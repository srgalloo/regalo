// Funciones de utilidad para delays asíncronos limpios
const delay = ms => new Promise(res => setTimeout(res, ms));

// Sistema de partículas de polvo ambiental (Cinematic)
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('ambient-particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numParticles = window.innerWidth < 600 ? 30 : 60;
        this.animationFrame = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        for(let i = 0; i < this.numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2 - 0.1,
                alpha: Math.random() * 0.5 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            // Loop en bordes
            if(p.x < 0) p.x = this.canvas.width;
            if(p.x > this.canvas.width) p.x = 0;
            if(p.y < 0) p.y = this.canvas.height;
            if(p.y > this.canvas.height) p.y = 0;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`; // Tono oro cálido
            this.ctx.fill();
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

const particles = new ParticleSystem();