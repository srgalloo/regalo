class AudioManager {
    constructor() {
        this.audio = new Audio('assets/music/cancion.mp3');
        this.audio.loop = true;
        this.isPlaying = false;
        this.fadeInterval = null;
        
        // Elementos UI
        this.playerUI = document.getElementById('audio-player');
        this.playBtn = document.getElementById('play-pause-btn');
        this.progressFill = document.getElementById('progress-fill');
        
        this.setupListeners();
    }

    setupListeners() {
        this.playBtn.addEventListener('click', () => this.toggle());
        this.audio.addEventListener('timeupdate', () => {
            if(this.audio.duration) {
                const percent = (this.audio.currentTime / this.audio.duration) * 100;
                this.progressFill.style.width = `${percent}%`;
            }
        });
        
        // Fallback en caso de que el archivo no exista localmente (evitar que rompa la exp)
        this.audio.addEventListener('error', () => {
            console.warn('Audio file not found. Running experience silently.');
            this.playerUI.classList.add('hidden');
        });
    }

    playWithFadeIn(duration = 2000) {
        if(this.isPlaying) return;
        
        this.playerUI.classList.remove('hidden');
        this.audio.volume = 0;
        
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.fade(1, duration);
            }).catch(e => console.log('Auto-play prevented', e));
        }
    }

    fadeOut(duration = 2000) {
        if(!this.isPlaying) return;
        this.fade(0, duration, () => {
            this.audio.pause();
            this.isPlaying = false;
        });
    }

    fade(targetVolume, duration, callback = null) {
        clearInterval(this.fadeInterval);
        const steps = 20;
        const stepTime = duration / steps;
        const volStep = (targetVolume - this.audio.volume) / steps;

        this.fadeInterval = setInterval(() => {
            let newVol = this.audio.volume + volStep;
            if((volStep > 0 && newVol >= targetVolume) || (volStep < 0 && newVol <= targetVolume)) {
                this.audio.volume = targetVolume;
                clearInterval(this.fadeInterval);
                if(callback) callback();
            } else {
                this.audio.volume = newVol;
            }
        }, stepTime);
    }

    toggle() {
        if(this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play();
            this.isPlaying = true;
        }
    }

    stopAndReset() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.playerUI.classList.add('hidden');
    }
}

const audioManager = new AudioManager();