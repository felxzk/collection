let activeTag = null;

// Returns items matching both the current search query and active tag filter.
function getFilteredItems(query) {
    let results = window.listingArray ?? [];

    if (activeTag) {
        results = results.filter(item => (item.tags ?? []).includes(activeTag));
    }

    if (query) {
        const q = query.toLowerCase();
        results = results.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            (item.tags ?? []).some(t => t.toLowerCase().includes(q))
        );
    }

    return results;
}

// Called from oninput on the search field.
function performSearch() {
    const query = document.getElementById('search').value.trim();
    window.renderItems(getFilteredItems(query));
    updateSuggestions(query);
}

// --- Suggestions ---

function updateSuggestions(query) {
    const box = document.getElementById('search-suggestions');
    if (!query) { hideSuggestions(); return; }

    const q = query.toLowerCase();
    const matches = (window.listingArray ?? [])
        .filter(item => item.name.toLowerCase().includes(q))
        .slice(0, 6);

    if (!matches.length) { hideSuggestions(); return; }

    box.innerHTML = '';
    matches.forEach(item => {
        const el = document.createElement('button');
        el.className = 'suggestion-item';
        el.textContent = item.name;
        el.addEventListener('mousedown', (e) => {
            // mousedown fires before blur, prevent blur from hiding the list first
            e.preventDefault();
            document.getElementById('search').value = item.name;
            window.renderItems(getFilteredItems(item.name));
            hideSuggestions();
        });
        box.appendChild(el);
    });

    box.hidden = false;
}

function hideSuggestions() {
    const box = document.getElementById('search-suggestions');
    box.hidden = true;
    box.innerHTML = '';
}

// --- Category filter ---

function initCategoryDropdown() {
    const allTags = [...new Set(
        (window.listingArray ?? []).flatMap(item => item.tags ?? [])
    )].sort();

    if (!allTags.length) return;

    const btn = document.getElementById('category-btn');
    const dropdown = document.getElementById('category-dropdown');

    // Build "all" option
    const allOption = document.createElement('button');
    allOption.className = 'category-option active';
    allOption.textContent = 'all';
    allOption.addEventListener('click', () => selectTag(null));
    dropdown.appendChild(allOption);

    allTags.forEach(tag => {
        const el = document.createElement('button');
        el.className = 'category-option';
        el.textContent = tag;
        el.dataset.tag = tag;
        el.addEventListener('click', () => selectTag(tag));
        dropdown.appendChild(el);
    });

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== btn) {
            dropdown.classList.remove('open');
        }
    });
}

function selectTag(tag) {
    activeTag = tag;

    // Update active state on options
    document.querySelectorAll('.category-option').forEach(el => {
        el.classList.toggle('active', el.dataset.tag === tag || (tag === null && el.textContent === 'all'));
    });

    // Update button label
    const btn = document.getElementById('category-btn');
    btn.textContent = tag ?? 'all categories';

    // Close dropdown
    document.getElementById('category-dropdown').classList.remove('open');

    // Re-filter with current search query
    const query = document.getElementById('search').value.trim();
    window.renderItems(getFilteredItems(query));
}

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('search');
    input.addEventListener('blur', hideSuggestions);
});

document.addEventListener('itemsLoaded', initCategoryDropdown);
