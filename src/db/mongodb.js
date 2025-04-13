import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const {
  MONGO_URL,
  MONGO_URL_TEST,
  NODE_ENV,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_APP_NAME,
} = process.env;

const mongoDbDeploy = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@ecommerce.gfzucsq.mongodb.net/?retryWrites=true&w=majority&appName=${MONGO_DB_APP_NAME}`;

const mongoUrl = NODE_ENV === "test" ? MONGO_URL_TEST : MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(
      NODE_ENV === "production" ? mongoDbDeploy : mongoUrl
    );
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
