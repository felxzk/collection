// search functionality
// we're gonna start by defining the obvious - search field and button to fire off search - also listening for enter key potentially? 

function performSearch() {
    const query = document.getElementById('search').value.toLowerCase().trim();

    if (query === '') {
        renderItems(listingArray);
        return;
    }

    const filtered = listingArray.filter(item => {
        if (!item.name) return false;
        return (
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query))
        );
    });

    renderItems(filtered);
}