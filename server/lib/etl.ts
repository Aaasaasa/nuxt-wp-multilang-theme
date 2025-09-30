import { getWpMenu } from '~/lib/wp.ts'
import { db } from '~/utils/dbClients.ts'

/**
 * ETL: Fetch menu from MySQL → save/update into Postgres as JSONB
 */
export async function etlMenu(slug: string) {
  const menu = await getWpMenu(slug)

  // UPSERT into Postgres
  const saved = await db.postgres.asMenu.upsert({
    where: { slug },
    update: { data: menu, updated_at: new Date() },
    create: { slug, data: menu }
  })

  return saved
}
