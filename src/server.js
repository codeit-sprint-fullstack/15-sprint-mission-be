import app from "./app.js";
import { config } from "./config/config.js";
//몽고 연결함수 가져오기
import connectDB from "./db/index.js";

console.log("mongo", !!process.env.MONGO_URI);
// 몽고 연결끝날때까지 기다려
await connectDB();

console.log(config.NODE_ENV);
// 서버실행
app.listen(config.PORT, () => {
  console.log(`서버가 ${config.PORT}번 포트에서 실행 중입니다.`);
});
