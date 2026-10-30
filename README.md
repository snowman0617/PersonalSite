# 張瀚文 Han-Wen Chang - 個人專業形象網站

生技研發專案經理 (R&D PM) 與產品經理 (Product Manager) 個人形象與作品集網站。

## 視覺風格：柔和自然風 (Soft Organic & Medical Aesthetics)
- **配色主題**：舒緩米白底色 (`#f8fafc`)、鼠尾草深綠 (`#2d6a4f`)、醫材青藍 (`#1f7a8c`) 與溫潤琥珀金 (`#d97706`)。
- **視覺特色**：大圓角卡片設計 (`rounded-2xl`)、微散光漫射陰影、白毛玻璃導航列、親和且具學術與產業界質感的排版。

## 核心功能與資訊架構亮點
- **資訊階層分明（消除重複敘述）**：
  - **核心理念 (`#about`)**：聚焦跨職能專案治理、法規驅動商業化與 Agentic AI 賦能方法論。
  - **專業矩陣與工具棧 (`#skills`)**：四大職能模組搭配 PM / 法規 / AI / 生醫實戰工具棧 (Toolstack)。
  - **工作歷程時間軸 (`#experience`)**：完整呈現 2022–2026 生醫研發管理實績與 2026/06–2026/09 勞動部 400 小時 Agentic AI 密集實訓。
  - **專案實績與 STAR 深度彈窗 (`#projects`)**：外層卡片呈現精煉成果 Hook，點開 Modal 呈現量化指標、視覺化流程架構圖與 STAR（情境、行動、結果）完整拆解。
- **招募友善體驗 (Recruiter-Friendly UX)**：
  - 支援一鍵 **匯出 / 列印 A4 標準 PDF 履歷**（含專屬 `@media print` 樣式優化）。
  - 導航列 **ScrollSpy 章節自動高亮**。
  - 聯絡表單支援 **雙模發信**（喚起預設郵件軟體 + 專為網頁版 Gmail 設計的一鍵複製排版信件與信箱）。

## 專案架構 (HTML / CSS / JavaScript 獨立模組化)

```text
PersonalSite/
├── index.html               # 語意化 HTML5 核心結構（含 SEO/OG 標籤與 12 大區塊註解）
├── css/
│   └── style.css            # 核心樣式表（CSS 變數、ScrollSpy、視覺化流程圖、列印優化）
├── js/
│   └── main.js              # 前端互動邏輯（ScrollSpy、專案篩選、STAR 架構圖 Modal、雙模表單）
├── images/
│   ├── avatar-profile.svg   # 個人專業形象與生醫 AI 識別向量頭像
│   ├── ncku-logo.svg        # 國立成功大學校徽
│   ├── nutn-logo.svg        # 國立臺南大學校徽
│   └── mol-logo.svg         # 勞動部部徽
└── README.md                # 專案說明文件
```
