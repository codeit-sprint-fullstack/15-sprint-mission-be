import express from 'express';
import { Product } from '../../model/product.model.js';
import { validateProducts } from './middlewares/validate-products.middleware.js';
import { validateProductsPagination } from './middlewares/vaildate-products-pagination.middleware.js';

export const productsRouter = express.Router();

//GET Pagination
productsRouter.get('/',validateProductsPagination, async (req, res, next)=>{

  try{
    const { pageSize, skip } = req.validateProductsPagination ;
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : { };

    const [ list, totalCount ] = await Promise.all([
      //페이지 값
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      //전체 값
      Product.countDocuments(filter),
    ]);


    res.status(200).json({
      success: true,
      data: {
        list,
        totalCount,
      },
      message: 'Product get Success',
    });

  } catch(error) {
    next(error);
  }

});

//GET id
productsRouter.get('/:id', async (req, res, next)=>{
  try {
     const { id } = req.params;

     const product = await Product.findById(id)

     
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product get Success',
    });

  } catch(error) {
    next(error);
  }
});

//POST
productsRouter.post('/',validateProducts,async (req, res, next)=>{
  try{

    const { name, description, price, tags } = req.validateProducts;

    const newItem = new Product({
      name,
      description,
      price,
      tags,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      id: savedItem._id,
      message: 'Product post Success',
    });
  } catch (error){
    next(error);
  }

});

//PATCH
productsRouter.patch('/:id',validateProducts,async (req, res, next)=>{
  try{
    const { id } = req.params;
    const { name, description, price, tags } = req.validateProducts;

    const updatedItem = new Product.findByIdAndUpdate(
      id,
      {
      name,
      description,
      price,
      tags, 
      },
      //수정 끝난 결과를 받아보기
      { new: true },
    );

    res.status(200).json({
    success: true,
    message: 'Product patch Success',
    data: updatedItem,
    });

  } catch (error) {
    next(error);
  }
});

//DELETE
productsRouter.delete('/:id',async (req, res, next)=>{
  try{
    const { id } = req.params;

    const deletedItem = await Product.findByIdAndDelete(id)

    res.status(204).json({
    success: true,
    message: 'Product delete Success',
    data: deletedItem,
    });

  } catch (error) {
    next(error);
  }
});
