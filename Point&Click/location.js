document.addEventListener('DOMContentLoaded', () => {
    // Get the URL parameters to find out which location we're at
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('id');

    // Get the DOM elements to update
    const sceneContainer = document.getElementById('scene-container');
    const titleElement = document.getElementById('location-title');
    const descriptionElement = document.getElementById('location-description');

    if (locationId && gameData.locations[locationId]) {
        const locationData = gameData.locations[locationId];

        // Update the page content with data from data.js
        titleElement.textContent = locationData.name;
        document.title = locationData.name; // Also update the browser tab title
        descriptionElement.textContent = locationData.description;

        // Set the background image if one exists, otherwise use the fallback color
        if (locationData.image) {
            sceneContainer.style.backgroundImage = `url('${locationData.image}')`;
        } else {
            sceneContainer.style.backgroundColor = locationData.backgroundColor;
        }
    } else {
        // Handle case where the ID is invalid or missing
        titleElement.textContent = 'Unknown Location';
        descriptionElement.textContent = 'You seem to be lost. Better head back to the map.';
    }
});