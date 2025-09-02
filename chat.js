// XDOG聊天室功能实现
(function() {
    'use strict';
    
    // DOM元素
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const walletVerification = document.getElementById('walletVerification');
    const chatRoom = document.getElementById('chatRoom');
    const walletBalanceInfo = document.getElementById('walletBalanceInfo');
    const xdogBalance = document.getElementById('xdogBalance');
    const balanceCheckResult = document.getElementById('balanceCheckResult');
    const userInfo = document.getElementById('userInfo');
    const walletAddress = document.getElementById('walletAddress');
    const userNickname = document.getElementById('userNickname');
    const changeNicknameBtn = document.getElementById('changeNicknameBtn');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const nicknameModal = document.getElementById('nicknameModal');
    const nicknameInput = document.getElementById('nicknameInput');
    const nicknameChangesLeft = document.getElementById('nicknameChangesLeft');
    const cancelNicknameBtn = document.getElementById('cancelNicknameBtn');
    const confirmNicknameBtn = document.getElementById('confirmNicknameBtn');
    const langToggle = document.getElementById('langToggle');
    
    // 应用状态
    let web3Instance = null;
    let currentAccount = null;
    let isVerified = false;
    let nicknameData = {
        name: '',
        changesLeft: 2
    };
    const XDOG_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // 示例XDOG合约地址
    const MIN_BALANCE_REQUIRED = 100000; // 进入聊天室所需的最小XDOG余额
    const NICKNAME_CHANGE_COST = 10; // 更改昵称的费用（XDOG）
    
    // 初始化应用
    function init() {
        // 从localStorage加载昵称数据
        loadNicknameData();
        
        // 加载聊天历史
        loadChatHistory();
        
        // 检查钱包连接状态
        checkWalletConnection();
        
        // 设置事件监听器
        setupEventListeners();
        
        // 初始化语言
        initLanguage();
    }
    
    // 初始化语言设置
    function initLanguage() {
        // 检查localStorage中的语言设置
        const savedLang = localStorage.getItem('xdogLanguage');
        if (savedLang === 'zh') {
            switchToChinese();
        } else {
            switchToEnglish();
        }
    }
    
    // 切换到英文
    function switchToEnglish() {
        document.querySelectorAll('.en').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.zh').forEach(el => el.classList.add('hidden'));
        localStorage.setItem('xdogLanguage', 'en');
        updatePlaceholders();
    }
    
    // 切换到中文
    function switchToChinese() {
        document.querySelectorAll('.en').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.zh').forEach(el => el.classList.remove('hidden'));
        localStorage.setItem('xdogLanguage', 'zh');
        updatePlaceholders();
    }
    
    // 更新输入框占位符
    function updatePlaceholders() {
        const isChinese = document.querySelector('.zh').classList.contains('hidden');
        messageInput.placeholder = isChinese ? '在此输入您的消息...' : 'Type your message here...';
        nicknameInput.placeholder = isChinese ? '输入您的新昵称' : 'Enter your new nickname';
    }
    
    // 检查钱包连接状态
    async function checkWalletConnection() {
        // 尝试检测MetaMask或OKX钱包
        if (typeof window.ethereum !== 'undefined' || typeof window.okexchain !== 'undefined') {
            try {
                const walletProvider = getWalletProvider();
                const accounts = await walletProvider.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    currentAccount = accounts[0];
                    initWeb3();
                    updateUI();
                }
            } catch (error) {
                console.error('检查钱包连接状态时出错:', error);
            }
        }
    }
    
    // 获取钱包提供者（支持MetaMask和OKX钱包）
    function getWalletProvider() {
        // 优先使用OKX钱包，如果可用
        if (typeof window.okexchain !== 'undefined') {
            return window.okexchain;
        }
        // 否则使用MetaMask或其他以太坊钱包
        else if (typeof window.ethereum !== 'undefined') {
            return window.ethereum;
        }
        return null;
    }
    
    // 初始化Web3实例
    function initWeb3() {
        const walletProvider = getWalletProvider();
        if (walletProvider) {
            web3Instance = new Web3(walletProvider);
        } else {
            console.error('请安装MetaMask或OKX钱包');
            showErrorMessage('请安装MetaMask或OKX钱包以使用聊天室功能');
        }
    }
    
    // 连接钱包
    async function connectWallet() {
        const walletProvider = getWalletProvider();
        if (walletProvider) {
            try {
                const accounts = await walletProvider.request({ method: 'eth_requestAccounts' });
                currentAccount = accounts[0];
                initWeb3();
                updateUI();
                await checkXdogBalance();
            } catch (error) {
                console.error('连接钱包时出错:', error);
                showErrorMessage('连接钱包失败');
            }
        } else {
            console.error('请安装MetaMask或OKX钱包');
            showErrorMessage('请安装MetaMask或OKX钱包以使用聊天室功能');
        }
    }
    
    // 检查XDOG余额
    async function checkXdogBalance() {
        if (!web3Instance || !currentAccount) return;
        
        try {
            // XDOG代币的ABI（简化版）
            const xdogTokenABI = [
                {
                    "constant": true,
                    "inputs": [{"name": "_owner", "type": "address"}],
                    "name": "balanceOf",
                    "outputs": [{"name": "balance", "type": "uint256"}],
                    "type": "function"
                }
            ];
            
            const xdogContract = new web3Instance.eth.Contract(xdogTokenABI, XDOG_CONTRACT_ADDRESS);
            const balance = await xdogContract.methods.balanceOf(currentAccount).call();
            
            // 假设XDOG代币有18位小数
            const balanceFormatted = (balance / 10 ** 18).toFixed(2);
            xdogBalance.textContent = balanceFormatted;
            
            // 显示余额信息
            walletBalanceInfo.classList.remove('hidden');
            
            // 验证余额是否满足要求
            if (parseFloat(balanceFormatted) >= MIN_BALANCE_REQUIRED) {
                isVerified = true;
                balanceCheckResult.innerHTML = '<span class="text-green-500"><i class="fa fa-check-circle"></i> 余额验证通过！</span>';
                
                // 如果还没有昵称，提示用户设置昵称
                if (!nicknameData.name) {
                    openNicknameModal();
                }
            } else {
                isVerified = false;
                balanceCheckResult.innerHTML = `<span class="text-red-500"><i class="fa fa-exclamation-circle"></i> 需要至少${MIN_BALANCE_REQUIRED}个XDOG才能进入聊天室</span>`;
            }
            
            updateUI();
        } catch (error) {
            console.error('检查XDOG余额时出错:', error);
            xdogBalance.textContent = '无法获取';
            balanceCheckResult.innerHTML = '<span class="text-red-500"><i class="fa fa-exclamation-circle"></i> 获取余额失败</span>';
        }
    }
    
    // 加载昵称数据
    function loadNicknameData() {
        const savedData = localStorage.getItem('xdogChatNickname');
        if (savedData) {
            try {
                nicknameData = JSON.parse(savedData);
                nicknameChangesLeft.textContent = nicknameData.changesLeft;
            } catch (error) {
                console.error('加载昵称数据失败:', error);
            }
        }
        
        // 更新UI显示当前昵称
        if (nicknameData.name) {
            userNickname.textContent = nicknameData.name;
        }
    }
    
    // 保存昵称数据
    function saveNicknameData() {
        localStorage.setItem('xdogChatNickname', JSON.stringify(nicknameData));
        nicknameChangesLeft.textContent = nicknameData.changesLeft;
    }
    
    // 打开更改昵称模态框
    function openNicknameModal() {
        nicknameInput.value = nicknameData.name || '';
        nicknameModal.classList.remove('hidden');
    }
    
    // 关闭更改昵称模态框
    function closeNicknameModal() {
        nicknameModal.classList.add('hidden');
    }
    
    // 更改昵称
    async function changeNickname(newNickname) {
        if (!newNickname.trim()) {
            showErrorMessage('昵称不能为空');
            return false;
        }
        
        // 检查是否需要支付费用
        if (nicknameData.changesLeft <= 0) {
            // 这里应该有支付XDOG的逻辑
            // 为了演示，我们跳过实际的支付逻辑
            console.log(`收取${NICKNAME_CHANGE_COST}个XDOG作为昵称更改费用`);
            
            // 模拟支付成功
            showSuccessMessage(`已收取${NICKNAME_CHANGE_COST}个XDOG作为昵称更改费用`);
        } else {
            // 减少免费更改次数
            nicknameData.changesLeft--;
        }
        
        // 更新昵称
        nicknameData.name = newNickname.trim();
        saveNicknameData();
        userNickname.textContent = nicknameData.name;
        
        return true;
    }
    
    // 加载聊天历史
    function loadChatHistory() {
        const chatHistory = localStorage.getItem('xdogChatHistory');
        if (chatHistory) {
            try {
                const messages = JSON.parse(chatHistory);
                messages.forEach(msg => addMessageToUI(msg.nickname, msg.content, msg.timestamp));
            } catch (error) {
                console.error('加载聊天历史失败:', error);
            }
        }
    }
    
    // 保存聊天历史
    function saveChatHistory(messages) {
        localStorage.setItem('xdogChatHistory', JSON.stringify(messages));
    }
    
    // 发送消息
    function sendMessage(content) {
        if (!content.trim() || !nicknameData.name) return;
        
        const timestamp = new Date().toISOString();
        const message = {
            nickname: nicknameData.name,
            content: content.trim(),
            timestamp: timestamp
        };
        
        // 添加消息到UI
        addMessageToUI(message.nickname, message.content, message.timestamp);
        
        // 保存消息（模拟X链上的永久保存）
        saveMessage(message);
        
        // 清空输入框
        messageInput.value = '';
    }
    
    // 添加消息到UI
    function addMessageToUI(nickname, content, timestamp) {
        const messageElement = document.createElement('div');
        messageElement.className = 'bg-dark rounded-lg p-3 border border-gray-800';
        
        const date = new Date(timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-secondary">${nickname}</span>
                <span class="text-xs text-gray-500">${timeString}</span>
            </div>
            <p class="text-gray-300">${content}</p>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // 滚动到最新消息
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // 保存消息（模拟X链上的永久保存）
    function saveMessage(message) {
        // 从localStorage加载现有消息
        const chatHistory = localStorage.getItem('xdogChatHistory') || '[]';
        const messages = JSON.parse(chatHistory);
        
        // 添加新消息
        messages.push(message);
        
        // 保留最新的100条消息
        if (messages.length > 100) {
            messages.splice(0, messages.length - 100);
        }
        
        // 保存回localStorage
        saveChatHistory(messages);
        
        // 这里应该有将消息发送到X链的逻辑
        console.log('将消息保存到X链:', message);
    }
    
    // 更新UI
    function updateUI() {
        if (currentAccount) {
            // 显示用户信息
            walletAddress.textContent = formatAddress(currentAccount);
            userInfo.classList.remove('hidden');
            
            // 更新按钮文本
            const isChinese = !document.querySelector('.zh').classList.contains('hidden');
            connectWalletBtn.innerHTML = `
                <span class="en">Connected</span>
                <span class="zh hidden">已连接</span>
            `;
            connectWalletBtn.classList.add('bg-green-600');
            connectWalletBtn.disabled = true;
        } else {
            // 重置按钮文本
            connectWalletBtn.innerHTML = `
                <span class="en">Connect Wallet</span>
                <span class="zh hidden">连接钱包</span>
            `;
            connectWalletBtn.classList.remove('bg-green-600');
            connectWalletBtn.disabled = false;
        }
        
        // 根据验证状态显示聊天室或验证界面
        if (isVerified && nicknameData.name) {
            walletVerification.classList.add('hidden');
            chatRoom.classList.remove('hidden');
            messageInput.disabled = false;
            sendMessageBtn.disabled = false;
        } else {
            walletVerification.classList.remove('hidden');
            chatRoom.classList.add('hidden');
            messageInput.disabled = true;
            sendMessageBtn.disabled = true;
        }
    }
    
    // 格式化地址（显示前6位和后4位）
    function formatAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    
    // 显示错误消息
    function showErrorMessage(message) {
        alert(message);
    }
    
    // 显示成功消息
    function showSuccessMessage(message) {
        alert(message);
    }
    
    // 设置事件监听器
    function setupEventListeners() {
        // 连接钱包按钮
        connectWalletBtn.addEventListener('click', connectWallet);
        
        // 更改昵称按钮
        changeNicknameBtn.addEventListener('click', openNicknameModal);
        
        // 取消更改昵称
        cancelNicknameBtn.addEventListener('click', closeNicknameModal);
        
        // 确认更改昵称
        confirmNicknameBtn.addEventListener('click', async function() {
            const newNickname = nicknameInput.value;
            if (await changeNickname(newNickname)) {
                closeNicknameModal();
                updateUI();
            }
        });
        
        // 发送消息
        sendMessageBtn.addEventListener('click', function() {
            sendMessage(messageInput.value);
        });
        
        // 按Enter发送消息
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage(messageInput.value);
            }
        });
        
        // 语言切换
        langToggle.addEventListener('click', function() {
            if (document.querySelector('.zh').classList.contains('hidden')) {
                switchToChinese();
            } else {
                switchToEnglish();
            }
            // 更新连接按钮的语言
            if (currentAccount) {
                updateUI();
            }
        });
        
        // 移动端菜单事件
        if (window.innerWidth < 768) {
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileLangToggle = document.getElementById('mobileLangToggle');
            const mobileConnectWalletBtn = document.getElementById('mobileConnectWalletBtn');
            
            // 打开移动端菜单
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.remove('hidden');
            });
            
            // 关闭移动端菜单
            closeMobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
            
            // 移动端语言切换
        mobileLangToggle.addEventListener('click', function() {
            toggleLanguage();
            updateMobileLangToggleText();
        });
            
            // 移动端连接钱包
            mobileConnectWalletBtn.addEventListener('click', function() {
                connectWallet();
                mobileMenu.classList.add('hidden');
            });
            
            // 初始化移动端语言切换按钮文本
            updateMobileLangToggleText();
        }
        
        // 监听钱包账户变化
        const walletProvider = getWalletProvider();
        if (walletProvider) {
            walletProvider.on('accountsChanged', function(accounts) {
                if (accounts.length > 0) {
                    currentAccount = accounts[0];
                    updateUI();
                    checkXdogBalance();
                } else {
                    currentAccount = null;
                    isVerified = false;
                    updateUI();
                }
            });
        }
    }
    
    // 更新移动端语言切换按钮文本
    function updateMobileLangToggleText() {
        const mobileLangToggle = document.getElementById('mobileLangToggle');
        if (mobileLangToggle) {
            const enText = mobileLangToggle.querySelector('.en');
            const zhText = mobileLangToggle.querySelector('.zh');
            
            if (currentLanguage === 'en') {
                enText.textContent = 'Switch to Chinese';
                zhText.textContent = '切换到英文';
            } else {
                enText.textContent = '切换到中文';
                zhText.textContent = 'Switch to English';
            }
        }
    }
    
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);
    
    // 暴露公共接口
    window.XDOGChat = {
        init: init,
        connectWallet: connectWallet,
        sendMessage: sendMessage
    };
})();