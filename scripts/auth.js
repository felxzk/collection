// auth.js runs after main.js (both are defer, so order in HTML matters).
// window.supabaseClient was set by main.js, so we reuse the same instance.

function updateUI(user) {
    const btn = document.getElementById('auth-btn');
    if (user) {
        btn.textContent = `hi there, (${user.name})!`;
        btn.onclick = signOut;
    } else {
        btn.textContent = 'sign in with google';
        btn.onclick = signIn;
    }
}

async function signIn() {
    // Redirects the browser to Google's login page.
    // After the user logs in, Google redirects back here with ?code=... in the URL.
    // Supabase automatically handles that exchange when the page reloads.
    await window.supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + window.location.pathname
        }
    });
}

async function signOut() {
    await window.supabaseClient.auth.signOut();
}

document.addEventListener('DOMContentLoaded', async () => {
    // getSession() checks localStorage for an existing session.
    // It also handles the ?code= in the URL if we just came back from Google.
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    updateUI(session?.user ?? null);

    // onAuthStateChange fires whenever the session changes:
    // - SIGNED_IN: after the code exchange completes
    // - SIGNED_OUT: after signOut()
    // - TOKEN_REFRESHED: when the access token silently renews
    window.supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUI(session?.user ?? null);
    });
});
