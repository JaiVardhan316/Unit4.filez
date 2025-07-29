import db from "#db/client";

export async function getAllFilesWithFolderName() {
  const sql = `
    SELECT 
      files.*, 
      folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
  `;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getAllFolders() {
  const sql = `SELECT * FROM folders`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getFolderById(id) {
  const sql = `SELECT * FROM folders WHERE id = $1`;
  const { rows } = await db.query(sql, [id]);
  return rows[0] || null;
}

export async function getFilesInFolder(id) {
  const sql = `SELECT * FROM files WHERE folder_id = $1`;
  const { rows } = await db.query(sql, [id]);
  return rows;
}

export async function insertFile({ name, size, folder_id }) {
  const sql = `
    INSERT INTO files (name, size, folder_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows } = await db.query(sql, [name, size, folder_id]);
  return rows[0];
}