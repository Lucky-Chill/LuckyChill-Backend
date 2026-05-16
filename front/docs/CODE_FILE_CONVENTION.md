# 🚀 Team Project Code Convention (React + JavaScript)

본 문서는 우리 팀의 원활한 협업과 코드 품질 유지를 위한 프론트엔드(React + JS) 개발 및 폴더 구조 컨벤션입니다. 모든 팀원은 작업 전 해당 컨벤션을 숙지하고 준수해 주시기 바랍니다.

## 0. 개발 환경 셋업 (Environment Setup)

### 0.1. 패키지 매니저 (Package Manager)

우리 팀은 의존성(Dependency) 버전 충돌 및 Lock 파일 혼재를 방지하기 위해 **npm**을 엄격하게 사용합니다.

- **사용 매니저:** `npm`
- **주의사항:**
- 패키지를 설치할 때는 반드시 `npm install` 명령어를 사용합니다.
- 만약 실수로 다른 패키지 매니저를 사용하여 의도치 않은 Lock 파일(예: `yarn.lock`, `pnpm-lock.yaml`)이 생성되었다면, 해당 파일을 즉시 삭제 후 `npm install`을 다시 실행해 주세요.

---

## 1. 개발 코드 컨벤션 (Code Convention)

### 1.1. 네이밍 컨벤션 (Naming Convention)

JavaScript와 React의 글로벌 표준 네이밍 관례를 엄격하게 따릅니다. 이름만으로 역할과 의도를 명확히 파악할 수 있도록 직관적으로 작성합니다.

- **변수 및 일반 함수명 (camelCase)**
- 카멜케이스(camelCase): 첫 글자는 소문자로 시작하며, 이어지는 단어의 첫 글자는 대문자로 표기합니다.
- **예시:** `userList`, `handleSubmit()`, `calculateDistance()`

- **상수 (CONSTANT_CASE)**
- 변경되지 않는 전역 설정값은 모두 대문자와 언더바(`_`)를 사용합니다.
- **예시:** `MAX_GROUP_SIZE = 7`, `MIN_MANNER_SCORE = 60`

- **React 컴포넌트 및 생성자/클래스명 (PascalCase)**
- 화면을 구성하는 UI 컴포넌트나 커스텀 훅 파일명 등에 사용합니다.
- **예시:** `function UserProfile() {}`, `const NavigationMenu = () => {}`

### 1.2. 주석 작성 규칙 (Comment Rules)

코드의 가독성과 유지보수성을 높이기 위해 **JSDoc 스타일**을 표준으로 채택하여 주석을 작성합니다. 주요 모듈의 경우 `@author` 태그를 통해 담당자를 명시할 수 있습니다.

- **컴포넌트 및 핵심 로직 시작 부분**

```javascript
/**
 * 사용자 로그인 처리를 담당하는 커스텀 훅
 * @author 이름 (이니셜)
 * @description 입력받은 인증 정보를 바탕으로 토큰을 발급받고 전역 상태를 업데이트합니다.
 */
const useAuth = () => {
  // 로직 구현...
};
```

- **데이터 출처 명시**
- 외부 API를 호출하는 함수 위, 또는 더미 데이터 파일 상단에 주석으로 출처를 밝힙니다.

```javascript
// 데이터 출처: 서울특별시 지하철 승하차 승객수 (공공데이터포털 JSON API)
```

### 1.3. 코드 스타일 (Code Style)

- **들여쓰기 (Indentation)**: 글로벌 웹 개발 표준에 맞춰 **Space 2칸**을 사용합니다. (Prettier 확장을 기본으로 사용 권장)
- **타입 힌팅 (Type Hinting)**: TypeScript 대신 JavaScript를 사용하므로, 에러 방지와 협업 효율을 위해 JSDoc을 활용하여 매개변수(`@param`)와 반환값(`@returns`)의 타입을 명시합니다.

```javascript
/**
 * 사용자 데이터를 UI에 맞게 포맷팅하는 함수
 * @param {Object} user - 사용자 정보 원본 객체
 * @returns {string} 포맷팅된 사용자 표시 이름
 */
const formatUserName = (user) => {
  // 로직 구현...
};
```

---

## 2. 파일 및 디렉토리 컨벤션 (File & Directory Convention)

### 2.1. 파일 네이밍 규칙 (File Naming)

버전 관리는 전적으로 Git에 위임하므로 **파일명에 날짜나 버전을 절대 기재하지 않습니다.** 파일명은 내부 모듈의 네이밍 컨벤션을 그대로 따라갑니다.

- **확장자 구분 및 네이밍**:
- **React UI 컴포넌트 (`.jsx`)**: 반드시 `PascalCase` 사용 (예: `UserProfile.jsx`, `Home.jsx`)
- **순수 로직, 훅, 일반 함수 (`.js`)**: 반드시 `camelCase` 사용 (예: `useAuth.js`, `dateUtils.js`)

---

### 2.2. 디렉토리 구조 (Architecture Structure)

우리 팀은 **기능 단위로 쪼개고 책임을 고정**하여 변경 범위를 작게 유지하는 최신 아키텍처(Feature-Sliced Design 기반)를 채택합니다.

```text
project_root/
├── public/                  # 🌐 정적 파일 (index.html, favicon 등)
├── src/
│   ├── pages/               # 📄 라우트 엔트리 (페이지 단위 진입, 얇게 유지)
│   │   ├── Home.jsx
│   │   └── Login.jsx
│   │
│   ├── features/            # 💡 도메인 기능 모듈 (화면+훅+API 조합, 실질 비즈니스 로직 집중)
│   │   ├── auth/
│   │   ├── matching/
│   │   └── board/
│   │
│   ├── components/common/   # 🧩 재사용 UI 프리미티브 (버튼, 모달 등 비즈니스 로직 완전 배제)
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   │
│   ├── apis/                # 🔌 API 타입 및 도메인별 엔드포인트 호출 함수
│   │
│   ├── libs/                # ⚙️ 횡단 관심사(Cross-cutting concerns) 단일 관리 인프라
│   │   ├── http/            # axios client, interceptor 설정
│   │   └── security/        # auth/token store, refresh 처리 로직
│   │
│   ├── utils/               # 🛠️ 도메인에 종속되지 않는 공통 유틸리티
│   │   ├── dateUtils.js     # 날짜 포맷팅 함수 등
│   │   └── helpers.js       # 기타 유틸 함수
│   │
│   ├── assets/              # 📂 아이콘, 배경, 로고 등 정적 리소스
│   │
│   ├── App.jsx              # 🚀 전체 라우팅 및 Provider 설정
│   └── index.js             # React Root Render
│
├── docs/                    # 🔥 컨벤션 및 협업 규칙 문서
├── package.json
└── README.md

```

#### 📌 폴더 구조 설계 철학 (Why this structure?)

1. **얇은 Pages & 두꺼운 Features**: `pages`는 라우팅을 위한 껍데기 역할만 수행하며, 실질적인 비즈니스 로직과 상태 관리, 컴포넌트 조합은 `features` 도메인 내부에 집중합니다.
2. **UI와 비즈니스 로직의 결합 차단**: `components/common`은 어떠한 도메인 지식도 가지지 않는 순수 UI 컴포넌트로 구성하여 전역적인 재사용성을 극대화합니다.
3. **인프라 코드 단일화**: 인증, 네트워크 세팅 등 앱 전체에 걸친 횡단 관심사는 `libs`에서 전담하여 도메인 모듈 간의 강한 결합(의존성)을 방지합니다.
4. **빠른 이슈 트래킹**: 기능 추가 및 버그 발생 시 "어디를 고쳐야 하는지"가 직관적으로 파악되며, 여러 개발자가 동시에 작업하더라도 코드 병합 충돌(Merge Conflict)이 최소화됩니다.
