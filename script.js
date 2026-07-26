function showAlert() {
    alert("Terima kasih sudah menghubungi saya!");
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

function initTypingEffect() {
    const subtitle = document.getElementById('hero-subtitle');
    if (!subtitle) return;

    const phrases = [
        'Editor | Videografer | Pemula Web Developer',
        'Saya suka mengubah ide menjadi karya yang menarik',
        'Membangun pengalaman digital dengan pendekatan sederhana'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeLoop = () => {
        const currentPhrase = phrases[phraseIndex];
        subtitle.textContent = isDeleting
            ? currentPhrase.substring(0, charIndex--)
            : currentPhrase.substring(0, charIndex++);

        if (!isDeleting && charIndex === currentPhrase.length + 1) {
            isDeleting = true;
            setTimeout(typeLoop, 1000);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        setTimeout(typeLoop, isDeleting ? 50 : 80);
    };

    typeLoop();
}

function initParallax() {
    const hero = document.querySelector('.hero');
    const ambient1 = document.querySelector('.ambient-1');
    const ambient2 = document.querySelector('.ambient-2');

    if (!hero || !ambient1 || !ambient2) return;

    hero.addEventListener('mousemove', (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 16;
        const y = (event.clientY / window.innerHeight - 0.5) * 16;

        ambient1.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        ambient2.style.transform = `translate3d(${-x * 0.7}px, ${-y * 0.7}px, 0)`;
    });

    hero.addEventListener('mouseleave', () => {
        ambient1.style.transform = '';
        ambient2.style.transform = '';
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const revealItems = document.querySelectorAll('.reveal');

    if (!revealItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    initTypingEffect();
    initParallax();
});