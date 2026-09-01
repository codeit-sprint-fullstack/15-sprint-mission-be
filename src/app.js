import express from "express";
import cors from "cors";

import { router } from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

//cors설정
app.use(cors());
//json 데이터읽기
app.use(express.json());
//라우터연결
app.use(router);
//에러처리
app.use(errorHandler);

export default app;
