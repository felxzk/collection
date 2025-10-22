// array of items where each item has multiple properties
const testArray = [
    { name: 'Vivaldi', description: `hi this is my description for Vivaldi.`, tags: [`apps`, `browsers`] },
    { name: 'Ventoy', description: `Ventoy is pretty cool DOWNLOAD IT.`, tags: [`apps`, `ISOs`, `tools`], featured: true },
    { name: 'CSSHero', description: `CSSHero has a variety of tools. I've only really used the gradient one.`, tags: [`development`, `design`, `tools`]}
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
        <h2>${element.name}</h2>
        <p>${element.description}</p>
        <p>Tags: ${element.tags}</p>`;
        
    }); 
}

createSkelly();
