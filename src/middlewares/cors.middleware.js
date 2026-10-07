import { isDevelopment, isProduction } from '#config';

export const cors = (req, res, next) => {
  const whiteList = [
    'https://panda-market-of-monstera.netlify.app',
    'http://localhost:5173',
  ];

  const origin = req.get('origin');
  res.vary('origin');

  if (!origin && isDevelopment) {
    return next();
  }

  if (isProduction && origin && !whiteList.includes(origin)) {
    res.status(403).json({
      success: false,
      message: '허용되지 않은 출처입니다.',
    });
    return;
  }

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  }
  return next();
};
