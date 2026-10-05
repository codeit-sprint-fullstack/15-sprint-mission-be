import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품명을 입력해 주세요."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "상품 설명을 입력해 주세요."],
    },
    price: {
      type: Number,
      required: [true, "상품 가격을 입력해 주세요."],
      min: [0, "가격은 0원 이상이어야 합니다."],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

productSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
