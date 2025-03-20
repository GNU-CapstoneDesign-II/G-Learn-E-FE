
## 1. 프로젝트 시작하기 전에
### 필요한 프로그램 설치
이 프로젝트를 실행하려면 먼저 **다음 프로그램이 설치되어 있어야 합니다.**  
✔ **Node.js** 설치 확인  
```sh
node -v
```

✔ **Git 설치 확인**
```sh
git --version
```

---

## 2. 프로젝트 다운로드 및 실행
### 1) 프로젝트 다운로드

```sh
git clone https://github.com/GNU-CapstoneDesign-II/G-Learn-E-FE.git
```

### 2) 프로젝트 폴더로 이동
```sh
cd 저장소명
```

### 3) 필수 패키지 설치
```sh
npm install
```

### 4) 개발 서버 실행
```sh
npm run dev
```
실행 후 **브라우저에서 `http://localhost:5173`**를 열면 React 앱을 확인할 수 있습니다.

---

## 3. 프로젝트 구조 (폴더 설명)
```
📂 프로젝트 루트
├── 📂 node_modules    # 설치된 라이브러리
├── 📂 public          # 정적 파일 (favicon, index.html 등)
├── 📂 src             # 핵심 코드 폴더
│   ├── 📂 components  # 재사용 가능한 컴포넌트
│   ├── App.jsx        # 메인 컴포넌트
│   ├── main.jsx       # React 진입점
│   ├── index.css      # 전역 스타일
├── .gitignore         # Git에서 제외할 파일 목록
├── package.json       # 프로젝트 설정 및 의존성 정보
├── README.md          # 프로젝트 설명서
└── vite.config.js     # Vite 설정 파일
```

---

## 4. Vite 명령어 정리
```sh
npm install      # 패키지 설치
npm update       # 패키지 업데이트
npm run dev      # 개발 서버 실행
npm run build    # 배포용 빌드 생성
npm run preview  # 빌드된 결과 미리보기
```
