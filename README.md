# 판다마켓 스프린트 미션 5

React 프론트엔드와 Express 백엔드를 연동한 중고마켓 풀스택 프로젝트입니다.

상품 목록 조회와 검색, 상품 등록 폼 검증, 상품 CRUD API를 구현했으며 MongoDB Atlas에 상품 데이터를 저장합니다.

## 배포

- Backend API: https://one5-sprint-mission-be-okq9.onrender.com

## 기술 스택

### Frontend

- React 19
- React Router
- Create React App
- CSS

### Backend

- Node.js 26
- Express 5
- MongoDB Atlas
- Mongoose
- postman

### Code Quality

- ESLint
- Prettier

## 시작하기

### 1. 의존성 설치

저장소를 내려받은 뒤 `server` 폴더로 이동합니다.

```bash
cd server
npm install
```

### 2. 환경 변수 설정

`server/.env` 파일을 만들고 아래 값을 입력합니다.

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

`MONGODB_URI`에는 본인의 MongoDB Atlas 연결 문자열을 사용해야 합니다. `.env`는 Git에 포함되지 않습니다.

### 3. 서버 실행

```bash
npm run dev
```

정상적으로 실행되면 다음 메시지가 표시됩니다.

```text
MongoDB 연결 성공
서버가 3001포트에서 작동 중입니다.
```

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run lint` | JavaScript 코드 검사 |
| `npm run format` | Prettier로 파일 정리 |
| `npm run format:check` | Prettier 적용 여부 확인 |

## API

기본 주소는 `http://localhost:3001`입니다.

| 메서드 | 경로 | 설명 | 정상 상태 코드 |
| --- | --- | --- | --- |
| `GET` | `/` | 서버 상태 확인 | `200` |
| `GET` | `/api/products` | 상품 목록 조회 | `200` |
| `POST` | `/api/products` | 상품 등록 | `201` |
| `GET` | `/api/products/:id` | 상품 상세 조회 | `200` |
| `PATCH` | `/api/products/:id` | 전달된 상품 필드 수정 | `200` |
| `DELETE` | `/api/products/:id` | 상품 삭제 | `204` |

상품 목록 조회에는 다음 쿼리 파라미터를 사용할 수 있습니다.

| 파라미터 | 기본값 | 설명 |
| --- | --- | --- |
| `offset` | `0` | 건너뛸 상품 수 |
| `limit` | `10` | 한 번에 조회할 상품 수 |
| `orderBy` | `recent` | 최신순 정렬. `recent`만 지원 |
| `keyword` | 빈 문자열 | 상품명 또는 상품 소개 검색어 |

상품 등록 요청 예시:

```json
{
  "name": "Keyboard",
  "description": "Test product description",
  "price": 30000,
  "tags": ["device", "used"]
}
```

상품 데이터는 다음 필드를 사용합니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `id` | String | MongoDB가 생성한 상품 ID |
| `name` | String | 상품명 |
| `description` | String | 상품 소개 |
| `price` | Number | 판매 가격 |
| `tags` | String[] | 상품 태그 |
| `createdAt` | Date | 생성 시간 |
| `updatedAt` | Date | 수정 시간 |

## 폴더 구조

```text
15-sprint-mission-be/
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   └── products.js
│   │   └── server.js
│   ├── .env
│   └── package.json
└── README.md
```

## 구현 현황

- [x] Express 기본 서버, 환경 변수, CORS 설정
- [x] MongoDB Atlas 연결
- [x] Product 스키마
- [x] 상품 등록 API
- [x] 상품 상세 조회 API
- [x] 상품 부분 수정과 입력값 검증
- [x] 상품 삭제 API
- [x] 상품 목록 조회, offset 페이지네이션, 최신순 정렬, 검색
- [x] Render 배포
