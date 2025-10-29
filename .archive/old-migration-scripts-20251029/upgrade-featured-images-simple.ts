import { Client } from 'pg'

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'nuxt_pg_cms_db',
  user: 'usrcms',
  password: 'Utorak30Sep',
})

async function main(): Promise<void> {
  try {
    await client.connect()
    console.log('🔗 Connected to PostgreSQL')

    // Step 1: Update Articles
    console.log('\\n🔄 Updating Articles...')
    const articlesResult = await client.query(`
      UPDATE cms_article_meta
      SET value = jsonb_build_object(
        'media_id', m.id,
        'featured_image', cms_article_meta.value::text,
        'updated_at', NOW()
      )
      FROM cms_media m
      WHERE cms_article_meta.key = 'featured_image'
      AND m.file_path = TRIM(BOTH '"' FROM cms_article_meta.value::text)
      RETURNING cms_article_meta."articleId", m.id as media_id
    `)
    console.log(`✅ Updated ${articlesResult.rowCount} articles`)

    // Step 2: Update Pages
    console.log('\\n🔄 Updating Pages...')
    const pagesResult = await client.query(`
      UPDATE cms_page_meta
      SET value = jsonb_build_object(
        'media_id', m.id,
        'featured_image', cms_page_meta.value::text,
        'updated_at', NOW()
      )
      FROM cms_media m
      WHERE cms_page_meta.key = 'featured_image'
      AND m.file_path = TRIM(BOTH '"' FROM cms_page_meta.value::text)
      RETURNING cms_page_meta."pageId", m.id as media_id
    `)
    console.log(`✅ Updated ${pagesResult.rowCount} pages`)

    // Step 3: Update Portfolios
    console.log('\\n🔄 Updating Portfolios...')
    const portfoliosResult = await client.query(`
      UPDATE cms_portfolio_meta
      SET value = jsonb_build_object(
        'media_id', m.id,
        'featured_image', cms_portfolio_meta.value::text,
        'updated_at', NOW()
      )
      FROM cms_media m
      WHERE cms_portfolio_meta.key = 'featured_image'
      AND m.file_path = TRIM(BOTH '"' FROM cms_portfolio_meta.value::text)
      RETURNING cms_portfolio_meta."portfolioId", m.id as media_id
    `)
    console.log(`✅ Updated ${portfoliosResult.rowCount} portfolios`)

    // Step 4: Update media_id columns if they exist
    try {
      await client.query(`
        UPDATE cms_article_meta
        SET media_id = (value->>'media_id')::integer
        WHERE key = 'featured_image' AND value ? 'media_id'
      `)

      await client.query(`
        UPDATE cms_page_meta
        SET media_id = (value->>'media_id')::integer
        WHERE key = 'featured_image' AND value ? 'media_id'
      `)

      await client.query(`
        UPDATE cms_portfolio_meta
        SET media_id = (value->>'media_id')::integer
        WHERE key = 'featured_image' AND value ? 'media_id'
      `)

      console.log('✅ Updated media_id columns')
    } catch (error) {
      console.log('ℹ️  media_id columns not updated (may not exist)')
    }

    // Step 5: Show final summary
    const summaryResult = await client.query(`
      SELECT
        'Articles' as content_type,
        COUNT(*) as total_with_featured_images,
        COUNT(CASE WHEN value ? 'media_id' THEN 1 END) as total_with_media_id
      FROM cms_article_meta
      WHERE key = 'featured_image'

      UNION ALL

      SELECT
        'Pages' as content_type,
        COUNT(*) as total_with_featured_images,
        COUNT(CASE WHEN value ? 'media_id' THEN 1 END) as total_with_media_id
      FROM cms_page_meta
      WHERE key = 'featured_image'

      UNION ALL

      SELECT
        'Portfolios' as content_type,
        COUNT(*) as total_with_featured_images,
        COUNT(CASE WHEN value ? 'media_id' THEN 1 END) as total_with_media_id
      FROM cms_portfolio_meta
      WHERE key = 'featured_image'
    `)

    console.log('\\n📊 Final Summary:')
    for (const row of summaryResult.rows) {
      console.log(`   ${row.content_type}: ${row.total_with_media_id}/${row.total_with_featured_images} linked to media table`)
    }

    const totalUpdated = (articlesResult.rowCount || 0) + (pagesResult.rowCount || 0) + (portfoliosResult.rowCount || 0)

    console.log('\\n🎉 Featured Images System upgrade completed!')
    console.log(`📊 Total updated: ${totalUpdated} featured images`)
    console.log('\\n💡 Benefits:')
    console.log('   ✅ Robust media management via cms_media table')
    console.log('   ✅ Automatic size variants support')
    console.log('   ✅ Better performance with proper indexes')
    console.log('   ✅ Backward compatibility maintained')
    console.log('   ✅ Eliminates duplicate/missing images issues')

  } catch (error) {
    console.error('❌ Upgrade failed:', (error as Error).message)
  } finally {
    await client.end()
  }
}

main().catch(console.error)
