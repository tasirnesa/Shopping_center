import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create a System Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const systemAdmin = await prisma.user.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      email: 'admin@system.com',
      password: adminPassword,
      name: 'System Administrator',
      role: Role.SYSTEM_ADMIN,
    },
  });
  console.log('✅ System Admin:', systemAdmin.email);

  // 2. Create Organization: ABC Supermarket
  const org1 = await prisma.organization.create({
    data: {
      name: 'ABC Supermarket',
      businessType: 'SUPERMARKET',
      phone: '+251911000001',
      email: 'info@abcsupermarket.com',
      address: 'Bole, Addis Ababa',
      settings: {
        create: {
          currency: 'ETB',
          taxRate: 15,
          receiptFooter: 'Thank you for shopping at ABC Supermarket!',
        },
      },
    },
  });
  console.log('✅ Organization:', org1.name);

  // 3. Create Branches
  const mainBranch = await prisma.branch.create({
    data: {
      organizationId: org1.id,
      name: 'Main Branch',
      code: 'MAIN',
      phone: '+251911000002',
      address: 'Bole Road, Addis Ababa',
    },
  });

  const boleBranch = await prisma.branch.create({
    data: {
      organizationId: org1.id,
      name: 'Bole Branch',
      code: 'BOLE',
      phone: '+251911000003',
      address: 'Bole Medhanialem, Addis Ababa',
    },
  });
  console.log('✅ Branches:', mainBranch.name, ',', boleBranch.name);

  // 4. Create Users for this Organization
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.create({
    data: {
      email: 'owner@abc.com',
      password: ownerPassword,
      name: 'Abebe Kebede',
      role: Role.OWNER,
      organizationId: org1.id,
      // Owner has access to all branches (branchId is null)
    },
  });

  const cashierPassword = await bcrypt.hash('cashier123', 10);
  const cashier = await prisma.user.create({
    data: {
      email: 'cashier@abc.com',
      password: cashierPassword,
      name: 'Sara Tesfaye',
      role: Role.CASHIER,
      organizationId: org1.id,
      branchId: mainBranch.id,
    },
  });

  const salesRepPassword = await bcrypt.hash('sales123', 10);
  const salesRep = await prisma.user.create({
    data: {
      email: 'sales@abc.com',
      password: salesRepPassword,
      name: 'Daniel Sales',
      role: Role.SALES_REP,
      organizationId: org1.id,
      branchId: boleBranch.id,
    },
  });

  const storeKeeperPassword = await bcrypt.hash('store123', 10);
  const storeKeeper = await prisma.user.create({
    data: {
      email: 'store@abc.com',
      password: storeKeeperPassword,
      name: 'Yonas Warehouse',
      role: Role.STORE_KEEPER,
      organizationId: org1.id,
      branchId: mainBranch.id,
    },
  });

  const invoiceMakerPassword = await bcrypt.hash('invoice123', 10);
  const invoiceMaker = await prisma.user.create({
    data: {
      email: 'invoice@abc.com',
      password: invoiceMakerPassword,
      name: 'Helina Finance',
      role: Role.INVOICE_MAKER,
      organizationId: org1.id,
    },
  });

  const driverPassword = await bcrypt.hash('driver123', 10);
  const driver = await prisma.user.create({
    data: {
      email: 'driver@abc.com',
      password: driverPassword,
      name: 'Kebede Driver',
      role: Role.DRIVER,
      organizationId: org1.id,
    },
  });

  console.log('✅ Users Created Successfully');

  // 5. Create Master Data (scoped to organization)
  const cat1 = await prisma.category.create({
    data: { organizationId: org1.id, name: 'Beverages' },
  });
  const cat2 = await prisma.category.create({
    data: { organizationId: org1.id, name: 'Snacks' },
  });

  const brand1 = await prisma.brand.create({
    data: { organizationId: org1.id, name: 'Coca Cola' },
  });
  const brand2 = await prisma.brand.create({
    data: { organizationId: org1.id, name: 'Lays' },
  });

  const unitPcs = await prisma.unit.create({
    data: { organizationId: org1.id, name: 'pcs' },
  });
  const unitBox = await prisma.unit.create({
    data: { organizationId: org1.id, name: 'box' },
  });
  console.log('✅ Categories, Brands, Units created');

  // 6. Create Products
  const prod1 = await prisma.product.create({
    data: {
      organizationId: org1.id,
      name: 'Coca Cola 500ml',
      barcode: '1234567890123',
      categoryId: cat1.id,
      brandId: brand1.id,
      unitId: unitPcs.id,
      price: 25,
      cost: 18,
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      organizationId: org1.id,
      name: 'Lays Classic Chips',
      barcode: '9876543210987',
      categoryId: cat2.id,
      brandId: brand2.id,
      unitId: unitPcs.id,
      price: 45,
      cost: 30,
    },
  });
  console.log('✅ Products:', prod1.name, ',', prod2.name);

  // 7. Create initial stock balances
  await prisma.stockBalance.createMany({
    data: [
      { branchId: mainBranch.id, productId: prod1.id, quantity: 100 },
      { branchId: mainBranch.id, productId: prod2.id, quantity: 50 },
      { branchId: boleBranch.id, productId: prod1.id, quantity: 75 },
      { branchId: boleBranch.id, productId: prod2.id, quantity: 30 },
    ],
  });
  console.log('✅ Stock balances initialized');

  // 8. Create a Supplier
  await prisma.supplier.create({
    data: {
      organizationId: org1.id,
      name: 'East Africa Trading',
      contact: '+251911000009',
      email: 'east.africa@trading.com',
    },
  });
  console.log('✅ Supplier created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('  System Admin:  admin@system.com / admin123');
  console.log('  Owner:         owner@abc.com / owner123');
  console.log('  Cashier:       cashier@abc.com / cashier123');
  console.log('  Sales Rep:     sales@abc.com / sales123');
  console.log('  Store Keeper:  store@abc.com / store123');
  console.log('  Invoice Maker: invoice@abc.com / invoice123');
  console.log('  Driver:        driver@abc.com / driver123');
  console.log(`\n📍 Organization ID: ${org1.id}`);
  console.log(`📍 Main Branch ID:  ${mainBranch.id}`);
  console.log(`📍 Bole Branch ID:  ${boleBranch.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
