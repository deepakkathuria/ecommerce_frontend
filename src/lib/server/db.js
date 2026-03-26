import mysql from "mysql2/promise";

const poolByDatabase = new Map();

/** User / cart / orders (Node `userDBPool`). */
export function userDatabaseName() {
  const v =
    process.env.USER_DB_NAME || process.env.DB_NAME || process.env.POLL_DB_NAME || "";
  return String(v).trim();
}

/**
 * Catalog: products, reviews, promos. Default matches Node when everything lives in USER_DB_NAME (audiophile).
 * Order: CATALOG_DB_NAME → USER_DB_NAME → POLL_DB_NAME → DB_NAME
 * (POLL_DB_NAME alone is often another app e.g. games11 with no `products` — do not prefer it over USER.)
 * Split DB (users in audiophile, products in games11): set CATALOG_DB_NAME=games11
 */
export function catalogDatabaseName() {
  const v =
    process.env.CATALOG_DB_NAME ||
    process.env.USER_DB_NAME ||
    process.env.POLL_DB_NAME ||
    process.env.DB_NAME ||
    "";
  return String(v).trim();
}

function sslConfig() {
  if (process.env.DB_SSL === "false") return undefined;
  if (process.env.DB_SSL === "true") return { rejectUnauthorized: false };
  const port = Number(process.env.DB_PORT || 3306);
  if (port !== 3306) return { rejectUnauthorized: false };
  return undefined;
}

function createPool(database) {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  if (!host || !user) {
    throw new Error(
      "DB_HOST and DB_USER are required — add them to ecommerce_next/.env.local (or .env) and restart dev server"
    );
  }
  if (!database) {
    throw new Error(
      "Database name missing — set at least one of USER_DB_NAME, POLL_DB_NAME, DB_NAME (same as Node .env)"
    );
  }
  const port = Number(process.env.DB_PORT || 3306);
  const ssl = sslConfig();
  const opts = {
    host,
    user,
    password: process.env.DB_PASSWORD,
    database,
    port,
    waitForConnections: true,
    connectionLimit: Math.max(1, parseInt(String(process.env.DB_POOL_MAX || "10").trim(), 10) || 10),
  };
  if (ssl) opts.ssl = ssl;
  return mysql.createPool(opts);
}

function poolForDatabase(database) {
  if (!poolByDatabase.has(database)) {
    poolByDatabase.set(database, createPool(database));
  }
  return poolByDatabase.get(database);
}

/** User / cart / orders DB (Node `userDBPool` — audiophile when USER_DB_NAME is set) */
export function getUserPool() {
  const db = userDatabaseName();
  if (!db) {
    throw new Error(
      "Set USER_DB_NAME, DB_NAME, or POLL_DB_NAME in ecommerce_next/.env.local — Next does not load .env.example"
    );
  }
  return poolForDatabase(db);
}

/** Catalog DB — products, reviews, promos. See `catalogDatabaseName()`. */
export function getPollPool() {
  const db = catalogDatabaseName();
  if (!db) {
    throw new Error(
      "Set USER_DB_NAME, CATALOG_DB_NAME, POLL_DB_NAME, or DB_NAME in ecommerce_next/.env.local"
    );
  }
  return poolForDatabase(db);
}

/** Optional internal_links DB if you add routes later */
export function getInternalPool() {
  const db = process.env.INTERNAL_DB_NAME;
  if (!db) return null;
  return poolForDatabase(db);
}

/** When a single DB holds everything, user and poll pools resolve to the same pool. */
export function getPool() {
  return getPollPool();
}
