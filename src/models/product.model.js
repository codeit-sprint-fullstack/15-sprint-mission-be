import mongoose from 'mongoose';

// 데베에 저장되는 구조 만들기
// 저거 mockup 데이터에 맞춰서
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    tags: { type: Array },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const Product = mongoose.model('Product', productSchema);
