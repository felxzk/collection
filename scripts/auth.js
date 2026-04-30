// auth.js runs after main.js (both are defer, so order in HTML matters).
// window.supabaseClient was set by main.js, so we reuse the same instance.

function updateUI(user) {
    const trigger = document.getElementById('auth-trigger');
    const authOptions = document.getElementById('auth-options');
    const authUser = document.getElementById('auth-user');

    if (user) {
        const name = user.user_metadata.name || user.user_metadata.user_name || 'you';
        trigger.textContent = `howdy, ${name}!`;
        authOptions.hidden = true;
        authUser.hidden = false;
    } else {
        trigger.textContent = 'log in';
        authOptions.hidden = false;
        authUser.hidden = true;
    }
}

async function signInWithGoogle() {
    await window.supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
    });
}

async function signInWithGitHub() {
    await window.supabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin + window.location.pathname }
    });
}

async function signOut() {
    await window.supabaseClient.auth.signOut();
}

document.addEventListener('DOMContentLoaded', async () => {
    const trigger = document.getElementById('auth-trigger');
    const popover = document.getElementById('auth-popover');
    const googleBtn = document.getElementById('google-auth');
    const githubBtn = document.getElementById('github-auth');
    const signOutBtn = document.getElementById('sign-out-btn');
    const whyToggle = document.getElementById('why-toggle');
    const whyText = document.getElementById('why-text');

    // Toggle popover open/closed
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('open');
    });

    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && e.target !== trigger) {
            popover.classList.remove('open');
        }
    });

    googleBtn.addEventListener('click', signInWithGoogle);
    githubBtn.addEventListener('click', signInWithGitHub);
    signOutBtn.addEventListener('click', signOut);

    whyToggle.addEventListener('click', () => {
        whyText.classList.toggle('visible');
    });

    // Check existing session (also handles ?code= redirect from OAuth)
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    updateUI(session?.user ?? null);

    window.supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUI(session?.user ?? null);
    });
});
