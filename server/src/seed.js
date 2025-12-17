// seed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Expense from './models/Expense.js';
import Product from './models/Product.js';
import Sale from './models/Sale.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

//   await Category.create({ name: 'Reading' });

//   await Expense.create({
//     date_added: '4/1/2023',
//     price: '12345',
//     type: 'Delivery',
//     verification: '234567',
//     phoneNumber: '0712345678'
//   });

//   await Product.create({
//     added_by: 'Trevooor Newahh!',
//     category: 'Reading',
//     date_added: '12/13/2025',
//     name: 'Gum',
//     price_bought: '10',
//     quantity: 0,
//     restock: 8,
//     unit: 'Pc'
//   });

//   await Sale.create({
//     credit: true,
//     creditinfo: {
//       duedate: '06/21/2023',
//       name: 'tina',
//       payment_covered: false,
//       unpaid: 7474
//     },
//     date_sold: '6/9/2023',
//     items: [
//       { id: '9lH2xWvDEPtjWjrM2vjf', previousQuantity: 234, price: 34, quantity: 234 },
//       { id: 'K6sFQd5QaBXfp1cgwdqP', previousQuantity: 24, price: 22, quantity: 24 }
//     ],
//     seller: 'Jacob Zuma',
//     total: 8484
//   });
const adminPassword = '123456';
const salespersonPassword = '123456';
const adminHash = await bcrypt.hash(adminPassword, 10);
const salespersonHash = await bcrypt.hash(salespersonPassword, 10);

  await User.create({
    username: 'admin',
    password: adminHash,
    fullname: 'Admin',
    admin: true
  });
  await User.create({
    username: 'salesperson',
    password: salespersonHash,
    fullname: 'Salesperson',
    admin: false
  });

  console.log('Seeded');
  await mongoose.disconnect();
  console.log('Done');
}

run().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});