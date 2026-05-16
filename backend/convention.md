# Backend Code Convention

> 바이브코딩 해커톤용 백엔드(Node.js + Express + Prisma) 프로젝트 컨벤션입니다.  
> 빠른 개발과 협업 효율을 목표로 하며, 과도한 규칙보다 "일관성"을 우선합니다.

---

# 1. General Rules

## 1.1 기본 규칙

- 문자열은 쌍따옴표(`"`) 사용
- 문장 끝에는 세미콜론(`;`) 사용
- 함수명 / 변수명은 camelCase 사용
- 클래스 / 타입 / DTO는 PascalCase 사용
- 상수는 UPPER_SNAKE_CASE 사용
- 한 줄에 하나의 문장만 작성
- 연산자 앞뒤 공백 추가
- 콤마 뒤 공백 추가

```js
// bad
const arr = [1, 2, 3];

// good
const arr = [1, 2, 3];
```

---

# 2. Naming Convention

## 2.1 변수 / 함수

### camelCase 사용

```js
const postList = [];

function createPost() {}
```

---

## 2.2 클래스 / DTO / 타입

### PascalCase 사용

```js
PostService;
PostController;
CreatePostReqDto;
PostDetailResDto;
```

---

## 2.3 상수

### UPPER_SNAKE_CASE 사용

```js
const MAX_FILE_SIZE = 5 * 1024 * 1024;
```

---

# 3. Folder Structure Convention

## 3.1 도메인 기준 구조 사용

```text
src/
 ├─ global/
 │   ├─ middleware/
 │   ├─ utils/
 │   ├─ constants/
 │   └─ errors/
 │
 ├─ domain/
 │   ├─ auth/
 │   │   ├─ auth.controller.js
 │   │   ├─ auth.service.js
 │   │   ├─ auth.repository.js
 │   │   ├─ auth.dto.js
 │   │   └─ auth.routes.js
 │   │
 │   ├─ post/
 │   │   ├─ post.controller.js
 │   │   ├─ post.service.js
 │   │   ├─ post.repository.js
 │   │   ├─ post.dto.js
 │   │   └─ post.routes.js
 │   │
 │   └─ comment/
 │
 ├─ prisma/
 ├─ uploads/
 ├─ app.js
 └─ server.js
```

---

# 4. Layer Convention

## 4.1 Controller

### 역할

- Request 수신
- Response 반환
- Service 호출

### 규칙

- 비즈니스 로직 작성 금지
- 요청 검증 최소 처리만 수행

```js
async function createPost(req, res) {}
```

---

## 4.2 Service

### 역할

- 핵심 비즈니스 로직 처리
- Repository 호출

### 규칙

- DB 직접 접근 금지
- Controller ↔ Service ↔ Repository 구조 유지

```js
async function createPost(postData) {}
```

---

## 4.3 Repository

### 역할

- Prisma DB 접근 전용

### 규칙

- DB 관련 코드만 작성

```js
async function savePost(data) {}
```

---

# 5. API Convention

## 5.1 RESTful API 사용

| Method | Description |
| ------ | ----------- |
| GET    | 조회        |
| POST   | 생성        |
| PATCH  | 수정        |
| DELETE | 삭제        |

---

## 5.2 URL Convention

### 복수형 사용

```text
/api/posts
/api/comments
/api/users
```

---

## 5.3 camelCase 사용

```json
{
  "githubUrl": "",
  "createdAt": ""
}
```

---

# 6. Common Response Convention

## 6.1 성공 응답

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## 6.2 실패 응답

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "게시글을 찾을 수 없습니다."
  }
}
```

---

# 7. DTO Convention

## 7.1 Request DTO

```js
CreatePostReqDto;
UpdatePostReqDto;
LoginReqDto;
```

### 규칙

- 행위 포함
- 요청(Request) 목적 명확화

---

## 7.2 Response DTO

```js
PostDetailResDto;
PostSummaryResDto;
UserProfileResDto;
```

### 규칙

- 응답(Response) 목적 명확화

---

# 8. Prisma Convention

## 8.1 Model Naming

### 단수형 PascalCase 사용

```prisma
model Post {

}

model Comment {

}
```

---

## 8.2 Field Naming

### camelCase 사용

```prisma
createdAt
githubUrl
likeCount
```

---

# 9. Error Convention

## 9.1 Error Message

### 사용자 친화적 메시지 사용

```text
존재하지 않는 게시글입니다.
로그인이 필요합니다.
파일 크기가 너무 큽니다.
```

---

## 9.2 HTTP Status

| Status | Description |
| ------ | ----------- |
| 200    | 성공        |
| 201    | 생성 성공   |
| 400    | 잘못된 요청 |
| 401    | 인증 필요   |
| 403    | 권한 없음   |
| 404    | 데이터 없음 |
| 500    | 서버 오류   |

---

# 10. File Upload Convention

## 10.1 업로드 방식

- 첨부파일은 Supabase Storage 사용
- DB에는 파일 URL만 저장

---

## 10.2 허용 파일

```text
zip
js
ts
py
java
txt
md
```

---

# 11. Comment Convention

## 11.1 한 줄 주석

```js
// 게시글 생성
```

---

## 11.2 여러 줄 주석

```js
/**
 * 게시글 생성 API
 * 게시글 저장 후 결과 반환
 */
```

---

# 12. Git Convention

## 12.1 Branch Naming

```text
feature/post-api
feature/comment-api
fix/login-error
```

---

## 12.2 Commit Message

```text
feat: 게시글 작성 API 구현
fix: 댓글 조회 버그 수정
refactor: 응답 구조 수정
```

---

# 13. Anti-Pattern

❌ 금지 사항

- snake_case 변수명 사용
- Controller에 비즈니스 로직 작성
- DB 직접 접근
- 응답 형식 혼용
- 한 파일에 여러 역할 작성
- 의미 없는 변수명 사용

```js
// bad
const d = [];

// good
const postList = [];
```

---

# 14. MVP Development Rule

해커톤 MVP 기준 우선순위:

1. API 동작
2. FE 연동 가능 상태
3. 응답 형식 통일
4. 예외처리 최소화
5. 성능 최적화는 마지막

과도한 설계보다 빠른 구현과 안정적인 시연을 우선합니다.

```

```
