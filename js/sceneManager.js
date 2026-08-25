class SceneManager {
    constructor() {
        this.currentSceneId = 'scene-welcome';
        this.isTransitioning = false;
    }

    async transitionTo(newSceneId) {
        if(this.isTransitioning || this.currentSceneId === newSceneId) return;
        this.isTransitioning = true;

        const currentEl = document.getElementById(this.currentSceneId);
        const newEl = document.getElementById(newSceneId);

        // Fade out actual
        currentEl.style.opacity = '0';
        await delay(1500);
        currentEl.classList.remove('active');
        currentEl.style.display = 'none';

        // Preparar y Fade In nuevo
        newEl.style.display = 'flex';
        // Forzar reflow
        void newEl.offsetWidth;
        
        newEl.classList.add('active');
        newEl.style.opacity = '1';
        
        this.currentSceneId = newSceneId;
        this.isTransitioning = false;
        await delay(500); // Pequeña pausa antes de permitir interacciones en la nueva escena
    }
}

const sceneManager = new SceneManager();