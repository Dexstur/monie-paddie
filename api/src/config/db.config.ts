import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

const URI = process.env.MONGO_URI || '';
const password = process.env.MONGO_PASSWORD || '';
const connectionString = URI.replace('<password>', password);

async function connectDB() {
  try {
    const connection = mongoose.connect(connectionString);
    console.log(`Db connected`);
  } catch (err) {
    console.error(`db connection failed`);
    console.error(err);
  }
}

export default connectDB;
