# WordPress Migration zu NuxtWP

Dokumentation für die Migration von WordPress-Daten zu PostgreSQL im NuxtWP Multilang Theme.

## 🚀 Quick Start Migration

### 1. WordPress Dump bereinigen

```bash
# Bereinigt Plugin-Tabellen und Shortcodes aus dem WordPress Dump
yarn wp:clean

# Oder manuell mit Parametern:
ts-node scripts/clean-wordpress-dump.ts .docker/data/mysql/sta3wp.sql .docker/data/mysql/sta3wp_clean.sql
```

### 2. Daten migrieren

```bash
# Komplette Migration: Bereinigung + Import
yarn wp:import

# Oder nur Migration (nach manueller Bereinigung):
yarn wp:migrate
```

## ⚙️ Konfiguration

### Umgebungsvariablen (.env)

```bash
# WordPress Datenbank Prefix (wie in wp-config.php)
DB_PREFIX="as_"          # Dein WordPress Prefix (z.B. wp_, as_, sta_)

# Standard-Sprache für migrierte Inhalte
DEFAULT_LANGUAGE="de"    # en, de, sr, etc.

# Datenbank-Verbindungen
POSTGRES_CMS_URL="postgresql://user:pass@localhost:5432/cms"
MYSQL_URL="mysql://user:pass@localhost:3306/wordpress"
```

## 🎯 Migrations-Status & Ergebnisse

### Aktuelle Migration (Beispiel)

✅ **Erfolgreich migriert:**

- **37 Articles** mit Übersetzungen und Featured Images
- **12 Pages** mit vollständigem Content
- **10 Portfolios** (Avada Portfolio Projects)
- **191 Terms** (Kategorien/Tags/Portfolio-Kategorien)
- **224 Term Relationships** (Content ↔ Kategorien/Tags Verknüpfungen)
- **1 Benutzer** mit Metadaten
- **Featured Images** mit WebP-Konvertierung (33% bereits konvertiert)

### Content-Distribution

| Content-Typ | Anzahl | Mit Kategorien/Tags |
| ----------- | ------ | ------------------- |
| Articles    | 37     | 141 Zuordnungen     |
| Pages       | 12     | 0 Zuordnungen       |
| Portfolios  | 10     | 83 Zuordnungen      |

### Taxonomien

| Taxonomy             | Anzahl | Beschreibung         |
| -------------------- | ------ | -------------------- |
| `category`           | ~50    | Blog-Kategorien      |
| `post_tag`           | ~100   | Blog-Tags            |
| `portfolio_category` | ~20    | Portfolio-Kategorien |
| `portfolio_tags`     | ~20    | Portfolio-Tags       |

### WordPress Dump Bereinigung

Das Bereinigungsskript entfernt automatisch:

**Plugin-Tabellen:**

- `actionscheduler_*` (Action Scheduler)
- `awb_*` (Avada/Fusion Builder)
- `cli_*` (Cookie Law Info)
- `fusion_*` (Fusion Builder)
- `layerslider*` (LayerSlider)
- `loginizer_*` (Loginizer)
- `woocommerce_*` / `wc_*` (WooCommerce)
- `yoast_*` (Yoast SEO)
- `elementor_*` (Elementor)
- Und viele weitere...

**Shortcodes bereinigt:**

- `[elementor-template]`, `[fusion_*]`
- `[contact-form-7]`, `[wpforms]`
- `[rev_slider]`, `[layerslider]`
- `[woocommerce]`, `[product]`
- Social Media Feeds
- Und viele weitere...

**Plugin-Optionen entfernt:**

- `elementor_*`, `fusion_*`
- `woocommerce_*`, `yoast_*`
- `_transient_*`, `widget_*`
- Und weitere Plugin-spezifische Optionen

## 📊 Migrations-Mapping

### WordPress → PostgreSQL Struktur

| WordPress                    | PostgreSQL                           | Beschreibung                             |
| ---------------------------- | ------------------------------------ | ---------------------------------------- |
| `wp_users`                   | `User` + `UserMeta`                  | Benutzer mit Metadaten                   |
| `wp_posts` (post)            | `Article` + `ArticleTranslation`     | Blog-Artikel mit Übersetzungen           |
| `wp_posts` (page)            | `Page` + `PageTranslation`           | Seiten mit Übersetzungen                 |
| `wp_posts` (avada_portfolio) | `Portfolio` + `PortfolioTranslation` | Portfolio-Projekte mit Übersetzungen     |
| `wp_terms`                   | `Term` + `TermTaxonomy`              | Kategorien/Tags                          |
| `wp_term_relationships`      | `TermRelationship`                   | Verknüpfungen Content ↔ Kategorien/Tags |
| `wp_comments`                | `Comment`                            | Kommentare                               |
| `wp_options`                 | `Setting`                            | WordPress-Einstellungen                  |
| `wp_postmeta`                | `*Meta` Tabellen                     | Metadaten für alle Content-Typen         |

### Benutzer-Rollen Mapping

| WordPress Capability   | NuxtWP Role  | Beschreibung       |
| ---------------------- | ------------ | ------------------ |
| Erster Benutzer (ID=1) | `SUPERADMIN` | Vollzugriff        |
| Andere Benutzer        | `AUTHOR`     | Content-Erstellung |

### Post-Status Mapping

| WordPress | NuxtWP      | Beschreibung   |
| --------- | ----------- | -------------- |
| `publish` | `PUBLISHED` | Veröffentlicht |
| `draft`   | `DRAFT`     | Entwurf        |
| `private` | `ARCHIVED`  | Archiviert     |

## 🛠️ Erweiterte Nutzung

### Migrations-Ablauf

Die Migration läuft in folgenden Schritten ab:

1. **Datenbank bereinigen** - Leert PostgreSQL CMS Datenbank
2. **Benutzer migrieren** - `wp_users` → `User` + `UserMeta`
3. **Begriffe migrieren** - `wp_terms` + `wp_term_taxonomy` → `Term` + `TermTaxonomy`
4. **Content migrieren** - `wp_posts` → `Article`/`Page`/`Portfolio` + Übersetzungen
5. **Kommentare migrieren** - `wp_comments` → `Comment`
6. **🔗 Term Relationships** - `wp_term_relationships` → `TermRelationship`
7. **Einstellungen migrieren** - `wp_options` → `Setting`

### Content-Typen Unterstützung

| WordPress Post Type | Ziel-Tabelle | Status     | Übersetzungen |
| ------------------- | ------------ | ---------- | ------------- |
| `post`              | `Article`    | ✅ Aktiv   | ✅ Ja         |
| `page`              | `Page`       | ✅ Aktiv   | ✅ Ja         |
| `avada_portfolio`   | `Portfolio`  | ✅ Aktiv   | ✅ Ja         |
| `product`           | `Product`    | 🔄 Geplant | ✅ Ja         |

### Term Relationships Migration

**Neu hinzugefügt:** Automatische Verknüpfung von Content mit Kategorien/Tags:

```sql
-- Beispiel: Artikel "jetbrains-ide-babun-settings-bash"
Article: "jetbrains-ide-babun-settings-bash" → category: "Allgemein"
Article: "jetbrains-ide-babun-settings-bash" → category: "Microsoft"
Article: "jetbrains-ide-babun-settings-bash" → post_tag: "release"
Article: "jetbrains-ide-babun-settings-bash" → post_tag: "technology"
Portfolio: "projekt-xyz" → portfolio_category: "Web Development"
```

### Eigenes Bereinigungsprofil

Bearbeite `scripts/clean-wordpress-dump.ts`:

```typescript
// Zusätzliche Plugin-Prefixe
const PLUGIN_PREFIXES = ['my_custom_plugin_', 'another_plugin_']

// Zusätzliche Shortcodes
const SHORTCODES_TO_CLEAN = [/\[my-shortcode[^\]]*\]/g]
```

## 🔧 Fehlerbehebung

### Häufige Probleme

**1. MySQL Verbindung fehlschlägt:**

```bash
# Prüfe MySQL Verbindung
mysql -h localhost -u rooth3wp -p sta3wp

# Teste Prisma Verbindung
yarn prisma:studio:mysql
```

**2. PostgreSQL Schema fehlt:**

```bash
# Generiere Prisma Clients
yarn prisma:generate

# Führe Migrationen aus
yarn prisma:migrate:postgres
```

**3. Prefix nicht erkannt:**

```bash
# Prüfe .env Datei
grep DB_PREFIX .env

# Setze korrekten Prefix
echo 'DB_PREFIX="dein_prefix_"' >> .env
```

**4. Zu viele Plugin-Tabellen:**

```bash
# Prüfe bereinigte Datei
head -50 .docker/data/mysql/sta3wp_clean.sql

# Füge weitere Plugin-Prefixe hinzu in scripts/clean-wordpress-dump.ts
```

## 📈 Performance-Tipps

1. **Große Datenbanken:** Teile Migration in Batches auf
2. **Bilder:** Migriere Medien separat via Skript
3. **Indizes:** PostgreSQL Indizes werden automatisch erstellt
4. **Logs:** Aktiviere Prisma Logging für Debugging

## 🔄 Workflow-Empfehlung

### Entwicklung

1. `yarn wp:clean` - Dump bereinigen
2. `yarn wp:migrate` - Daten migrieren
3. `yarn dev` - Entwicklungsserver starten
4. `yarn prisma:studio` - Daten prüfen

### Produktion

1. Backup der WordPress-Datenbank
2. Bereinigung auf separatem Server
3. Test-Migration in Staging
4. Produktions-Migration mit Downtime-Plan

## 📝 Weitere Infos

- **Prisma Schemas:** `prisma/*/schema.prisma`
- **Seed-Daten:** `prisma/seed-data/*.ts`
- **Migration-Scripts:** `migrate/*.ts`
- **Docker Setup:** `docker-compose.yml`

## 🆘 Support

Bei Problemen:

1. Prüfe Logs in der Konsole
2. Validiere Datenbank-Verbindungen
3. Checke .env Konfiguration
4. Erstelle GitHub Issue mit Fehlermeldung
