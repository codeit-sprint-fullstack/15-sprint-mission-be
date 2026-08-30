import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "상품 이름을 입력해 주세요"],
      minlength: [1, "1자 이상 입력해 주세요"],
      maxlength: [10, "10자 이내로 입력해 주세요"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "상품 설명을 입력해 주세요"],
      minlength: [10, "10자 이상 입력해 주세요"],
      maxlength: [100, "100자 이내로 입력해 주세요"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "가격을 입력해 주세요"],
      min: [0, "가격은 0원 이상이어야 합니다"],
    },
    tags: {
      type: [
        {
          type: String,
          maxlength: [5, "태그는 5글자 이내로 입력해 주세요"],
          trim: true,
        },
      ],
      validate: [
        (val) => val.length >= 1 && val.length <= 10,
        "태그는 1개 이상 10개 이하로 추가해 주세요",
      ],
    },
  },
  { timestamps: true },
);

const transformRule = {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
};

productSchema.set("toJSON", transformRule);
productSchema.set("toObject", transformRule);

export const Product = mongoose.model("Product", productSchema);
