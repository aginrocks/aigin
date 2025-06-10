import mongoose from 'mongoose';

export async function initDatabase() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aigin');
}
