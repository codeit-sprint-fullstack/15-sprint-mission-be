import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  //mongoose.Schema로는 인자 1로 필드, 인자 2로 옵션을 받아 스키마(설계도)를 만들고.
  {
    name: { type: String, required: true },
    description: { type: String, required: true, minlength: 10 },
    price: { type: Number, required: true, min: 0 },
    tags: { type: [String] },
    images: { type: [String] },
  },
  {
    timestamps: true, // createdAt과 updatedAt 필드를 부여하고 자동으로 생성시키기 위해 설정함.
    toJSON: { virtuals: true }, // 명시적으로 지정한 필드 외에 DB가 생성하는 가상의(virtual) 필드가 있음(id, createdAt, updatedAt 등).
    toObject: { virtuals: true }, // 이런 버추얼 필드들도 응답값에 노출시키도록 설정함.
  },
);

export const Product = mongoose.model('Product', productSchema); //mongoose.model로는 컬렉션 이름(DB에는 소문자+복수형으로 자동 형변환됨)과 스키마를 받아 클래스(=찍어낼 틀)를 만든다.
