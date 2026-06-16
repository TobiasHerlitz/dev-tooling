import { Database } from 'bun:sqlite';

const dbPath = process.argv[2];
if (!dbPath) {
  console.error('Usage: bun schema.ts <path-to-db>');
  process.exit(1);
}

type ColumnRow = { name: string; type: string; notnull: number; pk: number };
type FkRow = { table: string; from: string; to: string };
type TableRow = { name: string };

const db = new Database(dbPath, { readonly: true });

const tables = db
  .query<TableRow, []>(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
  )
  .all()
  .filter(
    (t) =>
      !t.name.endsWith('_fts') &&
      !t.name.endsWith('_fts_data') &&
      !t.name.endsWith('_fts_idx') &&
      !t.name.endsWith('_fts_content') &&
      !t.name.endsWith('_fts_docsize') &&
      !t.name.endsWith('_fts_config'),
  );

for (const { name } of tables) {
  const cols = db.query<ColumnRow, []>(`PRAGMA table_info("${name}")`).all();
  const fks = db.query<FkRow, []>(`PRAGMA foreign_key_list("${name}")`).all();
  const fkMap = new Map(fks.map((fk) => [fk.from, `→ ${fk.table}.${fk.to}`]));

  console.log(name);
  for (const col of cols) {
    const type = col.type || 'TEXT';
    const pk = col.pk > 0 ? ' PK' : '';
    const nn = col.notnull && !col.pk ? ' NOT NULL' : '';
    const ref = fkMap.get(col.name) ? ` ${fkMap.get(col.name)}` : '';
    console.log(`  ${col.name}  ${type}${pk}${nn}${ref}`);
  }
  console.log();
}

db.close();
