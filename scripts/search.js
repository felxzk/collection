// search functionality
// we're gonna start by defining the obvious - search field and button to fire off search - also listening for enter key potentially? 

// if the user clicks on a tag, search by the tag...
let searchBar = document.getElementById('search');

searchBar.addEventListener('input', function() {
    performSearch();
});

document.addEventListener('click', function(e) {
    if (e.target.closest('.e_tags') && e.target.tagName === 'SPAN') {
        searchBar.value = e.target.textContent;
        performSearch();
    }
});

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