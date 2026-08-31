import express from "express";
import Product from "#src/models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      tags,
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("상품 등록 오류:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, orderBy = "recent" } = req.query;

    const limit = Number(pageSize);
    const skip = (Number(page) - 1) * limit;

    const filter = {};
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const sortOption = {};
    if (orderBy === "recent") {
      sortOption.createdAt = -1;
    }

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .select("name price createdAt")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      list: products,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("상품 상세 조회 오류:", error);
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "유효하지 않은 상품 ID 형식입니다." });
    }

    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "잘못된 ID 형식입니다." });
    }
    console.error("상품 수정 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    return res
      .status(200)
      .json({ message: "상품이 성공적으로 삭제되었습니다.", id });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "잘못된 ID 형식입니다." });
    }
    console.error("상품 삭제 오류:", error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;
