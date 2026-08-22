import Product from '../models/Product.js';
import CustomError from '../middlewares/CustomError.js';
import asyncHandler from '../middlewares/asyncHandler.js';


const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, tags } = req.body;

  const product = await Product.create({ name, description, price, tags });

  res.status(201).json(product);
});


const getProductList = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, sort = 'recent', keyword = '' } = req.query;

  const parsedOffset = Number(offset);
  const parsedLimit = Number(limit);

  
  const sortOption = sort === 'recent' ? { createdAt: -1 } : { createdAt: -1 };

  
  const query = keyword
    ? {
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    Product.find(query)
      .select('id name price createdAt')
      .sort(sortOption)
      .skip(parsedOffset)
      .limit(parsedLimit),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    list: products,
    totalCount,
  });
});


const getProductDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).select(
    'id name description price tags createdAt'
  );

  if (!product) {
    throw new CustomError(404, '해당 id의 상품을 찾을 수 없습니다.');
  }

  res.status(200).json(product);
});


const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, tags } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    { name, description, price, tags },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new CustomError(404, '해당 id의 상품을 찾을 수 없습니다.');
  }

  res.status(200).json(product);
});


const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new CustomError(404, '해당 id의 상품을 찾을 수 없습니다.');
  }

  res.status(200).json({ message: '상품이 삭제되었습니다.' });
});

export {
  createProduct,
  getProductList,
  getProductDetail,
  updateProduct,
  deleteProduct,
};
