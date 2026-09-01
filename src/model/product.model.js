import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name:         {type: String, required: true, minlength: 1, maxlength: 10 },
    description:  {type: String, required: true, minlength: 10, maxlength: 100 },
    price:        {type: Number, required: true, min: 0},
    tags:         {type: [String] , minlength: 5},
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