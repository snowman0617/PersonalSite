/**
 * ==============================================================================
 * 張瀚文 Han-Wen Chang 個人專業形象網站 - 核心互動邏輯 (JavaScript)
 * ==============================================================================
 * 
 * 模組結構說明：
 * 1. 導航列與行動版選單模組 (Navbar & Mobile Menu Toggle)
 * 2. 視窗滾動監聽與章節 ScrollSpy 高亮 (Navbar Scroll & ScrollSpy)
 * 3. 浮動提示元件模組 (Toast Notification System)
 * 4. 剪貼簿一鍵複製與 PDF 履歷列印模組 (Clipboard Copy & Print Resume)
 * 5. 專案分類即時篩選模組 (Project Portfolio Filtering)
 * 6. 專案實績 STAR 深度對話盒與視覺化架構圖 (Interactive Project Modal)
 * 7. 聯絡表單雙模處理：Mailto 喚起與一鍵複製信件 (Contact Form Handler)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initScrollSpy();
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
 * 2. 視窗滾動監聽與章節 ScrollSpy 高亮 (Navbar Scroll & ScrollSpy)
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
  }, { passive: true });
}

/**
 * 透過 IntersectionObserver 偵測目前閱讀區塊並高亮對應導航按鈕
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-nav]');
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('data-nav') === currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0
    }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ==============================================================================
 * 3. 浮動提示元件模組 (Toast Notification System)
 * ==============================================================================
 * @param {string} message - 欲顯示之提示訊息文字
 * @param {number} duration - 顯示時間（毫秒，預設 3200ms）
 */
let toastTimeoutId = null;

function showToast(message, duration = 3200) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  toastTimeoutId = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
    toastTimeoutId = null;
  }, duration);
}

/* ==============================================================================
 * 4. 剪貼簿一鍵複製與 PDF 履歷列印模組 (Clipboard Copy & Print Resume)
 * ==============================================================================
 */
function copyEmail() {
  const email = 'hanwen0617@gmail.com';
  copyTextToClipboard(email, 'Email 地址 (hanwen0617@gmail.com) 已複製至剪貼簿！');
}

/**
 * 通用剪貼簿複製常式（含安全環境 API 與傳統 textarea 降級備援）
 * @param {string} text - 欲複製文字
 * @param {string} successMsg - 成功時顯示之 Toast 訊息
 */
function copyTextToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(successMsg);
      })
      .catch(() => {
        fallbackCopyText(text, successMsg);
      });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
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
      showToast(successMsg);
    } else {
      showToast(`請手動複製：${text}`);
    }
  } catch (err) {
    showToast(`請手動複製：${text}`);
  } finally {
    document.body.removeChild(tempInput);
  }
}

/**
 * 觸發瀏覽器列印 / 另存為標準 A4 PDF 履歷
 */
function printResume() {
  // 確保列印前展開所有專案卡片
  filterProjects('all');
  showToast('正在啟動列印對話框，可選擇「另存為 PDF」匯出完整履歷');
  setTimeout(() => {
    window.print();
  }, 250);
}

/* ==============================================================================
 * 5. 專案分類即時篩選模組 (Project Portfolio Filtering)
 * ==============================================================================
 * @param {string} category - 篩選類別 ('all', 'sbir', 'ai', 'publication')
 */
function filterProjects(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    const btnCategory = btn.getAttribute('data-filter');
    if (btnCategory === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      card.offsetHeight; // trigger reflow
      card.style.animation = '';
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ==============================================================================
 * 6. 專案實績 STAR 深度對話盒與視覺化架構圖 (Interactive Project Modal)
 * ==============================================================================
 * 與外層卡片做出深度區隔：提供量化指標晶片、視覺化流程圖與 STAR (背景/行動/成果) 完整解析
 */
const modalDetails = {
  'sbir-winnoz': {
    title: '經濟部 SBIR 恆溫核酸檢測儀開發計畫',
    badge: '醫療器材開發 · EN 13612 確效 · 體外診斷 (IVD)',
    badgeColor: 'badge-teal',
    date: '2024/12 – 2025/08',
    role: '計畫聯絡人 / 核心研發成員（伊勒伯科技 Winnoz）',
    metrics: [
      { label: '光學線性度確效', value: 'R² > 0.99' },
      { label: '查核點達成率', value: '100% 如期驗收' },
      { label: '商業模式轉型', value: '儀器 + 專屬試劑' }
    ],
    flowTitle: '跨部門危機應變與 EN 13612 系統確效流程',
    flowSteps: [
      { icon: 'fa-triangle-exclamation', step: '1. 供應鏈與硬體危機', desc: '關鍵零組件停產 (EOL) 與 PCB 電路改版衝擊原定時程' },
      { icon: 'fa-sliders', step: '2. 跨部門敏捷重排程', desc: '協調光學、電子、機構重新拆解關鍵路徑與替代料件驗證' },
      { icon: 'fa-eye', step: '3. 單光源雙通道確立', desc: '平衡 BOM 製造成本與微量螢光靈敏度，實測 R² > 0.99' },
      { icon: 'fa-file-circle-check', step: '4. EN 13612 法規確效', desc: '完成體外診斷儀器性能確效與 ISO 14971 風險報告修補' }
    ],
    star: {
      situation: '在開發新一代小型化恆溫核酸檢測儀期間，專案同時面臨核心光學與電子零組件臨時停產 (EOL) 以及 PCB 主機板改版的雙重排程衝擊，且須在嚴格的經濟部 SBIR 期中與期末查核期限內完成法規級確效。',
      action: [
        '<strong>跨部門關鍵路徑重組：</strong>擔任計畫聯絡人，立即召集電子、機構與生醫試劑團隊盤點替代料件，將原本串行的測試改為「光學夾具先行驗證 + PCB 改版並行」之敏捷排程。',
        '<strong>光學規格與成本最佳化：</strong>主導確立「單光源雙通道」光學檢測架構，在受限體積與成本下解決通道串擾 (Crosstalk) 問題，建立標準螢光校正曲線。',
        '<strong>商業與法規雙軌佈局：</strong>同步撰寫國際三大潛在市場之競品法規壁壘評估報告，向管理層提出由「單次硬體銷售」轉型為「封閉式儀器＋高毛利專用試劑」之商業模式建議。'
      ],
      result: '成功驗證雙通道光學線性度達 R² > 0.99，全面符合歐盟 EN 13612 體外診斷醫療器材性能評估規範，100% 如期通過經濟部所有查核點並獲補助款核撥。'
    }
  },
  'sbir-zesheng': {
    title: '經濟部 SBIR miRNA 癌症診斷套組開發計畫',
    badge: '計畫主持人 · 肝癌/胰臟癌早期偵測 · 產學醫三方合作',
    badgeColor: 'badge-sage',
    date: '2022/11 – 2023/06',
    role: '計畫主持人 / 核心研發工程師（澤生生技）',
    metrics: [
      { label: '多中心臨床檢體', value: '70+ 例實測' },
      { label: '合作醫學與學研機構', value: '3 家 (北榮/聖保祿/輔大)' },
      { label: '計畫審查結果', value: '全額補助通過' }
    ],
    flowTitle: '臨床檢體品質優化與 RT-qPCR 試劑開發管線',
    flowSteps: [
      { icon: 'fa-fire-extinguisher', step: '1. 臨危受命接手', desc: '接手嚴重落後專案，盤點人機料並重設 WBS 查核節點' },
      { icon: 'fa-hospital-user', step: '2. 產學醫 IRB 推進', desc: '串聯輔大、北榮與聖保祿醫院，推進臨床收案與檢體調度' },
      { icon: 'fa-vial-circle-check', step: '3. 新鮮檢體對策', desc: '發現凍存檢體降解導致專一性波動，制定新鮮血液前處理 SOP' },
      { icon: 'fa-chart-column', step: '4. 適應症擴展結案', desc: '完成 70+ 例肝癌驗證並延伸至胰臟癌預後監控，獲全額補助' }
    ],
    star: {
      situation: '原專案進度嚴重滯後且面臨實驗數據再現性 (Reproducibility) 不佳、專一性不足的技術瓶頸，距離經濟部結案審查時間緊迫，亟需重整研發與臨床合作步調。',
      action: [
        '<strong>全面標準化實驗平台：</strong>臨危受命擔任計畫主持人，重新建立從血清/血漿 RNA 萃取、cDNA 合成至 RT-qPCR 定量分析之標準作業程序 (SOP) 與內部品管 (QC) 允收標準。',
        '<strong>突破檢體專一性瓶頸：</strong>深入排查 70 餘例臨床數據波動根因，發現長期冷凍保存造成特定微量 miRNA 降解與背景干擾；果斷向合作醫院提出「新鮮檢體即時處理」修正策略。',
        '<strong>跨機構臨床協作：</strong>統籌輔仁大學、台北榮民總醫院與聖保祿醫院三方資源，確保 IRB 人體試驗倫理合規與檢體收案進度。'
      ],
      result: '「新鮮檢體」策略大幅提升試劑靈敏度與專一性，不僅如期逆轉落後局勢、獲得經濟部審查委員高度肯定並取得全額補助，更成功將生物標記應用延伸至胰臟癌預後監測。'
    }
  },
  'agentic-ai-biomed': {
    title: '生醫法規與臨床數據 Agentic AI 智慧分析管線',
    badge: '勞動部 400hr 專班實作 · Python & Pandas · Agentic AI',
    badgeColor: 'badge-teal',
    date: '2026/06 – 2026/09',
    role: 'Python 資料工程與 AI 代理流程設計',
    metrics: [
      { label: '專業實訓時數', value: '400 小時全職' },
      { label: '核心技術棧', value: 'Python / Pandas / ML' },
      { label: '應用場景', value: '生醫數據與法規檢索' }
    ],
    flowTitle: 'Agentic AI 多代理檢索與數據分析系統架構',
    flowSteps: [
      { icon: 'fa-database', step: '1. 多源資料擷取', desc: '收集生醫實驗原始 CSV、PubMed 文獻與醫材法規指引文件' },
      { icon: 'fa-filter', step: '2. Pandas 數據清洗', desc: '自動化處理缺失值、異常值篩檢、標準化轉換與特徵工程' },
      { icon: 'fa-brain', step: '3. 統計 ML 與 RAG 代理', desc: '結合統計機器學習模型與 LLM 檢索代理進行交叉比對' },
      { icon: 'fa-file-lines', step: '4. 結構化決策報告', desc: '自動生成法規合規差異表、趨勢圖表與專案風險摘要' }
    ],
    star: {
      situation: '在生醫研發與醫材 PM 實務中，研發人員與 PM 經常耗費大量時間於「跨國醫材法規條文比對」、「競品專利與文獻篩選」以及「重複性的實驗數據清洗與統計檢定」。',
      action: [
        '<strong>Python & Pandas 資料前處理管線：</strong>於 2026/06 至 2026/09 勞動部 400 小時專班受訓期間，運用 Python 與 Pandas 建立模組化數據處理腳本，自動完成實驗數據格式正規化、離群值偵測與敘述統計。',
        '<strong>統計機器學習模型驗證：</strong>應用監督式與非監督式機器學習邏輯，針對多維度生物標記與特徵數據進行分類評估與交叉驗證。',
        '<strong>Agentic AI 工作流設計：</strong>導入任務拆解型 AI Agent 架構（結合系統化 Prompt Engineering 與知識檢索邏輯），讓 AI 代理能針對特定醫療器材法規（如 ISO 13485 / FDA 510(k) 公開摘要）進行結構化欄位抽取與自動摘要。'
      ],
      result: '成功將過去需耗時數天的人工文獻盤點與數據整理流程縮短至數分鐘內完成，展現兼具「生醫領域知識 (Domain Know-how)」與「現代 AI 工程實作力」的跨界產品經理優勢。'
    }
  },
  'ai-workflow': {
    title: '週報自動備份及防呆稽核系統',
    badge: 'Google Apps Script · Gmail/Drive API · 數位工作流',
    badgeColor: 'badge-teal',
    date: '2025/02 – 2025/03',
    role: '獨立架構設計與 GAS 腳本開發（伊勒伯科技）',
    metrics: [
      { label: '每週節省主管工時', value: '30+ 分鐘/週' },
      { label: '人工漏交與歸檔失誤', value: '0 失誤' },
      { label: '雲端部署成本', value: '$0 (原生 API)' }
    ],
    flowTitle: 'Google Workspace 自動化歸檔與時間戳記防呆架構',
    flowSteps: [
      { icon: 'fa-envelope-open-text', step: '1. Gmail 觸發監聽', desc: '定時掃描特定主旨與標籤之團隊週報信件與附件' },
      { icon: 'fa-code', step: '2. GAS 規則解析', desc: '自動辨識寄件者部門、日期區間與檔案格式正規化命名' },
      { icon: 'fa-folder-tree', step: '3. Drive 樹狀歸檔', desc: '依專案與月份動態寫入 Google Drive 指定權限資料夾' },
      { icon: 'fa-bell', step: '4. 時間戳記防呆稽核', desc: '比對檔案最後修改時間，針對未更新或逾時項目自動預警' }
    ],
    star: {
      situation: '研發團隊每週需繳交專案進度週報，過去仰賴同仁手動上傳雲端硬碟、主管每週耗時約 30 分鐘逐一點開資料夾檢查「誰沒交、誰傳錯格式、誰覆蓋到舊檔」，行政摩擦成本極高。',
      action: [
        '<strong>痛點定義與零成本架構選型：</strong>考量公司既有 Google Workspace 環境，決定不採購外部付費 SaaS，改以原生 Google Apps Script (GAS) 進行無伺服器 (Serverless) 自動化開發。',
        '<strong>AI 協作敏捷開發：</strong>透過結構化 Prompt Engineering 與 LLM 協同編寫 JavaScript / GAS 程式碼，串接 GmailApp 與 DriveApp API，實作正則表達式信件篩選與動態目錄掛載。',
        '<strong>時間戳記防呆機制 (Poka-Yoke)：</strong>針對「同仁誤傳上週舊檔」之常見疏失，設計檔案 Metadata 時間戳記比對邏輯，自動標記異常檔案並產出稽核摘要。'
      ],
      result: '系統上線後 100% 取代人工收集與逐項檢查流程，每週為管理層省下 30 分鐘以上機械式核對工時，達成研發文件歸檔零遺漏。'
    }
  },
  'plos-genetics': {
    title: 'PLoS Genetics 國際頂尖期刊論文發表',
    badge: 'SCI 期刊 (IF: 6.02) · 分子生物學 · DNA 複製與修復機轉',
    badgeColor: 'badge-sage',
    date: '2018/09 – 2021/08',
    role: '國立成功大學生命科學所 碩士研究（共同作者）',
    metrics: [
      { label: '期刊影響力指數', value: 'IF 6.020' },
      { label: '領域排名級別', value: 'Genetics 頂尖期刊' },
      { label: '關鍵實驗技術', value: 'DNA Fiber Assay' }
    ],
    flowTitle: 'PARP1 與 DNA 轉位酶調控複製壓力之分子機制驗證',
    flowSteps: [
      { icon: 'fa-dna', step: '1. 科學假說建立', desc: '探究 PARP1 在受損 DNA 複製叉 (Replication Fork) 之調控角色' },
      { icon: 'fa-microscope', step: '2. 單分子 DNA Fiber', desc: '以雙色螢光核苷酸標定技術，在顯微鏡下量測單一 DNA 複製軌跡' },
      { icon: 'fa-vials', step: '3. 基因剔除與回補驗證', desc: '結合 CRISPR/Cas9、siRNA 與 Western Blot 驗證 HLTF/SHPRH 交互作用' },
      { icon: 'fa-globe', step: '4. 同儕審查與發表', desc: '通過嚴格國際同儕審查，正式刊登於 PLoS Genetics' }
    ],
    star: {
      situation: '基因體在遭受內外源損傷（如化療藥物或紫外線）時會產生 DNA 複製壓力。當時學界對於 PARP1 蛋白如何與酵母菌 Rad5 同源之人類 DNA 轉位酶（HLTF 與 SHPRH）協同減緩複製叉推進並啟動修復，尚缺乏直接的分子動力學證據。',
      action: [
        '<strong>高難度單分子實驗操作：</strong>執行極具挑戰性的單分子 DNA 纖維分析術 (DNA Fiber Assay)，精準量化不同基因表現背景下 DNA 複製叉的延伸速率與逆轉現象。',
        '<strong>多維度分子生物驗證：</strong>搭配免疫共沉澱 (Co-IP)、Western Blotting、細胞存活率分析與生物統計檢定，建構完整的分子途徑證據鏈。'
      ],
      result: '研究成果發表於遺傳學領域權威期刊《PLoS Genetics》（論文題目："PARP1 recruits DNA translocases to restrain DNA replication and facilitate DNA repair"），奠定深厚的科學實驗設計、數據嚴謹度與抗壓解決問題能力。'
    },
    externalLink: {
      url: 'https://doi.org/10.1371/journal.pgen.1008596',
      text: '前往 PLoS Genetics 檢視論文全文 (DOI: 10.1371/journal.pgen.1008596)'
    }
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

  // 1. 組合頂部量化指標晶片 HTML
  const metricsHtml = (data.metrics || [])
    .map(m => `
      <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
        <div class="text-base sm:text-lg font-extrabold text-emerald-700">${m.value}</div>
        <div class="text-[11px] text-slate-500 font-medium mt-0.5">${m.label}</div>
      </div>
    `)
    .join('');

  // 2. 組合視覺化架構/流程圖 HTML
  const flowStepsHtml = (data.flowSteps || [])
    .map((stepObj, idx, arr) => `
      <div class="flow-step-card flex-1 relative">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
          <i class="fa-solid ${stepObj.icon} text-emerald-600"></i>
          <span>${stepObj.step}</span>
        </div>
        <p class="text-[11px] text-slate-600 leading-snug">${stepObj.desc}</p>
        ${idx < arr.length - 1 ? '<div class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 items-center justify-center text-[10px] shadow-sm"><i class="fa-solid fa-chevron-right"></i></div>' : ''}
      </div>
    `)
    .join('');

  // 3. 組合 STAR 行動條目 HTML
  const actionsHtml = (data.star?.action || [])
    .map(act => `
      <li class="flex items-start gap-2.5">
        <i class="fa-solid fa-check text-emerald-600 text-xs mt-1.5 flex-shrink-0"></i>
        <span class="text-slate-700 text-sm leading-relaxed">${act}</span>
      </li>
    `)
    .join('');

  // 4. 外部連結按鈕 (若有)
  const externalLinkHtml = data.externalLink
    ? `
      <div class="mt-5 pt-4 border-t border-slate-100">
        <a href="${data.externalLink.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> ${data.externalLink.text}
        </a>
      </div>
    `
    : '';

  // 動態注入結構化內容
  content.innerHTML = `
    <div class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${data.badgeColor || 'badge-sage'}">
      ${data.badge}
    </div>
    <h3 id="modalTitle" class="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5 leading-snug">${data.title}</h3>
    <div class="text-xs font-medium text-slate-500 mb-5 flex flex-wrap items-center gap-2">
      <span><i class="fa-regular fa-calendar mr-1"></i>${data.date}</span>
      <span class="text-slate-300">|</span>
      <span><i class="fa-solid fa-user-tag text-emerald-600 mr-1"></i>${data.role}</span>
    </div>

    <!-- 關鍵量化指標列 -->
    <div class="grid grid-cols-3 gap-2.5 mb-5">
      ${metricsHtml}
    </div>

    <!-- 視覺化流程與系統架構圖 -->
    <div class="flow-diagram-box mb-6">
      <div class="text-xs font-bold text-emerald-900 mb-2.5 flex items-center gap-1.5">
        <i class="fa-solid fa-sitemap text-emerald-700"></i> ${data.flowTitle}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        ${flowStepsHtml}
      </div>
    </div>

    <!-- STAR 深度實績拆解 -->
    <div class="space-y-4 text-sm">
      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
        <div class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">S & T</span> 背景與核心挑戰 (Situation & Task)
        </div>
        <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">${data.star.situation}</p>
      </div>

      <div>
        <div class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">Action</span> 關鍵行動與決策方案
        </div>
        <ul class="space-y-2 pl-1">${actionsHtml}</ul>
      </div>

      <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
        <div class="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px]">Result</span> 最終量化成果與商業價值
        </div>
        <p class="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">${data.star.result}</p>
      </div>
    </div>

    ${externalLinkHtml}
  `;

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

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/* ==============================================================================
 * 7. 聯絡表單雙模處理：Mailto 喚起與一鍵複製信件 (Contact Form Handler)
 * ==============================================================================
 */
function getContactFormValues() {
  const nameInput = document.getElementById('senderName');
  const subjectInput = document.getElementById('senderSubject');
  const messageInput = document.getElementById('senderMessage');

  if (!nameInput || !subjectInput || !messageInput) return null;

  return {
    name: nameInput.value.trim(),
    subject: subjectInput.value.trim(),
    message: messageInput.value.trim()
  };
}

/**
 * 表單提交：喚起預設郵件軟體，並同步將內容複製到剪貼簿作為防呆備援
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const values = getContactFormValues();
  if (!values || !values.name || !values.subject || !values.message) {
    showToast('請完整填寫姓名、主旨與訊息內容，謝謝您！');
    return;
  }

  const mailSubject = encodeURIComponent(`[個人網站來信] ${values.subject}`);
  const mailBody = encodeURIComponent(
    `您好，張瀚文先生：\n\n我是：${values.name}\n\n洽談內容：\n${values.message}\n\n------\n此信件由個人網站聯絡表單自動生成`
  );
  const mailtoLink = `mailto:hanwen0617@gmail.com?subject=${mailSubject}&body=${mailBody}`;

  window.location.href = mailtoLink;
  showToast('正在喚起郵件軟體...（若使用網頁版信箱，可點選右側「複製信件內容」）');
}

/**
 * 專為使用網頁版 Gmail / 無預設郵件軟體之 HR 設計：一鍵複製排好版的信件與收件信箱
 */
function copyFormattedMessage() {
  const values = getContactFormValues();
  if (!values || !values.name || !values.subject || !values.message) {
    showToast('請先填寫表單欄位，即可一鍵複製排好版的信件內容！');
    return;
  }

  const formattedText = `收件人：hanwen0617@gmail.com\n主旨：[個人網站來信] ${values.subject}\n\n您好，張瀚文先生：\n\n我是：${values.name}\n\n洽談內容：\n${values.message}`;

  copyTextToClipboard(
    formattedText,
    '已複製完整信件內容與收件信箱 (hanwen0617@gmail.com)，可直接貼上至您的信箱寄出！'
  );
}
