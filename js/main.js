/**
 * ==============================================================================
 * 張瀚文 Han-Wen Chang 個人專業形象網站 - 核心互動邏輯 (JavaScript)
 * ==============================================================================
 * 
 * 模組結構說明：
 * 1. 導航列與行動版選單模組 (Navbar & Mobile Menu Toggle)
 * 2. 視窗滾動監聽與導航列陰影 (Navbar Scroll Effect)
 * 3. 浮動提示元件模組 (Toast Notification System)
 * 4. 剪貼簿一鍵複製模組 (Clipboard Copy with Fallback)
 * 5. 專案分類即時篩選模組 (Project Portfolio Filtering)
 * 6. 專案實績詳細資訊對話盒 (Interactive Project Modal)
 * 7. 聯絡表單轉 Mailto 郵件發送 (Contact Form Mailto Handler)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 初始化滾動與互動監聽
  initNavbarScroll();
  initMobileMenu();
  initModalListeners();
});

/* ==============================================================================
 * 1. 導航列與行動版選單模組 (Navbar & Mobile Menu Toggle)
 * ==============================================================================
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!mobileMenuBtn || !mobileMenu) return;

  // 點擊漢堡按鈕切換展開/收合
  mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // 點擊選單內部錨點連結後自動收合選單
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // 當使用者將螢幕視窗放大回桌機寬度時，自動收合行動選單
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==============================================================================
 * 2. 視窗滾動監聽與導航列陰影 (Navbar Scroll Effect)
 * ==============================================================================
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==============================================================================
 * 3. 浮動提示元件模組 (Toast Notification System)
 * ==============================================================================
 * @param {string} message - 欲顯示之提示訊息文字
 * @param {number} duration - 顯示時間（毫秒，預設 3000ms）
 */
let toastTimeoutId = null;

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  // 清除先前的計時器避免連點時閃爍
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  // 設定提示文字並顯示
  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  // 指定秒數後平滑淡出退回下方
  toastTimeoutId = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
    toastTimeoutId = null;
  }, duration);
}

/* ==============================================================================
 * 4. 剪貼簿一鍵複製模組 (Clipboard Copy with Fallback)
 * ==============================================================================
 * 支援現代 Clipboard API 與舊型 execCommand 降級策略，相容 iframe 與嚴格沙盒環境。
 */
function copyEmail() {
  const email = 'hanwen0617@gmail.com';

  // 優先嘗試現代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email)
      .then(() => {
        showToast('Email 地址已成功複製至剪貼簿！');
      })
      .catch(() => {
        fallbackCopyText(email);
      });
  } else {
    // 降級使用 textarea + execCommand
    fallbackCopyText(email);
  }
}

/**
 * 降級剪貼簿複製常式
 * @param {string} text - 欲複製之文字內容
 */
function fallbackCopyText(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.left = '-9999px';
  tempInput.style.top = '0';
  document.body.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast('Email 地址已成功複製至剪貼簿！');
    } else {
      showToast(`Email: ${text}`);
    }
  } catch (err) {
    showToast(`Email: ${text}`);
  } finally {
    document.body.removeChild(tempInput);
  }
}

/* ==============================================================================
 * 5. 專案分類即時篩選模組 (Project Portfolio Filtering)
 * ==============================================================================
 * @param {string} category - 篩選類別 ('all', 'sbir', 'ai', 'publication')
 */
function filterProjects(category) {
  // 1. 切換按鈕的啟用樣式 (Active State)
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    const btnCategory = btn.getAttribute('data-filter');
    if (btnCategory === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 2. 顯示或隱藏對應類別之專案卡片
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.classList.remove('hidden');
      // 重新觸發淡入動畫
      card.style.animation = 'none';
      card.offsetHeight; // 強制重繪 (trigger reflow)
      card.style.animation = '';
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ==============================================================================
 * 6. 專案實績詳細資訊對話盒 (Interactive Project Modal)
 * ==============================================================================
 */

// 專案彈窗之結構化資料庫
const modalDetails = {
  'sbir-winnoz': {
    title: '經濟部 SBIR 恆溫核酸檢測儀開發計畫',
    badge: '醫療器材開發 · EN 13612 · 體外診斷 (IVD)',
    badgeColor: 'badge-teal',
    date: '2024/12 – 2025/08',
    role: '計畫聯絡人 / 核心研發成員',
    points: [
      '<strong>時程與風險控管：</strong>開發期間遭遇關鍵零組件停產 (EOL) 與 PCB 主電路改版危機，迅速協調電子、機構與光學跨部門動態調整甘特圖排程，確保計畫零延誤順利達成。',
      '<strong>光學規格確立：</strong>協助確認「單光源雙通道」光學架構，精準平衡製造成本與量測線性度，實測驗證判定係數 R² > 0.99，確保微量螢光訊號的高信噪比。',
      '<strong>國際法規確效：</strong>依循體外診斷醫療器材標準 EN 13612 規範完成系統確效驗證，100% 達成所有查核點驗收，證實具備高商用化潛力。'
    ]
  },
  'sbir-zesheng': {
    title: '經濟部 SBIR miRNA 癌症診斷套組開發計畫',
    badge: '計畫主持人 · 肝癌/胰臟癌早期偵測 · 全額補助',
    badgeColor: 'badge-sage',
    date: '2022/11 – 2023/06',
    role: '計畫主持人 / 核心研發工程師',
    points: [
      '<strong>臨危受命重整局勢：</strong>接手時專案進度嚴重滯後，迅速盤點人機料資源，重新建立 RT-qPCR 及檢體萃取標準 SOP，逆轉困局並獲經濟部審查委員高度肯定，取得全額經費補助。',
      '<strong>跨界臨床驗證：</strong>統籌輔仁大學、台北榮總與聖保祿醫院多中心產學醫合作，順利通過 IRB 倫理審查並完成 70 餘例臨床檢體分析。',
      '<strong>突破技術瓶頸：</strong>針對臨床檢體數據波動問題，主動提出「新鮮檢體」品質規範修正策略，解決專一性不足瓶頸，並成功將適應症延伸至胰臟癌預後監測。'
    ]
  },
  'ai-workflow': {
    title: '週報自動備份及防呆檢查系統',
    badge: 'Google Apps Script · Gmail/Drive API · LLM Prompting',
    badgeColor: 'badge-teal',
    date: '2025/02 – 2025/03',
    role: '全流程架構設計與 GAS 實作',
    points: [
      '<strong>AI 協作快速開發：</strong>在非傳統軟體工程背景下，透過與 ChatGPT 高階 Prompting 協同撰寫 Google Apps Script 腳本，快速串接 Workspace API。',
      '<strong>智慧轉存工作流：</strong>針對團隊同仁寄送的週報信件進行自動化標籤過濾與附件抽取，精準將檔案轉存至雲端硬碟指定樹狀目錄，徹底取代每週人工作業。',
      '<strong>主動式稽核防呆：</strong>加入「檔案更新時間戳記」自動校驗機制，若有未準時更新或未歸檔狀況即時警示，節省主管每週 30 分鐘人工逐項檢查時間，實現零失誤管理。'
    ]
  },
  'health-food': {
    title: '健康食品查驗登記 (衛部健食字第 A00445 號)',
    badge: '衛福部健字號 · 法規事務 (RA) · 產品合規',
    badgeColor: 'badge-warm',
    date: '2022/04 – 2024/04',
    role: '主導法規論證與申覆答辯',
    points: [
      '<strong>完整技術卷宗整備：</strong>統籌包含安全毒理試驗、功效成分定性定量分析、安定性試驗等數百頁查驗登記申報資料。',
      '<strong>嚴謹審查答辯：</strong>面對衛福部審查委員多項技術質疑，運用深厚的生物化學機轉論證逐項申覆釋疑，順利通關。',
      '<strong>市場價值賦能：</strong>成功取得國家級健康食品小綠人標章（衛部健食字第 A00445 號），大幅提升產品在保健醫藥通路的定價與競爭優勢。'
    ]
  }
};

/**
 * 開啟專案詳細對話盒
 * @param {string} key - 對應 modalDetails 的鍵名
 */
function openModal(key) {
  const data = modalDetails[key];
  if (!data) return;

  const content = document.getElementById('modalContent');
  const modal = document.getElementById('projectModal');
  if (!content || !modal) return;

  // 組合重點條目 HTML
  const pointsHtml = data.points
    .map(p => `
      <li class="flex items-start gap-3 py-1">
        <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
          <i class="fa-solid fa-check"></i>
        </span>
        <span class="text-slate-700 leading-relaxed text-sm">${p}</span>
      </li>
    `)
    .join('');

  // 動態插入結構化內容
  content.innerHTML = `
    <div class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${data.badgeColor || 'badge-sage'}">
      ${data.badge}
    </div>
    <h3 class="text-2xl font-bold text-slate-800 mb-1 leading-snug">${data.title}</h3>
    <div class="text-xs font-medium text-slate-500 mb-5 flex items-center gap-2">
      <i class="fa-regular fa-calendar"></i> ${data.date} 
      <span class="text-slate-300">|</span> 
      <i class="fa-solid fa-user-tag text-emerald-600"></i> ${data.role}
    </div>
    <div class="text-sm text-slate-700 leading-relaxed border-t border-slate-200/80 pt-5">
      <h5 class="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
        <i class="fa-solid fa-list-check text-emerald-600"></i> 專案執行重點與實績成果：
      </h5>
      <ul class="space-y-2.5">${pointsHtml}</ul>
    </div>
  `;

  // 顯示彈出視窗並鎖定背景滾動
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

/**
 * 關閉專案詳細對話盒
 */
function closeModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

/**
 * 初始化彈窗快捷鍵與背景遮罩點擊關閉事件
 */
function initModalListeners() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  // 1. ESC 鍵關閉
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // 2. 點擊外部半透明背景遮罩時自動關閉
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/* ==============================================================================
 * 7. 聯絡表單轉 Mailto 郵件發送 (Contact Form Mailto Handler)
 * ==============================================================================
 * @param {Event} e - 表單提交事件物件
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('senderName');
  const subjectInput = document.getElementById('senderSubject');
  const messageInput = document.getElementById('senderMessage');

  if (!nameInput || !subjectInput || !messageInput) return;

  const name = nameInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !subject || !message) {
    showToast('請完整填寫所有欄位，謝謝您！');
    return;
  }

  // 編碼 Mailto 連結並喚起預設郵件客戶端
  const mailSubject = encodeURIComponent(`[個人網站來信] ${subject}`);
  const mailBody = encodeURIComponent(
    `您好，張瀚文先生：\n\n我是：${name}\n\n洽談內容：\n${message}\n\n------\n此信件由個人網站聯絡表單自動生成`
  );
  const mailtoLink = `mailto:hanwen0617@gmail.com?subject=${mailSubject}&body=${mailBody}`;

  window.location.href = mailtoLink;
  showToast('正在為您開啟電子郵件軟體...');
}

