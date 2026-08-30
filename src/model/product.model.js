import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name:         {type: String, required: true, maxlength: 10 },
    description:  {type: String, required: true},
    price:        {type: Number, required: true, min: 0},
    tags:         {type: [String] },
  },
  {
    //options
    timestamps: true,
    toJSON:     {
      virtuals: true,
      transform: (doc, ret) => {   
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject:   {virtuals: true}
  }
);

export const Product = mongoose.model('Product',productSchema);