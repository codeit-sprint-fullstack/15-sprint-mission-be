# 🐼 판다마켓 프로젝트

> 이 저장소는 판다마켓 프로젝트의 백엔드 express 미션을 수행하는 저장소입니다. 🔗 [판다마켓 백엔드🐼](https://cloud-panda-market-api.onrender.com)

## 1. 기술 스택

- **Runtime:** Node.js (v24)
- **Package Manager:** Yarn (v1)
- **Framework:** Express (v5)
- **Database:** MongoDB & Mongoose
- **Validation:** Zod (v4)
- **Security:** Helmet, CORS
- **Logging:** Morgan

## 2. 프로젝트 구조

```
📦src
 ┣ 📂config
 ┃ ┣ 📜db.js
 ┃ ┗ 📜env.js
 ┣ 📂controllers
 ┃ ┗ 📜product.controller.js
 ┣ 📂middlewares
 ┃ ┣ 📜error.middleware.js
 ┃ ┗ 📜validate.middleware.js
 ┣ 📂models
 ┃ ┗ 📜product.model.js
 ┣ 📂routes
 ┃ ┗ 📜product.routes.js
 ┣ 📂utils
 ┃ ┗ 📜AppError.js
 ┣ 📜app.js
 ┗ 📜server.js
```

### 각 파일별 역할

- server.js: 서버를 실제로 실행
- app.js: Express application 구성 및 middleware/router 등록
- config: 환경변수와 데이터베이스 연결 등 애플리케이션 설정 관리
- routes: HTTP Method와 URL을 Controller 및 Middleware에 연결
- middlewares: 요청 데이터 검증 및 전역 에러 처리
- controllers: HTTP 요청을 받아 실제 작업을 수행하고 응답 반환
- models: Mongoose Schema 및 Model 정의
- utils: 애플리케이션 전반에서 사용하는 공통 Utility 코드

## 3. 실행

```bash
# 의존성 설치
yarn

# 로컬 개발 서버 실행 (Nodemon)
yarn dev
```

## 4. API 명세

| Method | Endpoint          | 설명           |
| ------ | ----------------- | -------------- |
| GET    | /api/products     | 상품 목록 조회 |
| GET    | /api/products/:id | 상품 단건 조회 |
| POST   | /api/products     | 상품 생성      |
| PATCH  | /api/products/:id | 상품 수정      |
| DELETE | /api/products/:id | 상품 삭제      |

## 5. 스프린트 미션

### 기본 요구사항(sprint 5)

#### 공통

- [x] Github에 스프린트 미션 PR을 만들어 주세요.
- [x] React, Express를 사용해 진행합니다.

#### 중고마켓

- [x] Product 스키마를 작성해 주세요.
  - [x] id, name, description, price, tags, createdAt, updatedAt필드를 가집니다.
  - [x] 필요한 필드가 있다면 자유롭게 추가해 주세요.
- [x] 상품 등록 API를 만들어 주세요.
  - [x] name, description, price, tags를 입력하여 상품을 등록합니다.
- [x] 상품 상세 조회 API를 만들어 주세요.
  - [x] id, name, description, price, tags, createdAt를 조회합니다.
- [x] 상품 수정 API를 만들어 주세요.
  - [x] PATCH 메서드를 사용해 주세요.
- [x] 상품 삭제 API를 만들어 주세요.
- [x] 상품 목록 조회 API를 만들어 주세요.
  - [x] id, name, price, createdAt를 조회합니다.
  - [x] offset 방식의 페이지네이션 기능을 포함해 주세요.
  - [x] 최신순(recent)으로 정렬할 수 있습니다.
  - [x] name, description에 포함된 단어로 검색할 수 있습니다.
- [x] 각 API에 적절한 에러 처리를 해 주세요.
- [x] 각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.
- [x] `.env` 파일에 환경 변수를 설정해 주세요.
- [x] CORS를 설정해 주세요.
- [x] render.com로 배포해 주세요.
- [x] MongoDB를 활용해 주세요.

## 6. 학습 내용 및 트러블슈팅(sprint 5)

1. **프로젝트 규모에 맞는 아키텍처 설계**
   - **고민:** Express의 흐름(`Request → Middleware → Controller → Model`)을 학습하면서, 비즈니스 로직을 담당하는 Service 계층을 추가할지 고민했습니다.
   - **결정:** 단일 상품(Product) 대상의 작은 CRUD 프로젝트이므로, Service 계층이 단지 `Model.create()` 등을 그대로 전달만 하게 되어 불필요하다고 판단했습니다. 이에 따라 `Route → Middleware → Controller → Model`의 간결한 구조를 채택했습니다.

2. **검증된 데이터의 안전한 전달 방식 개선 (res.locals 활용)**
   - **고민:** Zod 미들웨어에서 검증을 마친 데이터를 컨트롤러로 전달할 때, 기존의 `req.query`나 `req.body`를 직접 덮어씌우는(Mutation) 방식에서 원본 데이터 훼손 문제가 발생했습니다.
   - **결정:** Express 권장 방식에 따라, 검증된 데이터를 `req` 객체 변조 대신 `res.locals.validated`에 안전하게 저장하도록 리팩토링했습니다. 이를 통해 컨트롤러에서 검증이 완료된 데이터를 명확하게 사용할 수 있도록 개선했습니다.

3. **실무적인 로깅(Logging) 도입**
   - **결정:** 단순한 `console.log`를 넘어, 실무 표준 미들웨어인 `morgan`을 도입했습니다. 이를 통해 HTTP 메서드, 엔드포인트, 상태 코드, 응답 속도 등을 체계적으로 기록하여 모니터링 및 디버깅 환경을 개선했습니다.

4. **논리적 단위의 버전 관리 (Git)**
   - **결정:** Conventional Commits 컨벤션을 적용하고, 하나의 커밋에 하나의 논리적인 변경 사항을 담도록 하여 Git 히스토리의 가독성과 추적성을 높였습니다.

5. **패키지 매니저 선택**
   - **학습:** 새로운 도구를 경험하고자 npm 대신 Yarn(v1)을 도입해 보았습니다. 하지만 학습 과정에서 Yarn Classic(v1)은 더 이상 적극적인 업데이트가 지원되지 않음을 인지하게 되었습니다. 다음 프로젝트에서는 다른 패키지 매니저의 도입을 고려해 볼 예정입니다.

6. **MongoDB Atlas 연결 타임아웃 및 실패 오류**
   - **증상:** 백엔드 배포 후 데이터베이스 연결에 실패함.
   - **원인:** MongoDB Atlas의 IP Access List에 접근을 시도하는 IP가 등록되어 있지 않아 연결이 차단됨.
   - **해결:** Render 서비스의 `Connect → Outbound`에서 제공하는 Outbound IP 범위를 확인한 후, MongoDB Atlas의 `Network Access`에 해당 IP 대역을 등록하여 연결을 허용했습니다.
   - **배운 점:** 배포 환경에서 외부 데이터베이스에 접근할 때는 서버의 outbound IP를 고려해야 한다는 점을 배웠습니다.
