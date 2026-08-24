//mongoDB 문서구조를 모아두는 model폴더
//상품 데이터의 구조와 검증 규칙을 정의할 Product파일

import mongoose from 'mongoose';

//mongoDB에 저장할 상품 문서의 구조와 검증 규칙
const productSchema = new mongoose.Schema({
  //필드들의 객체 (첫번째 스키마 옵션)
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  }
},
{
  timestamps: true, // 두번째 스키마 옵션
}
);

//product 모델을 통해 상품 데이터를 저장하고 조회
const Product = mongoose.model('Product', productSchema);

export default Product;
