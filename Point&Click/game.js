document.addEventListener('DOMContentLoaded', () => {
    // Get all the necessary DOM elements
    const locations = document.querySelectorAll('.location');

    // Add a click event listener to each location
    locations.forEach(location => {
        location.addEventListener('click', () => {
            // Get the id of the clicked location
            const locationId = location.id;
            // Navigate to the location page with the ID as a URL parameter
            window.location.href = `RPG/rpg.html?id=${locationId}`;
        });
    });
});