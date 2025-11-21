// array of items where each item has multiple properties
const testArray = [
    { name: 'Vivaldi', imagePath: 'vivaldi.svg', description: `hi this is my description for Vivaldi.`, tags: [`apps`, `browsers`] },
    { name: 'Ventoy', description: `Ventoy is pretty cool DOWNLOAD IT.`, tags: [`apps`, `ISOs`, `tools`], featured: true },
    { name: 'CSSHero', description: `CSSHero has a variety of tools. I've only really used the gradient one.`, tags: [`development`, `design`, `tools`, 
        'sites'
    ]}
];  

// log the array to the console
console.log(testArray);

// example access
console.log(testArray[0].name); // "item1"

// skeleton of what an item could look like
function createSkelly() {
    const itemWrapper = document.querySelector('.item-wrapper');
    testArray.forEach(element => {
        let itemElement = document.createElement("div");
        itemWrapper.appendChild(itemElement);
        itemElement.classList.add("item");
        itemElement.innerHTML = `
        <h2 class="e_name">${element.name}</h2>
        <img class="e_img"src="${`./assets/logos/${element.imagePath}` }" alt="${element.name} logo"></img>
        <p class="e_desc">${element.description}</p>
        <p class="e_tags">Tags: ${element.tags}</p>`;
    }
 ); 
}

createSkelly();
