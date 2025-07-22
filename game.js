// Game State
let hasKey = false;
let chestOpened = false;

// DOM Elements
const keyElement = document.getElementById('key');
const chestElement = document.getElementById('chest');
const statusMessage = document.getElementById('status-message');
const inventorySlots = document.getElementById('inventory-slots');

// Event Listeners
keyElement.addEventListener('click', () => {
    if (!hasKey) {
        hasKey = true;
        keyElement.style.display = 'none'; // Hide key from the world
        statusMessage.textContent = 'You picked up a rusty key.';

        // Add key to inventory display
        const keyInInventory = document.createElement('div');
        keyInInventory.className = 'inventory-item';
        inventorySlots.appendChild(keyInInventory);
    }
});

chestElement.addEventListener('click', () => {
    if (chestOpened) return; // Do nothing if already opened

    if (hasKey) {
        chestOpened = true;
        chestElement.classList.add('unlocked');
        statusMessage.textContent = 'You used the key and unlocked the chest! You win!';
    } else {
        statusMessage.textContent = 'The chest is locked. You need a key.';
    }
});