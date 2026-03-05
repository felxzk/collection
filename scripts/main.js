// array of items where each item has multiple properties
const listingArray = [
    { name: 'Vivaldi', imagePath: 'vivaldi.svg', description: `Vivaldi is a privacy-first, customizable, community-centric browser built on Chromium.`, tags: [`apps`, `browsers`], download: `https://vivaldi.com/download` },
    { name: 'Ventoy', description: `Ventoy is pretty cool DOWNLOAD IT.`, tags: [`apps`, `ISOs`, `tools`], featured: true, download: `https://www.ventoy.net/en/download.html` },
    { name: 'CSSHero', imagePath: 'csshero.svg', description: `CSSHero has a variety of tools. I've only really used the gradient one.`, tags: [`development`, `design`, `tools`, 
        'sites']},
        { name: 'HDDGuru', imagePath: 'hdd.png', description: `Low-Level format tool helped me recover a disk that I may have otherwise tossed, due to thinking it was done for (in reality, it was just incorrectly formatted).`, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
        { name: 'IHatePDF', imagePath: 'ihatepdf.svg', description: ``, tags: [`sites`, `tools`], download: 'https://ihatepdf.site/' },
        { name: 'Bitwarden', imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://bitwarden.com/download' },
        { name: ``, imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
        { name: ``, imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
        { name: ``, imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
        { name: ``, imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
        { name: ``, imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
        { name: ``, imagePath: ``, description: ``, tags: [`apps`, `tools`], download: 'https://hddguru.com/software/HDD-LLF-Low-Level-Format-Tool/' },
    ];  

// log the array to the console
console.log(listingArray);

// example access
console.log(listingArray[0].name); // "item1"

// skeleton of what an item could look like
// change this name eventually.... 
function createSkelly() {
    const itemWrapper = document.querySelector('.item-wrapper');
    listingArray.forEach(element => {
        let itemElement = document.createElement("div");
        itemWrapper.appendChild(itemElement);
        itemElement.classList.add("item");

        let allTags = element.tags.map(tag => `<span>${tag}</span>`).join('');

        if(element.download != null){
            element.download = `<span class=e_download><a href=${element.download} target="blank" rel="noopener noreferrer">Link</a></span>`;
            



        } else {
            element.download = ``; /* just don't show it. and maybe I can recreate this for other elements too */
        }
 
        itemElement.innerHTML = `
        <h2 class="e_name">${element.name}</h2>
        <img class="e_img" src="./assets/logos/${element.imagePath}" alt="${element.name} logo">
        <p class="e_desc">${element.description}</p>
        <div class="e_tags">${allTags}</div>
        ${element.download}`        
        
    });
}


createSkelly();
