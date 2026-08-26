//환경 변수에 대한 정의와 검증을 진행하여 적절한 값 이외의 경우 에러를 발생시키기 위함
//zod를 사용하여 환경 변수 검증 진행
import { z } from 'zod';

//zod 사용법
//1. 환경변수의 스키마를 정의: 타입이나 다수의 변수가 있다면 배열로 정의
//2. 검증 실행하는 함수 만들기: 정의된 스키마를 .parse() 안에 인풋한다
//3. 리턴에 담기: return 변수.parse() 로 반환한다.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().min(1000).max(65535).default(5001),
  MONGO_URI: z.string(),
});

const parseEnvschema = () => {
  return envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
  });
};

export const config = parseEnvschema();

//NODE_ENV는 값이 여러개이므로 각각 할당 해준다.
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
