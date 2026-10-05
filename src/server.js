import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

import productRouter from "#src/routes/productRouter.js";
import {config} from "#src/config/config.js";

const app = express();
app.use(cors());
app.use(express.json());

try {
  await mongoose.connect(config.MONGO_URI);
  console.log('MongoDB Atlas 연결 성공!');
} catch (err) {
  console.error('MongoDB Atlas 연결 실패:', err);
}

app.use("/products", productRouter);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "올바른 JSON 형식이 아닙니다. 큰따옴표(\")를 사용했는지 확인하세요." });
  }
  next();
});

app.listen(config.PORT, () =>{
    console.log(`Server listening on port http://localhost:${config.PORT}`);
});