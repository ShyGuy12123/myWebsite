document.addEventListener('DOMContentLoaded', () => {
    // Make sure player data is loaded first
    if (typeof loadPlayerData !== 'function') {
        console.error('data.js is not loaded or loadPlayerData function is missing.');
        return;
    }
    loadPlayerData();

    // --- DOM Elements ---
    const messageEl = document.getElementById('puzzle-message');
    const rocksEl = document.getElementById('rocks');
    const chestEl = document.getElementById('chest');
    const keyEl = document.getElementById('key');
    const boostItemEl = document.getElementById('boost-item');
    const returnButton = document.getElementById('return-button');
    const inventorySlots = document.getElementById('inventory-slots');

    // --- Game State ---
    let hasKey = false;
    let chestOpened = false;
    let itemCollected = false;

    // --- Event Listeners ---

    // --- Inventory Display Function ---
    function updateInventoryDisplay() {
        inventorySlots.innerHTML = ''; // Clear existing items

        if (playerData.items && playerData.items.length > 0) {
            playerData.items.forEach(item => {
                const itemSlot = document.createElement('div');
                itemSlot.classList.add('inventory-slot');
                itemSlot.textContent = '✨'; // Placeholder icon
                itemSlot.title = item; // Show item name on hover
                inventorySlots.appendChild(itemSlot);
            });
        } else {
            inventorySlots.innerHTML = '<p>Your inventory is empty.</p>';
        }
    }

    // Click on the rocks
    rocksEl.addEventListener('click', () => {
        if (hasKey || itemCollected) return;

        hasKey = true;
        keyEl.classList.remove('hidden');
        rocksEl.style.opacity = '0.5'; // Make it look used
        rocksEl.style.cursor = 'default';
        messageEl.textContent = "You found a key under the rocks!";
    });

    // Click on the chest
    chestEl.addEventListener('click', () => {
        if (chestOpened || itemCollected) return; // Don't do anything if already open

        if (hasKey) {
            chestOpened = true;
            boostItemEl.classList.remove('hidden');
            chestEl.textContent = '📖'; // Change to an open chest emoji
            keyEl.classList.add('hidden'); // Key is used
            messageEl.textContent = "You unlocked the chest and found a strange glowing orb!";
        } else {
            messageEl.textContent = "It's locked. You'll need to find a key.";
        }
    });

    // Click on the boost item
    boostItemEl.addEventListener('click', () => {
        if (itemCollected) return;

        itemCollected = true;
        
        // --- Update Player Data ---
        // This assumes `data.js` provides a global `playerData` object
        // and a `savePlayerData` function.
        if (typeof playerData !== 'undefined' && typeof savePlayerData !== 'undefined') {
            // Initialize items array if it doesn't exist
            if (!playerData.items) {
                playerData.items = [];
            }
            playerData.items.push('Glowing Orb of Power');

            // Get the location name from the URL (e.g., "cleared.html?location=forest")
            // This marks the location as cleared so the puzzle can't be repeated.
            const urlParams = new URLSearchParams(window.location.search);
            const locationName = urlParams.get('location');
            if (locationName) {
                if (!playerData.clearedLocations) playerData.clearedLocations = [];
                if (!playerData.clearedLocations.includes(locationName)) {
                    playerData.clearedLocations.push(locationName);
                }
            }
            savePlayerData();
            console.log('Player data updated:', playerData);
        } else {
            console.warn('playerData object or savePlayerData function not found. Progress will not be saved.');
        }

        boostItemEl.classList.add('hidden');
        messageEl.textContent = "You collected the Glowing Orb of Power! You feel slightly stronger.";
        returnButton.classList.remove('hidden');
        // Update the inventory display after collecting the item
        updateInventoryDisplay();
    });

    updateInventoryDisplay(); // Initial display on page load
});