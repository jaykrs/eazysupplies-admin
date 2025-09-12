import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Roles
  const [adminRole, customerRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN' },
    }),
    prisma.role.upsert({
      where: { name: 'CUSTOMER' },
      update: {},
      create: { name: 'CUSTOMER' },
    }),
  ]);

  // 2. Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      roleId: adminRole.id,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@example.com',
      password: passwordHash,
      roleId: customerRole.id,
    },
  });

  // 3. Categories & Brands
  const category = await prisma.category.create({
    data: { name: 'Clothing' },
  });

  const brand = await prisma.brand.create({
    data: { name: 'Nike' },
  });

  // 4. Tags
  const [tag1, tag2] = await Promise.all([
    prisma.tag.create({ data: { name: 'Summer' } }),
    prisma.tag.create({ data: { name: 'Sports' } }),
  ]);

  // 5. Product
  const product = await prisma.product.create({
    data: {
      name: 'Nike T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 29.99,
      stock: 100,
      categoryId: category.id,
      brandId: brand.id,
      tags: {
        create: [
          { tag: { connect: { id: tag1.id } } },
          { tag: { connect: { id: tag2.id } } },
        ],
      },
    },
    include: { tags: true },
  });

  // 6. Cart
  const cart = await prisma.cart.create({
    data: {
      userId: customer.id,
      items: {
        create: {
          productId: product.id,
          quantity: 2,
        },
      },
    },
  });

  // 7. Order with OrderItem
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      status: 'PENDING',
      items: {
        create: {
          productId: product.id,
          quantity: 2,
          price: product.price,
        },
      },
    },
  });

  // 8. Shipping
  await prisma.shipping.create({
    data: {
      orderId: order.id,
      address: '123 Main St',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      status: 'PENDING',
    },
  });

  // 9. Payment
  await prisma.payment.create({
    data: {
      userId: customer.id,
      orderId: order.id,
      amount: product.price * 2,
      method: 'CARD',
      status: 'PENDING',
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
