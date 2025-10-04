import { db } from '../utils/dbClients.ts'

const P = process.env.MYSQL_PREFIX || 'wp_'

/**
 * Fetch a WP nav menu by slug (classic nav_menu taxonomy).
 * NOTE: This is a simplified join that maps menu items -> target posts/pages.
 */
export async function getWpMenu(menuSlug: string) {
  const sql = `
    SELECT
      t.term_id, t.name AS menu_name, t.slug AS menu_slug,
      p.ID AS item_id, p.post_title AS item_title,
      pm_obj.meta_value AS object_id,
      pm_parent.meta_value AS parent_id,
      p2.post_name AS target_slug,
      p2.post_title AS target_title,
      p2.post_type AS target_type
    FROM ${P}terms t
    JOIN ${P}term_taxonomy tt ON tt.term_id = t.term_id AND tt.taxonomy='nav_menu'
    JOIN ${P}term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
    JOIN ${P}posts p ON p.ID = tr.object_id AND p.post_type='nav_menu_item'
    LEFT JOIN ${P}postmeta pm_obj ON pm_obj.post_id = p.ID AND pm_obj.meta_key = '_menu_item_object_id'
    LEFT JOIN ${P}postmeta pm_parent ON pm_parent.post_id = p.ID AND pm_parent.meta_key = '_menu_item_menu_item_parent'
    LEFT JOIN ${P}posts p2 ON p2.ID = pm_obj.meta_value
    WHERE t.slug = ?
    ORDER BY p.menu_order ASC, p.ID ASC
  `

  try {
    const [rows] = await db.mysql.execute(sql, [menuSlug]) as [any[], any]
    const byId: Record<string, any> = {}
    const roots: any[] = []

    ;(rows as any[]).forEach(r => {
      const node = {
        id: String(r.item_id),
        label: r.target_title || r.item_title || '',
        slug: r.target_slug || '',
        type: r.target_type || 'custom',
        parent: r.parent_id ? String(r.parent_id) : null,
        children: [] as any[]
      }
      byId[node.id] = node
    })

    ;(rows as any[]).forEach(r => {
      const id = String(r.item_id)
      const parent = r.parent_id ? String(r.parent_id) : null
      const node = byId[id]
      if (parent && byId[parent]) {
        byId[parent].children.push(node)
      } else if (node) {
        roots.push(node)
      }
    })
    console.log('[getWpMenu] rows for slug', menuSlug, rows)

    return { slug: menuSlug, items: roots }
  } catch (err) {
    console.error(`[getWpMenu] failed for slug "${menuSlug}":`, (err as Error).message)
    // fallback празан мени
    return { slug: menuSlug, items: [] }
  }
}

/**
 * Fetch WP posts/pages by criteria (e.g., post_type, limit).
 * Simplified for migration – adjust as needed.
 */
export async function getWpPosts(options: { postType?: string; limit?: number } = {}) {
  const { postType = 'post', limit = 10 } = options
  const sql = `
    SELECT ID, post_name AS slug, post_title AS title, post_content AS content, post_date AS createdAt
    FROM ${P}posts
    WHERE post_type = ? AND post_status = 'publish'
    ORDER BY post_date DESC
    LIMIT ?
  `

  try {
    const [rows] = await db.mysql.execute(sql, [postType, limit]) as [any[], any]
    console.log('[getWpPosts] rows for postType', postType, rows)
    return rows as any[]
  } catch (err) {
    console.error(`[getWpPosts] failed for postType "${postType}":`, (err as Error).message)
    return []
  }
}
