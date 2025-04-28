// 侧边栏控制
document.addEventListener('DOMContentLoaded', function() {
    // 初始提示弹窗控制
    const initialNotice = document.getElementById('initialNotice');
    const noticeConfirm = document.getElementById('noticeConfirm');
    const countdown = document.querySelector('.countdown');
    
    // 检查是否是直接访问首页，且不在24小时确认期内
    if ((document.referrer === '' || document.referrer.indexOf(window.location.origin) === -1) && !isWithin24Hours()) {
        let timer = 6;
        initialNotice.classList.add('show');
        
        // 倒计时
        const countdownInterval = setInterval(() => {
            timer--;
            countdown.textContent = timer;
            
            if (timer <= 0) {
                clearInterval(countdownInterval);
                noticeConfirm.removeAttribute('disabled');
                noticeConfirm.classList.add('active');
                countdown.textContent = '0';
            }
        }, 1000);
        
        // 确认按钮点击事件
        noticeConfirm.addEventListener('click', () => {
            if (!noticeConfirm.disabled) {
                initialNotice.classList.remove('show');
                // 记录确认时间
                localStorage.setItem('noticeConfirmTime', Date.now().toString());
            }
        });
    }

    // 检查是否在24小时内已确认
    function isWithin24Hours() {
        const lastConfirmTime = localStorage.getItem('noticeConfirmTime');
        if (!lastConfirmTime) return false;
        
        const now = Date.now();
        const hoursPassed = (now - parseInt(lastConfirmTime)) / (1000 * 60 * 60);
        return hoursPassed < 24;
    }

    // 显示页面
    document.body.classList.add('visible');

    // 侧边栏控制
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const mainContent = document.querySelector('.main-content');
    const closeSidebarBtn = document.querySelector('.close-sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
        });
    }

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }

    // 点击侧边栏外部关闭侧边栏
    document.addEventListener('click', function(e) {
        if (sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // 欢迎弹窗控制
    const welcomePopup = document.getElementById('welcome-popup');
    const closePopupBtn = document.querySelector('.close-popup');

    if (welcomePopup) {
        // 检查是否已经显示过弹窗
        if (!localStorage.getItem('popupShown')) {
            setTimeout(() => {
                welcomePopup.style.display = 'block';
                welcomePopup.classList.add('moving');
                
                // 随机移动弹窗
                setInterval(() => {
                    const x = Math.random() * (window.innerWidth - welcomePopup.offsetWidth);
                    const y = Math.random() * (window.innerHeight - welcomePopup.offsetHeight);
                    welcomePopup.style.setProperty('--random-x', x + 'px');
                    welcomePopup.style.setProperty('--random-y', y + 'px');
                }, 2000);
            }, 1000);
        }

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function() {
                welcomePopup.classList.add('hide');
                setTimeout(() => {
                    welcomePopup.style.display = 'none';
                }, 500);
                // 记录弹窗已显示
                localStorage.setItem('popupShown', 'true');
            });
        }
    }

    // 滚动动画效果
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in, .slide-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // 监听滚动事件
    window.addEventListener('scroll', animateOnScroll);
    // 初始检查
    animateOnScroll();

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 为所有卡片添加鼠标悬停效果
    const cards = document.querySelectorAll('.campus-card, .news-item, .info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // 表单验证
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('invalid');
                    
                    // 添加抖动动画
                    field.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        field.style.animation = '';
                    }, 500);
                } else {
                    field.classList.remove('invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('请填写所有必填项！');
            }
        });
    });

    // 主题相关元素
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeModal = document.getElementById('themeModal');
    const normalDarkMode = document.getElementById('normalDarkMode');
    const specialDarkMode = document.getElementById('specialDarkMode');
    const spotlightMask = document.getElementById('spotlightMask');
    const spotlightCenter = document.getElementById('spotlightCenter');
    
    // 从本地存储中获取主题设置
    const currentTheme = localStorage.getItem('theme');
    const isSpecialDark = localStorage.getItem('specialDark') === 'true';
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme === 'dark');
        if (isSpecialDark && currentTheme === 'dark') {
            enableSpotlightEffect();
        }
    }
    
    // 切换主题
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            // 从任何深色模式切换到亮色模式
            disableSpotlightEffect();
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
            localStorage.removeItem('specialDark');
            updateThemeIcon(false);
        } else {
            // 从亮色模式切换到深色模式，显示选择弹窗
            themeModal.classList.add('show');
        }
    });
    
    // 正常深色模式
    normalDarkMode.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        localStorage.setItem('specialDark', 'false');
        updateThemeIcon(true);
        themeModal.classList.remove('show');
    });
    
    // 特殊深色模式
    specialDarkMode.addEventListener('click', () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        localStorage.setItem('specialDark', 'true');
        updateThemeIcon(true);
        themeModal.classList.remove('show');
        enableSpotlightEffect();
    });
    
    // 更新主题图标
    function updateThemeIcon(isDark) {
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // 启用聚光灯效果
    function enableSpotlightEffect() {
        spotlightMask.classList.add('active');
        spotlightCenter.classList.add('active');
        document.body.style.cursor = 'none';
        
        // 计算聚光灯大小（屏幕对角线的八分之一）
        const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
        const spotlightSize = screenDiagonal / 8;
        document.documentElement.style.setProperty('--spotlight-size', spotlightSize + 'px');
        
        // 监听鼠标移动
        document.addEventListener('mousemove', updateSpotlightPosition);
        // 监听窗口大小变化
        window.addEventListener('resize', updateSpotlightSize);
    }
    
    // 禁用聚光灯效果
    function disableSpotlightEffect() {
        spotlightMask.classList.remove('active');
        spotlightCenter.classList.remove('active');
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', updateSpotlightPosition);
        window.removeEventListener('resize', updateSpotlightSize);
    }
    
    // 更新聚光灯位置
    function updateSpotlightPosition(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        // 更新遮罩层的渐变位置
        spotlightMask.style.webkitMaskImage = `radial-gradient(circle at ${x}px ${y}px, transparent 0, transparent var(--spotlight-size), black calc(var(--spotlight-size) + 50px))`;
        spotlightMask.style.maskImage = `radial-gradient(circle at ${x}px ${y}px, transparent 0, transparent var(--spotlight-size), black calc(var(--spotlight-size) + 50px))`;
        
        // 更新中心点位置
        spotlightCenter.style.left = x + 'px';
        spotlightCenter.style.top = y + 'px';
    }
    
    // 更新聚光灯大小
    function updateSpotlightSize() {
        const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
        const spotlightSize = screenDiagonal / 8;
        document.documentElement.style.setProperty('--spotlight-size', spotlightSize + 'px');
    }

    // 扇形菜单控制
    const radialMenuToggle = document.querySelector('.radial-menu-toggle');
    const radialMenu = document.querySelector('.radial-menu');

    if (radialMenuToggle && radialMenu) {
        radialMenuToggle.addEventListener('click', function() {
            radialMenu.classList.toggle('active');
            radialMenuToggle.querySelector('i').classList.toggle('fa-plus');
            radialMenuToggle.querySelector('i').classList.toggle('fa-times');
        });

        // 点击其他地方关闭扇形菜单
        document.addEventListener('click', function(e) {
            if (!radialMenu.contains(e.target) && !radialMenuToggle.contains(e.target)) {
                radialMenu.classList.remove('active');
                const icon = radialMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-plus');
            }
        });
    }

    // 全屏菜单控制
    const fullscreenMenuToggle = document.querySelector('.fullscreen-menu-toggle');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    
    if (fullscreenMenuToggle && fullscreenMenu) {
        fullscreenMenuToggle.addEventListener('click', function() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            // 计算从右上角到最远角的距离作为扩散的最大半径
            const maxRadius = Math.sqrt(Math.pow(windowWidth, 2) + Math.pow(windowHeight, 2));
            
            fullscreenMenu.classList.toggle('active');
            fullscreenMenuToggle.classList.toggle('active');
            
            // 设置扩散圆的缩放比例
            const beforeElement = fullscreenMenu.querySelector('::before');
            if (beforeElement) {
                beforeElement.style.transform = `scale(${maxRadius})`;
            }
            
            const icon = fullscreenMenuToggle.querySelector('i');
            if (fullscreenMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });

        // 绑定ESC键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
                fullscreenMenu.classList.remove('active');
                fullscreenMenuToggle.classList.remove('active');
                const icon = fullscreenMenuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }

    // 全屏菜单中的背景追踪效果
    function setupMenuBackgroundTracking() {
        const menuCategories = document.querySelectorAll('.menu-category');
        
        menuCategories.forEach(category => {
            const links = category.querySelector('.menu-links');
            const menuItems = links.querySelectorAll('a');
            
            menuItems.forEach((item, index) => {
                item.addEventListener('mouseenter', () => {
                    const offset = item.offsetTop;
                    links.style.setProperty('--highlight-offset', `${offset}px`);
                });
            });

            // 鼠标离开菜单分类时重置背景位置
            links.addEventListener('mouseleave', () => {
                links.style.setProperty('--highlight-offset', '0px');
            });
        });
    }

    // 当全屏菜单打开时初始化背景追踪
    document.addEventListener('DOMContentLoaded', () => {
        const fullscreenMenu = document.querySelector('.fullscreen-menu');
        if (fullscreenMenu) {
            fullscreenMenu.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'visibility' && fullscreenMenu.classList.contains('active')) {
                    setupMenuBackgroundTracking();
                }
            });
        }
    });

    // 监听滚动事件，控制导航栏透明度
    const nav = document.querySelector('.nav-container');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // 当滚动超过100px时添加scrolled类
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // VR导航按钮控制
    const vrBtns = document.querySelectorAll('.vr-btn');
    const vrModal = document.getElementById('vrModal');
    const onlineVRBtn = document.getElementById('onlineVR');
    const localVRBtn = document.getElementById('localVR');

    if (vrBtns && vrModal && onlineVRBtn && localVRBtn) {
        vrBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                vrModal.style.display = 'flex';
            });
        });

        // 点击模态框外部关闭
        vrModal.addEventListener('click', function(e) {
            if (e.target === vrModal) {
                vrModal.style.display = 'none';
            }
        });

        // 在线VR按钮
        onlineVRBtn.addEventListener('click', function() {
            window.open('https://www.chzu.edu.cn/vr/index.html', '_blank');
            vrModal.style.display = 'none';
        });

        // 本地VR按钮
        localVRBtn.addEventListener('click', function() {
            vrModal.style.display = 'none';
            // 创建下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = 'vr/start_vr_server.bat';
            downloadLink.download = 'start_vr_server.bat';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // 显示提示
            alert('如果未跳转请打开vr文件夹并运行start_vr_server.bat文件来启动VR服务器。\n注意：需要安装Python环境。');
        });
    }
});

// 添加抖动动画的关键帧
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .invalid {
        border-color: #ff4444 !important;
    }
`;
document.head.appendChild(style);

// 自动引入全局音乐播放器
(function(){
    var script = document.createElement('script');
    script.src = 'music/music-player.js';
    script.defer = true;
    document.head.appendChild(script);
})();
