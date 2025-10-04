// server/api/cms/menus.get.ts
import { defineEventHandler, getQuery } from 'h3'
import { pgCMS } from '../../utils/dbClients.ts'

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event)

  if (!slug) {
    return { error: 'Missing slug parameter' }
  }

  // 1. Nadji menu
  const menu = await pgCMS.cms_terms.findFirst({
    where: { slug: String(slug) },
    include: {
      taxonomy: {
        where: { taxonomy: 'nav_menu' }
      }
    }
  })

  if (!menu) {
    return { error: 'Menu not found' }
  }

  // 2. Nadji sve stavke tog menija
  const items = await pgCMS.cms_posts.findMany({
    where: { post_type: 'nav_menu_item' },
    include: { metas: true }
  })

  const menuItems = items.map(item => {
    const getMeta = (key: string) =>
      item.metas.find(m => m.meta_key === key)?.meta_value ?? null

    return {
      id: item.id,
      title: item.post_title,
      url: getMeta('_menu_item_url') || item.guid,
      parent: parseInt(getMeta('_menu_item_menu_item_parent') || '0'),
      objectId: getMeta('_menu_item_object_id')
    }
  })

  function buildTree(list: any[], parent = 0) {
    return list
      .filter(i => i.parent === parent)
      .map(i => ({ ...i, children: buildTree(list, i.id) }))
  }
  console.log('[menus.get] menuItems for slug', slug, menuItems)
  return {
    slug,
    items: buildTree(menuItems)
  }
})
