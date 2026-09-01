import mongoose from "mongoose";
import { config } from "../config/config.js";

// .env에 저장해둔 몽고주소 연결
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("연결 성공");
  } catch (error) {
    console.log("연결 실패", error);
    //연결 실패하면 서버 종료
    process.exit(1);
  }
};

export default connectDB;
