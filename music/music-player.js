// 全局音乐播放器，使用 localStorage 保持播放状态
(function() {
    if (window.__musicPlayerInjected) return;
    window.__musicPlayerInjected = true;

    // 创建播放器容器
    const player = document.createElement('div');
    player.className = 'music-player-global';
    player.innerHTML = `
        <img class="music-cover" src="../images/art.jpg" alt="音乐封面" onerror="this.style.display='none'">
        <div class="music-info">
            <div class="music-title">背景音乐</div>
            <div class="music-progress"><div class="music-progress-bar"></div></div>
            <div class="music-controls">
                <button class="music-btn music-play" title="播放/暂停"><i class="fa fa-play"></i></button>
                <button class="music-btn music-mute" title="静音"><i class="fa fa-volume-up"></i></button>
            </div>
        </div>
        <audio class="music-audio" src="music/bgm.mp3" preload="auto" loop></audio>
    `;
    document.body.appendChild(player);

    // 加载样式
    if (!document.querySelector('link[href*="music-player.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'music/music-player.css';
        document.head.appendChild(link);
    }
    // 加载 FontAwesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    const audio = player.querySelector('.music-audio');
    const playBtn = player.querySelector('.music-play');
    const muteBtn = player.querySelector('.music-mute');
    const progressBar = player.querySelector('.music-progress-bar');
    const playIcon = playBtn.querySelector('i');
    const muteIcon = muteBtn.querySelector('i');

    // 保持播放状态
    let lastTime = parseFloat(localStorage.getItem('musicPlayerTime') || '0');
    let lastPaused = localStorage.getItem('musicPlayerPaused') === 'true';
    let lastMuted = localStorage.getItem('musicPlayerMuted') === 'true';
    audio.currentTime = lastTime;
    audio.muted = lastMuted;
    if (!lastPaused) {
        audio.play().catch(()=>{});
        playIcon.className = 'fa fa-pause';
    }
    if (lastMuted) {
        muteIcon.className = 'fa fa-volume-mute';
    }

    // 播放/暂停
    playBtn.onclick = function() {
        if (audio.paused) {
            audio.play();
            playIcon.className = 'fa fa-pause';
            localStorage.setItem('musicPlayerPaused', 'false');
        } else {
            audio.pause();
            playIcon.className = 'fa fa-play';
            localStorage.setItem('musicPlayerPaused', 'true');
        }
    };
    // 静音
    muteBtn.onclick = function() {
        audio.muted = !audio.muted;
        muteIcon.className = audio.muted ? 'fa fa-volume-mute' : 'fa fa-volume-up';
        localStorage.setItem('musicPlayerMuted', audio.muted ? 'true' : 'false');
    };
    // 进度条
    audio.ontimeupdate = function() {
        progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
        localStorage.setItem('musicPlayerTime', audio.currentTime);
    };
    // 点击进度条跳转
    player.querySelector('.music-progress').onclick = function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    };
    // 页面卸载时保存状态
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('musicPlayerTime', audio.currentTime);
        localStorage.setItem('musicPlayerPaused', audio.paused ? 'true' : 'false');
        localStorage.setItem('musicPlayerMuted', audio.muted ? 'true' : 'false');
    });
})();
