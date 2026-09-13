import { flattenError, z } from 'zod';

// zod로 노드환경, 포트, 몽고URI 값이 잘 들어갔는지 검증하는 스키마 만들기.
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().min(1000).max(65535),
  MONGO_URI: z
    .string()
    .regex(
      /^mongodb(?:\+srv)?:\/\//,
      'MONGO_URI는 mongodb:// 또는 mongdodb+srv://로 시작해야 합니다.',
    ),
});

// (process는 Node.js 실행시 전역으로 자동 제공되는 객체로 현재 실행중인 프로세스(프로그램)에 대한 정보와 제어 기능이 있음.)
// (process의 내장 프로퍼티 중 환경변수를 담당하는 env를 통해 내가 정의한 NODE_ENV, PORT, MONGO_URI에 접근하여 스키마를 충족시키는지 검증할 것임.)
// (그러기 위해 envSchema에 .parse 메서드를 돌리고 각각의 환경변수값을 집어넣음.) 
const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGO_URI: process.env.MONGO_URI,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('환경 변수 검증 실패:', flattenError(error));  // 환경 변수 검증과 관련한 오류일 땐 보기좋게 flatten하여 오류 출력, 혹은 fieldErrors만 꺼내서 출력하기도 함.
    } else {
      console.error(error);  // 환경 변수 검증과 무관한 오류(zod 오류가 아닌 오류)일 때도 어쨌든 출력.
    }
    throw error;  // fail fast 유도.
  }
};

export const config = parseEnvironment();  // 스키마에 .parse를 돌리면 리턴값에는 입력한 환경변수 값이 그대로 들어있거나, PORT처럼 coerce로 형변환한 값은 형변환되어 들어가게 됨.
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test'; // 편의를 위해, 리턴값 config에서 실행환경 값만 비교후 불린형으로 반환하는 is~ 변수를 만들고 export함.