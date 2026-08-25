document.addEventListener('DOMContentLoaded', () => {
    initWelcomeScene();
    setupEventListeners();
});

function initWelcomeScene() {
    const texts = document.querySelectorAll('#scene-welcome .fade-text');
    texts.forEach(el => {
        const d = el.getAttribute('data-delay');
        setTimeout(() => el.classList.add('show'), parseInt(d));
    });
}

function setupEventListeners() {
    // Escena 0 -> 1
    document.getElementById('btn-start').addEventListener('click', async () => {
        document.getElementById('scene-welcome').style.opacity = 0;
        await sceneManager.transitionTo('scene-box');
    });

    // Escena 1 -> Apertura
    document.getElementById('btn-open-box').addEventListener('click', async function() {
        this.style.opacity = 0;
        this.style.pointerEvents = 'none';
        
        const boxContainer = document.getElementById('gift-box-container');
        boxContainer.classList.add('box-open');
        
        audioManager.playWithFadeIn();
        
        await delay(2500);
        initCardsScene();
        await sceneManager.transitionTo('scene-cards');
    });

    // Tarjetas Navegación
    document.getElementById('btn-prev-card').addEventListener('click', () => navigateCards(-1));
    document.getElementById('btn-next-card').addEventListener('click', () => navigateCards(1));

    // Escena 1.5 (Tarjetas) -> Escena 2 (Frasco)
    document.getElementById('btn-finish-cards').addEventListener('click', async () => {
        await sceneManager.transitionTo('scene-jar');
    });

    // Descubrir Flores (Cinematográfico)
    document.getElementById('btn-reveal-flowers').addEventListener('click', async function() {
        document.getElementById('flowers-intro').classList.add('hidden');
        const revealContainer = document.getElementById('flowers-reveal-container');
        revealContainer.classList.remove('hidden');
        
        const fGlow = document.getElementById('f-glow');
        const fImg = document.getElementById('f-img');
        
        fGlow.classList.remove('hidden-layer');
        fGlow.classList.add('fade-in');
        
        fImg.classList.remove('hidden-layer');
        fImg.classList.add('reveal-cinematic');
        
        await delay(2500);
        document.getElementById('flowers-message').classList.remove('hidden');
    });

    // Escena 2 -> 3 (Cena)
    document.getElementById('btn-finish-flowers').addEventListener('click', async () => {
        await sceneManager.transitionTo('scene-dinner');
        buildDinnerScene();
    });

    // Escena 3 -> Final
    document.getElementById('btn-final-scene').addEventListener('click', async () => {
        await sceneManager.transitionTo('scene-final');
        startCountdown();
        const texts = document.querySelectorAll('#scene-final .fade-text');
        texts.forEach(el => {
            const d = el.getAttribute('data-delay');
            setTimeout(() => el.classList.add('show'), parseInt(d));
        });
    });

    // Reiniciar
    document.getElementById('btn-restart').addEventListener('click', () => {
        location.reload();
    });

    // --- LÓGICA DEL FRASCO DE RECUERDOS ---

    document.getElementById('btn-open-jar').addEventListener('click', async function() {
        document.getElementById('jar-ui').style.opacity = 0;
        this.style.pointerEvents = 'none';

        const lid = document.getElementById('jar-lid');
        lid.style.transform = 'translateY(-100px) rotate(20deg)';
        lid.style.opacity = '0';

        await delay(800);

        document.querySelector('.jar-contents-fake').style.opacity = 0;
        document.getElementById('jar-wrapper').style.opacity = 0.3;

        liberarEstrellas();
    });

    document.getElementById('btn-finish-jar').addEventListener('click', async () => {
        await sceneManager.transitionTo('scene-flowers');
        
        const texts = document.querySelectorAll('#flowers-intro .fade-text');
        texts.forEach(el => {
            const d = el.getAttribute('data-delay');
            setTimeout(() => el.classList.add('show'), parseInt(d));
        });
    });

    document.getElementById('btn-close-strip').addEventListener('click', () => {
        const modal = document.getElementById('paper-modal');
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            
            if (memoriesRead === memories.length) {
                // Desvanecer el frasco completamente
                const jarWrapper = document.getElementById('jar-wrapper');
                jarWrapper.style.transition = 'opacity 1.5s ease';
                jarWrapper.style.opacity = '0';
                
                document.getElementById('jar-outro').classList.add('visible-layer');
            }
        }, 500);
    });
}

// ===================== TARJETAS (16 imágenes) =====================
const cardData = Array.from({ length: 16 }, (_, i) => `assets/img/tarjeta-${i + 1}.png`);
let currentCard = 0;

function initCardsScene() {
    const container = document.querySelector('.cards-container');
    container.innerHTML = '';
    
    cardData.forEach((imgSrc, index) => {
        const card = document.createElement('div');
        card.className = `card ${index === 0 ? 'active' : 'next'}`;
        card.innerHTML = `<img src="${imgSrc}" alt="Mensaje ${index + 1}" class="card-img">`;
        card.dataset.index = index;
        container.appendChild(card);
    });
    updateCardNav();
}

function navigateCards(direction) {
    const cards = document.querySelectorAll('.card');
    if (currentCard + direction < 0 || currentCard + direction >= cards.length) return;
    
    cards[currentCard].className = `card ${direction > 0 ? 'prev' : 'next'}`;
    currentCard += direction;
    cards[currentCard].className = 'card active';
    
    updateCardNav();
}

function updateCardNav() {
    const total = cardData.length;
    const current = String(currentCard + 1).padStart(2, '0');
    const count = String(total).padStart(2, '0');
    document.getElementById('card-counter').innerText = `${current} / ${count}`;
    
    document.getElementById('btn-prev-card').style.opacity = currentCard === 0 ? '0.3' : '1';
    
    if (currentCard === total - 1) {
        document.getElementById('btn-next-card').style.opacity = '0.3';
        document.getElementById('cards-outro').classList.remove('hidden');
    } else {
        document.getElementById('btn-next-card').style.opacity = '1';
        document.getElementById('cards-outro').classList.add('hidden');
    }
}

// ===================== FRASCO DE RECUERDOS =====================
const memories = [
    "El primer dia, ese primer dia que estuvimos juntos por primera vez en el liceo, cual de los dos mas nervioso. YO te comia con la mirada y usted no queriendo que la vea, esa carita tan hermosa como simpre y sonrojada como un tomate.",
    "Aquella tarde en la que salimos a comprar algo a la tienda, dios como me gustaba ir contigo, me encantaba ir contigo agarrados de mano. Y ese dia que me diste el primer beso frente al hospital iba yo feliz con la sonrisa de esquina a esquina.",
    "Cuando siempre estabamos juntos en el liceo, iba yo con mi mujeron de lao a lao. La unica vez que me encantaban los dias de semana y no los fines de semana ni las vacaciones por que no podria verte.",
    "Un recuerdo de algo muy simple que hiciste y que no he podido olvidar, cuando yo arrancaba las hojas de matas que estuvieran cerca y usted me daba para que no lo hiciera, ehhhh eso eh abuso y entonces yo lo hacia con mas gusto, y otro es cuando me dabas nalga y yo tenia que correrte.",
    "Todas esas veces que me hiciste reír cuando más lo necesitaba, el cambio que me daba con un solo mensaje o una foto que me enviaras, quedarme como un bobo viendo una foto 10 minutos.",
    "Cada vez que me despertaba tu mensaje en la mañana, ese simple hola o una foto random, me arrancaba una sonrisa que no me la quitaba en todo el dia. Tus mensajes eran lo primero que buscaba y lo ultimo que leia antes de dormirme."
];

let memoriesRead = 0;
let starsElements = [];

function liberarEstrellas() {
    const universe = document.getElementById('stars-universe');
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.35; 
    const totalStars = memories.length;

    memories.forEach((memoryText, index) => {
        const star = document.createElement('div');
        star.className = 'origami-star';
        
        star.style.left = `calc(50% - 12.5px)`; 
        star.style.top = `calc(50% - 12.5px)`;
        
        universe.appendChild(star);
        starsElements.push(star);

        const angle = (index / totalStars) * (Math.PI * 2);
        const adjustedAngle = angle - (Math.PI / 2); 
        
        const moveX = Math.cos(adjustedAngle) * radius;
        const moveY = Math.sin(adjustedAngle) * radius;

        setTimeout(() => {
            star.style.opacity = 1;
            star.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.5s ease';
            star.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${Math.random() * 360}deg)`;
        }, index * 800); 

        star.addEventListener('click', () => abrirRecuerdo(star, memoryText));
    });
}

function abrirRecuerdo(starElement, text) {
    if (starElement.classList.contains('opened')) return;

    const modal = document.getElementById('paper-modal');
    document.getElementById('memory-text').innerText = text;
    
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('show'), 50);

    starElement.classList.add('opened');
    memoriesRead++;
}

// ===================== COUNTDOWN A 4 DE SEPTIEMBRE =====================
function startCountdown() {
    const countdownEl = document.getElementById('countdown-text');
    if (!countdownEl) return;

    function updateCountdown() {
        const now = new Date();
        const target = new Date(now.getFullYear(), 8, 4, 0, 0, 0); // Sept 4
        
        if (now > target) {
            countdownEl.innerText = "Ya llegó el día ✨";
            return;
        }

        const diff = target - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        countdownEl.innerText = `${days}d ${hours}h ${minutes}m`;
    }

    updateCountdown();
    setInterval(updateCountdown, 60000);
}

// ===================== ESCENA DE CENA =====================
async function buildDinnerScene() {
    await delay(1000);
    document.getElementById('d-table').classList.add('visible-layer');
    await delay(1500);
    document.getElementById('d-candle').classList.add('visible-layer');
    await delay(2000);
    document.getElementById('d-plates').classList.add('visible-layer');
    await delay(1500);
    document.getElementById('d-glasses').classList.add('visible-layer');
    await delay(2000);
    
    document.getElementById('dt-1').classList.add('visible-layer');
    await delay(2500);
    document.getElementById('dt-2').classList.add('visible-layer');
    await delay(2000);
    document.getElementById('dt-3').classList.add('visible-layer');
    await delay(2500);
    document.getElementById('dt-4').classList.add('visible-layer');
    await delay(4000);
    
    document.getElementById('dinner-outro').classList.add('visible-layer');
}
