window.addEventListener('DOMContentLoaded', () => {
    const game = {
        area: document.getElementById('game-area'),
        message: document.getElementById('message'),
        step: 0,
        colors: ['#FF69B4', '#00BFFF', '#FFD700'],
        messages: [
            '✨ Cliquez sur la bulle magique !',
            '🌟 Wow ! Magnifique ! En voici une autre...',
            '💫 Dernière bulle, vous y êtes presque !',
            '🎉 Bravo ! Vous avez réussi !'
        ],
        photoUrl: './image/photo.jpg',
        sounds: {
            background: new Audio('https://assets.mixkit.co/active_storage/sfx/2335/2335-preview.mp3'),
            pop: new Audio('https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3'),
            success: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3')
        },

        setupSounds() {
            // Préchargement des sons
            Object.values(this.sounds).forEach(sound => {
                sound.load();
                sound.volume = 0.5;
            });
            
            // Démarrer la musique de fond
            this.sounds.background.loop = true;
            
            // Démarrer la musique au premier clic
            document.addEventListener('click', () => {
                this.sounds.background.play();
            }, { once: true });
        },

        showMessage(text) {
            if (!this.message) return; // Vérification de l'élément
            
            this.message.textContent = text;
            this.message.style.opacity = 1;
            this.message.style.transform = 'translateY(0)';
        },

        init() {
            // Vérification des éléments DOM
            if (!this.area || !this.message) {
                console.error('Éléments DOM manquants');
                return;
            }

            this.setupSounds();
            this.showMessage(this.messages[0]);
            this.createBall();
            this.addStarryBackground();
        },

        addStarryBackground() {
            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 2}s`;
                this.area.appendChild(star);
            }
        },

        createBall() {
            const ball = document.createElement('div');
            ball.classList.add('magic-ball');
            
            const shine = document.createElement('div');
            shine.classList.add('shine');
            ball.appendChild(shine);

            ball.style.backgroundColor = this.colors[this.step];
            ball.style.left = `${Math.random() * 70 + 15}%`;
            ball.style.top = `${Math.random() * 60 + 20}%`;
            
            ball.style.animation = 'appear 0.3s ease-out forwards, float 1s ease-in-out infinite';
            
            ball.addEventListener('click', () => this.handleBallClick(ball));
            this.area.appendChild(ball);
        },

        handleBallClick(ball) {
            this.sounds.pop.currentTime = 0;
            this.sounds.pop.play();
            
            const particles = this.createBurstParticles(ball);
            particles.forEach(p => this.area.appendChild(p));
            
            ball.classList.add('pop');
            setTimeout(() => {
                ball.remove();
                particles.forEach(p => p.remove());
            }, 300);
            
            this.step++;
            
            if (this.step < 3) {
                this.showMessage(this.messages[this.step]);
                setTimeout(() => this.createBall(), 400);
            } else {
                const title = document.querySelector('.title');
                if (title) {
                    title.style.animation = 'titleTransform 1s forwards';
                    title.innerHTML = `
                        <span class="emoji">❤️</span> 
                        Tu es le meilleur papa du monde 
                        <span class="emoji">❤️</span>
                    `;
                }
                setTimeout(() => this.showFinal(), 800);
            }
        },

        createBurstParticles(ball) {
            const particles = [];
            const rect = ball.getBoundingClientRect();
            const color = this.colors[this.step];
            
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.backgroundColor = color;
                particle.style.left = `${rect.left + rect.width/2}px`;
                particle.style.top = `${rect.top + rect.height/2}px`;
                particle.style.setProperty('--angle', `${i * 30}deg`);
                particles.push(particle);
            }
            
            return particles;
        },

        showFinal() {
            this.sounds.background.volume = 0.1;
            this.sounds.success.play();
            
            const finalContainer = document.createElement('div');
            finalContainer.classList.add('final-container');
            
            const photo = document.createElement('img');
            photo.src = this.photoUrl;
            photo.alt = "Photo spéciale";
            photo.classList.add('final-photo');
            
            finalContainer.appendChild(photo);
            
            this.area.classList.add('fade-out', 'final-view');
            setTimeout(() => {
                this.area.innerHTML = '';
                this.area.appendChild(finalContainer);
                this.area.classList.remove('fade-out');
                this.area.classList.add('fade-in');
            }, 1000);
        }
    };
    
    game.init();
});