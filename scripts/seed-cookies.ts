// scripts/seed-cookies.ts
import { PrismaCMS } from '../lib/prisma'
import { seedCookiePolicies } from '../prisma/seed-data/cookie-policies'

async function main() {
  try {
    console.log('🍪 Starting cookie policies seed...')

    const result = await seedCookiePolicies(PrismaCMS)

    console.log('✅ Cookie policies seeded successfully')
    console.log(`📊 Created policy: ${result.policy.version}`)
    console.log(`🏷️ Created ${result.categoriesCount} categories and ${result.cookiesCount} cookies`)
  } catch (error) {
    console.error('❌ Error seeding cookie policies:', error)
    process.exit(1)
  } finally {
    await PrismaCMS.$disconnect()
  }
}

main()
