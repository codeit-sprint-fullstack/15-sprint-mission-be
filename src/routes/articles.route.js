import express from 'express';
import { NotFoundException } from '../errors/not-found-exception.js';
import { articlesRepository } from '#repositories';
import { validateArticle } from '../middlewares/validate-article.js';

export const articleRouter = express.Router();

articleRouter.get('/', async (req, res, next) => {
  try {
    const { keyword, sort } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sortMap = 'desc';
    if (sort === null || sort === 'recent') {
      sortMap = 'desc';
    } else {
      sortMap = sort;
    }

    const [articles, totalCount] = await Promise.all([
      articlesRepository.find(page, limit, sortMap, keyword),
      articlesRepository.count(keyword),
    ]);

    if (articles.length === 0) {
      throw new NotFoundException('게시글을 찾을수 없음');
    }
    res.status(200).json({
      success: true,
      data: articles,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      message: '게시글 목록 불러오기 완료',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.get('/:articleId', async (req, res, next) => {
  try {
    const article = await articlesRepository.findById(req.params.articleId);
    if (!article) {
      throw new NotFoundException('게시글을 찾을수 없음');
    }

    res.status(200).json({
      success: true,
      data: article,
      message: '게시글을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body ?? {};

    const newArticle = { title, content };
    console.log('생성데이터:',newArticle);
    const result = await articlesRepository.createArticle(newArticle);

    res.status(201).json({
      success: true,
      data: result,
      message: '게시글 생성 완료',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.patch('/:articleId', validateArticle, async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content } = req.body ?? {};
    const target = articlesRepository.findById(articleId);
    if (!target) {
      throw new NotFoundException('게시글을 찾을 수 없음');
    }

    const update = {};
    if (title) {
      update.title = title;
    }
    if (content) {
      update.content = content;
    }

    const udpatedProduct = await articlesRepository.update(articleId, update);
    
        res.status(200).json({
          success: true,
          data: udpatedProduct,
          message: '게시글 업데이트 완료',
        });
      } catch (error) {
        next(error);
      }
    });

    articleRouter.delete('/:articleId', async (req, res, next) => {
      try {
        const { articleId } = req.params;
        const target = articlesRepository.findById(articleId);
        if (!target) {
          throw new NotFoundException('게시글을 찾을 수 없음');
        }
    
        const deleteTarget = await articlesRepository.remove(articleId);
    
        res.status(200).json({
          success: true,
          data: deleteTarget,
          message: '게시글 삭제 완료',
        });
      } catch (error) {
        next(error);
      }
    });
    