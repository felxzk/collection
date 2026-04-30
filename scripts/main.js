const SUPABASE_URL = 'https://qfqrzddzasxfjmrvybbc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KqrUa1s9ahedHpldVSXRrw_m3KZp5i8';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseClient = client;

let displayType = `alphabetical`;
let listingArray = [];
window.listingArray = listingArray;
window.renderItems = renderItems;

function renderItems(items) {
    const itemWrapper = document.querySelector('.item-wrapper');
    itemWrapper.innerHTML = '';

    items.forEach(element => {
        let itemElement = document.createElement("div");
        itemElement.className = "card flex flex-col items-center gap-lg";

        const imgHTML = element.image_path
            ? `<img class="logo" src="./assets/logos/${element.image_path}" alt="${element.name} logo">`
            : '';

        itemElement.innerHTML = `
            <h2 class="fw-black">${element.name}</h2>
            ${imgHTML}
            <p class="text-sm element_description">${element.description}</p>
        `;

        itemElement.addEventListener('click', () => openCard(element, itemElement));

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
    window.listingArray = listingArray;
    renderItems(listingArray);
    document.dispatchEvent(new CustomEvent('itemsLoaded'));
}

document.addEventListener('DOMContentLoaded', loadItems);

// adding items

async function addItem(){
    const { error } = await client
    .from('items')
    .insert({ name: 'Mordor', image_path: 'vivaldi.svg', description: 'added via js', link: 'https://google.com/' })
}
