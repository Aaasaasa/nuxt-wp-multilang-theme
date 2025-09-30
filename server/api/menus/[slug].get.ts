// API route за get menu by slug (server/api/menus/[slug].get.ts)
// get menu from MySQL (ako je još tamo)

import { defineEventHandler, getRouterParams, createError } from 'h3'
import { db } from '~/utils/dbClients.ts'

export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event)

  // Raw SQL za select menu iz MySQL (pretpostavimo tabelu as_menus ili sličnu)
  const [rows] = await db.mysql.execute(
    'SELECT * FROM as_menus WHERE slug = ?',  // Promijeni tabelu ako je drugačija
    [slug]
  ) as [any[], any]

  if (rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Menu not found' })
  }

  return rows[0]  // Vrati menu objekat
})

/* --- HOW TO ---

Како ради у пракси

Прво рефрешуј мени (MySQL → Postgres):

curl -X POST http://localhost:3000/api/wp/etl/menu -H "Content-Type: application/json" -d '{"slug":"main-menu"}'


Сада можеш да га читаш из Postgres:

curl http://localhost:3000/api/menus/main-menu


Frontend користи само /api/menus/[slug] → што значи да си већ decoupled од MySQL.
Ако сутра пребациш у чист Postgres, ETL више није потребан.

*/
