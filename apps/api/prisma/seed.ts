import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const workTypes = [
  "Кладка перегородок",
  "Монтаж опалубки",
  "Армирование",
  "Бетонирование",
  "Штукатурные работы",
  "Монтаж инженерных сетей",
];

async function main() {
  for (const name of workTypes) {
    await prisma.workType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Seed completed:", workTypes.length, "work types");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });