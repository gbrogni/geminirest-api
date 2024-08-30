const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.customer.upsert({
    where: { code: 'default-customer' },
    update: {},
    create: {
      code: 'default-customer',
    },
  });

  await prisma.measure.create({
    data: {
      image_url: 'http://example.com/image.jpg',
      measure_value: 100,
      measure_uuid: 'unique-uuid',
      measure_datetime: new Date(),
      measure_type: 'WATER',
      customer_code: customer.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
