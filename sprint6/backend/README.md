# 판다마켓 스프린트 미션 6 백엔드

판다마켓(중고마켓 + 자유게시판 + 댓글) API 서버. 스프린트 5의 MongoDB 기반 서버를
Prisma + PostgreSQL로 마이그레이션하고, 자유게시판(Article)과 댓글(Comment) API를
추가 구현했습니다.

## 기술 스택

- Node.js 26 · Express 5
- Prisma 7 · PostgreSQL (`@prisma/adapter-pg`)
- zod(환경변수·입력 검증) · ESM · CORS

## 배포 URL

```
https://one5-sprint-mission-be-wtf6.onrender.com/api
```

`GET https://one5-sprint-mission-be-wtf6.onrender.com/api` → `{"message":"Hello, Panda Market!"}`

## 로컬 실행

```bash
npm install
npx prisma generate
cp env/.env.example env/.env.development
# env/.env.development에 DATABASE_URL(POSTGRES) 입력
npm run prisma:migrate
npm run dev
```

`GET http://localhost:5001/api` → `{"message":"Hello, Panda Market!"}`

## 시드 데이터

```bash
# 개발 DB: 기존 데이터를 지우고 새로 채움 (보호 가드: 로컬 panda_market + --allow-reset 필요)
npm run seed

# 비파괴: 이미 데이터가 있으면 건너뜀 (프로덕션/배포 DB에 사용)
npm run seed:insert
#  └─ 프로덕션 DB(External URL + sslmode=require)를 대상으로 할 때:
#     DATABASE_URL='<External Database URL>?sslmode=require' node ./scripts/seed.js --no-reset
```

시드 결과: 상품 10, 게시글 10, 댓글 60 (`scripts/seed.js`, faker)

## API

기본 응답 형식: 성공 `{ "success": true, "data": ... }`, 실패 `{ "success": false, "message": "..." }`

### 중고마켓 (Product) — MongoDB → PostgreSQL 마이그레이션 완료

| 메서드 | 엔드포인트                          | 설명                                                               |
| ------ | ----------------------------------- | ------------------------------------------------------------------ |
| POST   | `/api/products`                     | 상품 등록 (`name`, `description`, `price`, `tags`)                 |
| GET    | `/api/products`                     | 목록: `offset`/`limit` 페이지네이션, `keyword` 검색, `sort=recent` |
| GET    | `/api/products/:productId`          | 상품 상세                                                          |
| PATCH  | `/api/products/:productId`          | 상품 수정 (부분 업데이트)                                          |
| DELETE | `/api/products/:productId`          | 상품 삭제 (댓글은 `Cascade` 삭제)                                  |
| POST   | `/api/products/:productId/comments` | 상품 댓글 등록                                                     |
| GET    | `/api/products/:productId/comments` | 상품 댓글 목록 (`cursor` 페이지네이션)                             |

### 자유게시판 (Article)

| 메서드 | 엔드포인트                          | 설명                                                                          |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------- |
| POST   | `/api/articles`                     | 게시글 등록 (`title`, `content`)                                              |
| GET    | `/api/articles`                     | 목록: `offset`/`limit` 페이지네이션, `keyword` 검색(제목·내용), `sort=recent` |
| GET    | `/api/articles/:articleId`          | 게시글 상세                                                                   |
| PATCH  | `/api/articles/:articleId`          | 게시글 수정                                                                   |
| DELETE | `/api/articles/:articleId`          | 게시글 삭제 (댓글은 `Cascade` 삭제)                                           |
| POST   | `/api/articles/:articleId/comments` | 게시글 댓글 등록                                                              |
| GET    | `/api/articles/:articleId/comments` | 게시글 댓글 목록 (`cursor` 페이지네이션)                                      |

### 댓글 공통

| 메서드 | 엔드포인트                 | 설명                   |
| ------ | -------------------------- | ---------------------- |
| PATCH  | `/api/comments/:commentId` | 댓글 수정 (PATCH 필수) |
| DELETE | `/api/comments/:commentId` | 댓글 삭제              |

### 페이지네이션

- 목록(게시글·상품): offset 방식 — `?offset=0&limit=10` → `data: { list, totalCount }`
- 댓글: cursor 방식 — `?limit=10` → `data: { list, nextCursor }`, 다음 페이지는 `?cursor={nextCursor}`. `nextCursor`가 `null`이면 마지막 페이지.

### 상태 코드

201(생성)·200(조회/수정·목록)·204(삭제), 400(필수값/쿼리 검증 실패), 404(리소스 없음).

## API 테스트 (Newman) 및 보고서

컬렉션: `postman/panda-market.postman_collection.json` (환경 파일: `postman/env/*`)

```bash
npm run test:api:local   # 로컬(5001) 대상 실행
npm run test:api         # 배포 URL 대상 실행
```

- 상세 보고서: `postman/reports/api-test-report.html`
- 브라우저에서 보기: [htmlpreview.github.io](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Aidenpark87/15-sprint-mission-be/express-박순창-sprint6/sprint6/backend/postman/reports/api-test-report.html)
- 요구사항 검증(`pm.test` 포함): 상태 코드, `{ success, data }` 구조, `totalCount`/`nextCursor` 필드, 필수값·404 에러 케이스

## 폴더 구조

```
scripts/            시드(seed.js) + DB 대상 안전 검사(seed-safety.js)
src/
  config/           환경변수 zod 검증
  constants/        상태 코드 / 에러 메시지 / Prisma 에러
  db/               Prisma Client
  errors/           HTTP 예외(400·404 등)
  middlewares/      중앙 에러 핸들러
  repositories/     DB 접근(Product·Article·Comment)
  routes/           /products /articles /comments (/api 하위)
  server.js         Express 진입점
postman/            테스트 컬렉션 + 환경 + 보고서
prisma/             스키마 + 마이그레이션
```
