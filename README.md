# 15-Sprint-Mission (Backend / Express + MongoDB)

중고마켓 서비스의 백엔드 API 서버입니다. Express와 MongoDB(Mongoose)를 사용해 상품(Product)에 대한 CRUD API를 제공합니다.

> 프론트엔드(React)는 별도 저장소/PR로 진행합니다.

## 기술 스택

- Node.js (ESM, `type: module`)
- Express 5
- MongoDB / Mongoose 9
- ESLint / Prettier

## 폴더 구조

```
src/
 ├─ db/                # DB 연결
 ├─ error/             # 커스텀 예외 클래스 (HttpException 상속)
 ├─ middlewares/        # CORS, 공통 에러 핸들러
 ├─ model/             # Mongoose 스키마
 ├─ routes/
 │   ├─ index.js        # 루트 라우터 (헬스체크 포함)
 │   └─ products/       # 상품 라우터 + 유효성 검사 미들웨어
 └─ server.js           # 앱 진입점
```

## 환경 변수

`env/.env.development`, `env/.env.production` 파일에 아래 값을 설정합니다. (git에는 커밋되지 않도록 `.gitignore`에서 `env/*` 제외 처리)

| 변수명     | 설명                         |
| ---------- | ---------------------------- |
| `NODE_ENV` | `development` / `production` |
| `PORT`     | 서버 포트                    |
| `MONG_URI` | MongoDB 연결 문자열          |

## 실행 방법

```bash
npm install

# 개발 모드
npm run dev

# 프로덕션 모드
npm run prod

# 린트 / 포맷
npm run lint
npm run format
```

## API 명세

### 상품 등록 — `POST /products`

요청 바디: `name`, `description`, `price`, `tags`

### 상품 목록 조회 — `GET /products`

쿼리 파라미터:

- `page`, `pageSize` — offset 방식 페이지네이션
- `search` — `name`, `description`에 포함된 단어 검색

정렬: 최신순(`createdAt` 내림차순) 고정

### 상품 상세 조회 — `GET /products/:id`

`id`, `name`, `description`, `price`, `tags`, `createdAt` 반환

### 상품 수정 — `PATCH /products/:id`

요청 바디: `name`, `description`, `price`, `tags` (부분 수정)

### 상품 삭제 — `DELETE /products/:id`

---

## 요구사항 체크리스트 (백엔드)

### 공통

- [ ] GitHub에 스프린트 미션 PR 생성
- [x] Express 사용

### 중고마켓

- [x] Product 스키마 작성 (`name`, `description`, `price`, `tags`, `createdAt`, `updatedAt`)
- [x] 상품 등록 API (`POST /products`) + 유효성 검사
- [x] 상품 상세 조회 API (`GET /products/:id`)
- [x] 상품 수정 API (`PATCH /products/:id`)
- [x] 상품 삭제 API (`DELETE /products/:id`)
- [x] 상품 목록 조회 API (`GET /products`)
  - [x] offset 방식 페이지네이션
  - [x] 최신순(`recent`) 정렬
  - [x] `name`, `description` 키워드 검색
- [x] 각 API 에러 처리 (공통 에러 핸들러 + 커스텀 예외 클래스)
- [x] 각 API 응답 상태 코드 반환
- [x] `.env` 파일로 환경 변수 분리
- [x] `.gitignore`에 `.env` 제외 처리
- [x] CORS 설정
- [ ] render.com 배포
- [x] MongoDB 연동 (Mongoose)
