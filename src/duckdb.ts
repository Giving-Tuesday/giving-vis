import * as duckdb from '@duckdb/duckdb-wasm';

let dbInstance: duckdb.AsyncDuckDB | null = null;
let initPromise: Promise<duckdb.AsyncDuckDB> | null = null;

async function initDB(): Promise<duckdb.AsyncDuckDB> {
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);

  const workerUrl = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], {
      type: 'text/javascript',
    }),
  );

  const worker = new Worker(workerUrl);
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(workerUrl);

  return db;
}

export async function getDB(): Promise<duckdb.AsyncDuckDB> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = initDB().then((db) => {
    dbInstance = db;
    return db;
  });

  return initPromise;
}

export async function loadParquet(
  url: string,
  tableName: string,
): Promise<void> {
  const db = await getDB();
  const conn = await db.connect();
  try {
    const absoluteUrl = new URL(url, window.location.origin).href;
    await db.registerFileURL(
      `${tableName}.parquet`,
      absoluteUrl,
      duckdb.DuckDBDataProtocol.HTTP,
      false,
    );
    await conn.query(
      `CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM '${tableName}.parquet'`,
    );
  } finally {
    await conn.close();
  }
}

export async function query<T = Record<string, unknown>>(
  sql: string,
): Promise<T[]> {
  const db = await getDB();
  const conn = await db.connect();
  try {
    const result = await conn.query(sql);
    return result.toArray().map((row) => row.toJSON()) as T[];
  } finally {
    await conn.close();
  }
}
