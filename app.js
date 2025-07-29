import express from "express";
const app = express();
export default app;
import db from "#db/client";

app.use(express.json());

app.get("/folders", async (req, res) => {
  const sql = `
    SELECT * FROM folders
  `;
  const { rows: folders } = await db.query(sql);
  res.send(folders);
});

app.get("/files", async (req, res) => {
  const sql = `
    SELECT 
        files.*,
        folders.name AS folder_name
      FROM files
      JOIN folders ON files.folder_id = folders.id
    `;
  const { rows: files } = await db.query(sql);
  res.send(files);
});

app.route("/folders/:id").get(async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("ID must be a positive integer.");
  }
  const folderSql = `SELECT * FROM folders WHERE id = $1`;
  const { rows: folders } = await db.query(folderSql, [id]);

  if (folders.length === 0) {
    return res.status(404).send("Folder not found");
  }

  const folder = folders[0];
  const fileSql = `SELECT * FROM files WHERE folder_id = $1`;
  const { rows: files } = await db.query(fileSql, [id]);
  folder.files = files;
  res.send(folder);
});

app.route("/folders/:id/files").post(async (req, res) => {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
      return res.status(400).send("ID must be a positive integer.");
    }
    const folderSql = `SELECT * FROM folders WHERE id = $1`;
    const { rows: folders } = await db.query(folderSql, [id]);
    if (folders.length === 0) {
      return res.status(404).send("Folder does not exist");
    }

    if (!req.body) {
      return res.status(400).send("Request body is required");
    }
    const { name, size } = req.body;
    if (!name) {
      return res.status(400).send("Missing required fields: name and size");
    }

    const insertSql = `
      INSERT INTO files (name, size, folder_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows: files } = await db.query(insertSql, [name, size, id]);
    res.status(201).send(files[0]);
  });

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});
