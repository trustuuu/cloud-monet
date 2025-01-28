import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// async function test() {
//   const user = await db.user.create({
//     data: {
//       username: "testuser",
//       phong: "7789874144",
//     },
//   });
// }

// test();
export default db;
