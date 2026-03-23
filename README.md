# Portfolio

포토그래퍼 지윤의 포트폴리오 웹사이트

## 🎯 주요 기능

- ✅ **고속 로딩**: Next.js 14 App Router + ISR로 초고속 로딩
- ✅ **미니멀 UX**: 직관적인 네비게이션과 깔끔한 디자인
- ✅ **풀너비 히어로 슬라이더**: Featured 프로젝트 자동 전환
- ✅ **반응형 그리드**: 모든 기기에서 완벽한 레이아웃
- ✅ **이미지 최적화**: WebP 자동 변환, lazy loading, blur placeholder
- ✅ **쉬운 관리**: Sanity CMS로 드래그 앤 드롭 콘텐츠 관리

## 🛠 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **CMS**: Sanity.io
- **이미지 최적화**: Sanity Image Pipeline
- **슬라이더**: Swiper.js
- **애니메이션**: Framer Motion
- **배포**: Vercel

## 📦 프로젝트 구조

```
jiyun-new/
├── app/
│   ├── layout.tsx           # 글로벌 레이아웃
│   ├── page.tsx             # 홈페이지 (슬라이더 + 그리드)
│   ├── projects/[slug]/     # 프로젝트 상세 페이지
│   ├── about/               # About 페이지
│   └── not-found.tsx        # 404 페이지
├── components/
│   ├── Header.tsx           # 네비게이션
│   ├── Footer.tsx           # 푸터
│   ├── HeroSlider.tsx       # 메인 슬라이더
│   ├── ProjectGrid.tsx      # 프로젝트 그리드
│   ├── ImageGallery.tsx     # 상세 페이지 이미지
│   └── ProjectNav.tsx       # 다음/이전 프로젝트
├── lib/
│   ├── sanity.ts            # Sanity 클라이언트 + API
│   └── utils.ts             # 유틸리티 함수
├── sanity/
│   └── schemas/
│       └── project.ts       # 프로젝트 스키마
├── sanity.config.ts         # Sanity Studio 설정
└── .env.local               # 환경 변수
```

## 🚀 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. Sanity 프로젝트 생성

1. [Sanity.io](https://www.sanity.io/)에 가입/로그인
2. 새 프로젝트 생성
3. 프로젝트 ID 복사

### 3. 환경 변수 설정

`.env.local` 파일 수정:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Sanity Studio 실행

```bash
npm run sanity
```

브라우저에서 `http://localhost:3333` 접속하여 콘텐츠 관리

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 📝 콘텐츠 관리

### 프로젝트 추가하기

1. Sanity Studio (`http://localhost:3333`)에서 "프로젝트 (순서변경)" 클릭
2. "Create" 버튼 클릭
3. 필수 항목 입력:
   - 프로젝트 제목
   - Slug (Generate 버튼 클릭)
   - 대표 이미지 (커버)
   - 프로젝트 이미지들 (여러 장 드래그 앤 드롭)
   - 프로젝트 날짜
4. 선택 항목:
   - 설명
   - 클라이언트
   - 메인 슬라이더 노출 (Featured 체크)
   - 태그
5. "Publish" 버튼으로 저장

### 프로젝트 순서 변경

1. "프로젝트 (순서변경)" 메뉴
2. ≡ 아이콘을 잡고 드래그
3. 자동 저장됨

### Featured 프로젝트 설정

- Featured 체크박스를 선택하면 메인 슬라이더에 표시됩니다
- 최대 5개까지 추천

## 🎨 커스터마이징

### 색상 변경

`app/globals.css`에서 색상 수정:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
}
```

### 폰트 변경

`app/globals.css`에서 폰트 URL 수정

### 연락처 정보 수정

- `components/Header.tsx`: 이메일 주소
- `components/Footer.tsx`: 소셜 미디어 링크
- `app/about/page.tsx`: About 페이지 내용

## 📱 페이지 구성

- **홈 (/)**: 히어로 슬라이더 + 프로젝트 그리드
- **프로젝트 상세 (/projects/[slug])**: 이미지 갤러리 + 다음/이전 네비게이션
- **About (/about)**: 소개 페이지
- **404**: 커스텀 에러 페이지

## 🚢 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 환경 변수 추가:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
3. 배포 클릭

### Sanity Studio 배포

```bash
npm run sanity:deploy
```

배포 후 URL에서 어디서나 콘텐츠 관리 가능

## 🔧 빌드

```bash
npm run build
npm run start
```

## 📄 라이선스

MIT

---

Made with ♥ by Claude Code
