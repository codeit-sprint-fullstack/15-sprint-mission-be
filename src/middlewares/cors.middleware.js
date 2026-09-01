import { ForbiddenException } from '#src/error/forbidden-exception.js';

const isDevelopment = process.env.NODE_ENV === 'development';

export const cors = ( req, res, next) => {

  const whiteList = isDevelopment 
                    ? ['http://localhost:5173'] 
                    : ['production-whiteList'];

  const origin = req.get('origin');
  res.vary('origin');

  if(!origin){
    next();
    return;
  }

  //production 유효성 검사
  const isAllowed = whiteList.includes(origin);

  if(!isAllowed){
    throw new ForbiddenException('허용되지 않은 출처입니다.');
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With',
  );
  res.setHeader(
    'Access-Control-Expose-Headers',
    'Authorization, X-Total-Count',
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  if(req.method === 'OPTIONS'){
    return res.sendStatus(204);
  }

  next();

};