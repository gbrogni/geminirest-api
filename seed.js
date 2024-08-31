const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customers = [
    { id: 'customer-1' },
    { id: 'customer-2' },
    { id: 'customer-3' },
  ];

  for (const customerData of customers) {
    await prisma.customer.upsert({
      where: { id: customerData.id },
      update: {},
      create: {
        id: customerData.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
