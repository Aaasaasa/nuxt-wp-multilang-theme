import { PrismaClient as MySqlClient } from '../prisma/generated/mysql/index.js'
import { PrismaClient as PgCMSClient } from '../prisma/generated/postgres-cms/index.js'

import dotenv from 'dotenv'
dotenv.config()

const mysql = new MySqlClient()
const pg = new PgCMSClient()

function toInt(v: any): number {
  return v ? Number(v) : 0
}

function mapStatus(status: string) {
  switch (status) {
    case 'publish':
      return 'PUBLISHED'
    case 'draft':
      return 'DRAFT'
    case 'pending':
      return 'PENDING'
    case 'trash':
      return 'TRASH'
    default:
      return 'ARCHIVED'
  }
}

/**
 * Vrati WP post_type za dati post ID (za mapiranje comments/terms)
 */
async function getWpPostTypeById(id: number): Promise<string | null> {
  const p = await mysql.as_posts.findUnique({ where: { ID: BigInt(id) } })
  return p?.post_type ?? null
}

/**
 * 1) OČISTI SVE CMS TABELE PRIJE NOVE MIGRACIJE
 */
async function clearCMS() {
  console.log('🧹 Cleaning existing CMS tables...')
  // Truncate redoslijedom koji sigurno prolazi uz CASCADE
  await pg.$executeRawUnsafe(`
    TRUNCATE TABLE
      cms_user_meta, cms_users,
      cms_page_meta, cms_page_translations, cms_pages,
      cms_article_meta, cms_article_translations, cms_articles,
      cms_portfolio_meta, cms_portfolio_translations, cms_portfolios,
      cms_product_meta, cms_product_translations, cms_products,
      cms_comment_meta, cms_comments,
      cms_term_relationships, cms_term_taxonomies, cms_terms,
      cms_menus, cms_settings
    RESTART IDENTITY CASCADE
  `)
}

/**
 * 2) USERS + USER META
 */
async function migrateUsers() {
  console.log('👥 Migrating users...')

  const wpUsers = await mysql.as_users.findMany()

  for (const u of wpUsers) {
    const user = await pg.user.upsert({
      where: { email: u.user_email || `user-${String(u.ID)}@example.local` },
      update: {
        login: u.user_login,
        password: u.user_pass,
        displayName: u.display_name,
        registeredAt: u.user_registered,
        isActive: u.user_status === 0
      },
      create: {
        login: u.user_login,
        email: u.user_email || `user-${String(u.ID)}@example.local`,
        password: u.user_pass,
        displayName: u.display_name,
        registeredAt: u.user_registered,
        isActive: u.user_status === 0
      }
    })

    const metas = await mysql.as_usermeta.findMany({ where: { user_id: u.ID } })
    if (metas.length) {
      await pg.userMeta.createMany({
        data: metas.map((m) => ({
          userId: user.id,
          key: m.meta_key || '',
          value: m.meta_value ? { raw: m.meta_value } : {}
        })),
        skipDuplicates: true
      })
    }
  }
}

/**
 * 3) PAGES, ARTICLES, PORTFOLIOS (+ translations + meta)
 */
async function migrateContent() {
  console.log('📝 Migrating pages, articles, portfolios...')

  const wpPosts = await mysql.as_posts.findMany({
    where: { post_type: { in: ['page', 'post', 'portfolio'] } }
  })

  for (const p of wpPosts) {
    const base = {
      slug: p.post_name || `post-${String(p.ID)}`,
      status: mapStatus(p.post_status),
      authorId: toInt(p.post_author) || 1,
      createdAt: p.post_date,
      updatedAt: p.post_modified
    }

    const metas = await mysql.as_postmeta.findMany({ where: { post_id: p.ID } })

    if (p.post_type === 'page') {
      const page = await pg.page.upsert({
        where: { slug: base.slug },
        update: {
          status: base.status,
          authorId: base.authorId,
          menuOrder: p.menu_order ?? 0,
          updatedAt: base.updatedAt
        },
        create: {
          ...base,
          menuOrder: p.menu_order ?? 0
        }
      })

      await pg.pageTranslation.upsert({
        where: { pageId_lang: { pageId: page.id, lang: 'en' } },
        update: {
          title: p.post_title || '',
          content: p.post_content || '',
          excerpt: p.post_excerpt || ''
        },
        create: {
          pageId: page.id,
          lang: 'en',
          title: p.post_title || '',
          content: p.post_content || '',
          excerpt: p.post_excerpt || ''
        }
      })

      if (metas.length) {
        await pg.pageMeta.createMany({
          data: metas.map((m) => ({
            pageId: page.id,
            key: m.meta_key || '',
            value: m.meta_value ? { raw: m.meta_value } : {}
          })),
          skipDuplicates: true
        })
      }
    }

    if (p.post_type === 'post') {
      const article = await pg.article.upsert({
        where: { slug: base.slug },
        update: {
          status: base.status,
          authorId: base.authorId,
          updatedAt: base.updatedAt
        },
        create: base
      })

      await pg.articleTranslation.upsert({
        where: { articleId_lang: { articleId: article.id, lang: 'en' } },
        update: {
          title: p.post_title || '',
          content: p.post_content || '',
          excerpt: p.post_excerpt || ''
        },
        create: {
          articleId: article.id,
          lang: 'en',
          title: p.post_title || '',
          content: p.post_content || '',
          excerpt: p.post_excerpt || ''
        }
      })

      if (metas.length) {
        await pg.articleMeta.createMany({
          data: metas.map((m) => ({
            articleId: article.id,
            key: m.meta_key || '',
            value: m.meta_value ? { raw: m.meta_value } : {}
          })),
          skipDuplicates: true
        })
      }
    }

    if (p.post_type === 'portfolio') {
      const portfolio = await pg.portfolio.upsert({
        where: { slug: base.slug },
        update: {
          status: base.status,
          authorId: base.authorId,
          updatedAt: base.updatedAt
        },
        create: base
      })

      await pg.portfolioTranslation.upsert({
        where: {
          portfolioId_lang: { portfolioId: portfolio.id, lang: 'en' }
        },
        update: {
          title: p.post_title || '',
          content: p.post_content || '',
          excerpt: p.post_excerpt || ''
        },
        create: {
          portfolioId: portfolio.id,
          lang: 'en',
          title: p.post_title || '',
          content: p.post_content || '',
          excerpt: p.post_excerpt || ''
        }
      })

      if (metas.length) {
        await pg.portfolioMeta.createMany({
          data: metas.map((m) => ({
            portfolioId: portfolio.id,
            key: m.meta_key || '',
            value: m.meta_value ? { raw: m.meta_value } : {}
          })),
          skipDuplicates: true
        })
      }
    }
  }
}

/**
 * 4) PRODUCTS (+ translations + meta) — samo ako u WP postoje post_type=product
 */
async function migrateProducts() {
  console.log('🛒 Migrating products...')

  const wpProducts = await mysql.as_posts.findMany({
    where: { post_type: 'product' }
  })

  for (const p of wpProducts) {
    const product = await pg.product.upsert({
      where: { slug: p.post_name || `product-${String(p.ID)}` },
      update: {
        price: 0, // ako imaš cijenu u metama, možeš mapirati
        vendorId: toInt(p.post_author) || 1,
        updatedAt: p.post_modified
      },
      create: {
        slug: p.post_name || `product-${String(p.ID)}`,
        price: 0,
        vendorId: toInt(p.post_author) || 1,
        createdAt: p.post_date,
        updatedAt: p.post_modified
      }
    })

    await pg.productTranslation.upsert({
      where: { productId_lang: { productId: product.id, lang: 'en' } },
      update: {
        title: p.post_title || '',
        description: p.post_content || ''
      },
      create: {
        productId: product.id,
        lang: 'en',
        title: p.post_title || '',
        description: p.post_content || ''
      }
    })

    const metas = await mysql.as_postmeta.findMany({ where: { post_id: p.ID } })
    if (metas.length) {
      await pg.productMeta.createMany({
        data: metas.map((m) => ({
          productId: product.id,
          key: m.meta_key || '',
          value: m.meta_value ? { raw: m.meta_value } : {}
        })),
        skipDuplicates: true
      })
    }
  }
}

/**
 * 5) COMMENTS (+ meta) — uz mapiranje ka točnoj target tablici po WP post_type
 */
async function migrateComments() {
  console.log('💬 Migrating comments...')

  const wpComments = await mysql.as_comments.findMany()

  for (const c of wpComments) {
    const targetPostId = toInt(c.comment_post_ID)
    const postType = await getWpPostTypeById(targetPostId)

    const baseComment = {
      userId: toInt(c.user_id) || null,
      content: c.comment_content || '',
      status: c.comment_approved === '1' ? 'approved' : 'pending',
      createdAt: c.comment_date,
      updatedAt: c.comment_date_gmt
    }

    let created
    if (postType === 'page') {
      // pageId — nažalost nemamo mapu WP→PG ID koristimo slug upisane u migrateContent
      const wpPage = await mysql.as_posts.findUnique({ where: { ID: BigInt(targetPostId) } })
      const pgPage = wpPage
        ? await pg.page.findUnique({
            where: { slug: wpPage.post_name || `post-${String(wpPage.ID)}` }
          })
        : null

      created = await pg.comment.create({
        data: {
          ...baseComment,
          pageId: pgPage ? pgPage.id : null
        }
      })
    } else if (postType === 'post') {
      const wpArt = await mysql.as_posts.findUnique({ where: { ID: BigInt(targetPostId) } })
      const pgArt = wpArt
        ? await pg.article.findUnique({
            where: { slug: wpArt.post_name || `post-${String(wpArt.ID)}` }
          })
        : null

      created = await pg.comment.create({
        data: {
          ...baseComment,
          articleId: pgArt ? pgArt.id : null
        }
      })
    } else if (postType === 'portfolio') {
      const wpPort = await mysql.as_posts.findUnique({ where: { ID: BigInt(targetPostId) } })
      const pgPort = wpPort
        ? await pg.portfolio.findUnique({
            where: { slug: wpPort.post_name || `post-${String(wpPort.ID)}` }
          })
        : null

      created = await pg.comment.create({
        data: {
          ...baseComment,
          portfolioId: pgPort ? pgPort.id : null
        }
      })
    } else if (postType === 'product') {
      const wpProd = await mysql.as_posts.findUnique({ where: { ID: BigInt(targetPostId) } })
      const pgProd = wpProd
        ? await pg.product.findUnique({
            where: { slug: wpProd.post_name || `product-${String(wpProd.ID)}` }
          })
        : null

      created = await pg.comment.create({
        data: {
          ...baseComment,
          productId: pgProd ? pgProd.id : null
        }
      })
    } else {
      // Ako je nešto drugo, kreiraj “orphanned” komentar bez veze
      created = await pg.comment.create({ data: baseComment })
    }

    // commentmeta
    const metas = await mysql.as_commentmeta.findMany({ where: { comment_id: c.comment_ID } })
    if (metas.length) {
      await pg.commentMeta.createMany({
        data: metas.map((m) => ({
          commentId: created.id,
          key: m.meta_key || '',
          value: m.meta_value ? { raw: m.meta_value } : {}
        })),
        skipDuplicates: true
      })
    }
  }
}

/**
 * 6) TERMS / TAXONOMIES / RELATIONSHIPS
 *    - terms: upsert po slug-u
 *    - taxonomies: upsert po (termId, taxonomy) ili po id-u ako želiš
 *    - relationships: mapiraj object_id → target model (page/article/portfolio/product) po WP post_type
 */
async function migrateTerms() {
  console.log('🏷️ Migrating terms & taxonomies...')

  // 1) TERMS
  const wpTerms = await mysql.as_terms.findMany()
  for (const t of wpTerms) {
    await pg.term.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        group: Number(t.term_group) || 0
      },
      create: {
        slug: t.slug,
        name: t.name,
        group: Number(t.term_group) || 0
      }
    })
  }

  // 2) TAXONOMIES - prvi prolaz, bez parentId
  const wpTax = await mysql.as_term_taxonomy.findMany()
  for (const tx of wpTax) {
    const termRow = await mysql.as_terms.findUnique({ where: { term_id: tx.term_id } })
    if (!termRow) continue

    const pgTerm = await pg.term.findUnique({ where: { slug: termRow.slug } })
    if (!pgTerm) continue

    await pg.termTaxonomy.upsert({
      where: { id: 0 }, // fake upsert (možeš staviti unique kombinaciju ako postoji)
      update: {
        termId: pgTerm.id,
        taxonomy: tx.taxonomy,
        description: tx.description || null,
        count: Number(tx.count) || 0
      },
      create: {
        termId: pgTerm.id,
        taxonomy: tx.taxonomy,
        description: tx.description || null,
        count: Number(tx.count) || 0,
        parentId: null // parent kasnije
      }
    })
  }

  // 3) TAXONOMIES - drugi prolaz, update parentId
  for (const tx of wpTax) {
    if (toInt(tx.parent) === 0) continue

    const parentTx = await mysql.as_term_taxonomy.findUnique({
      where: { term_taxonomy_id: tx.parent }
    })
    if (!parentTx) continue

    const parentTerm = await mysql.as_terms.findUnique({
      where: { term_id: parentTx.term_id }
    })
    if (!parentTerm) continue

    const pgParentTerm = await pg.term.findUnique({ where: { slug: parentTerm.slug } })
    if (!pgParentTerm) continue

    const pgParentTx = await pg.termTaxonomy.findFirst({
      where: { termId: pgParentTerm.id, taxonomy: parentTx.taxonomy }
    })
    if (!pgParentTx) continue

    const childTerm = await mysql.as_terms.findUnique({
      where: { term_id: tx.term_id }
    })
    if (!childTerm) continue

    const pgChildTerm = await pg.term.findUnique({ where: { slug: childTerm.slug } })
    if (!pgChildTerm) continue

    const pgChildTx = await pg.termTaxonomy.findFirst({
      where: { termId: pgChildTerm.id, taxonomy: tx.taxonomy }
    })
    if (!pgChildTx) continue

    await pg.termTaxonomy.update({
      where: { id: pgChildTx.id },
      data: { parentId: pgParentTx.id }
    })
  }

  // 4) RELATIONSHIPS - ostaje isto kao prije
  const wpRel = await mysql.as_term_relationships.findMany()
  for (const r of wpRel) {
    const tax = await mysql.as_term_taxonomy.findUnique({
      where: { term_taxonomy_id: r.term_taxonomy_id }
    })
    if (!tax) continue

    const termRow = await mysql.as_terms.findUnique({ where: { term_id: tax.term_id } })
    if (!termRow) continue

    const pgTerm = await pg.term.findUnique({ where: { slug: termRow.slug } })
    if (!pgTerm) continue

    // nađi PG termTaxonomy: najbliže ćemo ga locirati po (termId, taxonomy)
    const pgTax = await pg.termTaxonomy.findFirst({
      where: { termId: pgTerm.id, taxonomy: tax.taxonomy },
      orderBy: { id: 'asc' }
    })
    if (!pgTax) continue

    // mapiraj object_id → target model po WP post_type
    const objectId = toInt(r.object_id)
    const postType = await getWpPostTypeById(objectId)

    if (postType === 'page') {
      const wpPage = await mysql.as_posts.findUnique({ where: { ID: BigInt(objectId) } })
      const pgPage = wpPage
        ? await pg.page.findUnique({
            where: { slug: wpPage.post_name || `post-${String(wpPage.ID)}` }
          })
        : null
      if (!pgPage) continue

      await pg.termRelationship.create({
        data: {
          pageId: pgPage.id,
          termTaxonomyId: pgTax.id
        }
      })
    } else if (postType === 'post') {
      const wpArt = await mysql.as_posts.findUnique({ where: { ID: BigInt(objectId) } })
      const pgArt = wpArt
        ? await pg.article.findUnique({
            where: { slug: wpArt.post_name || `post-${String(wpArt.ID)}` }
          })
        : null
      if (!pgArt) continue

      await pg.termRelationship.create({
        data: {
          articleId: pgArt.id,
          termTaxonomyId: pgTax.id
        }
      })
    } else if (postType === 'portfolio') {
      const wpPort = await mysql.as_posts.findUnique({ where: { ID: BigInt(objectId) } })
      const pgPort = wpPort
        ? await pg.portfolio.findUnique({
            where: { slug: wpPort.post_name || `post-${String(wpPort.ID)}` }
          })
        : null
      if (!pgPort) continue

      await pg.termRelationship.create({
        data: {
          portfolioId: pgPort.id,
          termTaxonomyId: pgTax.id
        }
      })
    } else if (postType === 'product') {
      const wpProd = await mysql.as_posts.findUnique({ where: { ID: BigInt(objectId) } })
      const pgProd = wpProd
        ? await pg.product.findUnique({
            where: { slug: wpProd.post_name || `product-${String(wpProd.ID)}` }
          })
        : null
      if (!pgProd) continue

      await pg.termRelationship.create({
        data: {
          productId: pgProd.id,
          termTaxonomyId: pgTax.id
        }
      })
    } else {
      // ignore other object types
      continue
    }
  }
}

/**
 * 7) MENUS (nav_menu + nav_menu_item → JSON)
 */
async function migrateMenus() {
  console.log('📂 Migrating menus...')

  const menuTaxonomies = await mysql.as_term_taxonomy.findMany({
    where: { taxonomy: 'nav_menu' }
  })

  for (const tx of menuTaxonomies) {
    const term = await mysql.as_terms.findUnique({ where: { term_id: tx.term_id } })
    if (!term) continue

    // Nađi sve nav_menu_item postove povezane s ovim menijem preko term_relationships
    const relItems = await mysql.as_term_relationships.findMany({
      where: { term_taxonomy_id: tx.term_taxonomy_id }
    })

    const itemIds = relItems.map((r) => r.object_id)
    if (!itemIds.length) {
      await pg.menu.upsert({
        where: { slug: term.slug },
        update: { name: term.name, items: [] },
        create: { slug: term.slug, name: term.name, items: [] }
      })
      continue
    }

    const items = await mysql.as_posts.findMany({
      where: { ID: { in: itemIds } }
    })

    const structured: any[] = []
    for (const i of items) {
      const metas = await mysql.as_postmeta.findMany({ where: { post_id: i.ID } })
      const objId = metas.find((m) => m.meta_key === '_menu_item_object_id')?.meta_value
      const url = metas.find((m) => m.meta_key === '_menu_item_url')?.meta_value
      const parent = metas.find((m) => m.meta_key === '_menu_item_menu_item_parent')?.meta_value

      structured.push({
        id: toInt(i.ID),
        title: i.post_title || '',
        objectId: objId ? Number(objId) : null,
        url: url || null,
        parentId: parent ? Number(parent) : null,
        type: metas.find((m) => m.meta_key === '_menu_item_type')?.meta_value || null,
        object: metas.find((m) => m.meta_key === '_menu_item_object')?.meta_value || null
      })
    }

    await pg.menu.upsert({
      where: { slug: term.slug },
      update: { name: term.name, items: structured },
      create: { slug: term.slug, name: term.name, items: structured }
    })
  }
}

/**
 * 8) SETTINGS (options)
 */
async function migrateSettings() {
  console.log('⚙️ Migrating settings...')

  const wpOptions = await mysql.as_options.findMany()

  for (const o of wpOptions) {
    let parsed: any = o.option_value
    try {
      parsed = JSON.parse(o.option_value)
    } catch {
      parsed = o.option_value
    }
    // ukloni eventualne null byte znakove
    if (typeof parsed === 'string') {
      parsed = parsed.replace(/\u0000/g, '')
    }

    await pg.setting.upsert({
      where: { key: o.option_name },
      update: { value: parsed },
      create: { key: o.option_name, value: parsed }
    })
  }
}

/**
 * MAIN
 */
async function main() {
  console.log('🚀 Starting migration...')
  await clearCMS()

  await migrateUsers()
  await migrateContent()
  await migrateProducts()
  await migrateComments()
  await migrateTerms()
  await migrateMenus()
  await migrateSettings()

  console.log('✅ Migration completed!')
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await mysql.$disconnect()
    await pg.$disconnect()
  })
