document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameLocation = urlParams.get('location') || 'default';

    const clearedTitle = document.getElementById('cleared-title');
    const clearedMessage = document.getElementById('cleared-message');

    // Use gameData from the included data.js file
    // Use optional chaining (?.) and a fallback for safety
    const locationInfo = gameData.locations[gameLocation] || gameData.locations.default;

    if (locationInfo) {
        clearedTitle.textContent = `${locationInfo.name} Cleared!`;
        clearedMessage.textContent = locationInfo.clearedMessage;
        document.title = `${locationInfo.name} Cleared!`; // Update browser tab
    }
});