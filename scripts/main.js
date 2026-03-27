const SUPABASE_URL = 'https://qfqrzddzasxfjmrvybbc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KqrUa1s9ahedHpldVSXRrw_m3KZp5i8';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseClient = client;

let displayType = `alphabetical`;
let listingArray = [];

function renderItems(items) {
    const itemWrapper = document.querySelector('.item-wrapper');
    itemWrapper.innerHTML = '';

    items.forEach(element => {
        let itemElement = document.createElement("div");
        itemElement.className = "card flex flex-col items-center justify-center gap-lg";

        const allTags = (element.tags ?? []).map(tag => `<span class="tag">${tag}</span>`).join('');

        const downloadHTML = element.link
    ? `<a class="btn-link" href="${element.link}" target="_blank" rel="noopener noreferrer">Link</a>`
    : '';

        const imgHTML = element.image_path
            ? `<img class="logo" src="./assets/logos/${element.image_path}" alt="${element.name} logo">`
            : '';

        itemElement.innerHTML = `
            <h2 class="fw-black">${element.name}</h2>
            ${imgHTML}
            <p class="text-sm element_description">${element.description}</p>
            <div class="flex flex-wrap gap-sm">${allTags}</div>
            ${downloadHTML}
        `;

        itemWrapper.appendChild(itemElement);
    });
}

async function loadItems() {
    let query = client.from('items').select('*');

    if (displayType === 'alphabetical') {
        query = query.order('name', { ascending: true });
    } else if (displayType === 'newest') {
        query = query.order('created_at', { ascending: false });
    } else if (displayType === 'oldest') {
        query = query.order('created_at', { ascending: true });
    }

    const { data, error } = await query;
    if (error) { console.error(error); return; }

    listingArray = data;
    renderItems(listingArray);
}

document.addEventListener('DOMContentLoaded', loadItems);

// adding items

async function addItem(){
    const { error } = await client
    .from('items')
    .insert({ name: 'Mordor', image_path: 'vivaldi.svg', description: 'added via js', link: 'https://google.com/' })
}
