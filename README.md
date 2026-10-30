# 張瀚文 Han-Wen Chang - 個人專業形象網站

生技研發專案經理 (R&D PM) 與產品經理 (Product Manager) 個人形象與作品集網站。

## 線上預覽與專案連結 (Live Demo)
- **GitHub Pages 線上網站**：https://snowman0617.github.io/PersonalSite/
- **GitHub 專案倉庫**：https://github.com/snowman0617/PersonalSite

## 視覺風格：柔和自然風 (Soft Organic & Medical Aesthetics)
- **配色主題**：舒緩米白底色 (`#f8fafc`)、鼠尾草深綠 (`#2d6a4f`)、醫材青藍 (`#1f7a8c`) 與溫潤琥珀金 (`#d97706`)。
- **視覺特色**：大圓角卡片設計 (`rounded-2xl`)、微散光漫射陰影、白毛玻璃導航列、親和且具學術與產業界質感的排版。

## 核心功能與資訊架構亮點
- **資訊階層分明（消除重複敘述）**：
  - **核心理念 (`#about`)**：聚焦跨職能專案治理、法規驅動商業化與 Agentic AI 賦能方法論。
  - **專業矩陣與工具棧 (`#skills`)**：四大職能模組搭配 PM / 法規 / AI / 生醫實戰工具棧 (Toolstack)。
  - **工作歷程時間軸 (`#experience`)**：完整呈現 2022–2026 生醫研發管理實績與 2026/06–2026/09 勞動部 400 小時 Agentic AI 密集實訓。
  - **專案實績與 STAR 深度彈窗 (`#projects`)**：外層卡片呈現精煉成果 Hook，點開 Modal 呈現量化指標、視覺化流程架構圖與 STAR（情境、行動、結果）完整拆解。
- **招募友善與隱私保護體驗 (Recruiter-Friendly & Privacy-First UX)**：
  - **索取完整 PDF 履歷彈窗**：點擊「索取 PDF 履歷」可填寫接收信箱，系統即自動發送通知信至本人信箱並顯示感謝回覆訊息，兼顧招募便利性與個人資料隱私。
  - **導航列 ScrollSpy 章節自動高亮**。
  - **網頁直寄聯絡表單**：支援在網頁直接輸入回信 Email 與洽談內容寄達本人信箱（免跳轉郵件軟體，並保留一鍵複製排版信件備援）。

## 技術棧與前端工程實踐 (Tech Stack)
- **HTML5 語意化結構與 SEO**：採用標準語意標籤 (`<header>`, `<main>`, `<section>`, `<footer>`)、Open Graph (OG) 社群分享預覽標籤、內嵌 SVG Favicon 與無障礙輔助屬性 (`aria-label`, `aria-expanded`, `role="dialog"`)。
- **RWD 響應式切版與樣式系統 (CSS3 & Tailwind CSS)**：
  - 結合 Tailwind CSS 響應式斷點系統（支援手機、平板與桌機多尺寸檢視，含行動版漢堡選單）。
  - 獨立模組化 `css/style.css`：定義 CSS Custom Properties (Design Tokens)、卡片懸浮微交互、自定義滾動條與 `@media print` A4 履歷列印專屬樣式。
- **原生 JavaScript 模組化互動 (Vanilla JS ES6+)**：
  - 運用 `IntersectionObserver` API 實作低耗能導航列 ScrollSpy。
  - 實作專案無刷新分類篩選器與動態注入之 STAR 架構圖對話盒 (Modal)。
  - 實作 Clipboard API 一鍵複製（含傳統 `textarea` 降級備援）與非阻塞式 Toast 浮動通知。
- **字體與圖標資源**：Google Fonts (`Inter` & `Noto Sans TC`)、Font Awesome 6、純向量 SVG 機構徽章與個人視覺識別。

## 專案架構 (HTML / CSS / JavaScript 獨立模組化)

```text
PersonalSite/
├── index.html               # 語意化 HTML5 核心結構（含 SEO/OG 標籤與 12 大區塊註解）
├── css/
│   └── style.css            # 核心樣式表（CSS 變數、ScrollSpy、視覺化流程圖、列印優化）
├── js/
│   └── main.js              # 前端互動邏輯（ScrollSpy、專案篩選、STAR 架構圖 Modal、雙模表單）
├── images/
│   ├── profile-photo.jpg    # 個人形象照（已降維壓縮與去除 EXIF 保護隱私）
│   ├── avatar-profile.svg   # 社群分享預覽 (OG Image) 品牌識別向量圖
│   ├── ncku-logo.svg        # 國立成功大學校徽
│   ├── nutn-logo.svg        # 國立臺南大學校徽
│   └── mol-logo.svg         # 勞動部部徽
└── README.md                # 專案說明文件
```

## 聯絡資訊 (Contact)
- **姓名**：張瀚文 (Han-Wen Chang)
- **Email**：[hanwenchang.tw@gmail.com](mailto:hanwenchang.tw@gmail.com)
- **GitHub**：[https://github.com/snowman0617](https://github.com/snowman0617)
