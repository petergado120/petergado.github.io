function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getStoredMessages() {
    try {
        const rawMessages = localStorage.getItem('peterMessages');
        return rawMessages ? JSON.parse(rawMessages) : [];
    } catch (error) {
        return [];
    }
}

function saveStoredMessages(messages) {
    localStorage.setItem('peterMessages', JSON.stringify(messages));
}

function deleteMessage(indexToDelete) {
    const messages = getStoredMessages();
    const updatedMessages = messages.filter((_, index) => index !== indexToDelete);
    saveStoredMessages(updatedMessages);
    renderMessages();
}

function sendAllMessagesToEmail() {
    const messages = getStoredMessages();

    if (!messages.length) {
        alert('Belum ada pesan yang bisa dikirim.');
        return;
    }

    const subject = `Daftar pesan masuk dari portofolio (${messages.length})`;
    const body = messages.map((message, index) => {
        return [
            `Pesan ${index + 1}`,
            `Nama: ${message.name}`,
            `Email: ${message.email}`,
            `Waktu: ${message.createdAt}`,
            `Pesan: ${message.message}`,
            ''
        ].join('\n');
    }).join('\n---\n\n');

    const mailtoLink = `mailto:petergado120@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

function renderMessages() {
    const container = document.getElementById('message-list');
    const countBadge = document.getElementById('message-count');

    if (!container) return;

    const messages = getStoredMessages();

    if (countBadge) {
        countBadge.textContent = messages.length.toString();
    }

    if (!messages.length) {
        container.innerHTML = '<div class="empty-state">Belum ada pesan masuk.</div>';
        return;
    }

    container.innerHTML = messages.map((message, index) => `
        <div class="message-card p-3 rounded-3">
            <div class="d-flex justify-content-between align-items-start gap-2">
                <div>
                    <strong>${escapeHtml(message.name)}</strong>
                    <div class="text-muted small">${escapeHtml(message.email)}</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">${escapeHtml(message.createdAt)}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteMessage(${index})" aria-label="Hapus pesan">×</button>
                </div>
            </div>
            <p class="mb-0 mt-2">${escapeHtml(message.message)}</p>
        </div>
    `).join('');
}

async function handleContactSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const messageInput = document.getElementById('message-input');

    if (!form || !nameInput || !emailInput || !messageInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        alert('Silakan lengkapi semua kolom sebelum mengirim pesan.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Format email tidak valid. Mohon gunakan alamat email yang benar.');
        return;
    }

    const newMessage = {
        name,
        email,
        message,
        createdAt: new Date().toLocaleString('id-ID', {
            dateStyle: 'short',
            timeStyle: 'short'
        })
    };

    try {
        const response = await fetch('https://formsubmit.co/ajax/petergado120@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                name,
                email,
                message,
                _replyto: email,
                _subject: `Pesan baru dari ${name}`,
                _captcha: 'false',
                _template: 'table'
            })
        });

        const isRemoteSuccess = response.ok || response.type === 'opaque';
        if (!isRemoteSuccess) {
            throw new Error('Gagal mengirim pesan');
        }

        const messages = getStoredMessages();
        messages.unshift(newMessage);
        saveStoredMessages(messages.slice(0, 100));
        renderMessages();
        form.reset();
        alert('Terima kasih! Pesan Anda berhasil dikirim.');
    } catch (error) {
        const messages = getStoredMessages();
        messages.unshift(newMessage);
        saveStoredMessages(messages.slice(0, 100));
        renderMessages();
        form.reset();
        alert('Pesan Anda tersimpan di halaman ini karena ada gangguan saat mengirim ke email.');
    }
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
    renderMessages();

    const sendAllButton = document.getElementById('send-all-messages-btn');
    if (sendAllButton) {
        sendAllButton.addEventListener('click', sendAllMessagesToEmail);
    }
});