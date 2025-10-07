import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/utils/dbClients.ts'

export default defineEventHandler(async event => {
  return await handleMenuRequest(event)
})

async function handleMenuRequest(event: any) {
  const { slug } = getQuery(event)
  if (!slug) return { error: 'Missing slug parameter' }

  const menu = await db.pgCMS.cms_terms.findFirst({
    where: { slug: String(slug) },
    include: { taxonomy: { where: { taxonomy: 'nav_menu' } } }
  })
  if (!menu) return { error: 'Menu not found' }

  const posts = await db.pgCMS.cms_posts.findMany({
    where: { post_type: 'nav_menu_item' },
    include: { metas: true }
  })

  const menuItems = posts.map(p => {
    const getMeta = (k: string) => p.metas.find(m => m.meta_key === k)?.meta_value ?? null
    return {
      id: p.id,
      title: p.post_title,
      url: getMeta('_menu_item_url') || p.guid,
      parent: parseInt(getMeta('_menu_item_menu_item_parent') || '0', 10),
      objectId: getMeta('_menu_item_object_id')
    }
  })

  const buildTree = (list: any[], parent = 0) =>
    list.filter(i => i.parent === parent).map(i => ({ ...i, children: buildTree(list, i.id) }))

  return { slug: String(slug), items: buildTree(menuItems) }
}
