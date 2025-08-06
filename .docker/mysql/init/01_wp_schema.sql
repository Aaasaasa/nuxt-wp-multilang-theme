-- =============================================
-- WordPress MySQL Complete Database Schema
-- File: docker-init/mysql/01_wp_schema.sql
-- Features:
-- 1. All core WordPress tables with proper structure
-- 2. Dynamic table prefix from DB_PREFIX
-- 3. Proper indexes and constraints
-- 4. Basic initial data setup
-- =============================================

SET @prefix = IFNULL(@db_prefix, 'wp_');

-- Core Tables --------------------------------------------------------

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'posts (
  ID bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  post_author bigint(20) unsigned NOT NULL DEFAULT 0,
  post_date datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  post_date_gmt datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  post_content longtext NOT NULL,
  post_title text NOT NULL,
  post_excerpt text NOT NULL,
  post_status varchar(20) NOT NULL DEFAULT ''publish'',
  comment_status varchar(20) NOT NULL DEFAULT ''open'',
  ping_status varchar(20) NOT NULL DEFAULT ''open'',
  post_password varchar(255) NOT NULL DEFAULT '''',
  post_name varchar(200) NOT NULL DEFAULT '''',
  to_ping text NOT NULL,
  pinged text NOT NULL,
  post_modified datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  post_modified_gmt datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  post_content_filtered longtext NOT NULL,
  post_parent bigint(20) unsigned NOT NULL DEFAULT 0,
  guid varchar(255) NOT NULL DEFAULT '''',
  menu_order int(11) NOT NULL DEFAULT 0,
  post_type varchar(20) NOT NULL DEFAULT ''post'',
  post_mime_type varchar(100) NOT NULL DEFAULT '''',
  comment_count bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (ID),
  KEY post_name (post_name(191)),
  KEY type_status_date (post_type,post_status,post_date,ID),
  KEY post_parent (post_parent),
  KEY post_author (post_author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'postmeta (
  meta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  post_id bigint(20) unsigned NOT NULL DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext,
  PRIMARY KEY (meta_id),
  KEY post_id (post_id),
  KEY meta_key (meta_key(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'users (
  ID bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_login varchar(60) NOT NULL DEFAULT '''',
  user_pass varchar(255) NOT NULL DEFAULT '''',
  user_nicename varchar(50) NOT NULL DEFAULT '''',
  user_email varchar(100) NOT NULL DEFAULT '''',
  user_url varchar(100) NOT NULL DEFAULT '''',
  user_registered datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  user_activation_key varchar(255) NOT NULL DEFAULT '''',
  user_status int(11) NOT NULL DEFAULT 0,
  display_name varchar(250) NOT NULL DEFAULT '''',
  PRIMARY KEY (ID),
  KEY user_login_key (user_login),
  KEY user_nicename (user_nicename),
  KEY user_email (user_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'usermeta (
  umeta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user_id bigint(20) unsigned NOT NULL DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext,
  PRIMARY KEY (umeta_id),
  KEY user_id (user_id),
  KEY meta_key (meta_key(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'comments (
  comment_ID bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  comment_post_ID bigint(20) unsigned NOT NULL DEFAULT 0,
  comment_author tinytext NOT NULL,
  comment_author_email varchar(100) NOT NULL DEFAULT '''',
  comment_author_url varchar(200) NOT NULL DEFAULT '''',
  comment_author_IP varchar(100) NOT NULL DEFAULT '''',
  comment_date datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  comment_date_gmt datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  comment_content text NOT NULL,
  comment_karma int(11) NOT NULL DEFAULT 0,
  comment_approved varchar(20) NOT NULL DEFAULT ''1'',
  comment_agent varchar(255) NOT NULL DEFAULT '''',
  comment_type varchar(20) NOT NULL DEFAULT '''',
  comment_parent bigint(20) unsigned NOT NULL DEFAULT 0,
  user_id bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (comment_ID),
  KEY comment_post_ID (comment_post_ID),
  KEY comment_approved_date_gmt (comment_approved,comment_date_gmt),
  KEY comment_date_gmt (comment_date_gmt),
  KEY comment_parent (comment_parent),
  KEY comment_author_email (comment_author_email(10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'commentmeta (
  meta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  comment_id bigint(20) unsigned NOT NULL DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext,
  PRIMARY KEY (meta_id),
  KEY comment_id (comment_id),
  KEY meta_key (meta_key(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'terms (
  term_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(200) NOT NULL DEFAULT '''',
  slug varchar(200) NOT NULL DEFAULT '''',
  term_group bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (term_id),
  KEY slug (slug(191)),
  KEY name (name(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'term_taxonomy (
  term_taxonomy_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  term_id bigint(20) unsigned NOT NULL DEFAULT 0,
  taxonomy varchar(32) NOT NULL DEFAULT '''',
  description longtext NOT NULL,
  parent bigint(20) unsigned NOT NULL DEFAULT 0,
  count bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (term_taxonomy_id),
  UNIQUE KEY term_id_taxonomy (term_id,taxonomy),
  KEY taxonomy (taxonomy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'term_relationships (
  object_id bigint(20) unsigned NOT NULL DEFAULT 0,
  term_taxonomy_id bigint(20) unsigned NOT NULL DEFAULT 0,
  term_order int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (object_id,term_taxonomy_id),
  KEY term_taxonomy_id (term_taxonomy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'termmeta (
  meta_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  term_id bigint(20) unsigned NOT NULL DEFAULT 0,
  meta_key varchar(255) DEFAULT NULL,
  meta_value longtext,
  PRIMARY KEY (meta_id),
  KEY term_id (term_id),
  KEY meta_key (meta_key(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Options Table ------------------------------------------------------

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'options (
  option_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  option_name varchar(191) NOT NULL DEFAULT '''',
  option_value longtext NOT NULL,
  autoload varchar(20) NOT NULL DEFAULT ''yes'',
  PRIMARY KEY (option_id),
  UNIQUE KEY option_name (option_name),
  KEY autoload (autoload)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Links Table --------------------------------------------------------

SET @sql = CONCAT('
CREATE TABLE IF NOT EXISTS ', @prefix, 'links (
  link_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  link_url varchar(255) NOT NULL DEFAULT '''',
  link_name varchar(255) NOT NULL DEFAULT '''',
  link_image varchar(255) NOT NULL DEFAULT '''',
  link_target varchar(25) NOT NULL DEFAULT '''',
  link_description varchar(255) NOT NULL DEFAULT '''',
  link_visible varchar(20) NOT NULL DEFAULT ''Y'',
  link_owner bigint(20) unsigned NOT NULL DEFAULT 1,
  link_rating int(11) NOT NULL DEFAULT 0,
  link_updated datetime NOT NULL DEFAULT ''1000-01-01 00:00:00'',
  link_rel varchar(255) NOT NULL DEFAULT '''',
  link_notes mediumtext NOT NULL,
  link_rss varchar(255) NOT NULL DEFAULT '''',
  PRIMARY KEY (link_id),
  KEY link_visible (link_visible)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Initial Data Setup -------------------------------------------------

SET @sql = CONCAT('
INSERT IGNORE INTO ', @prefix, 'options (option_name, option_value, autoload) VALUES
  (''siteurl'', ''http://localhost'', ''yes''),
  (''home'', ''http://localhost'', ''yes''),
  (''blogname'', ''My WordPress Site'', ''yes''),
  (''blogdescription'', ''Just another WordPress site'', ''yes''),
  (''users_can_register'', ''0'', ''yes''),
  (''admin_email'', ''admin@example.com'', ''yes''),
  (''start_of_week'', ''1'', ''yes''),
  (''use_balanceTags'', ''0'', ''yes''),
  (''use_smilies'', ''1'', ''yes''),
  (''require_name_email'', ''1'', ''yes''),
  (''comments_notify'', ''1'', ''yes''),
  (''posts_per_rss'', ''10'', ''yes''),
  (''rss_use_excerpt'', ''0'', ''yes''),
  (''default_category'', ''1'', ''yes''),
  (''default_comment_status'', ''open'', ''yes''),
  (''default_ping_status'', ''open'', ''yes'')
');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Admin User Creation -------------------------------------------------
-- Note: Replace the password hash with a real WordPress hash after setup

SET @sql = CONCAT('
INSERT IGNORE INTO ', @prefix, 'users 
  (user_login, user_pass, user_email, user_registered, display_name) 
VALUES 
  (''admin'', ''$P$BDRJvY9m8N9Jf9Z9Z9Z9Z9Z9Z9Z9Z9Z9'', ''admin@example.com'', NOW(), ''Admin'')
');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verification -------------------------------------------------------

SET @sql = CONCAT('
SELECT 
  COUNT(*) AS tables_created,
  (SELECT COUNT(*) FROM ', @prefix, 'options) AS options_count,
  (SELECT COUNT(*) FROM ', @prefix, 'users) AS users_count
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND table_name LIKE ''', @prefix, '%''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =============================================
-- End of WordPress Database Initialization
-- =============================================