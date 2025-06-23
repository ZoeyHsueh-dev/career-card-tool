// 全域變數
let careersData = [];
let selectedCards = [];
let currentDisplayCount = 0;
let rankedCareers = [];
const cardsPerLoad = 20;

// 載入職業資料
async function loadCareersData() {
    try {
        const response = await fetch('careers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        careersData = await response.json();
        
        // 驗證資料格式
        if (!Array.isArray(careersData) || careersData.length === 0) {
            throw new Error('職業資料格式錯誤或為空');
        }
        
        // 隱藏載入畫面，顯示開始畫面
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
        
    } catch (error) {
        console.error('載入職業資料失敗:', error);
        showErrorModal('載入職業資料失敗，請檢查網路連線或聯絡管理員。');
    }
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
        li.innerHTML = `${career.name} (${career.code})`;
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

// 顯示職業排名
function displayCareerRanking() {
    const rankingList = document.getElementById('careerRankingList');
    rankingList.innerHTML = '';
    
    rankedCareers.forEach(career => {
        const item = document.createElement('div');
        item.className = 'career-card';
        
        // 根據排名設定顏色
        const colorClass = career.rank <= 3 ? 'top-rank' : 'normal-rank';
        
        item.innerHTML = `
            <div class="career-card-number ${colorClass}">${career.rank}</div>
            <div class="career-card-title">${career.name}</div>
            <div class="career-card-code">${career.code}</div>
        `;
        rankingList.appendChild(item);
    });
}

// 計算Holland代碼分數
function calculateHollandScores() {
    const hollandScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    rankedCareers.forEach(career => {
        const code = career.code.toUpperCase();
        
        // 根據代碼中字母的位置給分：第1個字母3分，第2個字母2分，第3個字母1分
        for (let i = 0; i < code.length; i++) {
            const letter = code[i];
            if (hollandScores.hasOwnProperty(letter)) {
                const score = 3 - i; // 第1個字母3分，第2個字母2分，第3個字母1分
                hollandScores[letter] += score;
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
        R: '實踐者',
        I: '思考者', 
        A: '創造者',
        S: '助人者',
        E: '影響者',
        C: '組織者'
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
    updateSelectionUI();
    loadCareersData();
});
