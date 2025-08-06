-- =============================================
-- WordPress-Compatible Schema for PostgreSQL
-- Uses DB_PREFIX from .env file
-- =============================================

DO $$
BEGIN
    -- Set prefix (must match your .env DB_PREFIX)
    PERFORM set_config('app.db_prefix', 'np_', false);
    
    -- Core WordPress Tables (prefixed)
    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.posts (
        ID bigserial PRIMARY KEY,
        post_author bigint NOT NULL DEFAULT 0,
        post_date timestamptz NOT NULL DEFAULT now(),
        post_date_gmt timestamptz NOT NULL DEFAULT now(),
        post_content text NOT NULL,
        post_title text NOT NULL,
        post_excerpt text NOT NULL,
        post_status varchar(20) NOT NULL DEFAULT ''publish'',
        comment_status varchar(20) NOT NULL DEFAULT ''open'',
        ping_status varchar(20) NOT NULL DEFAULT ''open'',
        post_password varchar(255) NOT NULL DEFAULT '''',
        post_name varchar(200) NOT NULL DEFAULT '''',
        to_ping text NOT NULL,
        pinged text NOT NULL,
        post_modified timestamptz NOT NULL DEFAULT now(),
        post_modified_gmt timestamptz NOT NULL DEFAULT now(),
        post_content_filtered text NOT NULL,
        post_parent bigint NOT NULL DEFAULT 0,
        guid varchar(255) NOT NULL DEFAULT '''',
        menu_order int NOT NULL DEFAULT 0,
        post_type varchar(20) NOT NULL DEFAULT ''post'',
        post_mime_type varchar(100) NOT NULL DEFAULT '''',
        comment_count bigint NOT NULL DEFAULT 0
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.postmeta (
        meta_id bigserial PRIMARY KEY,
        post_id bigint NOT NULL DEFAULT 0,
        meta_key varchar(255),
        meta_value text
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.users (
        ID bigserial PRIMARY KEY,
        user_login varchar(60) NOT NULL DEFAULT '''',
        user_pass varchar(255) NOT NULL DEFAULT '''',
        user_nicename varchar(50) NOT NULL DEFAULT '''',
        user_email varchar(100) NOT NULL DEFAULT '''',
        user_url varchar(100) NOT NULL DEFAULT '''',
        user_registered timestamptz NOT NULL DEFAULT now(),
        user_activation_key varchar(255) NOT NULL DEFAULT '''',
        user_status int NOT NULL DEFAULT 0,
        display_name varchar(250) NOT NULL DEFAULT ''''
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.usermeta (
        umeta_id bigserial PRIMARY KEY,
        user_id bigint NOT NULL DEFAULT 0,
        meta_key varchar(255),
        meta_value text
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.comments (
        comment_ID bigserial PRIMARY KEY,
        comment_post_ID bigint NOT NULL DEFAULT 0,
        comment_author text NOT NULL,
        comment_author_email varchar(100) NOT NULL DEFAULT '''',
        comment_author_url varchar(200) NOT NULL DEFAULT '''',
        comment_author_IP varchar(100) NOT NULL DEFAULT '''',
        comment_date timestamptz NOT NULL DEFAULT now(),
        comment_date_gmt timestamptz NOT NULL DEFAULT now(),
        comment_content text NOT NULL,
        comment_karma int NOT NULL DEFAULT 0,
        comment_approved varchar(20) NOT NULL DEFAULT ''1'',
        comment_agent varchar(255) NOT NULL DEFAULT '''',
        comment_type varchar(20) NOT NULL DEFAULT '''',
        comment_parent bigint NOT NULL DEFAULT 0,
        user_id bigint NOT NULL DEFAULT 0
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.commentmeta (
        meta_id bigserial PRIMARY KEY,
        comment_id bigint NOT NULL DEFAULT 0,
        meta_key varchar(255),
        meta_value text
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.terms (
        term_id bigserial PRIMARY KEY,
        name varchar(200) NOT NULL DEFAULT '''',
        slug varchar(200) NOT NULL DEFAULT '''',
        term_group bigint NOT NULL DEFAULT 0
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.term_taxonomy (
        term_taxonomy_id bigserial PRIMARY KEY,
        term_id bigint NOT NULL DEFAULT 0,
        taxonomy varchar(32) NOT NULL DEFAULT '''',
        description text NOT NULL,
        parent bigint NOT NULL DEFAULT 0,
        count bigint NOT NULL DEFAULT 0
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.term_relationships (
        object_id bigint NOT NULL DEFAULT 0,
        term_taxonomy_id bigint NOT NULL DEFAULT 0,
        term_order int NOT NULL DEFAULT 0,
        PRIMARY KEY (object_id, term_taxonomy_id)
    )', current_setting('app.db_prefix')::text);

    EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I.termmeta (
        meta_id bigserial PRIMARY KEY,
        term_id bigint NOT NULL DEFAULT 0,
        meta_key varchar(255),
        meta_value text
    )', current_setting('app.db_prefix')::text);

    -- Create indexes (matches WordPress core indexes)
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_post_name ON %I.posts (post_name)', 
        current_setting('app.db_prefix')::text, current_setting('app.db_prefix')::text);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_post_parent ON %I.posts (post_parent)', 
        current_setting('app.db_prefix')::text, current_setting('app.db_prefix')::text);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_post_meta ON %I.postmeta (post_id, meta_key)', 
        current_setting('app.db_prefix')::text, current_setting('app.db_prefix')::text);
    
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_user_email ON %I.users (user_email)', 
        current_setting('app.db_prefix')::text, current_setting('app.db_prefix')::text);

    -- Add foreign keys (not present in MySQL WP but recommended for PostgreSQL)
    EXECUTE format('ALTER TABLE %I.postmeta ADD CONSTRAINT fk_postmeta_post FOREIGN KEY (post_id) REFERENCES %I.posts(ID) ON DELETE CASCADE',
        current_setting('app.db_prefix')::text, current_setting('app.db_prefix')::text);
    
    EXECUTE format('ALTER TABLE %I.usermeta ADD CONSTRAINT fk_usermeta_user FOREIGN KEY (user_id) REFERENCES %I.users(ID) ON DELETE CASCADE',
        current_setting('app.db_prefix')::text, current_setting('app.db_prefix')::text);

    RAISE NOTICE ''WordPress-compatible schema created with prefix: %'', current_setting('app.db_prefix')::text;
END $$;


-- Example data migration snippet (adjust connection details)
DO $$
BEGIN
    -- Import posts from external WordPress database
    EXECUTE format('
    INSERT INTO %I.posts 
    SELECT * FROM dblink(''dbname=wordpress_db host=mysql user=wp_user password=wp_pass'',
    ''SELECT * FROM wp_posts'') AS wp_posts(
        ID bigint,
        post_author bigint,
        post_date timestamp,
        -- Include all other fields...
    )', current_setting('app.db_prefix')::text);
END $$;