const SUPABASE_URL = 'https://qfqrzddzasxfjmrvybbc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KqrUa1s9ahedHpldVSXRrw_m3KZp5i8';

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadItems() {
    const { data, error } = await client.from('items').select('*');
    if (error) { console.error(error); return; }

    const itemWrapper = document.querySelector('.item-wrapper');
    itemWrapper.innerHTML = '';

    data.forEach(element => {
        let itemElement = document.createElement("div");
        itemElement.className = "card flex flex-col items-center justify-center gap-lg";

        const allTags = element.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        const downloadHTML = element.download
            ? `<a class="btn-link" href="${element.download}" target="_blank" rel="noopener noreferrer">Link</a>`
            : '';

        const imgHTML = element.image_path
            ? `<img class="logo" src="./assets/logos/${element.image_path}" alt="${element.name} logo">`
            : '';

        itemElement.innerHTML = `
            <h2 class="fw-black">${element.name}</h2>
            ${imgHTML}
            <p class="text-sm">${element.description}</p>
            <div class="flex flex-wrap gap-sm">${allTags}</div>
            ${downloadHTML}
        `;

        itemWrapper.appendChild(itemElement);
    });
}

document.addEventListener('DOMContentLoaded', loadItems);