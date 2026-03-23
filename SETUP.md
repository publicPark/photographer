# 프로젝트 설정 가이드

## 1. Sanity CMS 설정

### Sanity 프로젝트 생성

1. [Sanity.io](https://www.sanity.io/)에 가입/로그인
2. 새 프로젝트 생성
3. 프로젝트 이름: `jiyun-portfolio` (원하는 이름)
4. Dataset: `production`

### 환경 변수 설정

`.env.local` 파일을 수정:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz  # 실제 프로젝트 ID로 교체
NEXT_PUBLIC_SANITY_DATASET=production
```

프로젝트 ID는 Sanity 대시보드에서 확인 가능합니다.

### Sanity Studio 실행

```bash
npm run sanity
```

브라우저에서 `http://localhost:3333`으로 자동 이동됩니다.

### 첫 프로젝트 추가하기

1. Sanity Studio에서 "프로젝트 (순서변경)" 클릭
2. "Create" 버튼 클릭
3. 필수 항목 입력:
   - 프로젝트 제목
   - Slug (자동 생성됨, 클릭하여 생성)
   - 대표 이미지 (커버)
   - 프로젝트 이미지들 (여러 장)
   - 프로젝트 날짜
4. 선택 항목:
   - 설명
   - 클라이언트
   - 메인 슬라이더 노출 (Featured 체크박스)
   - 태그
5. "Publish" 버튼으로 저장

## 2. 프론트엔드 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 3. 프로젝트 구조

```
jiyun-new/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 글로벌 레이아웃
│   ├── page.tsx            # 홈페이지
│   ├── projects/           # 프로젝트 상세 페이지
│   └── about/              # About 페이지
├── components/             # React 컴포넌트
├── lib/                    # 유틸리티 함수
│   ├── sanity.ts           # Sanity 클라이언트
│   └── utils.ts            # 헬퍼 함수
├── sanity/                 # Sanity 스키마
│   └── schemas/
│       └── project.ts      # 프로젝트 스키마
├── sanity.config.ts        # Sanity Studio 설정
└── .env.local              # 환경 변수 (비공개)
```

## 4. 빌드 및 배포

### 로컬 빌드 테스트

```bash
npm run build
npm run start
```

### Vercel 배포

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 환경 변수 추가:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
4. 배포 클릭

### Sanity Studio 배포 (선택사항)

```bash
npm run sanity:deploy
```

배포된 Studio URL에서 어디서나 콘텐츠 관리 가능합니다.

## 5. 다음 단계

- [ ] Sanity에 프로젝트 3-5개 추가
- [ ] Featured 프로젝트 설정 (메인 슬라이더용)
- [ ] About 페이지 내용 작성
- [ ] 실제 도메인 연결
