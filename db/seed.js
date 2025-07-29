import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  await db.query(`
    INSERT INTO folders (name) VALUES 
      ('Documents'),
      ('Photos'),
      ('Music');

    INSERT INTO files (name, size, folder_id) VALUES
      ('resume.pdf', 120, 1),
      ('budget.xlsx', 95, 1),
      ('notes.txt', 33, 1),
      ('todo.md', 40, 1),
      ('project.docx', 150, 1),

      ('vacation.jpg', 500, 2),
      ('birthday.png', 450, 2),
      ('selfie.jpeg', 320, 2),
      ('receipt.png', 275, 2),
      ('screenshot.png', 600, 2),

      ('song1.mp3', 4200, 3),
      ('song2.mp3', 3950, 3),
      ('beat.wav', 8200, 3),
      ('demo.aac', 2900, 3),
      ('mix.flac', 10000, 3);
  `);
}
