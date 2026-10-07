import express from 'express';
import { commentRepository } from '../repositories/comment.repository.js';
import { validateComment } from '../middlewares/comment-validate.js';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../schema/comment.schema.js';

export const commentRouter = express.Router({ mergeParams: true });

commentRouter.get('/:commentId', validateComment, async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    if (!commentId) {
      res.status(400).json({
        success: false,
        message: '댓글 아이디가 없습니다.',
      });
    }

    const comment = await commentRepository.findById(commentId);
    res.status(200).json({
      success: true,
      data: comment,
      message: '댓글을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

commentRouter.get('/', async (req, res, next) => {
  try {
    const { articleId, productId } = req.params;
    const { createdAt, id } = req.query;

    let cursor;
    // createdAt이 날짜 형식인지
    // 두 개 중 하나라도 들어온 경우에 인증 구간이 있어야 함
    // 둘 다 없으면 그냥 일반적으로 작동되게 만들기
    if (createdAt !== undefined || id !== undefined) {
      if (
        typeof createdAt !== 'string' ||
        typeof id !== 'string' ||
        id.trim() === '' ||
        Number.isNaN(new Date(createdAt).getTime())
      ) {
        return res.status(400).json({
          message: '유효한 createdAt과 id를 설정해주세요.',
        });
      }

      cursor = { createdAt, id };
    }

    const target = articleId ? { articleId } : { productId };
    console.log(target);
    const comments = await commentRepository.findAll(target, cursor);

    res.status(200).json({
      success: true,
      data: comments,
      length: comments.length,
      message: '댓글 목록 조회에 성공했습니다.',
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

commentRouter.post('/', async (req, res, next) => {
  try {
    const { productId, articleId } = req.params;
    console.log(productId, articleId);
    const { content } = createCommentSchema.parse(req.body);
    console.log(content);
    const newData = await commentRepository.create(
      content,
      productId,
      articleId,
    );
    res.status(200).json({
      success: true,
      data: newData,
      message: '댓글 작성에 성공했습니다.',
    });
  } catch (error) {
    next(error);
  }
});

commentRouter.patch('/:commentId', validateComment, async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const data = updateCommentSchema.parse(req.body);

    if (!commentId) {
      res.status(400).json({
        success: false,
        message: '댓글 아이디가 존재하지 않습니다.',
      });
    }

    const updateData = await commentRepository.update(commentId, data);
    res.status(200).json({
      success: true,
      data: updateData,
      message: '댓글이 수정되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

commentRouter.delete('/:commentId', validateComment, async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    if (!commentId) {
      res.status(400).json({
        success: false,
        message: '댓글 아이디가 존재하지 않습니다.',
      });
    }

    await commentRepository.remove(commentId);
    res.status(200).json({
      success: true,
      message: '댓글 삭제에 성공했습니다.',
    });
  } catch (error) {
    next(error);
  }
});
