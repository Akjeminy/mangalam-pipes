/**
 * script.js — Mangalam HDPE Pipes
 * All carousels work without images (offline safe).
 * Hero carousel: loop + zoom
 * Apps carousel: infinite loop, left+right
 * Process tabs: prev/next arrows + tab clicks
 */

/* =============================================
   UTILITY — TOAST NOTIFICATION
   ============================================= */
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function showMsg(type) {
    const messages = {
        quote: '✅ Quote request sent! Our team will contact you within 24 hours.',
        quote2: '✅ Quote request sent! Our team will contact you within 24 hours.',
        specs: '📄 Scrolling to technical specifications...',
        datasheet: '📥 Technical datasheet download will start shortly.',
        fittings: '🔧 HDPE Fittings & Accessories — coming soon!',
        install: '🛠️ Professional Installation Services — contact us for a site assessment.',
        pert: '🌡️ PE-RT Heating Pipes — request a product catalogue.',
        expert: '💬 Connecting you to an expert — please hold!',
        dl1: '📥 HDPE Pipe Installation Manual — download started.',
        dl2: '📥 Maintenance & Inspection Handbook — download started.',
        dl3: '📥 Engineering Specifications Sheet — download started.',
    };
    showToast(messages[type] || "Thank you! We'll be in touch soon.");
}

function requestCatalogue() {
    const input = document.getElementById('catalogueEmail');
    if (!input) return;
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
        showToast('⚠️ Please enter a valid email address.');
        return;
    }
    showToast('📬 Catalogue sent! Check your inbox at ' + email);
    input.value = '';
}

function submitContact() {
    const name = (document.getElementById('cfName') || {}).value || '';
    const company = (document.getElementById('cfCompany') || {}).value || '';
    const email = (document.getElementById('cfEmail') || {}).value || '';
    const phone = (document.getElementById('cfPhone') || {}).value || '';

    if (!name.trim()) { showToast('⚠️ Please enter your full name.'); return; }
    if (!company.trim()) { showToast('⚠️ Please enter your company name.'); return; }
    if (!email.trim().includes('@')) { showToast('⚠️ Please enter a valid email.'); return; }
    if (!phone.trim()) { showToast('⚠️ Please enter your phone number.'); return; }

    showToast("✅ Request submitted! We'll call you within 1 business day, " + name.trim() + '.');
    ['cfName', 'cfCompany', 'cfEmail', 'cfPhone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

/* =============================================
   STICKY HEADER
   Appear after first fold (1 viewport height).
   Hide on scroll-down, show on scroll-up.
   ============================================= */
(function initStickyHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;

    function update() {
        const y = window.scrollY;
        const fold = window.innerHeight;

        if (y < fold) {
            header.classList.remove('visible', 'hidden'); // transparent
        } else {
            header.classList.add('visible');
            if (y < 10) {
                header.classList.remove('visible', 'hidden');
            } else if (y < lastY - 4) {
                header.classList.add('visible'); // always white
            }
        }
        lastY = y;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
})();

/* =============================================
   MOBILE NAV
   ============================================= */
(function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('mobileOverlay');
    const closeBtn = document.getElementById('mobileNavClose');
    if (!hamburger || !mobileNav) return;

    function openNav() {
        mobileNav.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        mobileNav.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
})();

/* =============================================
   HERO IMAGE CAROUSEL + ZOOM
   - Infinite loop (prev & next both work)
   - Click image → zoom overlay
   - ESC / X / outside-click → close zoom
   - Auto-advance every 4s
   ============================================= */
(function initHeroCarousel() {
    const slides = Array.from(document.querySelectorAll('#heroSlider .slide'));
    const thumbs = Array.from(document.querySelectorAll('#thumbStrip .thumb'));
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const zoomOverlay = document.getElementById('zoomOverlay');
    const zoomImg = document.getElementById('zoomImg');
    const zoomClose = document.getElementById('zoomClose');

    if (!slides.length || !prevBtn || !nextBtn) return;

    let current = 0;
    let autoTimer;

    /* Activate slide by index — always loops */
    function goTo(idx) {
        slides[current].classList.remove('active');
        if (thumbs[current]) thumbs[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (thumbs[current]) thumbs[current].classList.add('active');
    }

    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 4000);
    }

    /* Buttons */
    prevBtn.addEventListener('click', () => {
        goTo(current - 1);
        startAuto();
    });
    nextBtn.addEventListener('click', () => {
        goTo(current + 1);
        startAuto();
    });

    /* Thumbnails */
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            goTo(parseInt(thumb.dataset.index || '0', 10));
            startAuto();
        });
    });

    /* Zoom */
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (!img || !zoomOverlay || !zoomImg) return;
        img.addEventListener('click', () => {
            zoomImg.src = img.src;
            zoomOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeZoom() {
        if (zoomOverlay) zoomOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (zoomClose) zoomClose.addEventListener('click', closeZoom);
    if (zoomOverlay) zoomOverlay.addEventListener('click', e => { if (e.target === zoomOverlay) closeZoom(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });

    startAuto();
})();

/* =============================================
   APPLICATIONS CAROUSEL — Infinite Loop
   Layout after cloning:
     [N clones FRONT] [N originals] [N clones BACK]
   Card width = (wrapper width - gaps) / visibleCount
   Both prev and next loop infinitely.
   ============================================= */
(function initAppsCarousel() {
    const wrap = document.querySelector('.apps-slider-wrap');
    const slider = document.getElementById('appsSlider');
    const prevBtn = document.getElementById('appsPrev');
    const nextBtn = document.getElementById('appsNext');
    if (!wrap || !slider || !prevBtn || !nextBtn) return;

    const GAP = 20; // px — must match CSS gap

    function getVisible() {
        const w = window.innerWidth;
        if (w <= 480) return 1;
        if (w <= 768) return 2;
        if (w <= 1024) return 3;
        return 4;
    }

    function getCardW() {
        const vis = getVisible();
        const totalGap = GAP * (vis - 1);
        return (wrap.clientWidth - totalGap) / vis;
    }

    function applyWidths() {
        const w = getCardW();
        Array.from(slider.children).forEach(c => {
            c.style.width = w + 'px';
            c.style.minWidth = w + 'px';
        });
    }

    /* Clone: [originals] → [front clones | originals | back clones] */
    const origCards = Array.from(slider.children);
    const total = origCards.length;

    origCards.forEach(card => {
        const c = card.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        slider.appendChild(c); // back clones
    });
    for (let i = total - 1; i >= 0; i--) {
        const c = origCards[i].cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        slider.insertBefore(c, slider.firstChild); // front clones
    }

    let pos = total; // start at first real card
    let isMoving = false;

    function moveTo(index, animate) {
        const cw = getCardW() + GAP;
        slider.style.transition = animate ?
            'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)' :
            'none';
        slider.style.transform = 'translateX(' + (-index * cw) + 'px)';
        pos = index;
    }

    /* After animation: silent jump if in clone zone */
    slider.addEventListener('transitionend', () => {
        if (pos >= total * 2) {
            moveTo(total, false); // end clones → real start
        } else if (pos < total) {
            moveTo(total * 2 - 1, false); // front clones → real end
        }
        isMoving = false;
    });

    /* Init */
    requestAnimationFrame(() => requestAnimationFrame(() => {
        applyWidths();
        moveTo(total, false);
    }));

    /* Buttons */
    prevBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        moveTo(pos - 1, true);
    });
    nextBtn.addEventListener('click', () => {
        if (isMoving) return;
        isMoving = true;
        moveTo(pos + 1, true);
    });

    /* Resize */
    let resizeT;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => {
            applyWidths();
            moveTo(pos, false);
        }, 100);
    }, { passive: true });
})();

/* =============================================
   FAQ ACCORDION
   ============================================= */
(function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const btn = item.querySelector('.faq-q');
        const icon = item.querySelector('.faq-icon');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all
            items.forEach(i => {
                i.classList.remove('open');
                const q = i.querySelector('.faq-q');
                const ic = i.querySelector('.faq-icon');
                if (q) q.setAttribute('aria-expanded', 'false');
                if (ic) ic.textContent = '+';
            });
            // Open clicked
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                if (icon) icon.textContent = '−';
            }
        });
    });
})();

/* =============================================
   PROCESS TABS + PREV/NEXT ARROWS
   - Tab click or arrow click → switch panel
   - Active tab scrolls into view (mobile safe)
   - Loops: last→first, first→last
   ============================================= */
(function initTabs() {
    const tabBtns = Array.from(document.querySelectorAll('#tabNav .tab-btn'));
    const panels = document.querySelectorAll('.tab-panel');
    const prevBtn = document.getElementById('procPrev');
    const nextBtn = document.getElementById('procNext');
    if (!tabBtns.length) return;

    let activeIdx = 0;

    function activateTab(idx) {
        activeIdx = (idx + tabBtns.length) % tabBtns.length; // loop

        // Update tab buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        tabBtns[activeIdx].classList.add('active');

        // Scroll active tab button into view (for mobile horizontal scroll)
        tabBtns[activeIdx].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });

        // Update panels
        panels.forEach(p => p.classList.remove('active'));
        const target = tabBtns[activeIdx].dataset.tab;
        const panel = document.querySelector('.tab-panel[data-panel="' + target + '"]');
        if (panel) panel.classList.add('active');
    }

    // Tab button clicks
    tabBtns.forEach((btn, i) => btn.addEventListener('click', () => activateTab(i)));

    // Arrow clicks
    if (prevBtn) prevBtn.addEventListener('click', () => activateTab(activeIdx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => activateTab(activeIdx + 1));
})();

/* =============================================
   SMOOTH SCROLL with header offset
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-h')
        ) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* =============================================
   MODAL SYSTEM
   openModal(id)  — open a specific modal
   closeModal(id) — close a specific modal
   Close on overlay click or ESC key
   ============================================= */

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus first input
    const first = modal.querySelector('input');
    if (first) setTimeout(() => first.focus(), 100);
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Close on overlay background click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
            m.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
});

/* ── Modal 1: Catalogue form submit ── */
function submitCatalogue() {
    const email = (document.getElementById('mCatEmail') || {}).value || '';
    if (!email.trim() || !email.includes('@')) {
        showToast('⚠️ Please enter a valid email address.');
        return;
    }
    // Show success inside modal
    const box = document.querySelector('#modalCatalogue .modal-box');
    const form = document.querySelector('#modalCatalogue .modal-form');
    if (box && form) {
        form.style.display = 'none';
        let suc = box.querySelector('.modal-success');
        if (!suc) {
            suc = document.createElement('div');
            suc.className = 'modal-success show';
            suc.innerHTML =
                '<div class="modal-success-icon">&#10003;</div>' +
                '<h4>Catalogue Sent!</h4>' +
                '<p>We\'ve emailed the full catalogue to<br><strong>' + email.trim() + '</strong></p>';
            box.appendChild(suc);
        } else {
            suc.classList.add('show');
        }
        // Auto-close after 2.5s
        setTimeout(() => {
            closeModal('modalCatalogue');
            setTimeout(() => {
                form.style.display = '';
                const s = box.querySelector('.modal-success');
                if (s) s.classList.remove('show');
                document.getElementById('mCatEmail').value = '';
                const ph = document.getElementById('mCatPhone');
                if (ph) ph.value = '';
            }, 400);
        }, 2500);
    }
}

/* ── Modal 2: Quote / Call back form submit ── */
function submitQuote() {
    const name = (document.getElementById('mQName') || {}).value || '';
    const company = (document.getElementById('mQCompany') || {}).value || '';
    const email = (document.getElementById('mQEmail') || {}).value || '';
    const phone = (document.getElementById('mQPhone') || {}).value || '';

    if (!name.trim()) { showToast('⚠️ Please enter your full name.'); return; }
    if (!company.trim()) { showToast('⚠️ Please enter your company name.'); return; }
    if (!email.trim().includes('@')) { showToast('⚠️ Please enter a valid email.'); return; }
    if (!phone.trim()) { showToast('⚠️ Please enter your phone number.'); return; }

    // Show success inside modal
    const box = document.querySelector('#modalQuote .modal-box');
    const form = document.querySelector('#modalQuote .modal-form');
    const title = document.querySelector('#modalQuote .modal-title');
    if (box && form) {
        form.style.display = 'none';
        if (title) title.style.display = 'none';
        let suc = box.querySelector('.modal-success');
        if (!suc) {
            suc = document.createElement('div');
            suc.className = 'modal-success show';
            suc.innerHTML =
                '<div class="modal-success-icon">&#10003;</div>' +
                '<h4>Request Received!</h4>' +
                '<p>Thank you, <strong>' + name.trim() + '</strong>!<br>Our team will call you within 1 business day.</p>';
            box.appendChild(suc);
        } else {
            suc.classList.add('show');
        }
        // Auto-close after 2.5s and reset form
        setTimeout(() => {
            closeModal('modalQuote');
            setTimeout(() => {
                form.style.display = '';
                if (title) title.style.display = '';
                const s = box.querySelector('.modal-success');
                if (s) s.classList.remove('show');
                ['mQName', 'mQCompany', 'mQEmail', 'mQPhone'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
            }, 400);
        }, 2500);
    }
}