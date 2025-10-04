import dotenv from 'dotenv'
dotenv.config()
import { PrismaClient as MySqlClient } from "../prisma/generated/mysql/index.js";
import { PrismaClient as PgCMSClient } from "../prisma/generated/postgres/cms/index.js";

const mysql = new MySqlClient();
const pg = new PgCMSClient();

// TODO: implement dynamic loading of WP table prefix!
// Load table prefix from env or default to 'wp_'
// Add WP_TABLE_PREFIX to .env if custom (e.g., WP_TABLE_PREFIX=as_)
const tablePrefix = process.env.WP_TABLE_PREFIX || 'wp_';

// Function to dynamically get WP table prefix from database
async function getWpTablePrefix(): Promise<string> {
  try {
    const result = await mysql.$queryRaw`SELECT option_value FROM ${mysql.$queryRaw`${tablePrefix}options`} WHERE option_name = 'wp_db_prefix' LIMIT 1`;
    // Assuming result is an array, extract the prefix
    if (Array.isArray(result) && result.length > 0) {
      return result[0].option_value as string;
    }
  } catch (error) {
    console.warn("Could not fetch table prefix from DB, using default:", error.message);
  }
  return tablePrefix; // Fallback
}

// Use dynamic prefix
const dynamicTablePrefix = await getWpTablePrefix();


// To make this migration work for any WordPress database, dynamically load the table prefix.
// WordPress stores the prefix in the 'wp_options' table under the key 'wp_db_prefix' (default is 'wp_').
// Query it from MySQL and use it instead of hardcoding 'as_'.
//
// Example: Replace hardcoded 'as_' with dynamic prefix
// const tablePrefix = await getWpTablePrefix(); // Function to fetch prefix
// Then use: const wpPosts = await mysql[`${tablePrefix}posts`].findMany();
//
// For Yoast SEO, check if the table exists before migrating:
// try { const wpYoast = await mysql[`${tablePrefix}yoast_indexable`].findMany(); ... } catch { skip }
//
// This ensures compatibility with standard WP installs or custom prefixes.

// const tablePrefix = 'as_'; // Temporary: Replace with dynamic loading for universal use
// const wpPosts = await mysql[`${tablePrefix}posts`].findMany(); // Example usage


// example: const wpPosts = await mysql[`${tablePrefix}posts`].findMany();

function toInt(value: any): number {
  return value ? Number(value) : 0;
}

/**
 * Mapiranje WP statusa u pgCMS Status enum
 */
function mapStatus(status: string): any {
  switch (status) {
    case "publish": return "PUBLISHED";
    case "draft": return "DRAFT";
    case "pending": return "PENDING";
    case "trash": return "TRASH";
    default: return "ARCHIVED";
  }
}

/**
 * Mapiranje WP post_type u pgCMS ContentType enum
 */
function mapType(type: string): any {
  switch (type) {
    case "post": return "POST";
    case "page": return "PAGE";
    case "portfolio": return "PORTFOLIO";
    case "attachment": return "MEDIA"; // ide u Media model
    default: return "ARTICLE";
  }
}

async function migrateUsers() {
  console.log("👥 Migrating users...");

  const wpUsers = await mysql.as_users.findMany();
  for (const u of wpUsers) {
    await pg.user.upsert({
      where: { id: toInt(u.ID) },
      update: {
        login: u.user_login,
        email: u.user_email,
        password: u.user_pass,
        displayName: u.display_name,
        registeredAt: u.user_registered,
        isActive: u.user_status === 0,
      },
      create: {
        id: toInt(u.ID),
        login: u.user_login,
        email: u.user_email,
        password: u.user_pass,
        displayName: u.display_name,
        registeredAt: u.user_registered,
        isActive: u.user_status === 0,
      },
    });
  }
}

const wpUsermeta = await mysql.as_usermeta.findMany();
for (const m of wpUsermeta) {
  const userExists = await pg.user.findUnique({ where: { id: toInt(m.user_id) } });
  if (userExists) {
    try {
      await pg.meta.create({
        data: {
          objectId: toInt(m.user_id),
          objectType: "user",
          key: m.meta_key || "",
          value: m.meta_value ? { raw: m.meta_value } : {},
        },
      });
    } catch (error) {
      console.warn(`Skipping user meta for user ${m.user_id}:`, error.message);
    }
  }
}

async function migrateArticles() {
  console.log("📝 Migrating posts/pages/articles...");

  const wpPosts = await mysql.as_posts.findMany({
    where: {
      post_type: { in: ["post", "page", "portfolio"] },
    },
  });

  for (const p of wpPosts) {
    await pg.article.upsert({
      where: { id: toInt(p.ID) },
      update: {
        slug: p.post_name || `post-${p.ID}`,
        guid: p.guid,
        status: mapStatus(p.post_status),
        type: mapType(p.post_type),
        authorId: toInt(p.post_author),
        parentId: toInt(p.post_parent) === 0 ? null : toInt(p.post_parent),
        menuOrder: p.menu_order,
        language: "en",
        title: { en: p.post_title },
        content: { en: p.post_content },
        excerpt: { en: p.post_excerpt },
        publishedAt: p.post_date_gmt,
        createdAt: p.post_date,
        updatedAt: p.post_modified,
      },
      create: {
        id: toInt(p.ID),
        slug: p.post_name || `post-${p.ID}`,
        guid: p.guid,
        status: mapStatus(p.post_status),
        type: mapType(p.post_type),
        authorId: toInt(p.post_author),
        parentId: toInt(p.post_parent) === 0 ? null : toInt(p.post_parent),
        menuOrder: p.menu_order,
        language: "en",
        title: { en: p.post_title },
        content: { en: p.post_content },
        excerpt: { en: p.post_excerpt },
        publishedAt: p.post_date_gmt,
        createdAt: p.post_date,
        updatedAt: p.post_modified,
      },
    });
  }
}

const wpPostmeta = await mysql.as_postmeta.findMany();
for (const m of wpPostmeta) {
  const articleExists = await pg.article.findUnique({ where: { id: toInt(m.post_id) } });
  if (articleExists) {
    try {
      await pg.meta.create({
        data: {
          objectId: toInt(m.post_id),
          objectType: "article",
          key: m.meta_key || "",
          value: m.meta_value ? { raw: m.meta_value } : {},
        },
      });
    } catch (error) {
      console.warn(`Skipping post meta for post ${m.post_id}:`, error.message);
    }
  }
}

async function migrateMedia() {
  console.log("🖼️ Migrating media (attachments)...");

  const wpMedia = await mysql.as_posts.findMany({
    where: { post_type: "attachment" },
  });

  for (const m of wpMedia) {
    await pg.media.upsert({
      where: { id: toInt(m.ID) },
      update: {
        url: m.guid,
        title: m.post_title,
        type: m.post_mime_type.split("/")[0],
        meta: {
          mime: m.post_mime_type,
          description: m.post_content,
        },
        createdAt: m.post_date,
        updatedAt: m.post_modified,
      },
      create: {
        id: toInt(m.ID),
        url: m.guid,
        title: m.post_title,
        type: m.post_mime_type.split("/")[0],
        meta: {
          mime: m.post_mime_type,
          description: m.post_content,
        },
        createdAt: m.post_date,
        updatedAt: m.post_modified,
      },
    });
  }
}

async function migrateComments() {
  console.log("💬 Migrating comments...");

  const wpComments = await mysql.as_comments.findMany();
  for (const c of wpComments) {
    await pg.comment.upsert({
      where: { id: toInt(c.comment_ID) },
      update: {
        articleId: toInt(c.comment_post_ID),
        userId: toInt(c.user_id) || null,
        content: c.comment_content,
        status: c.comment_approved === "1" ? "approved" : "pending",
        createdAt: c.comment_date,
        updatedAt: c.comment_date_gmt,
      },
      create: {
        id: toInt(c.comment_ID),
        articleId: toInt(c.comment_post_ID),
        userId: toInt(c.user_id) || null,
        content: c.comment_content,
        status: c.comment_approved === "1" ? "approved" : "pending",
        createdAt: c.comment_date,
        updatedAt: c.comment_date_gmt,
      },
    });
  }
}

const wpCommentmeta = await mysql.as_commentmeta.findMany();
for (const m of wpCommentmeta) {
  const commentExists = await pg.comment.findUnique({ where: { id: toInt(m.comment_id) } });
  if (commentExists) {
    try {
      await pg.meta.create({
        data: {
          objectId: toInt(m.comment_id),
          objectType: "comment",
          key: m.meta_key || "",
          value: m.meta_value ? { raw: m.meta_value } : {},
        },
      });
    } catch (error) {
      console.warn(`Skipping comment meta for comment ${m.comment_id}:`, error.message);
    }
  }
}

async function migrateTerms() {
  console.log("🏷️ Migrating terms & taxonomies...");

  const wpTerms = await mysql.as_terms.findMany();
  for (const t of wpTerms) {
    await pg.term.upsert({
      where: { slug: t.slug },
      update: {
        name: { en: t.name },
        group: Number(t.term_group),
      },
      create: {
        id: toInt(t.term_id),
        slug: t.slug,
        name: { en: t.name },
        group: Number(t.term_group),
      },
    });
  }

  const wpTax = await mysql.as_term_taxonomy.findMany();
  // Prvi prolaz: doda bez parent
  for (const tx of wpTax) {
    const termExists = await pg.term.findUnique({ where: { id: toInt(tx.term_id) } });
    if (termExists) {
      await pg.termTaxonomy.upsert({
        where: { id: toInt(tx.term_taxonomy_id) },
        update: {
          termId: toInt(tx.term_id),
          taxonomy: tx.taxonomy,
          description: { en: tx.description },
          count: Number(tx.count),
        },
        create: {
          id: toInt(tx.term_taxonomy_id),
          termId: toInt(tx.term_id),
          taxonomy: tx.taxonomy,
          description: { en: tx.description },
          count: Number(tx.count),
        },
      });
    }
  }

  // Drugi prolaz: update parent gdje postoji
  for (const tx of wpTax) {
    if (toInt(tx.parent) !== 0) {
      const parentExists = await pg.termTaxonomy.findUnique({ where: { id: toInt(tx.parent) } });
      const termTaxonomyExists = await pg.termTaxonomy.findUnique({ where: { id: toInt(tx.term_taxonomy_id) } });
      if (parentExists && termTaxonomyExists) {
        await pg.termTaxonomy.update({
          where: { id: toInt(tx.term_taxonomy_id) },
          data: {
            parentId: toInt(tx.parent),
          },
        });
      }
    }
  }

  // Za termRelationship, doda upsert ili createMany sa skipDuplicates
  // Za termRelationship, doda upsert ili createMany sa skipDuplicates
  const wpRel = await mysql.as_term_relationships.findMany();
  for (const r of wpRel) {
    const termTaxonomyExists = await pg.termTaxonomy.findUnique({ where: { id: toInt(r.term_taxonomy_id) } });
    const articleExists = await pg.article.findUnique({ where: { id: toInt(r.object_id) } });
    if (termTaxonomyExists && articleExists) {
      await pg.termRelationship.upsert({
        where: {
          articleId_termTaxonomyId: {
            articleId: toInt(r.object_id),
            termTaxonomyId: toInt(r.term_taxonomy_id),
          },
        },
        update: {},
        create: {
          articleId: toInt(r.object_id),
          termTaxonomyId: toInt(r.term_taxonomy_id),
        },
      });
    }
  }
}


async function migrateMenus() {
  console.log("📂 Migrating menus...");

  const menuTaxonomies = await mysql.as_term_taxonomy.findMany({
    where: { taxonomy: "nav_menu" },
  });

  for (const tx of menuTaxonomies) {
  const term = await mysql.as_terms.findUnique({
    where: { term_id: toInt(tx.term_id) },
  });

  if (!term) continue;

  const menuItems = await mysql.as_posts.findMany({
    where: { post_type: "nav_menu_item" },
  });

  const structuredItems: any[] = [];
  for (const i of menuItems) {
      const metas = await mysql.as_postmeta.findMany({
        where: { post_id: toInt(i.ID) },
      });

      const objId = metas.find(m => m.meta_key === "_menu_item_object_id")?.meta_value;
      const url = metas.find(m => m.meta_key === "_menu_item_url")?.meta_value;
      const parent = metas.find(m => m.meta_key === "_menu_item_menu_item_parent")?.meta_value;

      structuredItems.push({
        id: toInt(i.ID),
        title: i.post_title,
        objectId: objId ? Number(objId) : null,
        url: url || null,
        parentId: parent ? Number(parent) : null,
      });
    }

    await pg.menu.upsert({
      where: { slug: term.slug },
      update: {
        name: { en: term.name },
        items: structuredItems,
      },
      create: {
        slug: term.slug,
        name: { en: term.name },
        items: structuredItems,
      },
    });
  }
}

async function migrateSeo() {
  console.log("🔍 Migrating SEO (Yoast)...");

  const wpYoast = await mysql.as_yoast_indexable.findMany();
  for (const y of wpYoast) {
    await pg.seo.upsert({
      where: { id: toInt(y.id) },
      update: {
        objectId: toInt(y.object_id) || 0,
        objectType: y.object_type,
        title: y.title,
        description: y.description,
        keywords: y.primary_focus_keyword,
        openGraph: {
          og_title: y.open_graph_title,
          og_description: y.open_graph_description,
          og_image: y.open_graph_image,
        },
        twitter: {
          title: y.twitter_title,
          description: y.twitter_description,
          image: y.twitter_image,
        },
        createdAt: y.created_at,
        updatedAt: y.updated_at,
      },
      create: {
        id: toInt(y.id),
        objectId: toInt(y.object_id) || 0,
        objectType: y.object_type,
        title: y.title,
        description: y.description,
        keywords: y.primary_focus_keyword,
        openGraph: {
          og_title: y.open_graph_title,
          og_description: y.open_graph_description,
          og_image: y.open_graph_image,
        },
        twitter: {
          title: y.twitter_title,
          description: y.twitter_description,
          image: y.twitter_image,
        },
        createdAt: y.created_at,
        updatedAt: y.updated_at,
      },
    });
  }
}

async function migrateRevisions() {
  console.log("🕒 Migrating revisions...");

  const wpRevs = await mysql.as_posts.findMany({
    where: { post_type: "revision" },
  });

  for (const r of wpRevs) {
    const articleExists = await pg.article.findUnique({ where: { id: toInt(r.post_parent) } });
    const userExists = await pg.user.findUnique({ where: { id: toInt(r.post_author) } });
    if (articleExists && userExists) {
      await pg.revision.upsert({
        where: { id: toInt(r.ID) },
        update: {
          articleId: toInt(r.post_parent),
          authorId: toInt(r.post_author),
          content: { en: r.post_content },
          createdAt: r.post_date,
        },
        create: {
          id: toInt(r.ID),
          articleId: toInt(r.post_parent),
          authorId: toInt(r.post_author),
          content: { en: r.post_content },
          createdAt: r.post_date,
        },
      });
    }
  }
}

async function migrateSettings() {
  console.log("⚙️ Migrating settings/options...");

  const wpOptions = await mysql.as_options.findMany();
  for (const o of wpOptions) {
    let parsed: any = o.option_value;
    try {
      parsed = JSON.parse(o.option_value);
    } catch {
      parsed = o.option_value;
    }
    // Sanitiziraj null byte
    if (typeof parsed === 'string') {
      parsed = parsed.replace(/\u0000/g, '');
    } else if (typeof parsed === 'object' && parsed !== null) {
      parsed = JSON.stringify(parsed).replace(/\u0000/g, '');
      try {
        parsed = JSON.parse(parsed);
      } catch {
        parsed = parsed;
      }
    }
    await pg.setting.upsert({
      where: { key: o.option_name },
      update: {
        value: parsed,
      },
      create: {
        key: o.option_name,
        value: parsed,
      },
    });
  }
}

async function main() {
  console.log("Connecting to PG CMS:", process.env.POSTGRES_CMS_URL);
  console.log("Connecting to MySQL:", process.env.MYSQL_URL);

  await migrateUsers();
  await migrateArticles();
  await migrateMedia();
  await migrateComments();
  await migrateTerms();
  await migrateMenus();
  await migrateSeo();
  await migrateRevisions();
  await migrateSettings();

  console.log("✅ Migration completed!");
}

main()
  .catch((e) => console.error("❌ Migration failed:", e))
  .finally(async () => {
    await mysql.$disconnect();
    await pg.$disconnect();
  });
