# wplace 2click

> **wplace.live에서 `i` 키 한 번으로 현재 마우스 지점을 자동 2회 클릭하는 크롬 확장 프로그램**

## 1. 소개 (Introduction)

이 프로젝트는 `wplace.live`에서 픽셀을 찍는 반복 클릭을 줄이기 위해 개발된 크롬 확장 프로그램입니다.
칸에 마우스를 올리고 `i` 키만 누르면, 직접 클릭하지 않아도 해당 지점이 자동으로 2회 클릭되어 한 칸을 빠르게 칠할 수 있습니다.

**주요 기능**
- **i 키 + 2회 클릭**: 현재 마우스 위치를 정해진 타이밍(클릭 0.1초 → 대기 0.1초 → 클릭 0.1초)으로 자동 실행
- **무(無) UI 자동 작동**: `wplace.live` 도메인이면 자동 실행되며, 작동 중에는 좌측 상단에 빨간색 `wplace 2click running` 표시만 나타납니다

## 2. 기술 스택 (Tech Stack)

- **Platform**: Chrome Extension (Manifest V3)
- **Language**: Vanilla JavaScript (Content Script)
- **API**: DOM Pointer / Mouse Events (합성 이벤트)
- **Dependencies**: 없음 (빌드·설치 과정 불필요)

## 3. 설치 및 실행 (Quick Start)

**요구 사항**: Manifest V3를 지원하는 Chrome 계열 브라우저

1. **설치 (Install)**
   - 주소창에 `chrome://extensions` 입력 후 이동
   - 우측 상단 **개발자 모드(Developer mode)** 켜기
   - **압축해제된 확장 프로그램을 로드(Load unpacked)** → `wplace-2click` 폴더 선택

2. **설정 (Optional)**
   기본값으로 바로 동작합니다. 키나 타이밍을 바꾸려면 `content.js` 상단 상수만 수정합니다.
   ```js
   const TRIGGER_KEY = 'i';   // 트리거 키
   const CLICK_HOLD_MS = 100; // 클릭 유지 시간(ms)
   const GAP_MS = 100;        // 두 클릭 사이 대기(ms)
   ```

3. **실행 (Run)**
   `https://wplace.live/` 접속 → 칠할 칸에 마우스를 올리고 **`i`** 키를 누릅니다.
   (코드 수정 후에는 `chrome://extensions`에서 **새로고침(↻)** 으로 반영)

## 4. 폴더 구조 (Structure)

```text
wplace-2click/
├── manifest.json   # 확장 설정 (Manifest V3, 도메인 매칭)
├── content.js      # 마우스 추적 · i 키 감지 · 2클릭 · 상태 표시
├── icons/          # 아이콘 (logo16/48/128.png + 원본 logo.png)
└── README.md       # 문서
```

## 5. 정보 (Info)

- **License**: MIT
- **참고**: 입력창에 타이핑 중일 때는 동작하지 않습니다.

---

📄 **개인정보 처리방침 (Privacy Policy)**: [privacy-policy.html](privacy-policy.html)