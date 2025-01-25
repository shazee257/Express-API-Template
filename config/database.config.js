import mongoose from 'mongoose';
import colors from "colors";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB Connected -> : ${conn.connection.name}`.cyan.bold);
    } catch (error) {
        console.error(`DB Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

export default connectDB;