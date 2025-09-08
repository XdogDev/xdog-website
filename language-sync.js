/**
 * XDOG网站语言同步机制
 * 确保所有页面间的语言设置保持一致
 */

// 语言切换和同步功能
const XDOG_LANGUAGE = {
    // 初始化语言设置
    init: function() {
        // 检查并应用保存的语言偏好
        this.checkLanguagePreference();
        
        // 设置语言切换按钮的事件监听器
        this.setupLanguageToggleButtons();
        
        // 设置localStorage变化的监听器，用于页面间同步
        this.setupStorageSync();
    },
    
    // 检查并应用保存的语言偏好
    checkLanguagePreference: function() {
        const savedLanguage = localStorage.getItem('xdogLanguage');
        const currentLang = this.getCurrentLanguage();
        
        // 如果有保存的语言偏好且与当前语言不同，则切换语言
        if (savedLanguage && savedLanguage !== currentLang) {
            this.toggleLanguage(true); // 传入true表示从localStorage同步
        }
    },
    
    // 设置语言切换按钮的事件监听器
    setupLanguageToggleButtons: function() {
        // 导航栏语言切换按钮
        const langToggle = document.getElementById('langToggle');
        const mobileLangToggle = document.getElementById('mobileLangToggle');
        
        // 个人资料页面的语言切换按钮
        const zhBtn = document.getElementById('zhBtn');
        const enBtn = document.getElementById('enBtn');
        
        // 为导航栏按钮添加事件监听
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }
        
        if (mobileLangToggle) {
            mobileLangToggle.addEventListener('click', () => this.toggleLanguage());
        }
        
        // 为个人资料页面按钮添加事件监听
        if (zhBtn) {
            zhBtn.addEventListener('click', () => {
                if (this.getCurrentLanguage() !== 'zh') {
                    this.toggleLanguage();
                }
                if (zhBtn.classList) zhBtn.classList.add('active');
                if (enBtn && enBtn.classList) enBtn.classList.remove('active');
            });
        }
        
        if (enBtn) {
            enBtn.addEventListener('click', () => {
                if (this.getCurrentLanguage() !== 'en') {
                    this.toggleLanguage();
                }
                if (enBtn.classList) enBtn.classList.add('active');
                if (zhBtn && zhBtn.classList) zhBtn.classList.remove('active');
            });
        }
    },
    
    // 设置localStorage变化的监听器
    setupStorageSync: function() {
        // 监听localStorage变化，实现页面间同步
        window.addEventListener('storage', (e) => {
            if (e.key === 'xdogLanguage') {
                this.checkLanguagePreference();
            }
        });
        
        // 添加一个自定义事件，用于同一页面内的组件间同步
        document.addEventListener('xdogLanguageChanged', () => {
            this.checkLanguagePreference();
        });
    },
    
    // 获取当前语言
    getCurrentLanguage: function() {
        const enElements = document.querySelectorAll('.en');
        
        // 如果第一个英文元素可见，则当前语言为英文
        if (enElements.length > 0 && !enElements[0].classList.contains('hidden')) {
            return 'en';
        }
        
        return 'zh'; // 否则为中文
    },
    
    // 切换语言
    toggleLanguage: function(fromStorageSync) {
        const enElements = document.querySelectorAll('.en');
        const zhElements = document.querySelectorAll('.zh');
        const currentLang = this.getCurrentLanguage();
        
        if (currentLang === 'en') {
            // 切换到中文
            enElements.forEach(el => el.classList.add('hidden'));
            zhElements.forEach(el => el.classList.remove('hidden'));
            localStorage.setItem('xdogLanguage', 'zh');
        } else {
            // 切换到英文
            enElements.forEach(el => el.classList.remove('hidden'));
            zhElements.forEach(el => el.classList.add('hidden'));
            localStorage.setItem('xdogLanguage', 'en');
        }
        
        // 如果不是从localStorage同步触发的切换，则触发自定义事件
        if (!fromStorageSync) {
            document.dispatchEvent(new Event('xdogLanguageChanged'));
        }
        
        // 更新语言切换按钮的文本
        this.updateLanguageToggleText();
    },
    
    // 更新语言切换按钮的文本
    updateLanguageToggleText: function() {
        const langToggle = document.getElementById('langToggle');
        const mobileLangToggle = document.getElementById('mobileLangToggle');
        const currentLang = this.getCurrentLanguage();
        
        // 查找按钮中的中英文文本元素
        if (langToggle) {
            const enText = langToggle.querySelector('.en');
            const zhText = langToggle.querySelector('.zh');
            
            if (enText && zhText) {
                if (currentLang === 'en') {
                    enText.textContent = '中文';
                    zhText.textContent = 'English';
                } else {
                    enText.textContent = '中文';
                    zhText.textContent = 'English';
                }
            }
        }
        
        if (mobileLangToggle) {
            const enText = mobileLangToggle.querySelector('.en');
            const zhText = mobileLangToggle.querySelector('.zh');
            
            if (enText && zhText) {
                if (currentLang === 'en') {
                    enText.textContent = '中文';
                    zhText.textContent = 'English';
                } else {
                    enText.textContent = '中文';
                    zhText.textContent = 'English';
                }
            }
        }
    }
};

// 页面加载完成后初始化语言同步功能
document.addEventListener('DOMContentLoaded', function() {
    XDOG_LANGUAGE.init();
});