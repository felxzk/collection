// window.supabaseClient is set by main.js (loaded before this script)

const STATES = ['loading', 'signin', 'noperms', 'form', 'success'];

function showState(name) {
    STATES.forEach(s => {
        const el = document.getElementById(`state-${s}`);
        if (el) el.hidden = s !== name;
    });
}

// RLS is evaluated before constraints in PostgreSQL.
// An empty insert returns 42501 (permission denied) for unauthorized users,
// or a constraint error for authorized ones — no rows are ever actually written.
async function checkInsertPermission() {
    const { error } = await window.supabaseClient.from('items').insert({});
    if (!error) return true;
    const blocked =
        error.code === '42501' ||
        (error.message ?? '').toLowerCase().includes('row-level security');
    return !blocked;
}

// Guard against concurrent calls (onAuthStateChange + direct call can both fire on load)
let initRunning = false;

async function init() {
    if (initRunning) return;
    initRunning = true;
    try {
        showState('loading');
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (!session) { showState('signin'); return; }
        const canInsert = await checkInsertPermission();
        showState(canInsert ? 'form' : 'noperms');
    } finally {
        initRunning = false;
    }
}

function showFieldError(form, fieldName, message) {
    const input = form.elements[fieldName];
    input.classList.add('form-control--invalid');
    const hint = input.closest('.form-group').querySelector('.form-hint, .form-field-error');
    if (hint && hint.classList.contains('form-field-error')) {
        hint.textContent = message;
        hint.hidden = false;
    } else {
        const err = document.createElement('p');
        err.className = 'form-hint form-field-error';
        err.textContent = message;
        input.after(err);
    }
    input.addEventListener('input', () => {
        input.classList.remove('form-control--invalid');
        const existing = input.closest('.form-group').querySelector('.form-field-error');
        if (existing) existing.hidden = true;
    }, { once: true });
}

async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.form-submit');
    const errorEl = document.getElementById('form-error');

    const name      = form.elements['name'].value.trim();
    const link      = form.elements['link'].value.trim();
    const desc      = form.elements['description'].value.trim();
    const tagsRaw   = form.elements['tags'].value.trim();
    const imagePath = form.elements['image_path'].value.trim();

    let invalid = false;
    if (!name) { showFieldError(form, 'name', 'required'); invalid = true; }
    if (!link) { showFieldError(form, 'link', 'required'); invalid = true; }
    else if (!/^https?:\/\/.+/.test(link)) { showFieldError(form, 'link', 'must start with http:// or https://'); invalid = true; }
    if (!desc) { showFieldError(form, 'description', 'required'); invalid = true; }
    if (invalid) return;

    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : null;

    submitBtn.disabled = true;
    submitBtn.textContent = 'adding...';
    errorEl.hidden = true;

    const payload = { name, link, description: desc };
    if (tags)      payload.tags = tags;
    if (imagePath) payload.image_path = imagePath;

    const { error } = await window.supabaseClient.from('items').insert(payload);

    if (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'add entry';
        const isPermError =
            error.code === '42501' ||
            (error.message ?? '').toLowerCase().includes('row-level security');
        if (isPermError) { showState('noperms'); return; }
        errorEl.textContent = error.message;
        errorEl.hidden = false;
        return;
    }

    // Refresh the in-memory array so the home page is up-to-date if navigated back
    if (typeof window.loadItems === 'function') window.loadItems();

    showState('success');
}

document.addEventListener('DOMContentLoaded', () => {
    // INITIAL_SESSION fires once on load with the current session (or null).
    // SIGNED_IN fires when OAuth redirect completes. Together they cover all cases.
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') init();
        if (event === 'INITIAL_SESSION') session ? init() : showState('signin');
        if (event === 'SIGNED_OUT') showState('signin');
    });

    document.getElementById('card-google-auth').addEventListener('click', () => {
        window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
    });

    document.getElementById('card-github-auth').addEventListener('click', () => {
        window.supabaseClient.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
    });

    document.getElementById('noperms-signout').addEventListener('click', (e) => {
        e.preventDefault();
        window.supabaseClient.auth.signOut();
    });

    document.getElementById('add-form').addEventListener('submit', handleSubmit);

    document.getElementById('add-another-btn').addEventListener('click', () => {
        document.getElementById('add-form').reset();
        document.getElementById('form-error').hidden = true;
        showState('form');
    });
});
