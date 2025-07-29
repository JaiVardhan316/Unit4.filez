import express from "express";
const app = express();
export default app;
import folderRouter from "./api/folder.js";

import db from "#db/client";

app.use(express.json());

app.use("/folders", folderRouter);

app.get("/files", async (req, res) => {
  const sql = `
    SELECT 
      files.*, 
      folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
  `;
  const { rows } = await db.query(sql);
  res.send(rows);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});
