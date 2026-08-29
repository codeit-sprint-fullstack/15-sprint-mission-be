import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:         {type: String, required: true},
    description:  {type: String, required: true},
    price:        {type: Number, required: true},
    tags:         {type: [String] },
  },
  {
    //options
    timestamps: true,
    toJSON:     {virtuals: true},
    toObject:   {virtuals: true}
  }
);

export const Product = mongoose.model('Product',productSchema);