import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    tags: [String],
    // createdAt: { type: Date, default: Date.now },
    // updatedAt, -> timestamp가 있으면 mongoose가 알아서 만들어줌
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const Item = mongoose.model('Item', itemSchema);
