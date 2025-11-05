#!/bin/bash

# Database Backup Script
# Erstellt Backups von PostgreSQL und MySQL Datenbanken

# Erstelle Backup-Verzeichnis mit Timestamp
BACKUP_DIR="/srv/proj/nuxt-wp-multilang-theme/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/$TIMESTAMP"

mkdir -p "$BACKUP_PATH"

echo "📦 Starting database backups..."
echo "Backup location: $BACKUP_PATH"
echo ""

# PostgreSQL Backup
echo "🐘 Backing up PostgreSQL (nuxt_pg_cms_db)..."
PGPASSWORD=Utorak30Sep pg_dump \
  -h localhost \
  -p 5432 \
  -U usrcms \
  -d nuxt_pg_cms_db \
  -F c \
  -f "$BACKUP_PATH/postgres_nuxt_pg_cms_db.dump"

if [ $? -eq 0 ]; then
  echo "  ✓ PostgreSQL backup created: postgres_nuxt_pg_cms_db.dump"
else
  echo "  ✗ PostgreSQL backup failed!"
  exit 1
fi

# MySQL Backup
echo ""
echo "🐬 Backing up MySQL (sta3wp)..."
docker exec nuxt_mysql mysqldump \
  -u root \
  -pFreitag0605 \
  sta3wp \
  > "$BACKUP_PATH/mysql_sta3wp.sql"

if [ $? -eq 0 ]; then
  echo "  ✓ MySQL backup created: mysql_sta3wp.sql"
else
  echo "  ✗ MySQL backup failed!"
  exit 1
fi

# Backup Info erstellen
echo ""
echo "📝 Creating backup info..."
cat > "$BACKUP_PATH/backup_info.txt" << EOF
Backup Information
==================
Date: $(date)
Timestamp: $TIMESTAMP

Databases:
- PostgreSQL: nuxt_pg_cms_db (localhost:5432)
- MySQL: sta3wp (Docker container)

Files:
- postgres_nuxt_pg_cms_db.dump (PostgreSQL custom format)
- mysql_sta3wp.sql (MySQL SQL dump)

Restore Commands:
-----------------
PostgreSQL:
  PGPASSWORD=Utorak30Sep pg_restore -h localhost -p 5432 -U usrcms -d nuxt_pg_cms_db -c postgres_nuxt_pg_cms_db.dump

MySQL:
  docker exec -i nuxt_mysql mysql -u root -pFreitag0605 sta3wp < mysql_sta3wp.sql
EOF

echo "  ✓ Backup info created: backup_info.txt"

# Dateigröße anzeigen
echo ""
echo "📊 Backup sizes:"
du -h "$BACKUP_PATH"/*

echo ""
echo "✅ Backup completed successfully!"
echo "Location: $BACKUP_PATH"
echo ""
echo "To restore:"
echo "  PostgreSQL: PGPASSWORD=Utorak30Sep pg_restore -h localhost -p 5432 -U usrcms -d nuxt_pg_cms_db -c $BACKUP_PATH/postgres_nuxt_pg_cms_db.dump"
echo "  MySQL: docker exec -i nuxt_mysql mysql -u root -pFreitag0605 sta3wp < $BACKUP_PATH/mysql_sta3wp.sql"
