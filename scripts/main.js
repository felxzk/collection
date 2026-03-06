const listingArray = [
    { name: 'Vivaldi', imagePath: 'vivaldi.svg', description: `Vivaldi is a privacy-first, customizable, community-centric browser built on Chromium.`, tags: [`apps`, `browsers`], download: `https://vivaldi.com/download` },
    { name: 'Ventoy', description: `Ventoy is pretty cool DOWNLOAD IT.`, tags: [`apps`, `ISOs`, `tools`], featured: true, download: `https://www.ventoy.net/en/download.html` },
    { name: 'CSSHero', imagePath: 'csshero.svg', description: `CSSHero has a variety of tools. I've only really used the gradient one.`, tags: [`development`, `design`, `tools`, `sites`] },
    { name: 'HDDGuru', imagePath: 'hdd.png', description: `Low-Level format tool helped me recover a disk that I may have otherwise tossed, due to thinking it was done for (in reality, it was just incorrectly formatted).`, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
    { name: 'IHatePDF', imagePath: 'ihatepdf.svg', description: ``, tags: [`sites`, `tools`], download: 'https://ihatepdf.site/' },
    { name: 'Bitwarden', imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://bitwarden.com/download' },
];

function renderItems(array) {
    const itemWrapper = document.querySelector('.flex.flex-wrap');
    itemWrapper.innerHTML = '';

    const validItems = array.filter(item => item.name.trim() !== '');

    validItems.forEach(element => {
        let itemElement = document.createElement("div");
        itemElement.className = "card flex flex-col items-center justify-center gap-lg";

        const allTags = element.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        const downloadHTML = element.download
            ? `<a class="btn-link" href="${element.download}" target="_blank" rel="noopener noreferrer">Link</a>`
            : '';

        const imgHTML = element.imagePath
            ? `<img class="logo" src="./assets/logos/${element.imagePath}" alt="${element.name} logo">`
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

renderItems(listingArray);
