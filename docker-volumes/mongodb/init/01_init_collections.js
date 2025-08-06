// Initialize database and collections
db = db.getSiblingDB('${MONGO_DB}')

// Create application user with least privileges
db.createUser({
  user: '${MONGO_USER}',
  pwd: '${MONGO_PASSWORD}',
  roles: [{ role: 'readWrite', db: '${MONGO_DB}' }]
})

// Core collections
db.createCollection('posts')
db.createCollection('users')

// Indexes for query performance
db.posts.createIndex({ wp_id: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })

// Initial admin user (optional)
db.users.insertOne({
  email: 'admin@example.com',
  password: '', // Should be hashed in production
  roles: ['admin'],
  createdAt: new Date()
})
