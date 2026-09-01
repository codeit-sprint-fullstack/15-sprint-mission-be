import express from "express";
import { NotFoundException } from "../errors/not-found-exception.js";
import Product from "../models/products.model.js";

export const productsRouter = express.Router();

//상품 생성
productsRouter.post("/", async (req, res, next) => {
  try {
    //사용자가 보낸정보 변수에 저장
    const productData = req.body;

    //몽고에 상품생성
    const product = await Product.create(productData);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 여러개 조회
productsRouter.get("/", async (req, res, next) => {
  try {
    const { order, keyword } = req.query;

    const products = await Product.find()
      //선택된것만 가져옴
      .select("_id name price createdAt")
      //최신순 정렬
      .sort(order === "recent" ? { createdAt: -1 } : {});

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

//상품 한개 조회
productsRouter.get("/:id", async (req, res, next) => {
  try {
    //id 가져오기
    const { id } = req.params;

    //이id를 가진 상품찾아줘
    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundException("상품 못찾음");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

//상품 수정
productsRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      //수정 후 데이터 줘
      new: true,
    });

    if (!product) {
      throw new NotFoundException("상품 못찾음");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

//상품 삭제
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    //id 상품을 찾아서 삭제
    const target = await Product.findByIdAndDelete(id);

    if (!target) {
      throw new NotFoundException("상품 못찾음");
    }

    res.status(200).json({
      success: true,
      data: target,
      message: "상품 삭제됨",
    });
  } catch (error) {
    next(error);
  }
});
