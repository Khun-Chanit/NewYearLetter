// ตัวแปรสำหรับ Swipe
let currentPageIndex = 0;
let totalPages = 0;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;
let isPlaying = false;

// เริ่มต้นเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    // เพิ่ม Event Listeners
    const musicBtn = document.getElementById('music-btn');
    const openBtn = document.getElementById('openBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeBtn = document.getElementById('closeBtn');
    
    if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
    if (openBtn) openBtn.addEventListener('click', openLetter);
    if (prevBtn) prevBtn.addEventListener('click', previousPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    if (closeBtn) closeBtn.addEventListener('click', closeLetter);
});

// ฟังก์ชันเปิด/ปิดเพลง
function toggleMusic() {
    const music = document.getElementById("bg-music");
    const btn = document.getElementById("music-btn");

    if (isPlaying) {
        music.pause();
        btn.textContent = "🎶 เปิดเพลง";
        btn.style.background = "#4CAF50";
    } else {
        music.play();
        btn.textContent = "🔇 ปิดเพลง";
        btn.style.background = "#F44336";
    }
    isPlaying = !isPlaying;
}

// ฟังก์ชันเปิดจดหมาย
function openLetter() {
    const envelope = document.querySelector('.envelope');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const letterContainer = document.getElementById('letterContainer');

    envelope.classList.add('opening');
    createOpeningHearts();

    setTimeout(() => {
        envelopeContainer.style.display = 'none';
        letterContainer.style.display = 'block';
        initializeSwipe();
    }, 1500);
}

// ฟังก์ชันปิดจดหมาย
function closeLetter() {
    const envelopeContainer = document.getElementById('envelopeContainer');
    const letterContainer = document.getElementById('letterContainer');
    const envelope = document.querySelector('.envelope');
    
    // ซ่อนจดหมาย
    letterContainer.style.display = 'none';
    
    // รีเซ็ตหน้าจดหมาย
    currentPageIndex = 0;
    updatePage();
    
    // แสดงซองจดหมายใหม่
    envelope.classList.remove('opening');
    envelopeContainer.style.display = 'flex';
}

// สร้างหัวใจตอนเปิดซอง
function createOpeningHearts() {
    const hearts = ['🥳', '🎉', '🥂', '🎆', '🎊'];
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.transform = 'translate(-50%, -50%)';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.animation = 'heartFly 2s ease-out forwards';
            
            // เพิ่ม CSS variable สำหรับตำแหน่งสุ่ม
            const randomX = Math.random() * 400 - 200;
            heart.style.setProperty('--random-x', randomX + 'px');
            
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
}

// Initialize Swipe System
function initializeSwipe() {
    const pages = document.querySelectorAll('.swipe-page');
    totalPages = pages.length;
    document.getElementById('totalPages').textContent = totalPages;
    updateActivePage();
    
    const swipeContainer = document.getElementById('swipeContainer');
    swipeContainer.addEventListener('touchstart', touchStart);
    swipeContainer.addEventListener('touchmove', touchMove);
    swipeContainer.addEventListener('touchend', touchEnd);
    swipeContainer.addEventListener('mousedown', touchStart);
    swipeContainer.addEventListener('mousemove', touchMove);
    swipeContainer.addEventListener('mouseup', touchEnd);
    swipeContainer.addEventListener('mouseleave', touchEnd);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') previousPage();
    });
}

function touchStart(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const swipeWrapper = document.getElementById('swipeWrapper');
    swipeWrapper.style.transition = 'none';
}

function touchMove(e) {
    if (!isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
    const swipeWrapper = document.getElementById('swipeWrapper');
    swipeWrapper.style.transform = `translateX(${currentTranslate}px)`;
}

function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    const movedBy = currentTranslate - prevTranslate;
    
    if (movedBy < -100 && currentPageIndex < totalPages - 1) {
        currentPageIndex++;
    } else if (movedBy > 100 && currentPageIndex > 0) {
        currentPageIndex--;
    }
    updatePage();
}

function nextPage() {
    if (currentPageIndex < totalPages - 1) {
        currentPageIndex++;
        updatePage();
    }
}

function previousPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        updatePage();
    }
}

function updatePage() {
    const swipeWrapper = document.getElementById('swipeWrapper');
    const containerWidth = document.getElementById('swipeContainer').offsetWidth;
    
    prevTranslate = -containerWidth * currentPageIndex;
    currentTranslate = prevTranslate;
    
    swipeWrapper.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    swipeWrapper.style.transform = `translateX(${prevTranslate}px)`;
    
    updateActivePage();
    updateButtons();
    updatePageIndicator();
    
    if (currentPageIndex === totalPages - 1) {
        setTimeout(() => {
            document.getElementById('actionButtons').style.display = 'flex';
        }, 500);
    } else {
        document.getElementById('actionButtons').style.display = 'none';
    }
}

function updateActivePage() {
    const pages = document.querySelectorAll('.swipe-page');
    pages.forEach((page, index) => {
        if (index === currentPageIndex) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
}

function updateButtons() {
    document.getElementById('prevBtn').disabled = currentPageIndex === 0;
    document.getElementById('nextBtn').disabled = currentPageIndex === totalPages - 1;
}

function updatePageIndicator() {
    document.getElementById('currentPage').textContent = currentPageIndex + 1;
}