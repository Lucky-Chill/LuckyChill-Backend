## LuckyChill Backend Plan (2인 태스크 분할)

### 프로젝트 목표
- 무박2일 해커톤 내 LuckyChill 백엔드 MVP 완성
- 스택: Node.js(LTS), npm, Express, Prisma, PostgreSQL(Supabase), Supabase Auth, JWT, Swagger
- 고정 정책:
1. 카테고리: `스터디 팀 모집 / 코드 리뷰 / 강의실 예약`
2. HOT 정렬: 공감 수 기준
3. 수정/삭제: 작성자 전용
4. 첨부파일 없음, URL만 허용

### 완료 조건 (DoD)
1. Google 로그인(Supabase Auth) + JWT 인증 동작
2. 게시글/댓글/공감/알림 API 정상 동작
3. 공통 응답 형식(`success`, `data`, `error`) 전 API 적용
4. Swagger 문서 + 핵심 E2E/유닛 테스트 통과
5. 모든 태스크는 subagent 리뷰 및 피드백 반영 완료

### 담당자 A 태스크 (Platform/Auth)
1. A-1 프로젝트 기반 세팅
- 작업: 초기 프로젝트 구조, 환경변수 템플릿, 실행 스크립트, 공통 설정
- 산출물: 기본 실행 가능한 서버, `.env.example`, 폴더 구조 초안
- 완료 기준: 로컬 부팅 성공, 필수 env 누락 체크 동작
- 리뷰: subagent가 설정 누락/구조 리스크 리뷰 후 반영

2. A-2 품질/컨벤션 기반
- 작업: ESLint + Prettier, 공통 에러 핸들링, 응답 래퍼 미들웨어, 로깅, 헬스체크
- 산출물: 공통 미들웨어와 컨벤션 가이드
- 완료 기준: 샘플 API에서 성공/실패 응답 포맷 일관성 확인
- 리뷰: subagent가 응답 규격/에러 코드 일관성 점검 후 반영

3. A-3 Supabase + Prisma 기반
- 작업: Supabase PostgreSQL 연결, Prisma 스키마 초안, 마이그레이션 플로우
- 산출물: User/Post/Comment/Like/Notification 모델 및 migration
- 완료 기준: migration 적용 및 기본 CRUD 확인
- 리뷰: subagent가 스키마 정합성/확장 리스크 검토 후 반영

4. A-4 인증 도메인
- 작업: Google OAuth(Supabase Auth) 연동, JWT 검증 미들웨어, `GET /me`
- 산출물: 로그인/인증 흐름 API
- 완료 기준: 로그인 성공/실패/만료 토큰 케이스 통과
- 리뷰: subagent가 인증 취약점 점검 후 반영

5. A-5 API 문서/테스트 베이스
- 작업: Swagger 베이스, 인증/공통 계층 유닛 테스트
- 산출물: 문서 엔드포인트 + 테스트 스캐폴드
- 완료 기준: 문서 접근 가능, 테스트 스위트 실행 성공
- 리뷰: subagent가 문서-구현 불일치 여부 점검 후 반영

### 담당자 B 태스크 (Domain API)
1. B-1 게시글 CRUD
- 작업: 게시글 생성/수정/삭제/상세, 작성자 권한, 카테고리 고정 검증
- 산출물: posts 기본 API
- 완료 기준: 작성자 외 수정/삭제 차단, 카테고리 검증 통과
- 리뷰: subagent가 권한 누락/검증 누락 점검 후 반영

2. B-2 게시글 목록/검색/정렬
- 작업: 목록 조회, 검색, `hot|latest` 정렬
- 산출물: 목록 조회 API 쿼리
- 완료 기준: HOT=공감 수 정렬 정확성 검증
- 리뷰: subagent가 정렬/쿼리 성능 리스크 점검 후 반영

3. B-3 코드리뷰 URL 정책
- 작업: 코드리뷰 게시글의 URL 필드 검증(프로토콜/길이)
- 산출물: URL validation 로직
- 완료 기준: 허용/차단 URL 케이스 테스트 통과
- 리뷰: subagent가 우회 케이스 점검 후 반영

4. B-4 댓글/공감 API
- 작업: 댓글 작성/조회, 공감 토글
- 산출물: comments/likes API
- 완료 기준: 중복 공감 방지, 댓글 작성 플로우 통과
- 리뷰: subagent가 동시성/중복 처리 점검 후 반영

5. B-5 알림 API
- 작업: 댓글/공감 기반 알림 생성, 목록 조회, 읽음 처리
- 산출물: notifications API
- 완료 기준: 이벤트 발생 시 알림 생성 및 읽음 처리 확인
- 리뷰: subagent가 누락/중복 알림 점검 후 반영

6. B-6 도메인 테스트
- 작업: 도메인 유닛 + 핵심 E2E(로그인→글작성→댓글→공감→알림)
- 산출물: 테스트 코드/시나리오
- 완료 기준: 핵심 시나리오 전부 통과
- 리뷰: subagent가 테스트 누락 경로 점검 후 반영

### 공통 협업 규칙
1. 브랜치: `codex/task-a-*`, `codex/task-b-*`
2. DB 스키마 변경은 Prisma migration 단일 흐름 준수
3. Task A가 공통 응답/에러 규격을 소유, Task B는 전 API 준수
4. 각 태스크 종료 체크리스트:
- 기능 구현 완료
- 테스트 통과
- subagent 리뷰 완료
- 피드백 반영 커밋 완료

### 일정 (무박2일)
1. Day1 오전: A-1, A-2 / B-1 설계 동기화
2. Day1 오후-야간: A-3, A-4 / B-1, B-2, B-3
3. Day2 오전: A-5 / B-4, B-5
4. Day2 오후: B-6, 통합 점검, 버그 수정, 데모 준비
