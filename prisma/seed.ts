import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment for seeding.",
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

