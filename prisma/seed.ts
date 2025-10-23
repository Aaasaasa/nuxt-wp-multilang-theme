// prisma/seed.ts
import { PrismaClient } from './generated/postgres-cms' // path -> prisma/generated/postgres-cms
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Default superadmin credentials
  const login = 'root'
  const email = 'root@localhost'
  const plainPassword = 'secret' // promeni posle na env var!

  // Hash password (bcryptjs)
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(plainPassword, salt)

  // Upsert user (safe: ne briše ništa, ako postoji - apdejtujemo samo lozinku/displayName/role ako je potrebno)
  const user = await prisma.user.upsert({
    where: { login }, // unique index na login
    update: {
      // Ne brisemo postojece, ovde samo osiguravamo da je superadmin i da ima aktuelnu lozinku
      email,
      displayName: 'root',
      password: hashed,
      role: 'SUPERADMIN',
      isActive: true
    },
    create: {
      login,
      email,
      displayName: 'root',
      password: hashed,
      role: 'SUPERADMIN',
      isActive: true
    }
  })

  console.log('✅ Upserted user:', { id: user.id, login: user.login, email: user.email, role: user.role })

  // (Opcionalno) Add a UserMeta entry without deleting anything
  await prisma.userMeta.upsert({
    where: { id: user.id }, // ako imaš drugačiji unique, možeš koristiti kombinaciju; ovde koristimo id kao primer
    update: {},
    create: {
      userId: user.id,
      key: 'seed',
      value: { createdBy: 'seed', note: 'default superadmin created' }
    }
  }).catch(() => {
    // Ako upsert preko id ne radi zbog unique key-a, preskočiti silently
  })

  console.log('✅ Seed finished (non-destructive).')
}

main()
  .catch(e => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
