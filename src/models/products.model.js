

import mongoose from "mongoose";
//붕어빵틀
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      //상품 이름도 필수
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    //배열 태그
    tags: {
      //문자열을 여러개 담는 배열
      type: [String],
      default: [],
    },

    images: {
      // 상품이 여러개일수도있어서
      type: [String],
      default: [],
    },

    //좋아요
    favoriteCount: {
      type: Number,
      default: 0,
    },
  },
  {
    //생성일 수정일 자동생성
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);
export default Product;
