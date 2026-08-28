import express from 'express';
import { productCommentRepository } from '#repositories';
import { NotFoundException } from '../errors/not-found-exception.js';


export const productCommentRouter = express.Router();

productCommentRouter.get('/', async (req, res, next) => {
  try {
    const { keyword, sort } = req.query;
    const cursor = parseInt(req.query.cursor);
    const limit = parseInt(req.query.limit) || 10;
    let sortMap = 'desc';
    if (sort === null || sort === 'recent') {
      sortMap = 'desc';
    } else {
      sortMap = sort;
    }

    const [productComment, totalCount] = await Promise.all([
      productCommentRepository.find(cursor, limit, sortMap, keyword),
      productCommentRepository.count(keyword),
    ]);

    const nextCursor = productComment.length > 0 
    ? productComment[productComment.length - 1].id 
    : null;

    if (productComment.length === 0) {
      throw new NotFoundException('제품 댓글을 찾을수 없음');
    }
    res.status(200).json({
      success: true,
      data: productComment,
      nextCursor: nextCursor,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      message: '제품 댓글 목록 불러오기 완료',
    });
  } catch (error) {
    next(error);
  }
});

productCommentRouter.get('/:productCommentId', async (req, res, next) => {
  try {
    const productComment = await productCommentRepository.findById(req.params.productCommentId);
    if (!productComment) {
      throw new NotFoundException('제품 댓글을 찾을수 없음');
    }

    res.status(200).json({
      success: true,
      data: productComment,
      message: '제품 댓글을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productCommentRouter.post('/', async (req, res, next) => {
  try {
    const { content, authorId } = req.body ?? {};

    const newProductComment = {content, authorId: Number(authorId)};
    const result = await productCommentRepository.createProductComment(newProductComment);

    res.status(201).json({
      success: true,
      data: result,
      message: '제품 댓글 생성 완료',
    });
  } catch (error) {
    next(error);
  }
});

productCommentRouter.patch('/:productCommentId',async (req, res, next) => {
  try {
    const productCommentId = req.params.productCommentId;
    const { content } = req.body ?? {};
    const target = productCommentRepository.findById(productCommentId);
    if (!target) {
      throw new NotFoundException('제품 댓글을 찾을 수 없음');
    }

    const update = {};
    if (content) {
      update.content = content;
    }

    const udpatedProductComment = await productCommentRepository.update(productCommentId, update);
    
        res.status(200).json({
          success: true,
          data: udpatedProductComment,
          message: '제품 댓글 업데이트 완료',
        });
      } catch (error) {
        next(error);
      }
    });

    productCommentRouter.delete('/:productCommentId', async (req, res, next) => {
          try {
            const { productCommentId } = req.params;
            const target = productCommentRepository.findById(productCommentId);
            if (!target) {
              throw new NotFoundException('제품 댓글을 찾을 수 없음');
            }
        
            const deleteTarget = await productCommentRepository.remove(productCommentId);
        
            res.status(200).json({
              success: true,
              data: deleteTarget,
              message: '제품 댓글 삭제 완료',
            });
          } catch (error) {
            next(error);
          }
        });