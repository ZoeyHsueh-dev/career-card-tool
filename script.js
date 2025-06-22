// 全域變數
let careersData = [];
let selectedCards = [];
let currentDisplayCount = 0;
let rankedCareers = [];
const cardsPerLoad = 20;

// 載入職業資料
async function loadCareersData() {
    try {
        console.log('開始載入職業資料...'); // 調試用
        
        const response = await fetch('careers.json');
        console.log('Fetch response:', response); // 調試用
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('載入的資料:', data); // 調試用
        
        careersData = data;
        
        // 驗證資料格式
        if (!Array.isArray(careersData) || careersData.length === 0) {
            throw new Error('職業資料格式錯誤或為空');
        }
        
        console.log(`成功載入 ${careersData.length} 個職業`); // 調試用
        
        // 隱藏載入畫面，顯示開始畫面
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
        
    } catch (error) {
        console.error('載入職業資料失敗:', error);
        
        // 如果是 CORS 或檔案路徑問題，使用內建資料作為備用
        console.log('使用備用職業資料...');
        useBackupCareersData();
    }
}

// 備用職業資料（避免載入失敗）
function useBackupCareersData() {
    careersData = [
        { id: 1, name: "軟體工程師", code: "IRC", description: "設計、開發和維護軟體系統，解決技術問題" },
        { id: 2, name: "幼教老師", code: "SA", description: "教育和照顧幼兒，促進其身心發展" },
        { id: 3, name: "地理與航照測繪員", code: "RIC", description: "使用測量儀器和航空攝影技術進行地理測繪" },
        { id: 4, name: "心理諮商師", code: "SI", description: "提供心理諮商服務，協助個案解決心理困擾" },
        { id: 5, name: "機械工程師", code: "RIE", description: "設計和開發機械設備，解決工程技術問題" },
        { id: 6, name: "平面設計師", code: "AE", description: "創作視覺設計作品，傳達品牌理念和訊息" },
        { id: 7, name: "會計師", code: "CE", description: "處理財務記錄，提供會計和稅務諮詢服務" },
        { id: 8, name: "護理師", code: "SR", description: "提供醫療照護服務，協助病患康復" },
        { id: 9, name: "銷售經理", code: "EC", description: "制定銷售策略，管理銷售團隊達成業績目標" },
        { id: 10, name: "研究員", code: "IR", description: "進行科學研究，探索新知識和技術" },
        { id: 11, name: "廚師", code: "RA", description: "準備和烹調食物，創作美味料理" },
        { id: 12, name: "社工師", code: "SE", description: "提供社會服務，協助弱勢族群解決問題" },
        { id: 13, name: "建築師", code: "AIR", description: "設計建築物，創造功能性和美觀的空間" },
        { id: 14, name: "律師", code: "EI", description: "提供法律諮詢，代理訴訟案件" },
        { id: 15, name: "醫師", code: "IS", description: "診斷和治療疾病，維護病患健康" },
        { id: 16, name: "記者", code: "AE", description: "採訪新聞事件，撰寫報導文章" },
        { id: 17, name: "電機工程師", code: "RIE", description: "設計和維護電氣系統和設備" },
        { id: 18, name: "人力資源專員", code: "SEC", description: "管理人力資源，處理員工招募和培訓" },
        { id: 19, name: "攝影師", code: "AR", description: "拍攝照片，記錄美好時刻和重要事件" },
        { id: 20, name: "財務分析師", code: "IC", description: "分析財務數據，提供投資建議" },
        { id: 21, name: "物理治療師", code: "SR", description: "協助患者恢復身體功能和活動能力" },
        { id: 22, name: "網頁設計師", code: "AIC", description: "設計和開發網站，創造良好的使用者體驗" },
        { id: 23, name: "市場行銷專員", code: "AE", description: "制定行銷策略，推廣產品和品牌" },
        { id: 24, name: "獸醫師", code: "IR", description: "診斷和治療動物疾病，維護動物健康" },
        { id: 25, name: "翻譯員", code: "AI", description: "進行語言翻譯，促進跨文化溝通" },
        { id: 26, name: "數據分析師", code: "IC", description: "分析大數據，提供商業洞察和決策支援" },
        { id: 27, name: "室內設計師", code: "AE", description: "設計室內空間，創造舒適美觀的環境" },
        { id: 28, name: "藥劑師", code: "IC", description: "調劑藥物，提供用藥諮詢服務" },
        { id: 29, name: "飛行員", code: "RIC", description: "駕駛飛機，確保飛行安全" },
        { id: 30, name: "音樂老師", code: "AS", description: "教授音樂技能，培養學生音樂素養" }
    ];
    
    // 生成更多職業資料到100個
    for (let i = 31; i <= 100; i++) {
        const codes = ['R', 'I', 'A', 'S', 'E', 'C'];
        const randomCode = codes[Math.floor(Math.random() * codes.length)] + 
                          (Math.random() > 0.5 ? codes[Math.floor(Math.random() * codes.length)] : '') +
                          (Math.random() > 0.7 ? codes[Math.floor(Math.random() * codes.length)] : '');
        
        careersData.push({
            id: i,
            name: `職業${i}`,
            code: randomCode,
            description: `這是職業${i}的工作內容描述`
        });
    }
    
    console.log(`使用備用資料，共 ${careersData.length} 個職業`);
    
    // 隱藏載入畫面，顯示開始畫面
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
}

// 顯示錯誤彈窗
function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').style.display = 'block';
}

// 關閉錯誤彈窗
function closeErrorModal() {
    document.getElementById('errorModal').style.display = 'none';
    // 重新嘗試載入
    location.reload();
}

// 開始選擇
function startTest() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('selectionScreen').classList.remove('hidden');
    loadMoreCards();
}

// 載入更多卡片
function loadMoreCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    const loadMoreBtn = document.getElementById('loadMore');
    
    const endIndex = Math.min(currentDisplayCount + cardsPerLoad, careersData.length);
    
    for (let i = currentDisplayCount; i < endIndex; i++) {
        const career = careersData[i];
        const cardElement = createCardElement(career);
        cardsGrid.appendChild(cardElement);
    }
    
    currentDisplayCount = endIndex;
    
    if (currentDisplayCount >= careersData.length) {
        loadMoreBtn.classList.add('hidden');
    } else {
        loadMoreBtn.classList.remove('hidden');
    }
}

// 創建卡片元素
function createCardElement(career) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = career.id;
    card.innerHTML = `
        <div class="card-title">${career.name}</div>
        <div class="card-description">${career.description}</div>
        <div class="card-code">${career.code}</div>
    `;
    
    card.addEventListener('click', () => toggleCard(career.id));
    return card;
}

// 切換卡片選擇狀態
function toggleCard(careerID) {
    const selectedIndex = selectedCards.findIndex(card => card.id === careerID);
    const cardElement = document.querySelector(`[data-id="${careerID}"]`);
    
    if (selectedIndex > -1) {
        // 取消選擇
        selectedCards.splice(selectedIndex, 1);
        cardElement.classList.remove('selected');
    } else {
        // 選擇卡片
        if (selectedCards.length >= 10) {
            showWarningModal();
            return;
        }
        
        const career = careersData.find(c => c.id === careerID);
        selectedCards.push(career);
        cardElement.classList.add('selected');
    }
    
    updateSelectionUI();
}

// 更新選擇UI
function updateSelectionUI() {
    document.getElementById('selectedCount').textContent = selectedCards.length;
    document.getElementById('submitBtn').disabled = selectedCards.length !== 10;
}

// 顯示警告彈窗
function showWarningModal() {
    document.getElementById('warningModal').style.display = 'block';
}

// 關閉彈窗
function closeModal() {
    document.getElementById('warningModal').style.display = 'none';
}

// 進入排序畫面
function goToRanking() {
    document.getElementById('selectionScreen').classList.add('hidden');
    document.getElementById('rankingScreen').classList.remove('hidden');
    
    const sortableList = document.getElementById('sortableList');
    sortableList.innerHTML = '';
    
    selectedCards.forEach((career, index) => {
        const li = document.createElement('li');
        li.className = 'sortable-item';
        li.draggable = true;
        li.dataset.id = career.id;
        li.innerHTML = `<div class="sortable-item-content">${career.name} (${career.code})</div>`;
        sortableList.appendChild(li);
    });
    
    initSortable();
}

// 初始化拖拽排序
function initSortable() {
    const sortableList = document.getElementById('sortableList');
    let draggedElement = null;
    
    sortableList.addEventListener('dragstart', (e) => {
        draggedElement = e.target;
        e.target.classList.add('dragging');
    });
    
    sortableList.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
    });
    
    sortableList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(sortableList, e.clientY);
        if (afterElement == null) {
            sortableList.appendChild(draggedElement);
        } else {
            sortableList.insertBefore(draggedElement, afterElement);
        }
    });
}

// 取得拖拽後的位置
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 確認排序
function confirmRanking() {
    const sortedItems = document.querySelectorAll('.sortable-item');
    rankedCareers = [];
    
    sortedItems.forEach((item, index) => {
        const careerID = parseInt(item.dataset.id);
        const career = selectedCards.find(c => c.id === careerID);
        rankedCareers.push({...career, rank: index + 1});
    });
    
    showResults();
}

// 顯示結果
function showResults() {
    document.getElementById('rankingScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
    
    displayCareerRanking();
    calculateHollandScores();
}

// 顯示職業排名（方案五：排行榜式）
function displayCareerRanking() {
    const rankingContainer = document.getElementById('careerRankingList');
    rankingContainer.innerHTML = '';
    
    // 創建 TOP 3 區域
    const topThreeSection = document.createElement('div');
    topThreeSection.className = 'top-three-section';
    
    const topThreeTitle = document.createElement('div');
    topThreeTitle.className = 'top-three-title';
    topThreeTitle.innerHTML = '🏆 <span>TOP 3 最喜愛職業</span> <span class="sparkle">✨</span>';
    
    const topThreeContainer = document.createElement('div');
    topThreeContainer.className = 'top-three-container';
    
    // TOP 3 職業
    const topThree = rankedCareers.slice(0, 3);
    const medals = ['🥇', '🥈', '🥉'];
    const classes = ['first', 'second', 'third'];
    
    topThree.forEach((career, index) => {
        const card = document.createElement('div');
        card.className = `top-career-card ${classes[index]}`;
        card.innerHTML = `
            <span class="medal-rank">${medals[index]}</span>
            <div class="rank-number">第 ${career.rank} 名</div>
            <div class="career-name-top">${career.name}</div>
            <div class="career-code-top">${career.code}</div>
        `;
        topThreeContainer.appendChild(card);
    });
    
    topThreeSection.appendChild(topThreeTitle);
    topThreeSection.appendChild(topThreeContainer);
    
    // 創建其他排名區域
    const otherSection = document.createElement('div');
    otherSection.className = 'other-rankings-section';
    
    const otherTitle = document.createElement('div');
    otherTitle.className = 'other-rankings-title';
    otherTitle.innerHTML = '📋 <span>其他職業排名</span>';
    
    const otherGrid = document.createElement('div');
    otherGrid.className = 'other-rankings-grid';
    
    // 4-10 名職業
    const otherRankings = rankedCareers.slice(3);
    
    otherRankings.forEach(career => {
        const card = document.createElement('div');
        card.className = 'other-career-card';
        card.innerHTML = `
            <div class="other-rank-number">${career.rank}</div>
            <div class="other-career-name">${career.name}</div>
            <div class="other-career-code">${career.code}</div>
        `;
        otherGrid.appendChild(card);
    });
    
    otherSection.appendChild(otherTitle);
    otherSection.appendChild(otherGrid);
    
    // 將兩個區域添加到容器中
    rankingContainer.appendChild(topThreeSection);
    rankingContainer.appendChild(otherSection);
}

// 計算Holland代碼分數
function calculateHollandScores() {
    const hollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    rankedCareers.forEach(career => {
        const code = career.code.toUpperCase();
        const baseScore = rankedCareers.length - career.rank + 1; // 排名越前面分數越高
        
        for (let i = 0; i < code.length; i++) {
            const letter = code[i];
            if (hollandScores.hasOwnProperty(letter)) {
                hollandScores[letter] += baseScore - i; // 第一個字母分數最高
            }
        }
    });
    
    displayHollandScores(hollandScores);
}

// 顯示Holland分數
function displayHollandScores(scores) {
    const hollandContainer = document.getElementById('hollandScores');
    hollandContainer.innerHTML = '';
    
    const hollandTypes = {
        R: '實用型',
        I: '研究型', 
        A: '藝術型',
        S: '社會型',
        E: '企業型',
        C: '事務型'
    };
    
    // 按照RIASEC順序顯示
    const orderedCodes = ['R', 'I', 'A', 'S', 'E', 'C'];
    
    orderedCodes.forEach(code => {
        const score = scores[code];
        const item = document.createElement('div');
        item.className = 'holland-item';
        item.innerHTML = `
            <div class="holland-code">${code}</div>
            <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">${hollandTypes[code]}</div>
            <div class="holland-score">${score}分</div>
        `;
        hollandContainer.appendChild(item);
    });
}

// 重新開始
function restart() {
    selectedCards = [];
    currentDisplayCount = 0;
    rankedCareers = [];
    
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    
    // 清空卡片網格
    document.getElementById('cardsGrid').innerHTML = '';
    document.getElementById('loadMore').classList.add('hidden');
    
    // 重置選擇計數
    updateSelectionUI();
}

// 頁面載入完成後初始化
window.addEventListener('load', () => {
    console.log('頁面載入完成，開始初始化...');
    updateSelectionUI();
    
    // 延遲一點點再載入，確保所有元素都準備好
    setTimeout(() => {
        loadCareersData();
    }, 100);
});
