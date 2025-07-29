import express from "express";
import {
  getAllFolders,
  getFolderById,
  getFilesInFolder,
  insertFile,
} from "../db/queries.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const folders = await getAllFolders();
  res.send(folders);
});

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).send("ID must be a positive integer.");
  }

  const folder = await getFolderById(id);
  if (!folder) {
    return res.status(404).send("Folder not found");
  }

  const files = await getFilesInFolder(id);
  folder.files = files;
  res.send(folder);
});

router.route("/:id/files").post(async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).send("ID must be a positive integer.");
  }
  const folder = await getFolderById(id);
  if (!folder) {
    return res.status(404).send("Folder does not exist");
  }
  if (!req.body) {
    return res.status(400).send("Request body is required");
  }
  const { name, size } = req.body;
  if (!name || typeof size !== "number") {
    return res.status(400).send("Missing required fields: name and size");
  }
  const file = await insertFile({ name, size, folder_id: id });
  res.status(201).send(file);
});

export default router;
