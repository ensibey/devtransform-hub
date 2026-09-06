export interface SqlRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Queries & Filtering' | 'Performance & Indexing' | 'Data Manipulation (DML)' | 'Schema & Admin (DDL)' | 'Window Functions';
  dialect: 'ANSI SQL / Universal' | 'PostgreSQL' | 'MySQL' | 'SQLite' | 'SQL Server';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  riskLevel: 'Safe' | 'Reversible' | 'Destructive';
  summary: string;
  quickQuery: string;
  scenario: string;
  steps: {
    title: string;
    query: string;
    explanation: string;
  }[];
  alternatives?: {
    name: string;
    query: string;
    whenToUse: string;
  }[];
  pitfalls: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const SQL_RECIPES: SqlRecipe[] = [
  {
    slug: 'find-duplicate-rows-sql',
    title: 'How to Find and Delete Duplicate Rows in SQL',
    shortTitle: 'Find & Delete Duplicate Rows',
    category: 'Queries & Filtering',
    dialect: 'ANSI SQL / Universal',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Identify rows with duplicate column values using GROUP BY and HAVING count(*) > 1, and safely remove duplicates using ROW_NUMBER() CTEs.',
    quickQuery: `SELECT email, COUNT(*)\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;`,
    scenario: 'A bug in sign-up or import logic created duplicate user email records or identical order entries in your database.',
    steps: [
      {
        title: 'Find all duplicate emails and count',
        query: 'SELECT email, COUNT(*)\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;',
        explanation: 'Groups rows by the email column and filters out groups with only 1 occurrence, showing which values are duplicated.',
      },
      {
        title: 'View all columns of the duplicated rows',
        query: 'SELECT *\nFROM users\nWHERE email IN (\n  SELECT email\n  FROM users\n  GROUP BY email\n  HAVING COUNT(*) > 1\n)\nORDER BY email, created_at;',
        explanation: 'Subquery returns all full row records belonging to duplicated groups for manual comparison.',
      },
      {
        title: 'Safely delete duplicates keeping the oldest row (Postgres / SQL Server)',
        query: 'WITH ranked_duplicates AS (\n  SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id ASC) as row_num\n  FROM users\n)\nDELETE FROM users\nWHERE id IN (\n  SELECT id FROM ranked_duplicates WHERE row_num > 1\n);',
        explanation: 'Assigns a row rank per partition. Keeps row_num = 1 and permanently deletes subsequent duplicates.',
      },
    ],
    pitfalls: [
      'Always test your DELETE query with a SELECT first inside a BEGIN TRANSACTION / ROLLBACK block.',
      'If your table lacks a unique primary key (ID), use the database physical row identifier (ctid in PostgreSQL, rowid in SQLite).',
    ],
    faqs: [
      {
        question: 'How do I prevent future duplicate rows in SQL?',
        answer: 'Add a UNIQUE constraint or unique index: "ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);".',
      },
      {
        question: 'How do I do this in MySQL?',
        answer: 'MySQL supports DELETE with JOIN: "DELETE t1 FROM users t1 INNER JOIN users t2 WHERE t1.id > t2.id AND t1.email = t2.email;".',
      },
    ],
  },
  {
    slug: 'delete-vs-truncate-vs-drop',
    title: 'DELETE vs TRUNCATE vs DROP in SQL: Differences Explained',
    shortTitle: 'DELETE vs TRUNCATE vs DROP',
    category: 'Schema & Admin (DDL)',
    dialect: 'ANSI SQL / Universal',
    difficulty: 'Beginner',
    riskLevel: 'Destructive',
    summary: 'Compare row-by-row logging (DELETE), fast table emptying with auto-increment reset (TRUNCATE), and complete table removal (DROP).',
    quickQuery: `-- DELETE (Slow, logged, where clause):\nDELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days';\n\n-- TRUNCATE (Fast, resets sequence, no where):\nTRUNCATE TABLE logs RESTART IDENTITY;\n\n-- DROP (Deletes table schema & data):\nDROP TABLE logs CASCADE;`,
    scenario: 'You need to clear millions of test records or decommission an old database table and need the fastest, safest method.',
    steps: [
      {
        title: 'DELETE (Data Manipulation Language - DML)',
        query: "DELETE FROM users WHERE status = 'inactive';",
        explanation: 'Deletes specific rows satisfying the WHERE clause. Logs each row deletion in write-ahead logs (WAL), fires triggers, and can be rolled back.',
      },
      {
        title: 'TRUNCATE (Data Definition Language - DDL)',
        query: 'TRUNCATE TABLE users RESTART IDENTITY CASCADE;',
        explanation: 'Instant table wipe by deallocating data pages. Bypasses individual row logging, resets AUTO_INCREMENT / IDENTITY counter, but cannot use WHERE.',
      },
      {
        title: 'DROP (Data Definition Language - DDL)',
        query: 'DROP TABLE IF EXISTS users CASCADE;',
        explanation: 'Permanently destroys both the data and the entire table schema, indexes, constraints, and permissions.',
      },
    ],
    pitfalls: [
      'TRUNCATE cannot be run on tables referenced by foreign keys from other tables unless CASCADE is specified.',
      'In MySQL, TRUNCATE triggers an implicit commit and cannot be rolled back inside a transaction!',
    ],
    faqs: [
      {
        question: 'Can TRUNCATE be rolled back in PostgreSQL?',
        answer: 'Yes! In PostgreSQL, DDL commands including TRUNCATE are fully transactional and can be rolled back within a BEGIN ... ROLLBACK block.',
      },
    ],
  },
  {
    slug: 'postgres-upsert-on-conflict',
    title: 'How to UPSERT in PostgreSQL Using ON CONFLICT DO UPDATE',
    shortTitle: 'PostgreSQL Upsert (ON CONFLICT)',
    category: 'Data Manipulation (DML)',
    dialect: 'PostgreSQL',
    difficulty: 'Intermediate',
    riskLevel: 'Safe',
    summary: 'Atomically insert a new row or update an existing row if a unique constraint or primary key conflict is encountered.',
    quickQuery: `INSERT INTO users (id, name, login_count)\nVALUES (1, 'Alice', 1)\nON CONFLICT (id)\nDO UPDATE SET\n  name = EXCLUDED.name,\n  login_count = users.login_count + 1,\n  updated_at = NOW();`,
    scenario: 'Syncing external CRM data or tracking user session counters without throwing duplicate key errors or doing double SELECT/INSERT checks.',
    steps: [
      {
        title: 'Basic Upsert with DO UPDATE',
        query: 'INSERT INTO user_settings (user_id, theme, updated_at)\nVALUES (42, \'dark\', NOW())\nON CONFLICT (user_id)\nDO UPDATE SET\n  theme = EXCLUDED.theme,\n  updated_at = EXCLUDED.updated_at;',
        explanation: 'EXCLUDED references the proposed row that would have been inserted. If user_id 42 exists, theme is updated.',
      },
      {
        title: 'Upsert with DO NOTHING (Ignore conflicts)',
        query: 'INSERT INTO tag_subscribers (tag_id, user_id)\nVALUES (5, 42)\nON CONFLICT (tag_id, user_id)\nDO NOTHING;',
        explanation: 'Silently ignores duplicate inserts without throwing error code 23505 (unique_violation).',
      },
      {
        title: 'Conditional DO UPDATE with WHERE filter',
        query: 'INSERT INTO inventory (sku, stock_qty)\nVALUES (\'WIDGET-01\', 10)\nON CONFLICT (sku)\nDO UPDATE SET stock_qty = EXCLUDED.stock_qty\nWHERE EXCLUDED.stock_qty > inventory.stock_qty;',
        explanation: 'Only updates the existing row if the incoming data meets a specific condition.',
      },
    ],
    pitfalls: [
      'ON CONFLICT requires an explicit unique index or primary key constraint on the conflicting target columns.',
    ],
    faqs: [
      {
        question: 'What is the MySQL equivalent of ON CONFLICT?',
        answer: 'MySQL uses "INSERT INTO ... ON DUPLICATE KEY UPDATE name = VALUES(name)".',
      },
    ],
  },
  {
    slug: 'sql-running-total-window-function',
    title: 'How to Calculate a Running Total (Cumulative Sum) in SQL',
    shortTitle: 'Running Total (Window Function)',
    category: 'Window Functions',
    dialect: 'ANSI SQL / Universal',
    difficulty: 'Intermediate',
    riskLevel: 'Safe',
    summary: 'Compute cumulative running totals over time or partitioned groups using SUM() OVER (ORDER BY ...).',
    quickQuery: `SELECT\n  order_date,\n  amount,\n  SUM(amount) OVER (ORDER BY order_date ASC) AS running_total\nFROM orders;`,
    scenario: 'You are building a revenue dashboard or financial ledger and need the accumulated revenue balance for each transaction row.',
    steps: [
      {
        title: 'Basic running total across entire table',
        query: 'SELECT\n  order_date,\n  amount,\n  SUM(amount) OVER (ORDER BY order_date ASC) AS running_total\nFROM orders;',
        explanation: 'Calculates the cumulative sum of amount ordered by date from the first row up to the current row.',
      },
      {
        title: 'Running total partitioned by customer',
        query: 'SELECT\n  customer_id,\n  order_date,\n  amount,\n  SUM(amount) OVER (\n    PARTITION BY customer_id\n    ORDER BY order_date ASC\n  ) AS customer_cumulative_spend\nFROM orders;',
        explanation: 'Resets the running total back to 0 whenever the customer_id changes.',
      },
      {
        title: 'Running monthly revenue with CTE',
        query: 'WITH monthly_sales AS (\n  SELECT DATE_TRUNC(\'month\', order_date) AS month, SUM(amount) AS monthly_revenue\n  FROM orders\n  GROUP BY 1\n)\nSELECT\n  month,\n  monthly_revenue,\n  SUM(monthly_revenue) OVER (ORDER BY month ASC) AS cumulative_annual_revenue\nFROM monthly_sales;',
        explanation: 'Aggregates monthly sums first, then calculates the cumulative running revenue.',
      },
    ],
    pitfalls: [
      'If multiple rows have the exact same ORDER BY value, SUM() OVER will calculate the sum including all peer rows with the same value unless you include an ID tie-breaker (ORDER BY date, id).',
    ],
    faqs: [
      {
        question: 'Are window functions supported in SQLite?',
        answer: 'Yes! SQLite added full window function support in version 3.25.0+.',
      },
    ],
  },
  {
    slug: 'create-index-concurrently-postgres',
    title: 'How to Create an Index Concurrently in PostgreSQL (Zero Downtime)',
    shortTitle: 'Create Index Concurrently (Zero Locks)',
    category: 'Performance & Indexing',
    dialect: 'PostgreSQL',
    difficulty: 'Advanced',
    riskLevel: 'Safe',
    summary: 'Build a production database index on a table with millions of rows without locking out live INSERT, UPDATE, or DELETE operations.',
    quickQuery: `CREATE INDEX CONCURRENTLY idx_users_email\nON users (email);`,
    scenario: 'Your production table has 10 million rows. Standard CREATE INDEX acquires an EXCLUSIVE table lock, blocking all web traffic and causing 504 Gateway Timeouts.',
    steps: [
      {
        title: 'Create standard index concurrently',
        query: 'CREATE INDEX CONCURRENTLY idx_orders_customer_date\nON orders (customer_id, order_date DESC);',
        explanation: 'Takes two table passes to build the index in the background without acquiring a write lock on the table.',
      },
      {
        title: 'Create unique index concurrently',
        query: 'CREATE UNIQUE INDEX CONCURRENTLY idx_unique_tenant_subdomain\nON tenants (subdomain);',
        explanation: 'Enforces unique constraints in production without downtime.',
      },
      {
        title: 'Check for invalid or failed indexes',
        query: 'SELECT indisvalid, indexrelid::regclass\nFROM pg_index\nWHERE NOT indisvalid;',
        explanation: 'If a concurrent build fails (e.g. timeout or duplicate violation), Postgres leaves an invalid index that must be dropped and rebuilt.',
      },
      {
        title: 'Drop invalid index concurrently',
        query: 'DROP INDEX CONCURRENTLY IF EXISTS idx_users_email;',
        explanation: 'Safely removes an invalid or obsolete index without write locks.',
      },
    ],
    pitfalls: [
      'CREATE INDEX CONCURRENTLY cannot be run inside a transaction block (BEGIN ... COMMIT). Must be run as an individual auto-commit command.',
      'It takes about 2-3x longer to build than a locked index because it performs two full table scans.',
    ],
    faqs: [
      {
        question: 'Why does CREATE INDEX lock the table?',
        answer: 'Standard CREATE INDEX takes a SHARE lock that allows SELECT queries but blocks all INSERT, UPDATE, and DELETE queries until indexing finishes.',
      },
    ],
  },
  {
    slug: 'update-from-another-table-sql',
    title: 'How to UPDATE a Table From Another Table in SQL',
    shortTitle: 'UPDATE From Another Table',
    category: 'Data Manipulation (DML)',
    dialect: 'ANSI SQL / Universal',
    difficulty: 'Intermediate',
    riskLevel: 'Reversible',
    summary: 'Update values in one table based on matching columns or aggregations in a secondary table.',
    quickQuery: `-- PostgreSQL / SQLite syntax:\nUPDATE products p\nSET price = n.new_price,\n    updated_at = NOW()\nFROM price_updates n\nWHERE p.sku = n.sku;`,
    scenario: 'You imported a CSV spreadsheet of updated product prices into a staging table and need to bulk update your live products table.',
    steps: [
      {
        title: 'PostgreSQL syntax (UPDATE ... FROM)',
        query: 'UPDATE products p\nSET\n  price = u.price,\n  updated_at = NOW()\nFROM product_price_imports u\nWHERE p.id = u.product_id;',
        explanation: 'Uses the clean and efficient PostgreSQL UPDATE ... FROM syntax.',
      },
      {
        title: 'MySQL syntax (UPDATE ... JOIN)',
        query: 'UPDATE products p\nJOIN product_price_imports u ON p.id = u.product_id\nSET\n  p.price = u.price,\n  p.updated_at = NOW();',
        explanation: 'MySQL supports direct JOIN syntax in UPDATE statements.',
      },
      {
        title: 'Universal ANSI SQL Subquery (Works on all engines)',
        query: 'UPDATE products\nSET price = (\n  SELECT price FROM product_price_imports WHERE product_price_imports.product_id = products.id\n)\nWHERE EXISTS (\n  SELECT 1 FROM product_price_imports WHERE product_price_imports.product_id = products.id\n);',
        explanation: 'Correlated subquery compatible with all SQL engines including older databases.',
      },
    ],
    pitfalls: [
      'In ANSI subqueries, always include the WHERE EXISTS clause; otherwise, rows without a match in the secondary table will have their columns overwritten with NULL!',
    ],
    faqs: [
      {
        question: 'What happens if the secondary table has multiple rows matching one row in the primary table?',
        answer: 'Only one of the matching rows will be used arbitrarily to update the primary row. Ensure the secondary table has unique matching keys.',
      },
    ],
  },
  {
    slug: 'reset-auto-increment-mysql-postgres',
    title: 'How to Reset Auto Increment / Sequence in MySQL & PostgreSQL',
    shortTitle: 'Reset Auto Increment / Sequence',
    category: 'Schema & Admin (DDL)',
    dialect: 'ANSI SQL / Universal',
    difficulty: 'Beginner',
    riskLevel: 'Reversible',
    summary: 'Reset the next auto-generated primary key ID back to 1 or synchronize it with the maximum existing ID in the table.',
    quickQuery: `-- MySQL:\nALTER TABLE users AUTO_INCREMENT = 1;\n\n-- PostgreSQL:\nSELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;`,
    scenario: 'You deleted test rows from a table and want subsequent new rows to start with ID 1, or after a database migration primary key sequence is out of sync.',
    steps: [
      {
        title: 'MySQL reset auto increment',
        query: 'ALTER TABLE users AUTO_INCREMENT = 1;',
        explanation: 'Resets the next ID. If table already contains rows, MySQL automatically sets it to MAX(id) + 1.',
      },
      {
        title: 'PostgreSQL synchronize sequence with MAX(id)',
        query: 'SELECT setval(\n  pg_get_serial_sequence(\'users\', \'id\'),\n  COALESCE(MAX(id), 0) + 1,\n  false\n) FROM users;',
        explanation: 'Dynamically looks up the sequence name and sets nextval to maximum existing ID + 1 to avoid duplicate key errors.',
      },
      {
        title: 'SQLite reset rowid sequence',
        query: 'UPDATE sqlite_sequence SET seq = 0 WHERE name = \'users\';',
        explanation: 'SQLite tracks auto-increment values in the internal sqlite_sequence table.',
      },
    ],
    pitfalls: [
      'In PostgreSQL, restoring data via pg_dump without sequences causes duplicate key violation error code 23505 on next insert until setval() is run.',
    ],
    faqs: [
      {
        question: 'Why does my PostgreSQL insert say "duplicate key value violates unique constraint users_pkey"?',
        answer: 'Your table sequence was not updated after manual ID inserts. Run the setval() query above to synchronize the sequence with the table MAX(id).',
      },
    ],
  },
  {
    slug: 'find-slow-queries-explain-analyze',
    title: 'How to Use EXPLAIN ANALYZE to Optimize Slow SQL Queries',
    shortTitle: 'Optimize Slow Queries (EXPLAIN ANALYZE)',
    category: 'Performance & Indexing',
    dialect: 'ANSI SQL / Universal',
    difficulty: 'Advanced',
    riskLevel: 'Safe',
    summary: 'Inspect the query execution plan, index scans vs sequential table scans, execution time, and buffer cache hits.',
    quickQuery: `EXPLAIN (ANALYZE, BUFFERS, COSTS)\nSELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC;`,
    scenario: 'An API endpoint takes 4 seconds to respond, and you need to determine which table scan or join is causing the database bottleneck.',
    steps: [
      {
        title: 'Run full execution plan with timing and buffers (PostgreSQL)',
        query: 'EXPLAIN (ANALYZE, BUFFERS, VERBOSE)\nSELECT * FROM orders\nWHERE customer_id = 1042 AND status = \'completed\'\nORDER BY created_at DESC\nLIMIT 20;',
        explanation: 'ANALYZE actually executes the query and compares estimated row counts against actual execution timing in milliseconds.',
      },
      {
        title: 'MySQL EXPLAIN ANALYZE (MySQL 8.0+)',
        query: 'EXPLAIN ANALYZE\nSELECT * FROM orders\nWHERE customer_id = 1042\nORDER BY created_at DESC;',
        explanation: 'Displays the iterator tree with cost, actual time per row, and loop counts.',
      },
    ],
    pitfalls: [
      'WARNING: EXPLAIN ANALYZE actually executes the statement! If you run "EXPLAIN ANALYZE DELETE ...", the rows WILL be deleted from your database!',
    ],
    faqs: [
      {
        question: 'What is the biggest red flag in an EXPLAIN ANALYZE output?',
        answer: '"Seq Scan on table (cost=... rows=1000000)" indicates PostgreSQL is reading every single page on disk because no suitable index was found.',
      },
    ],
  },
  {
    slug: 'sql-joins-explained',
    title: 'SQL Joins Explained: INNER, LEFT, RIGHT, FULL OUTER & CROSS',
    shortTitle: 'SQL Joins Visual Matrix',
    category: 'Queries & Filtering',
    dialect: 'ANSI SQL / Universal',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'A visual and practical guide to combining data from multiple relational tables with real-world examples.',
    quickQuery: `-- INNER JOIN (Only matching rows):\nSELECT * FROM users u INNER JOIN orders o ON u.id = o.user_id;\n\n-- LEFT JOIN (All users + matching orders):\nSELECT * FROM users u LEFT JOIN orders o ON u.id = o.user_id;`,
    scenario: 'You are writing an analytics report and need to choose between INNER JOIN, LEFT JOIN, or FULL OUTER JOIN.',
    steps: [
      {
        title: 'INNER JOIN (Intersection of both tables)',
        query: 'SELECT u.name, o.order_number, o.amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;',
        explanation: 'Returns rows only when there is a match in both the users and orders tables.',
      },
      {
        title: 'LEFT JOIN (Keep all left rows, even with no match)',
        query: 'SELECT u.name, COALESCE(COUNT(o.id), 0) AS total_orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.name;',
        explanation: 'Returns all users regardless of whether they have placed any orders. Unmatched order columns return NULL.',
      },
      {
        title: 'Find rows in Table A that DO NOT exist in Table B (Anti-Join)',
        query: 'SELECT u.id, u.email\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.id IS NULL;',
        explanation: 'Filters for users who have never placed an order.',
      },
    ],
    pitfalls: [
      'Placing filter conditions on the right-hand table in the WHERE clause instead of the ON clause transforms a LEFT JOIN into an INNER JOIN.',
    ],
    faqs: [
      {
        question: 'Is FULL OUTER JOIN supported in MySQL?',
        answer: 'MySQL does not natively support FULL OUTER JOIN. You can emulate it by doing a LEFT JOIN UNION a RIGHT JOIN.',
      },
    ],
  },
  {
    slug: 'postgres-backup-restore-pgdump',
    title: 'How to Backup and Restore a PostgreSQL Database with pg_dump & psql',
    shortTitle: 'PostgreSQL Backup & Restore (pg_dump)',
    category: 'Schema & Admin (DDL)',
    dialect: 'PostgreSQL',
    difficulty: 'Intermediate',
    riskLevel: 'Safe',
    summary: 'Export compressed SQL dump archives and restore them cleanly to local or remote database instances.',
    quickQuery: `# Backup:\npg_dump -U postgres -d mydb -Fc -f mydb_backup.dump\n\n# Restore:\npg_restore -U postgres -d mydb --clean --if-exists mydb_backup.dump`,
    scenario: 'You need to take a snapshot backup before deploying a major schema migration or clone production data to your local development environment.',
    steps: [
      {
        title: 'Create custom compressed binary dump (Recommended)',
        query: 'pg_dump -U postgres -h localhost -p 5432 -d production_db -Fc -f backup_2026.dump',
        explanation: '-Fc produces a compressed custom format archive that supports parallel multi-threaded restores and selective table extraction.',
      },
      {
        title: 'Create plain text SQL dump',
        query: 'pg_dump -U postgres -d production_db > backup.sql',
        explanation: 'Creates a human-readable SQL text script that can be inspected with any text editor.',
      },
      {
        title: 'Restore custom dump with pg_restore',
        query: 'pg_restore -U postgres -d dev_db --clean --if-exists -j 4 backup_2026.dump',
        explanation: '--clean drops existing database objects before recreating them. -j 4 uses 4 parallel CPU jobs for blazing fast restores.',
      },
      {
        title: 'Restore plain text SQL dump with psql',
        query: 'psql -U postgres -d dev_db -f backup.sql',
        explanation: 'Executes the SQL script line-by-line using psql.',
      },
    ],
    pitfalls: [
      'Do not use "psql" to restore custom format (.dump) files. Always use "pg_restore" for -Fc archives and "psql" for plain text .sql files.',
    ],
    faqs: [
      {
        question: 'How do I dump only a single specific table?',
        answer: 'Use the "-t" flag: "pg_dump -U postgres -d mydb -t users -Fc -f users.dump".',
      },
    ],
  },
];

export function getAllSqlRecipes(): SqlRecipe[] {
  return SQL_RECIPES;
}

export function getSqlRecipeBySlug(slug: string): SqlRecipe | undefined {
  return SQL_RECIPES.find((r) => r.slug === slug);
}
