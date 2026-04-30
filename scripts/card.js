let currentItem = null;
let currentCardEl = null;
const tweaks = { style: 'modal', tags: 'soft', meta: 'on' };

function openCard(item, cardEl) {
    currentItem = item;
    currentCardEl = cardEl;

    cardEl.classList.add('opening');
    cardEl.addEventListener('animationend', () => cardEl.classList.remove('opening'), { once: true });

    document.getElementById('exp-logo').src = `assets/logos/${item.image_path}`;
    document.getElementById('exp-logo').alt = item.name;
    document.getElementById('exp-name').textContent = item.name;
    document.getElementById('exp-category').textContent = item.tags?.[0] ?? '';
    document.getElementById('exp-desc').textContent = item.description;
    document.getElementById('exp-link').href = item.link ?? '#';

    const tagsEl = document.getElementById('exp-tags');
    const isSolid = tweaks.tags === 'solid';
    tagsEl.innerHTML = (item.tags ?? []).map(t =>
        `<span class="exp-tag ${isSolid ? 'exp-tag--solid' : 'exp-tag--soft'}">${t}</span>`
    ).join('');

    const metaEl = document.getElementById('exp-meta');
    if (tweaks.meta === 'on') {
        metaEl.style.display = 'flex';
        metaEl.innerHTML = `
            <div class="meta-item">
                <div class="meta-label">Category</div>
                <div class="meta-value">${item.tags?.[0] ?? '—'}</div>
            </div>
            <div class="meta-item">
                <div class="meta-label">Added</div>
                <div class="meta-value">${item.added ?? item.created_at?.slice(0, 10) ?? '—'}</div>
            </div>
        `;
    } else {
        metaEl.style.display = 'none';
    }

    applyExpansionStyle();
    document.getElementById('backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';

    const copyBtn = document.getElementById('btn-copy');
    copyBtn.textContent = 'Copy link';
    copyBtn.classList.remove('copied');
}

function applyExpansionStyle() {
    const backdrop = document.getElementById('backdrop');
    const card = document.getElementById('expanded-card');
    const style = tweaks.style;

    backdrop.style.alignItems = 'center';
    backdrop.style.justifyContent = 'center';
    backdrop.style.padding = '1rem';
    card.style.width = '';
    card.style.maxHeight = '';
    card.style.borderRadius = '';
    card.style.overflowY = '';
    card.style.marginTop = '';

    if (style === 'sheet') {
        backdrop.style.alignItems = 'flex-end';
        backdrop.style.padding = '0';
        card.style.width = 'min(600px, 100%)';
        card.style.borderRadius = '1rem 1rem 0 0';
        card.style.maxHeight = '90dvh';
        card.style.overflowY = 'auto';
    } else if (style === 'inline') {
        backdrop.style.alignItems = 'flex-start';
        backdrop.style.padding = '5rem 1rem 1rem';
        card.style.width = 'min(480px, 100%)';
    } else {
        card.style.width = 'min(520px, 100%)';
    }
}

function closeCard() {
    document.getElementById('backdrop').classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('btn-close').addEventListener('click', closeCard);

document.getElementById('backdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('backdrop')) closeCard();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });

document.getElementById('btn-copy').addEventListener('click', () => {
    if (!currentItem?.link) return;
    navigator.clipboard.writeText(currentItem.link).catch(() => {});
    const btn = document.getElementById('btn-copy');
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'Copy link'; btn.classList.remove('copied'); }, 2000);
});

document.querySelectorAll('.tweak-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.dataset.tweak;
        const val = btn.dataset.val;
        tweaks[key] = val;
        document.querySelectorAll(`.tweak-opt[data-tweak="${key}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: tweaks }, '*');
        if (document.getElementById('backdrop').classList.contains('open') && currentItem) {
            openCard(currentItem, currentCardEl);
        }
    });
});

window.addEventListener('message', e => {
    if (e.data?.type === '__activate_edit_mode') document.getElementById('tweaks-panel').classList.add('open');
    if (e.data?.type === '__deactivate_edit_mode') document.getElementById('tweaks-panel').classList.remove('open');
});
window.parent.postMessage({ type: '__edit_mode_available' }, '*');
