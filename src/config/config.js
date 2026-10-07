//환경 변수에 대한 정의와 검증을 진행하여 적절한 값 이외의 경우 에러를 발생시키기 위함
//zod를 사용하여 환경 변수 검증 진행
import { flattenError, z } from 'zod';

//zod 사용법
//1. 환경변수의 스키마를 정의: 타입이나 다수의 변수가 있다면 배열로 정의
//2. 검증 실행하는 함수 만들기: 정의된 스키마를 .parse() 안에 인풋한다
//3. 리턴에 담기: return 변수.parse() 로 반환한다.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().min(1000).max(65535).default(5001),
  DATABASE_URL: z
    .url()
    .refine(
      (url) => url.startsWith('postgresql:') || url.startsWith('postgres:'),
      'PostgreSQL 연결 URL이어야 합니다.',
    ),
});

const parseEnvschema = () => {
  //환경변수도 검증 해볼 것
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('환경 변수 검증 실패: ', flattenError(error));
    }
    throw error;
  }
};

export const config = parseEnvschema();

//NODE_ENV는 값이 여러개이므로 각각 할당 해준다.
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';
