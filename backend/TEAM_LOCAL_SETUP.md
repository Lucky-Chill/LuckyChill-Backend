# 팀원 로컬 실행 가이드

## 1. 코드 받기

```bash
git checkout dev
git pull origin dev
cd backend
npm install
```

> 폴더 이름은 **`backend`** 입니다. `LuckyChill-Backend-main` 은 예전 경로입니다.

## 2. `.env` 만들기

**파일 위치:** `backend/.env` (레포 루트가 아님)

```bash
copy .env.example .env
```

담당자가 준 **Supabase 키 3개**를 `.env`에 붙여넣습니다.  
키는 **한 줄 전체** 복사 (`eyJ...` 로 시작, `sb_publishable` 아님).

## 3. 점검 (필수)

터미inal 1:

```bash
cd backend
npm run check:setup
```

`실패: 0` 이 나와야 합니다.

터미inal 2:

```bash
cd backend
npm run dev
```

`Server listening on port 3000` 확인.

## 4. 브라우저

**본인 PC**에서만 열 수 있습니다:

- http://localhost:3000/health
- http://localhost:3000/api-docs

## 4-1. 프론트 + API 연동

터미널 1 (백엔드):

```bash
cd backend
npm run dev
```

터미널 2 (프론트):

```bash
cd front
copy .env.example .env
npm install
npm run dev
```

- 프론트: http://localhost:5173
- Supabase Redirect URLs에 `http://localhost:5173/auth/callback` 추가

다른 팀원 PC의 `localhost`는 **접속 불가**합니다.

## 5. 자주 하는 실수

| 증상 | 원인 | 해결 |
|------|------|------|
| 사이트에 연결할 수 없음 | `npm run dev` 안 함 | backend에서 서버 실행 |
| 다른 사람 localhost 접속 | localhost는 각자 PC | 본인이 dev 실행 후 본인 브라우저 |
| `Invalid API key` | 잘못된 키 형식 | Legacy `eyJ...` 키 재복사 |
| `EADDRINUSE` | 3000 포트 점유 | 기존 node 종료 후 재실행 |
| 폴더 없음 | pull 안 함 / 구 경로 | `git pull` + `cd backend` |
| `.env` 없음 | 파일 위치 오류 | `backend/.env` 생성 |
| Google 로그인 안 열림 | OAuth URL 미이동 / env 미로드 | `front/.env` 확인 후 `front`에서 dev **재시작** |
| Google 로그인 실패 | Supabase Google 미설정 | 대시보드 Authentication → Google 활성화 |
| PKCE code verifier not found | `127.0.0.1` ↔ `localhost` 혼용 또는 code 이중 교환 | **항상** `http://localhost:5173` 로 접속, `VITE_APP_ORIGIN` 동일하게 |

## 6. 그래도 안 되면

실패한 팀원이 아래 결과를 캡처해서 보내기:

```bash
cd backend
npm run check:setup
```

및 `npm run dev` 터미널 **에러 메시지 전체**.
