document.addEventListener('DOMContentLoaded', () => {
    // Make sure player data is loaded first
    if (typeof loadPlayerData !== 'function') {
        console.error('data.js is not loaded or loadPlayerData function is missing.');
        return;
    }
    loadPlayerData();

    const inventorySlots = document.getElementById('inventory-slots');
    const locations = document.querySelectorAll('.location');

    function updateInventoryDisplay() {
        inventorySlots.innerHTML = ''; // Clear existing items

        if (playerData.items && playerData.items.length > 0) {
            playerData.items.forEach(item => {
                const itemSlot = document.createElement('div');
                itemSlot.classList.add('inventory-slot');
                itemSlot.textContent = '✨'; // Placeholder icon for all items
                itemSlot.title = item; // Show item name on hover
                inventorySlots.appendChild(itemSlot);
            });
        } else {
            inventorySlots.innerHTML = '<p>Your inventory is empty.</p>';
        }
    }

    function updateLocationStatus() {
        if (!playerData.clearedLocations) return;

        locations.forEach(locationLink => {
            const locationId = locationLink.id;
            if (playerData.clearedLocations.includes(locationId)) {
                locationLink.classList.add('cleared');
                locationLink.title += ' (Cleared)';
            }
        });
    }

    // Initial setup when the page loads
    updateInventoryDisplay();
    updateLocationStatus();
});