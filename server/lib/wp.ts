import { wp } from '@/server/utils/dbClients'

const P = process.env.MYSQL_PREFIX || 'wp_'

// Basic fetch of latest published posts/pages
export async function getWpPosts(limit = 10, lang?: string) {
  const sql = `
    SELECT ID, post_title, post_name, post_date, post_type, post_status
    FROM ${P}posts
    WHERE post_status='publish' AND post_type IN ('post','page')
    ORDER BY post_date DESC
    LIMIT ?
  `
  const [rows] = await wp.execute(sql, [limit])
  return rows as any[]
}

/**
 * Fetch a WP nav menu by slug (classic nav_menu taxonomy).
 * NOTE: This is a simplified join that maps menu items -> target posts/pages.
 * It assumes standard WP structure for nav menus.
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
  const [rows] = await wp.execute(sql, [menuSlug])
  // Build a tree structure
  const byId: Record<string, any> = {}
  const roots: any[] = []
  ;(rows as any[]).forEach((r) => {
    const node = {
      id: String(r.item_id),
      label: r.target_title || r.item_title,
      slug: r.target_slug || '',
      type: r.target_type || 'custom',
      parent: r.parent_id ? String(r.parent_id) : null,
      children: [] as any[]
    }
    byId[node.id] = node
  })
  ;(rows as any[]).forEach((r) => {
    const id = String(r.item_id)
    const parent = r.parent_id ? String(r.parent_id) : null
    const node = byId[id]
    if (parent && byId[parent]) byId[parent].children.push(node)
    else roots.push(node)
  })
  return { slug: menuSlug, items: roots }
}
