import express from 'express';
import { articleCommentRepository } from '#repositories';
import { NotFoundException } from '../errors/not-found-exception.js';


export const articleCommentRouter = express.Router();

articleCommentRouter.get('/', async (req, res, next) => {
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

    const [articleComment, totalCount] = await Promise.all([
      articleCommentRepository.find(cursor, limit, sortMap, keyword),
      articleCommentRepository.count(keyword),
    ]);

    const nextCursor = articleComment.length > 0 
    ? articleComment[articleComment.length - 1].id 
    : null;

    if (articleComment.length === 0) {
      throw new NotFoundException('제품 댓글을 찾을수 없음');
    }
    res.status(200).json({
      success: true,
      data: articleComment,
      nextCursor: nextCursor,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      message: '제품 댓글 목록 불러오기 완료',
    });
  } catch (error) {
    next(error);
  }
});

articleCommentRouter.get('/:articleCommentId', async (req, res, next) => {
  try {
    const articleComment = await articleCommentRepository.findById(req.params.articleCommentId);
    if (!articleComment) {
      throw new NotFoundException('제품 댓글을 찾을수 없음');
    }

    res.status(200).json({
      success: true,
      data: articleComment,
      message: '제품 댓글을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleCommentRouter.post('/', async (req, res, next) => {
  try {
    const { content, authorId } = req.body ?? {};

    const newarticleComment = {content, authorId: Number(authorId)};
    const result = await articleCommentRepository.createArticleComment(newarticleComment);

    res.status(201).json({
      success: true,
      data: result,
      message: '제품 댓글 생성 완료',
    });
  } catch (error) {
    next(error);
  }
});

articleCommentRouter.patch('/:articleCommentId',async (req, res, next) => {
  try {
    const articleCommentId = req.params.articleCommentId;
    const { content } = req.body ?? {};
    const target = articleCommentRepository.findById(articleCommentId);
    if (!target) {
      throw new NotFoundException('제품 댓글을 찾을 수 없음');
    }

    const update = {};
    if (content) {
      update.content = content;
    }

    const udpatedarticleComment = await articleCommentRepository.update(articleCommentId, update);
    
        res.status(200).json({
          success: true,
          data: udpatedarticleComment,
          message: '제품 댓글 업데이트 완료',
        });
      } catch (error) {
        next(error);
      }
    });

    articleCommentRouter.delete('/:articleCommentId', async (req, res, next) => {
          try {
            const { articleCommentId } = req.params;
            const target = articleCommentRepository.findById(articleCommentId);
            if (!target) {
              throw new NotFoundException('제품 댓글을 찾을 수 없음');
            }
        
            const deleteTarget = await articleCommentRepository.remove(articleCommentId);
        
            res.status(200).json({
              success: true,
              data: deleteTarget,
              message: '제품 댓글 삭제 완료',
            });
          } catch (error) {
            next(error);
          }
        });