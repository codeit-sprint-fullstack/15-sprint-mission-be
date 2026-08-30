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

### Development Tools

- ESLint
- Prettier
- Postman

## 시작하기

### 1. 백엔드 의존성 설치

```bash
cd server
npm install
```

### 2. 백엔드 환경 변수 설정

`server/.env` 파일을 만들고 아래 값을 입력합니다.

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

`MONGODB_URI`에는 본인의 MongoDB Atlas 연결 문자열을 사용해야 합니다. `.env`는 Git에 포함되지 않습니다.

### 3. 백엔드 실행

```bash
npm run dev
```

정상적으로 실행되면 다음 메시지가 표시됩니다.

```text
MongoDB 연결 성공
서버가 3001포트에서 작동 중입니다.
```

### 4. 프론트엔드 의존성 설치

새 터미널을 열고 저장소 루트에서 `client` 폴더로 이동합니다.

```bash
cd client
npm install
```

### 5. 프론트엔드 환경 변수 설정

`client/.env` 파일을 만들고 사용할 API 주소를 입력합니다.

로컬 백엔드를 사용할 때:

```env
REACT_APP_API_BASE_URL=http://localhost:3001
```

배포된 백엔드를 사용할 때:

```env
REACT_APP_API_BASE_URL=https://one5-sprint-mission-be-okq9.onrender.com
```

### 6. 프론트엔드 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 명령어

| 실행 위치 | 명령어 | 설명 |
| --- | --- | --- |
| `client` | `npm start` | React 개발 서버 실행 |
| `client` | `npm run build` | React 프로덕션 빌드 |
| `server` | `npm run dev` | Express 서버 실행 |
| `server` | `npm run lint` | JavaScript 코드 검사 |
| `server` | `npm run format` | Prettier로 파일 정리 |
| `server` | `npm run format:check` | Prettier 적용 여부 확인 |

## API

- 로컬 주소: `http://localhost:3001`
- 배포 주소: `https://one5-sprint-mission-be-okq9.onrender.com`

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
15-sprint-mission-be-integrated/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   └── Product.js
│   │   ├── routes/
│   │   │   └── products.js
│   │   └── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## 구현 현황

### Frontend

- [x] 랜딩 페이지 React 마이그레이션 및 `/` 라우팅
- [x] 중고마켓 페이지와 `/items` 라우팅
- [x] 자체 GET API를 사용한 상품 목록 조회, 검색, 최신순 정렬, 페이지네이션
- [x] 상품 이미지가 없을 때 기본 이미지 표시
- [x] 상품 등록 페이지와 `/registration` 라우팅
- [x] 자체 POST API를 사용한 상품 등록 및 상세 페이지 이동
- [x] 상품 등록 버튼 활성화 조건과 Custom Hook 유효성 검사
- [x] 태그 칩 추가 및 삭제
- [x] PC, Tablet, Mobile 반응형 레이아웃

### Backend

- [x] Express 기본 서버, 환경 변수, CORS 설정
- [x] MongoDB Atlas 연결
- [x] Product 스키마
- [x] 상품 등록 API
- [x] 상품 상세 조회 API
- [x] 상품 부분 수정과 입력값 검증
- [x] 상품 삭제 API
- [x] 상품 목록 조회, offset 페이지네이션, 최신순 정렬, 검색
- [x] Render 배포
