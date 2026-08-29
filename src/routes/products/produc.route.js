import express from 'express';
import { Product } from '../../model/product.model.js';
import { validateProducts } from './middlewares/validate-products.middleware.js';
import { validateProductsPagination } from './middlewares/vaildate-products-pagination.middleware.js';
import { NotFoundException } from '#src/error/not-found-exception.js';

export const ProductsRouter = express.Router();

//GET Pagination
ProductsRouter.get('/',validateProductsPagination, async (req, res, next)=>{

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
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
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
ProductsRouter.get('/:id', async (req, res, next)=>{
  try {
     const { id } = req.params;

     const product = await Product.findById(id);
     if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');
     
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
ProductsRouter.post('/',validateProducts,async (req, res, next)=>{
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
ProductsRouter.patch('/:id',async (req, res, next)=>{
  try{
    const { id } = req.params;
    const { name, description, price, tags } = req.body ?? {} ;  

    const product = await Product.findById(id);
    if(!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    const updatedItem = await Product.findByIdAndUpdate(
      id,
      {
      name,
      description,
      price,
      tags, 
      },
      { new: true }
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
ProductsRouter.delete('/:id',async (req, res, next)=>{
  try{
    const { id } = req.params;

    const product = await Product.findById(id);
    if(!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    await Product.findByIdAndDelete(id);

    res.status(204).json();

  } catch (error) {
    next(error);
  }
});
