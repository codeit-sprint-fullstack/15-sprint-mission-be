import { isDevlopment } from '../config/config.js';

const developmentWhiteList = ['http://localhost:5001', 'http://localhost:5173'];
const productionWhiteList = [process.env.ALLOWED_ORIGINS];

export const cors = (req, res, next) => {
  const whiteList = isDevlopment ? developmentWhiteList : productionWhiteList;
  const origin = req.get('origin');
  res.vary('origin');

  if (!origin) {
    return next();
  }

  if (!whiteList.includes(origin)) {
    return res.status(403).json({
      message: '허용되지 않은 출처입니다',
    });
  }

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
};
