import express from 'express';
import { Product } from '../../model/product.model.js';
import { validateProducts } from './middlewares/validate-products.middleware.js';
import { validateProductsPagination } from './middlewares/vaildate-products-pagination.middleware.js';
import { NotFoundException } from '#src/error/not-found-exception.js';

export const ProductsRouter = express.Router();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


//GET Pagination
ProductsRouter.get('/',validateProductsPagination, async (req, res, next)=>{

  try{
    const { pageSize, skip } = req.validateProductsPagination ;
    const { search } = req.query;

    const filter = search
      ? {
          $or: [
            { name: { $regex:escapeRegex(search), $options: 'i' } },
            { description: { $regex: escapeRegex(search), $options: 'i' } },
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

    // 실제로 보내준 필드만 골라서 업데이트 객체 생성
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (tags !== undefined) updateFields.tags = tags;

    const updatedItem = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,  
    });

    if(!updatedItem ){
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    } 

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
    const deletedItem  = await Product.findByIdAndDelete(id);

    if(!deletedItem ){
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    } 

    res.status(204).json();

  } catch (error) {
    next(error);
  }
});
