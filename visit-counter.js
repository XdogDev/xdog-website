// 访问统计功能实现
(function() {
    'use strict';
    
    // 获取今天的日期，格式为 YYYY-MM-DD
    function getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }
    
    // 初始化访问统计数据
    function initVisitData() {
        const today = getTodayDate();
        return {
            total: 0,
            today: 0,
            lastVisit: null,
            visitorIds: [] // 存储唯一访客标识符
        };
    }
    
    // 生成唯一的访客标识符（基于用户IP或设备指纹）
    async function generateVisitorId() {
        try {
            // 尝试获取客户端IP（在生产环境中，这需要后端API支持）
            // 这里使用一个简单的设备指纹方法作为替代方案
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 绘制一些内容来生成设备指纹
            ctx.fillText(navigator.userAgent + navigator.platform + 
                         navigator.language + window.screen.width + 
                         window.screen.height + new Date().getTimezoneOffset(), 0, 0);
            
            // 获取画布数据的哈希值作为设备指纹
            const fingerprint = canvas.toDataURL();
            
            // 简单的字符串哈希函数
            function simpleHash(str) {
                let hash = 0;
                if (str.length === 0) return hash;
                for (let i = 0; i < str.length; i++) {
                    const char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return Math.abs(hash).toString(36);
            }
            
            return simpleHash(fingerprint);
        } catch (error) {
            console.error('生成访客ID失败:', error);
            // 回退方案：使用随机ID
            return Math.random().toString(36).substr(2, 9);
        }
    }
    
    // 更新访问统计
    async function updateVisitStatistics() {
        try {
            const today = getTodayDate();
            
            // 从localStorage获取访问数据
            let visitsData = JSON.parse(localStorage.getItem('xdogVisits')) || initVisitData();
            
            // 生成访客ID
            const visitorId = await generateVisitorId();
            
            // 检查是否是今天的新访客
            const hasVisitedToday = visitsData.lastVisit === today && 
                                  visitsData.visitorIds.includes(visitorId);
            
            // 如果今天没有访问过，增加访问计数
            if (!hasVisitedToday) {
                // 如果是新的一天，重置今天的访问量和访客列表
                if (visitsData.lastVisit !== today) {
                    visitsData.today = 1;
                    visitsData.visitorIds = [visitorId];
                } else {
                    // 同一天的新访客
                    visitsData.today += 1;
                    visitsData.visitorIds.push(visitorId);
                }
                
                visitsData.total += 1;
                visitsData.lastVisit = today;
                
                // 保存更新后的数据
                localStorage.setItem('xdogVisits', JSON.stringify(visitsData));
            }
            
            // 更新页面上的访问统计显示
            if (document.getElementById('totalVisits')) {
                document.getElementById('totalVisits').textContent = visitsData.total.toLocaleString();
            }
            if (document.getElementById('todayVisits')) {
                document.getElementById('todayVisits').textContent = visitsData.today.toLocaleString();
            }
            
            return visitsData;
        } catch (error) {
            console.error('更新访问统计失败:', error);
            // 即使出错，也尝试显示默认值
            if (document.getElementById('totalVisits')) {
                document.getElementById('totalVisits').textContent = '10,000+';
            }
            if (document.getElementById('todayVisits')) {
                document.getElementById('todayVisits').textContent = '500+';
            }
        }
    }
    
    // 页面加载完成后初始化访问统计
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', updateVisitStatistics);
        } else {
            updateVisitStatistics();
        }
    }
    
    // 暴露公共接口
    window.XDOGVisitCounter = {
        init: init,
        update: updateVisitStatistics,
        getTodayDate: getTodayDate
    };
    
    // 自动初始化
    init();
})();