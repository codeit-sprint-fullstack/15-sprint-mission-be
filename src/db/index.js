// import mongoose from 'mongoose';
// import { config } from '../config/config.js';

//mongoose를 사용해서 config의 환경변수(MongoDB 개인링크)로
//MongoDB 연결(connect)
// export const connectDB = async () => {
//   try {
//     await mongoose.connect(config.MONGO_URI);
//     console.log('connected MongoDB');
//   } catch (error) {
//     console.log('fail to connect', error.message);
//     //데이터베이스 연결이 실패하면 서버를 강제 종료
//     //연결 실패 됐는데 서버가 계속 살아있으면 서버 중복 됨
//     process.exit(1);
//   }
// };
