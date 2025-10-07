import { defineEventHandler } from 'h3'
import { db } from '../../utils/dbClients.ts'

export default defineEventHandler(async event => {
  const slug = event.context.params!.slug

  // 1. Nadji taxonomy nav_menu sa tim slug-om
  const menu = await db.pgCMS.cms_terms.findFirst({
    where: { slug },
    include: {
      taxonomy: {
        where: { taxonomy: 'nav_menu' }
      }
    }
  })

  if (!menu) {
    return { error: 'Menu not found' }
  }

  // 2. Nadji sve posts tipa nav_menu_item koji pripadaju tom meniju
  const items = await db.pgCMS.cms_posts.findMany({
    where: { post_type: 'nav_menu_item' },
    include: {
      metas: true
    }
  })

  // 3. Rekonstruisi menu strukturu iz meta vrijednosti
  const menuItems = items.map(item => {
    const getMeta = (key: string) => item.metas.find(m => m.meta_key === key)?.meta_value ?? null

    return {
      id: item.id,
      title: item.post_title,
      url: getMeta('_menu_item_url') || item.guid,
      parent: parseInt(getMeta('_menu_item_menu_item_parent') || '0'),
      objectId: getMeta('_menu_item_object_id')
    }
  })

  // 4. Vrati kao hijerarhiju
  function buildTree(list: any[], parent = 0) {
    return list
      .filter(i => i.parent === parent)
      .map(i => ({ ...i, children: buildTree(list, i.id) }))
  }

  return {
    slug,
    items: buildTree(menuItems)
  }
})
