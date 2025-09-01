// XDOG Meme Creation - Frontend Logic

// DOM元素引用
const elements = {
    // 语言切换相关
    langToggle: document.getElementById('langToggle'),
    mobileLangToggle: document.getElementById('mobileLangToggle'),
    enElements: document.querySelectorAll('.en'),
    zhElements: document.querySelectorAll('.zh'),
    
    // 导航相关
    menuToggle: document.getElementById('menuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    navbar: document.getElementById('navbar'),
    
    // 钱包相关
    connectWalletBtn: document.getElementById('connectWalletBtn'),
    walletAddress: document.getElementById('walletAddress'),
    userStats: document.getElementById('userStats'),
    rewardBalance: document.getElementById('rewardBalance'),
    withdrawBtn: document.getElementById('withdrawBtn'),
    
    // 上传相关
    uploadSection: document.getElementById('uploadSection'),
    dropZone: document.getElementById('dropZone'),
    imageUpload: document.getElementById('imageUpload'),
    uploadLimitInfo: document.getElementById('uploadLimitInfo'),
    memeDescriptionEn: document.getElementById('memeDescriptionEn'),
    memeDescriptionZh: document.getElementById('memeDescriptionZh'),
    submitMemeBtn: document.getElementById('submitMemeBtn'),
    
    // 随机Meme相关
    todayRandomMemes: document.getElementById('todayRandomMemes'),
    allRandomMemes: document.getElementById('allRandomMemes'),
    refreshTodayBtn: document.getElementById('refreshTodayBtn'),
    refreshAllBtn: document.getElementById('refreshAllBtn'),
    todayRefreshCount: document.getElementById('todayRefreshCount'),
    allRefreshCount: document.getElementById('allRefreshCount'),
    
    // 排行榜相关
    todayLikesContent: document.getElementById('todayLikesContent'),
    todayRewardsContent: document.getElementById('todayRewardsContent'),
    allTimeLikesContent: document.getElementById('allTimeLikesContent'),
    allTimeRewardsContent: document.getElementById('allTimeRewardsContent'),
    
    // 弹窗相关
    interactionModal: document.getElementById('interactionModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalMessage: document.getElementById('modalMessage'),
    rewardAmountSelector: document.getElementById('rewardAmountSelector'),
    customRewardAmount: document.getElementById('customRewardAmount'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    confirmModalBtn: document.getElementById('confirmModalBtn'),
    
    // 通知相关
    notification: document.getElementById('notification'),
    notificationIcon: document.getElementById('notificationIcon'),
    notificationMessage: document.getElementById('notificationMessage'),
    closeNotificationBtn: document.getElementById('closeNotificationBtn'),
    
    // 其他弹窗
    disclaimerToggle: document.getElementById('disclaimerToggle'),
    disclaimerPopup: document.getElementById('disclaimerPopup'),
    developerListToggle: document.getElementById('developerListToggle'),
    developerPopup: document.getElementById('developerPopup')
};

// 社区网页运营多签钱包地址
const COMMUNITY_MULTISIG_WALLET = '0xCommunityMultisigAddress123';

// 应用状态
const appState = {
    isChinese: false,
    isWalletConnected: false,
    walletAddress: null,
    rewardBalance: 0,
    totalRewardsReceived: 0, // 历史总计获得的打赏XDOG枚数
    todayUploadCount: 0,
    todayRefreshCount: 20,
    allRefreshCount: 20,
    interactionModalType: null, // 'like' or 'reward'
    currentMemeId: null,
    currentRewardAmount: 1,
    // 模拟数据
    mockMemes: [],
    mockTodayMemes: []
};

// 初始化应用
function initApp() {
    setupEventListeners();
    loadMockData();
    loadLocalState();
    renderRandomMemes();
    renderLeaderboards();
    setupLanguage();
}

// 加载本地状态
function loadLocalState() {
    const savedState = localStorage.getItem('xdogMemeAppState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        appState.isWalletConnected = parsedState.isWalletConnected || false;
        appState.walletAddress = parsedState.walletAddress || null;
        appState.rewardBalance = parsedState.rewardBalance || 0;
        appState.totalRewardsReceived = parsedState.totalRewardsReceived || 0;
        appState.todayUploadCount = parsedState.todayUploadCount || 0;
        appState.todayRefreshCount = parsedState.todayRefreshCount || 20;
        appState.allRefreshCount = parsedState.allRefreshCount || 20;
        appState.isChinese = parsedState.isChinese || false;
        
        if (appState.isWalletConnected) {
            updateWalletUI();
        }
        
        updateRefreshCountUI();
    }
}

// 保存状态到本地存储
function saveState() {
    const stateToSave = {
        isWalletConnected: appState.isWalletConnected,
        walletAddress: appState.walletAddress,
        rewardBalance: appState.rewardBalance,
        totalRewardsReceived: appState.totalRewardsReceived,
        todayUploadCount: appState.todayUploadCount,
        todayRefreshCount: appState.todayRefreshCount,
        allRefreshCount: appState.allRefreshCount,
        isChinese: appState.isChinese
    };
    localStorage.setItem('xdogMemeAppState', JSON.stringify(stateToSave));
}

// 加载模拟数据
function loadMockData() {
    // 模拟历史Meme数据
    appState.mockMemes = [
        {
            id: 1,
            imageUrl: 'galary/04f27da96d28c8ec482e6f56f0b49a67.jpg',
            descriptionEn: 'XDOG taking over the crypto world!',
            descriptionZh: 'XDOG正在接管加密货币世界！',
            likes: 1245,
            rewards: 345,
            creator: '0x123...456',
            date: '2024-01-15'
        },
        {
            id: 2,
            imageUrl: 'galary/139d3205fd9e7b4a509b50a0c31c0fa2.jpg',
            descriptionEn: 'When moon? Soon! #XDOGToTheMoon',
            descriptionZh: '什么时候登月？很快！#XDOG登月',
            likes: 987,
            rewards: 231,
            creator: '0x789...012',
            date: '2024-01-14'
        },
        {
            id: 3,
            imageUrl: 'galary/247421db40f0fc19e0617cccb2bf41be.jpg',
            descriptionEn: 'XDOG vs Other Meme Coins',
            descriptionZh: 'XDOG对比其他Meme币',
            likes: 876,
            rewards: 198,
            creator: '0x345...678',
            date: '2024-01-13'
        },
        {
            id: 4,
            imageUrl: 'galary/25fb45bb5fc329b69be8cbab4ae506c5.jpg',
            descriptionEn: 'XDOG is watching you!',
            descriptionZh: 'XDOG在看着你！',
            likes: 765,
            rewards: 187,
            creator: '0x901...234',
            date: '2024-01-12'
        },
        {
            id: 5,
            imageUrl: 'galary/3067a51c569905fc1785d05ef758fbbc.jpg',
            descriptionEn: 'The rise of XDOG!',
            descriptionZh: 'XDOG的崛起！',
            likes: 654,
            rewards: 165,
            creator: '0x567...890',
            date: '2024-01-11'
        },
        {
            id: 6,
            imageUrl: 'galary/468f8c8c326fb3756c64c74c08ec2d70.jpg',
            descriptionEn: 'XDOG: The Next Big Thing!',
            descriptionZh: 'XDOG：下一个大事件！',
            likes: 543,
            rewards: 143,
            creator: '0x123...456',
            date: '2024-01-10'
        }
    ];
    
    // 模拟今日Meme数据
    appState.mockTodayMemes = [
        {
            id: 7,
            imageUrl: 'galary/53ed796c13bb58e7246c21e8ce988bf3.jpg',
            descriptionEn: 'Good morning XDOG community!',
            descriptionZh: 'XDOG社区早上好！',
            likes: 321,
            rewards: 98,
            creator: '0x789...012',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 8,
            imageUrl: 'galary/5b685e32b1c8c2c3e559e8a8b7579645.jpg',
            descriptionEn: 'XDOG army growing stronger!',
            descriptionZh: 'XDOG军队越来越强大！',
            likes: 234,
            rewards: 76,
            creator: '0x345...678',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 9,
            imageUrl: 'galary/7f1a0d18534c940e1ef6feee3bbc3671.jpg',
            descriptionEn: 'When XDOG hits $1',
            descriptionZh: '当XDOG达到1美元时',
            likes: 187,
            rewards: 65,
            creator: '0x901...234',
            date: new Date().toISOString().split('T')[0]
        },
        {
            id: 10,
            imageUrl: 'galary/7ff0638c56573ca799b4f39820eadc7c.jpg',
            descriptionEn: 'XDOG making waves in crypto!',
            descriptionZh: 'XDOG在加密货币领域掀起波澜！',
            likes: 156,
            rewards: 54,
            creator: '0x567...890',
            date: new Date().toISOString().split('T')[0]
        }
    ];
}

// 设置事件监听器
function setupEventListeners() {
    // 语言切换
    elements.langToggle.addEventListener('click', toggleLanguage);
    elements.mobileLangToggle.addEventListener('click', toggleLanguage);
    
    // 导航菜单
    elements.menuToggle.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    
    // 钱包连接
    elements.connectWalletBtn.addEventListener('click', connectWallet);
    elements.withdrawBtn.addEventListener('click', withdrawRewards);
    
    // 上传Meme
    elements.dropZone.addEventListener('click', () => elements.imageUpload.click());
    elements.imageUpload.addEventListener('change', handleImageUpload);
    elements.memeDescriptionEn.addEventListener('input', validateUploadForm);
    elements.memeDescriptionZh.addEventListener('input', validateUploadForm);
    elements.submitMemeBtn.addEventListener('click', submitMeme);
    
    // 随机Meme刷新
    elements.refreshTodayBtn.addEventListener('click', refreshTodayMemes);
    elements.refreshAllBtn.addEventListener('click', refreshAllMemes);
    
    // 弹窗控制
    elements.closeModalBtn.addEventListener('click', closeInteractionModal);
    elements.cancelModalBtn.addEventListener('click', closeInteractionModal);
    elements.confirmModalBtn.addEventListener('click', confirmInteraction);
    
    // 通知控制
    elements.closeNotificationBtn.addEventListener('click', closeNotification);
    
    // 打赏金额选择
    document.querySelectorAll('.reward-amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.reward-amount-btn').forEach(b => b.classList.remove('active', 'border-secondary'));
            btn.classList.add('active', 'border-secondary');
            appState.currentRewardAmount = parseInt(btn.dataset.amount);
            elements.customRewardAmount.value = '';
        });
    });
    
    elements.customRewardAmount.addEventListener('input', () => {
        const value = parseInt(elements.customRewardAmount.value) || 1;
        if (value >= 1) {
            appState.currentRewardAmount = value;
            document.querySelectorAll('.reward-amount-btn').forEach(btn => {
                btn.classList.remove('active', 'border-secondary');
            });
        }
    });
    
    // 其他弹窗
    elements.disclaimerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        togglePopup(elements.disclaimerPopup);
    });
    
    elements.developerListToggle.addEventListener('click', (e) => {
        e.preventDefault();
        togglePopup(elements.developerPopup);
    });
    
    // 点击页面其他区域关闭弹窗
    document.addEventListener('click', (e) => {
        if (!elements.disclaimerPopup.contains(e.target) && e.target !== elements.disclaimerToggle) {
            elements.disclaimerPopup.classList.add('hidden');
        }
        
        if (!elements.developerPopup.contains(e.target) && e.target !== elements.developerListToggle) {
            elements.developerPopup.classList.add('hidden');
        }
    });
}

// 切换语言
function toggleLanguage() {
    appState.isChinese = !appState.isChinese;
    setupLanguage();
    saveState();
}

// 设置语言显示
function setupLanguage() {
    if (appState.isChinese) {
        elements.enElements.forEach(el => el.classList.add('hidden'));
        elements.zhElements.forEach(el => el.classList.remove('hidden'));
    } else {
        elements.enElements.forEach(el => el.classList.remove('hidden'));
        elements.zhElements.forEach(el => el.classList.add('hidden'));
    }
}

// 切换移动端菜单
function toggleMobileMenu() {
    elements.mobileMenu.classList.toggle('hidden');
}

// 处理滚动事件
function handleScroll() {
    if (window.scrollY > 20) {
        elements.navbar.classList.add('bg-dark-light/90', 'backdrop-blur-sm', 'py-2', 'shadow-md');
        elements.navbar.classList.remove('py-4');
    } else {
        elements.navbar.classList.remove('bg-dark-light/90', 'backdrop-blur-sm', 'py-2', 'shadow-md');
        elements.navbar.classList.add('py-4');
    }
}

// 连接钱包
function connectWallet() {
    // 模拟钱包连接
    appState.isWalletConnected = true;
    appState.walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
    updateWalletUI();
    saveState();
    showNotification('success', appState.isChinese ? '钱包连接成功' : 'Wallet connected successfully');
}

// 更新钱包UI
function updateWalletUI() {
    if (appState.isWalletConnected) {
        elements.connectWalletBtn.classList.add('hidden');
        elements.walletAddress.classList.remove('hidden');
        elements.walletAddress.querySelector('span').textContent = truncateAddress(appState.walletAddress);
        elements.userStats.classList.remove('hidden');
        elements.uploadSection.classList.remove('hidden');
        
        // 检查是否可以提取奖励
        if (appState.rewardBalance >= 100) {
            elements.withdrawBtn.disabled = false;
        } else {
            elements.withdrawBtn.disabled = true;
        }
        
        // 检查今日是否已上传Meme
        if (appState.todayUploadCount >= 1) {
            elements.uploadLimitInfo.classList.remove('hidden');
            elements.dropZone.classList.add('opacity-50', 'cursor-not-allowed');
            elements.submitMemeBtn.disabled = true;
        }
        
        // 初始化历史总计获得的打赏显示
        updateTotalRewardsReceivedUI();
    }
}

// 更新历史总计获得的打赏显示
function updateTotalRewardsReceivedUI() {
    // 检查是否已存在历史总计获得的打赏元素
    let totalRewardsElement = document.getElementById('totalRewardsReceived');
    
    if (!totalRewardsElement) {
        // 创建新的元素显示历史总计获得的打赏
        totalRewardsElement = document.createElement('div');
        totalRewardsElement.id = 'totalRewardsReceived';
        totalRewardsElement.className = 'flex items-center';
        
        const userStatsContainer = elements.userStats;
        
        // 插入到rewardBalance元素之前
        userStatsContainer.insertBefore(totalRewardsElement, userStatsContainer.firstChild);
    }
    
    // 更新显示内容
    totalRewardsElement.innerHTML = `
        <i class="fa fa-star text-yellow-400 mr-2"></i>
        <span class="text-sm">
            <span class="en hidden">Total Received: </span>
            <span class="zh">总计获得: </span>
            <span id="totalRewardsValue" class="font-semibold text-white">${appState.totalRewardsReceived}</span> XDOG
        </span>
    `;
}

// 提取奖励
function withdrawRewards() {
    if (appState.rewardBalance >= 100) {
        // 计算扣除5%的维护费后的实际提取金额
        const totalReward = appState.rewardBalance;
        const maintenanceFee = Math.floor(totalReward * 0.05); // 5%的维护费
        const actualWithdrawal = totalReward - maintenanceFee;
        
        // 模拟提取奖励并扣除维护费
        appState.rewardBalance = 0;
        elements.rewardBalance.textContent = appState.rewardBalance;
        elements.withdrawBtn.disabled = true;
        saveState();
        
        // 模拟将维护费发送到社区多签钱包
        // 注意：在实际应用中，这里应该调用区块链钱包SDK进行实际的转账操作
        console.log(`Transfer ${maintenanceFee} XDOG as maintenance fee to ${COMMUNITY_MULTISIG_WALLET}`);
        
        // 显示包含维护费信息的通知
        const notificationMessage = appState.isChinese 
            ? `成功提取${actualWithdrawal}个XDOG，扣除${maintenanceFee}个XDOG作为社区维护费（已发送到社区多签钱包）` 
            : `Successfully withdrew ${actualWithdrawal} XDOG, ${maintenanceFee} XDOG deducted as community maintenance fee (sent to community multisig wallet)`;
        
        showNotification('success', notificationMessage);
    }
}

// 处理图片上传
function handleImageUpload(e) {
    if (e.target.files && e.target.files[0]) {
        // 这里应该是实际的文件处理逻辑
        // 在这个模拟中，我们只需要更新UI
        validateUploadForm();
    }
}

// 验证上传表单
function validateUploadForm() {
    const hasImage = elements.imageUpload.files && elements.imageUpload.files[0];
    const hasDescriptionEn = elements.memeDescriptionEn.value.trim().length > 0;
    const hasDescriptionZh = elements.memeDescriptionZh.value.trim().length > 0;
    const canUpload = hasImage && hasDescriptionEn && hasDescriptionZh && appState.todayUploadCount < 1;
    
    elements.submitMemeBtn.disabled = !canUpload;
}

// 提交Meme
function submitMeme() {
    // 检查用户余额是否足够支付1枚XDOG
    if (appState.rewardBalance >= 1) {
        // 扣除1枚XDOG并模拟发送到社区多签钱包
        appState.rewardBalance -= 1;
        elements.rewardBalance.textContent = appState.rewardBalance;
        
        // 模拟将1枚XDOG发送到社区多签钱包
        // 注意：在实际应用中，这里应该调用区块链钱包SDK进行实际的转账操作
        console.log(`Transfer 1 XDOG as meme submission fee to ${COMMUNITY_MULTISIG_WALLET}`);
        
        // 模拟提交Meme
        appState.todayUploadCount = 1;
        elements.uploadLimitInfo.classList.remove('hidden');
        elements.dropZone.classList.add('opacity-50', 'cursor-not-allowed');
        elements.submitMemeBtn.disabled = true;
        saveState();
        
        // 重置表单
        elements.imageUpload.value = '';
        elements.memeDescriptionEn.value = '';
        elements.memeDescriptionZh.value = '';
        
        showNotification('success', appState.isChinese ? 'Meme上传成功，已支付1个XDOG到社区多签钱包' : 'Meme uploaded successfully, 1 XDOG paid to community multisig wallet');
        
        // 添加奖励
        appState.rewardBalance += 10; // 上传Meme奖励10个XDOG
        elements.rewardBalance.textContent = appState.rewardBalance;
        if (appState.rewardBalance >= 100) {
            elements.withdrawBtn.disabled = false;
        }
        saveState();
    } else {
        showNotification('error', appState.isChinese ? '余额不足，需要1个XDOG才能提交表情包' : 'Insufficient balance, 1 XDOG required to submit meme');
    }
}

// 渲染随机Meme
function renderRandomMemes() {
    renderTodayRandomMemes();
    renderAllRandomMemes();
}

// 渲染今日随机Meme
function renderTodayRandomMemes() {
    elements.todayRandomMemes.innerHTML = '';
    
    // 随机选择4个今日Meme
    const shuffled = [...appState.mockTodayMemes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    selected.forEach(meme => {
        const memeCard = createRandomMemeCard(meme);
        elements.todayRandomMemes.appendChild(memeCard);
    });
}

// 渲染历史随机Meme
function renderAllRandomMemes() {
    elements.allRandomMemes.innerHTML = '';
    
    // 随机选择4个历史Meme
    const shuffled = [...appState.mockMemes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    selected.forEach(meme => {
        const memeCard = createRandomMemeCard(meme);
        elements.allRandomMemes.appendChild(memeCard);
    });
}

// 创建随机Meme卡片
function createRandomMemeCard(meme) {
    const card = document.createElement('div');
    card.className = 'bg-dark p-4 rounded-xl border border-primary/30 hover:border-secondary transition-all hover:shadow-lg hover:shadow-primary/10';
    
    const descriptionKey = appState.isChinese ? 'descriptionZh' : 'descriptionEn';
    
    card.innerHTML = `
        <div class="aspect-video rounded-lg overflow-hidden mb-4 bg-dark-light">
            <img src="${meme.imageUrl}" alt="Meme" class="w-full h-full object-contain">
        </div>
        <p class="text-gray-300 mb-4 text-sm h-12 overflow-hidden">${meme[descriptionKey]}</p>
        <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <button class="like-btn flex items-center space-x-1 text-gray-400 hover:text-secondary transition-colors" data-id="${meme.id}">
                    <i class="fa fa-thumbs-up"></i>
                    <span>${meme.likes}</span>
                </button>
                <button class="reward-btn flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors" data-id="${meme.id}">
                    <i class="fa fa-gift"></i>
                    <span>${meme.rewards}</span>
                </button>
            </div>
            <span class="text-xs text-gray-500">
                ${formatDate(meme.date)}
            </span>
        </div>
    `;
    
    // 添加事件监听
    card.querySelector('.like-btn').addEventListener('click', (e) => {
        openInteractionModal('like', meme.id);
    });
    
    card.querySelector('.reward-btn').addEventListener('click', (e) => {
        openInteractionModal('reward', meme.id);
    });
    
    return card;
}

// 打开购买刷新次数弹窗
function openBuyRefreshModal(type) {
    elements.modalTitle.textContent = appState.isChinese ? '购买刷新次数' : 'Buy Refresh Times';
    elements.modalMessage.textContent = appState.isChinese ? '支付1XDOG获取10次刷新次数？' : 'Pay 1 XDOG for 10 refresh times?';
    elements.rewardAmountSelector.classList.add('hidden');
    
    // 存储当前操作类型
    appState.interactionModalType = 'buyRefresh';
    appState.currentMemeId = type; // 'today' 或 'all'
    
    elements.interactionModal.classList.remove('hidden');
}

// 刷新今日随机Meme
function refreshTodayMemes() {
    if (appState.todayRefreshCount > 0) {
        appState.todayRefreshCount--;
        renderTodayRandomMemes();
        updateRefreshCountUI();
        saveState();
    } else {
        // 检查余额是否足够购买刷新次数
        if (appState.rewardBalance >= 1) {
            openBuyRefreshModal('today');
        } else {
            showNotification('error', appState.isChinese ? '余额不足，无法购买刷新次数' : 'Insufficient balance to buy refresh times');
        }
    }
}

// 刷新历史随机Meme
function refreshAllMemes() {
    if (appState.allRefreshCount > 0) {
        appState.allRefreshCount--;
        renderAllRandomMemes();
        updateRefreshCountUI();
        saveState();
    } else {
        // 检查余额是否足够购买刷新次数
        if (appState.rewardBalance >= 1) {
            openBuyRefreshModal('all');
        } else {
            showNotification('error', appState.isChinese ? '余额不足，无法购买刷新次数' : 'Insufficient balance to buy refresh times');
        }
    }
}

// 更新刷新次数UI
function updateRefreshCountUI() {
    elements.todayRefreshCount.textContent = appState.isChinese 
        ? `${appState.todayRefreshCount}/20 免费` 
        : `${appState.todayRefreshCount}/20 free`;
    
    elements.allRefreshCount.textContent = appState.isChinese 
        ? `${appState.allRefreshCount}/20 免费` 
        : `${appState.allRefreshCount}/20 free`;
    
    if (appState.todayRefreshCount === 0) {
        elements.refreshTodayBtn.classList.add('text-primary/60', 'bg-primary/10');
        elements.refreshTodayBtn.classList.remove('hover:bg-primary/30');
        // 更新按钮文本，显示购买信息
        const todayRefreshBtnText = appState.isChinese ? '1XDOG=10次' : '1XDOG=10 times';
        elements.refreshTodayBtn.querySelector('.en').textContent = '1XDOG=10 times';
        elements.refreshTodayBtn.querySelector('.zh').textContent = '1XDOG=10次';
    } else {
        // 恢复原始按钮文本
        elements.refreshTodayBtn.querySelector('.en').textContent = 'Refresh';
        elements.refreshTodayBtn.querySelector('.zh').textContent = '刷新';
    }
    
    if (appState.allRefreshCount === 0) {
        elements.refreshAllBtn.classList.add('text-primary/60', 'bg-primary/10');
        elements.refreshAllBtn.classList.remove('hover:bg-primary/30');
        // 更新按钮文本，显示购买信息
        const allRefreshBtnText = appState.isChinese ? '1XDOG=10次' : '1XDOG=10 times';
        elements.refreshAllBtn.querySelector('.en').textContent = '1XDOG=10 times';
        elements.refreshAllBtn.querySelector('.zh').textContent = '1XDOG=10次';
    } else {
        // 恢复原始按钮文本
        elements.refreshAllBtn.querySelector('.en').textContent = 'Refresh';
        elements.refreshAllBtn.querySelector('.zh').textContent = '刷新';
    }
}

// 渲染排行榜
function renderLeaderboards() {
    renderTodayLikesLeaderboard();
    renderTodayRewardsLeaderboard();
    renderAllTimeLikesLeaderboard();
    renderAllTimeRewardsLeaderboard();
}

// 渲染今日点赞榜
function renderTodayLikesLeaderboard() {
    elements.todayLikesContent.innerHTML = '';
    
    // 按点赞数排序今日Meme
    const sorted = [...appState.mockTodayMemes].sort((a, b) => b.likes - a.likes);
    
    sorted.forEach((meme, index) => {
        const item = createLeaderboardItem(meme, index + 1, 'likes');
        elements.todayLikesContent.appendChild(item);
    });
}

// 渲染今日打赏榜
function renderTodayRewardsLeaderboard() {
    elements.todayRewardsContent.innerHTML = '';
    
    // 按打赏数排序今日Meme
    const sorted = [...appState.mockTodayMemes].sort((a, b) => b.rewards - a.rewards);
    
    sorted.forEach((meme, index) => {
        const item = createLeaderboardItem(meme, index + 1, 'rewards');
        elements.todayRewardsContent.appendChild(item);
    });
}

// 渲染历史点赞总榜
function renderAllTimeLikesLeaderboard() {
    elements.allTimeLikesContent.innerHTML = '';
    
    // 合并今日和历史Meme
    const allMemes = [...appState.mockMemes, ...appState.mockTodayMemes];
    // 按点赞数排序
    const sorted = allMemes.sort((a, b) => b.likes - a.likes);
    
    sorted.slice(0, 10).forEach((meme, index) => {
        const item = createLeaderboardItem(meme, index + 1, 'likes');
        elements.allTimeLikesContent.appendChild(item);
    });
}

// 渲染历史打赏总榜
function renderAllTimeRewardsLeaderboard() {
    elements.allTimeRewardsContent.innerHTML = '';
    
    // 合并今日和历史Meme
    const allMemes = [...appState.mockMemes, ...appState.mockTodayMemes];
    // 按打赏数排序
    const sorted = allMemes.sort((a, b) => b.rewards - a.rewards);
    
    sorted.slice(0, 10).forEach((meme, index) => {
        const item = createLeaderboardItem(meme, index + 1, 'rewards');
        elements.allTimeRewardsContent.appendChild(item);
    });
}

// 创建排行榜项目
function createLeaderboardItem(meme, rank, type) {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0';
    
    const descriptionKey = appState.isChinese ? 'descriptionZh' : 'descriptionEn';
    const likesCount = meme.likes;
    const rewardsCount = meme.rewards;
    
    item.innerHTML = `
        <div class="flex items-center">
            <span class="w-6 h-6 rounded-full flex items-center justify-center mr-3 ${rank <= 3 ? 'bg-primary text-white' : 'bg-dark text-gray-400'}">
                ${rank}
            </span>
            <div class="aspect-square w-10 h-10 rounded overflow-hidden mr-3 bg-dark-light">
                <img src="${meme.imageUrl}" alt="Meme thumbnail" class="w-full h-full object-cover">
            </div>
            <div>
                <p class="text-sm text-gray-300 truncate max-w-[150px] md:max-w-[200px]">${meme[descriptionKey]}</p>
                <p class="text-xs text-gray-500">${truncateAddress(meme.creator)}</p>
            </div>
        </div>
        <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-1">
                <i class="fa fa-thumbs-up text-secondary"></i>
                <span>${likesCount}</span>
            </div>
            <div class="flex items-center space-x-1">
                <i class="fa fa-gift text-primary"></i>
                <span>${rewardsCount}</span>
            </div>
            <div class="flex space-x-1">
                <button class="like-btn text-secondary hover:text-secondary/80 p-1 rounded-full hover:bg-secondary/10 transition-colors" data-meme-id="${meme.id}">
                    <i class="fa fa-thumbs-up"></i>
                </button>
                <button class="reward-btn text-primary hover:text-primary/80 p-1 rounded-full hover:bg-primary/10 transition-colors" data-meme-id="${meme.id}">
                    <i class="fa fa-gift"></i>
                </button>
            </div>
        </div>
    `;
    
    // 添加点赞按钮点击事件
    item.querySelector('.like-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openInteractionModal('like', meme.id);
    });
    
    // 添加打赏按钮点击事件
    item.querySelector('.reward-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openInteractionModal('reward', meme.id);
    });
    
    return item;
}

// 打开交互弹窗
function openInteractionModal(type, memeId) {
    appState.interactionModalType = type;
    appState.currentMemeId = memeId;
    
    if (type === 'like') {
        elements.modalTitle.textContent = appState.isChinese ? '点赞表情包' : 'Like Meme';
        elements.modalMessage.textContent = appState.isChinese ? '你确定要点赞这个表情包吗？点赞后无法撤销。' : 'Are you sure you want to like this meme? This action cannot be undone.';
        elements.rewardAmountSelector.classList.add('hidden');
    } else if (type === 'reward') {
        elements.modalTitle.textContent = appState.isChinese ? '打赏表情包' : 'Reward Meme';
        elements.modalMessage.textContent = appState.isChinese ? '选择打赏金额：' : 'Select reward amount:';
        elements.rewardAmountSelector.classList.remove('hidden');
        // 重置奖励金额
        document.querySelectorAll('.reward-amount-btn').forEach(btn => {
            btn.classList.remove('active', 'border-secondary');
        });
        document.querySelector('.reward-amount-btn[data-amount="1"]').classList.add('active', 'border-secondary');
        appState.currentRewardAmount = 1;
        elements.customRewardAmount.value = '';
    }
    
    elements.interactionModal.classList.remove('hidden');
}

// 关闭交互弹窗
function closeInteractionModal() {
    elements.interactionModal.classList.add('hidden');
    appState.interactionModalType = null;
    appState.currentMemeId = null;
}

// 确认交互
function confirmInteraction() {
    const id = appState.currentMemeId;
    const type = appState.interactionModalType;
    
    if (type === 'buyRefresh') {
        // 处理购买刷新次数
        if (appState.rewardBalance >= 1) {
            // 模拟从用户余额中扣除1枚XDOG并发送到社区多签钱包
            // 注意：在实际应用中，这里应该调用区块链钱包SDK进行实际的转账操作
            appState.rewardBalance -= 1;
            elements.rewardBalance.textContent = appState.rewardBalance;
            
            // 模拟转账记录日志（实际应用中应该有真实的转账交易）
            console.log(`Transfer 1 XDOG from ${appState.walletAddress} to ${COMMUNITY_MULTISIG_WALLET} for 10 refresh times`);
            
            // 根据类型增加刷新次数
            if (id === 'today') {
                appState.todayRefreshCount += 10;
                renderTodayRandomMemes();
            } else if (id === 'all') {
                appState.allRefreshCount += 10;
                renderAllRandomMemes();
            }
            
            updateRefreshCountUI();
            saveState();
            showNotification('success', appState.isChinese ? '成功支付1XDOG获取10次刷新次数' : 'Successfully paid 1 XDOG for 10 refresh times');
            
            // 更新提取按钮状态
            if (appState.rewardBalance < 100) {
                elements.withdrawBtn.disabled = true;
            }
        } else {
            showNotification('error', appState.isChinese ? '余额不足，无法购买刷新次数' : 'Insufficient balance to buy refresh times');
        }
    } else {
        // 查找对应的Meme
        let meme = appState.mockMemes.find(m => m.id === id);
        if (!meme) {
            meme = appState.mockTodayMemes.find(m => m.id === id);
        }
        
        if (meme) {
            if (type === 'like') {
                // 模拟点赞
                meme.likes++;
                showNotification('success', appState.isChinese ? '点赞成功' : 'Liked successfully');
            } else if (type === 'reward') {
                // 模拟打赏
                const amount = appState.currentRewardAmount;
                if (appState.rewardBalance >= amount) {
                    // 计算维护费 (5%) 和实际发送给创作者的金额 (95%)
                    const maintenanceFee = Math.floor(amount * 0.05);
                    const creatorReward = amount - maintenanceFee;
                    
                    // 模拟从用户余额中扣除打赏金额
                    appState.rewardBalance -= amount;
                    elements.rewardBalance.textContent = appState.rewardBalance;
                    
                    // 模拟将维护费发送到社区网页运营多签钱包
                    // 注意：在实际应用中，这里应该调用区块链钱包SDK进行实际的转账操作
                    console.log(`Transfer ${maintenanceFee} XDOG as maintenance fee to ${COMMUNITY_MULTISIG_WALLET}`);
                    
                    // 模拟将剩余金额发送给创作者的钱包
                    // 假设meme.creator是创作者的钱包地址
                    console.log(`Transfer ${creatorReward} XDOG to creator wallet: ${meme.creator}`);
                    
                    // 更新Meme的打赏统计
                    meme.rewards += amount;
                    
                    // 更新历史总计获得的打赏
                    appState.totalRewardsReceived += amount;
                    
                    // 更新历史总计获得打赏的显示
                    updateTotalRewardsReceivedUI();
                    
                    // 显示包含维护费信息的通知
                    const notificationMessage = appState.isChinese 
                        ? `打赏${amount}个XDOG成功，其中${maintenanceFee}个XDOG作为维护费，${creatorReward}个XDOG发送给创作者` 
                        : `Rewarded ${amount} XDOG successfully, ${maintenanceFee} XDOG as maintenance fee, ${creatorReward} XDOG sent to creator`;
                    
                    showNotification('success', notificationMessage);
                    
                    // 更新提取按钮状态
                    if (appState.rewardBalance < 100) {
                        elements.withdrawBtn.disabled = true;
                    }
                    saveState();
                } else {
                    showNotification('error', appState.isChinese ? '余额不足，无法打赏' : 'Insufficient balance to reward');
                }
            }
            
            // 重新渲染UI
            renderRandomMemes();
            renderLeaderboards();
        }
    }
    
    closeInteractionModal();
}

// 显示通知
function showNotification(type, message) {
    elements.notificationMessage.textContent = message;
    
    // 设置图标和颜色
    if (type === 'success') {
        elements.notificationIcon.className = 'fa fa-check-circle text-green-500 mt-1 mr-3';
    } else if (type === 'error') {
        elements.notificationIcon.className = 'fa fa-times-circle text-red-500 mt-1 mr-3';
    } else if (type === 'info') {
        elements.notificationIcon.className = 'fa fa-info-circle text-primary mt-1 mr-3';
    }
    
    elements.notification.classList.remove('hidden');
    
    // 3秒后自动关闭
    setTimeout(() => {
        closeNotification();
    }, 3000);
}

// 关闭通知
function closeNotification() {
    elements.notification.classList.add('hidden');
}

// 切换弹窗显示
function togglePopup(popupElement) {
    popupElement.classList.toggle('hidden');
}

// 辅助函数：截断地址
function truncateAddress(address) {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
}

// 辅助函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
        return appState.isChinese ? '今天' : 'Today';
    }
    
    const options = appState.isChinese ? 
        { year: 'numeric', month: 'short', day: 'numeric' } : 
        { year: 'numeric', month: 'short', day: 'numeric' };
    
    return date.toLocaleDateString(appState.isChinese ? 'zh-CN' : 'en-US', options);
}

// 初始化应用
initApp();