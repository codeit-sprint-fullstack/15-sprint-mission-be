import { BadRequestException } from '#scr/error/bad-request-exception.js';

  export const validateProducts = (req, res, next) => {
      const { name, description, price, tags } = req.body ?? {} ;
  
      //필수값 검증 
      const isPriceMissing = price === undefined || price === null || price === '';
  
      if(!name || !description || isPriceMissing ){
         throw new BadRequestException('필수값이 누락되었습니다.');
      }
      //상품 이름 유효성 검사
      if(name.trim().length === 0 || name.length > 10){
        throw new BadRequestException('상품이름이 없거나 10자 이상입니다');
      }
  
      //상품가격 검증 
      const parsedPrice = Number(price);
      const isValidPrice = !Number.isNaN(parsedPrice) && parsedPrice >=0 && Number.isInteger(parsedPrice);
  
      if(!isValidPrice){
        throw new BadRequestException('상품가격 0이하 혹은 유효한 숫자이어야합니다.');
      }

      req.validateProducts = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        tags: tags ?? [],
      };

      next();
    } ;
    