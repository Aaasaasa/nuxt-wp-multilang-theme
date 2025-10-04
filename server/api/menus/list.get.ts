import { defineEventHandler } from 'h3'
import { pgCMS } from '../../utils/dbClients.ts'

export default defineEventHandler(async () => {
  // 1. Nadji sve termine koji su taxonomy = "nav_menu"
  const menus = await pgCMS.cms_terms.findMany({
    where: {
      taxonomy: {
        some: { taxonomy: 'nav_menu' }
      }
    },
    include: {
      taxonomy: true
    }
  })

  // 2. Vrati samo osnovne podatke o menijima
  return menus.map(menu => ({
    id: menu.term_id,
    name: menu.name,
    slug: menu.slug
  }))
})
