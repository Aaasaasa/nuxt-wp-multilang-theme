import { defineEventHandler, getQuery, type H3Event } from 'h3'
import { db } from '~/utils/dbClients.ts'

interface MenuItem {
  id: number
  title: string
  url: string
  parent: number
  objectId: string | null
  children?: MenuItem[]
}

interface Meta {
  meta_key: string
  meta_value: string | null
}

interface Post {
  id: number
  post_type: string
  metas: Meta[]
  // Füge andere Felder hinzu, die du brauchst, z. B. title, content usw.
}

export default defineEventHandler(async event => {
  return await handleMenuRequest(event)
})

async function handleMenuRequest(event: H3Event) {
  const { slug } = getQuery(event)
  if (!slug) return { error: 'Missing slug parameter' }

  const menu = await db.pgCMS.cms_terms.findFirst({
    where: { slug: String(slug) },
    include: { taxonomy: { where: { taxonomy: 'nav_menu' } } }
  })
  if (!menu) return { error: 'Menu not found' }

  const posts: Post[] = await db.pgCMS.cms_posts.findMany({
    where: { post_type: 'nav_menu_item' },
    include: { metas: true }
  })

  const menuItems: MenuItem[] = posts.map((p: Post) => {
    const getMeta = (k: string) => p.metas.find((m: Meta) => m.meta_key === k)?.meta_value ?? null
    return {
      id: Number(getMeta('_menu_item_menu_item_parent')) || 0,  // Beispiel: ID aus Meta
      title: getMeta('_menu_item_title') || '',  // Titel aus Meta
      url: getMeta('_menu_item_url') || '',  // URL aus Meta
      parent: Number(getMeta('_menu_item_menu_item_parent')) || 0,  // Parent aus Meta
      objectId: getMeta('_menu_item_object_id') || null,  // Object ID aus Meta
      children: []  // Wird später gefüllt
    }
  })

  const buildTree = (list: MenuItem[], parent = 0): MenuItem[] => {
    return list
      .filter(i => i.parent === parent)
      .map(i => ({
        ...i,
        children: buildTree(list, i.id)
      }))
  }

  return { slug: String(slug), items: buildTree(menuItems) }
}
