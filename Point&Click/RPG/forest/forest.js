document.addEventListener('DOMContentLoaded', () => {
    // Make sure player data is loaded first
    if (typeof loadPlayerData !== 'function') {
        console.error('data.js is not loaded or loadPlayerData function is missing.');
        return;
    }
    loadPlayerData();

    // --- DOM Elements ---
    const messageEl = document.getElementById('puzzle-message');
    const ped_1 = document.getElementById('pedestal1');
    const ped_2 = document.getElementById('pedestal2');
    const ped_3 = document.getElementById('pedestal3');
    const ped_4 = document.getElementById('pedestal4');
    const boostItemEl = document.getElementById('boost-item');
    const returnButton = document.getElementById('return-button');
    const inventorySlots = document.getElementById('inventory-slots');

    // --- Game State ---
    let combinationCleared = false;
    let itemCollected = false;


    // --- Event Listeners ---

    function checkLocation() {
        // Get the URL parameters to find out which location we're at
        const locationId = 'forest';

        for (let i = 0; i < playerData.clearedLocations.length; i++) {
            if (playerData.clearedLocations[i] === locationId) {
                return true;
            }
        }
        return false;
    }

    function checkPuzzle() {
        if (ped_1.textContent == "☠️" && ped_2.textContent == "🌱" && ped_3.textContent == "🍎" && ped_4.textContent == "🌸") {
            combinationCleared = true;
            ped_1.style.opacity = '0.5';
            ped_2.style.opacity = '0.5';
            ped_3.style.opacity = '0.5';
            ped_4.style.opacity = '0.5'; // Make it look used
            boostItemEl.classList.remove('hidden');
            messageEl.textContent = "You unlocked the chest and found a strange glowing orb!";
        }
    }

    // --- Inventory Display Function ---
    /*function updateInventoryDisplay() {
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
    }*/

    // Click on the rocks
    let inventorySlotSelected;

    inventorySlots.addEventListener('click', (event) => {
        if (event.target && event.target.matches('.inventory-slot')) { // or whatever class your slots have
            if (inventorySlotSelected) {
                inventorySlotSelected.classList.remove('selected');
            }
            inventorySlotSelected = event.target;
            inventorySlotSelected.classList.add('selected');
        }
    });




    ped_1.addEventListener('click', () => {
        if (combinationCleared == false) {
            if (ped_1.textContent == "") {
                if (inventorySlotSelected) {
                    ped_1.textContent = inventorySlotSelected.textContent;
                    ped_1.title = inventorySlotSelected.title;
                    inventorySlotSelected.remove();
                }
            } else {
                const itemSlot = document.createElement('div');
                itemSlot.classList.add('inventory-slot');
                itemSlot.textContent = ped_1.textContent; // Placeholder icon
                itemSlot.title = ped_1.title; // Show item name on hover
                inventorySlots.appendChild(itemSlot);
                ped_1.textContent = "";
                ped_1.title = "";
            }
            checkPuzzle();
        }
    });

    ped_2.addEventListener('click', () => {
        if (combinationCleared == false) {
            if (ped_2.textContent == "") {
                if (inventorySlotSelected) {
                    ped_2.textContent = inventorySlotSelected.textContent;
                    ped_2.title = inventorySlotSelected.title;
                    inventorySlotSelected.remove();
                }
            } else {
                const itemSlot = document.createElement('div');
                itemSlot.classList.add('inventory-slot');
                itemSlot.textContent = ped_2.textContent; // Placeholder icon
                itemSlot.title = ped_2.title; // Show item name on hover
                inventorySlots.appendChild(itemSlot);
                ped_2.textContent = "";
                ped_2.title = "";
            }
            checkPuzzle();
        }
    });

    ped_3.addEventListener('click', () => {
        if (combinationCleared == false) {
            if (ped_3.textContent == "") {
                if (inventorySlotSelected) {
                    ped_3.textContent = inventorySlotSelected.textContent;
                    ped_3.title = inventorySlotSelected.title;
                    inventorySlotSelected.remove();
                }
            } else {
                const itemSlot = document.createElement('div');
                itemSlot.classList.add('inventory-slot');
                itemSlot.textContent = ped_3.textContent; // Placeholder icon
                itemSlot.title = ped_3.title; // Show item name on hover
                inventorySlots.appendChild(itemSlot);
                ped_3.textContent = "";
                ped_3.title = "";
            }
            checkPuzzle();
        }

    });

    ped_4.addEventListener('click', () => {
        if (combinationCleared == false) {
            if (ped_4.textContent == "") {
                if (inventorySlotSelected) {
                    ped_4.textContent = inventorySlotSelected.textContent;
                    ped_4.title = inventorySlotSelected.title;
                    inventorySlotSelected.remove();
                }
            } else {
                const itemSlot = document.createElement('div');
                itemSlot.classList.add('inventory-slot');
                itemSlot.textContent = ped_4.textContent; // Placeholder icon
                itemSlot.title = ped_4.title; // Show item name on hover
                inventorySlots.appendChild(itemSlot);
                ped_4.textContent = "";
                ped_4.title = "";
            }
            checkPuzzle();
        }

    });

    // keyEl.addEventListener('click', () => {

    //     hasKey = true;
    //     keyEl.classList.add('hidden');
    //     key = itemSlot;
    // });

    // // Click on the chest
    // chestEl.addEventListener('click', () => {
    //     if (chestOpened || itemCollected) return; // Don't do anything if already open

    //     if (hasKey) {
    //         key.remove();
    //         chestOpened = true;
    //         chestEl.textContent = '📖'; // Change to an open chest emoji
    //         keyEl.classList.add('hidden'); // Key is used
    //         boostItemEl.classList.remove('hidden');
    //         messageEl.textContent = "You unlocked the chest and found a strange glowing orb!";
    //     } else {
    //         messageEl.textContent = "It's locked. You'll need to find a key.";
    //     }
    // });

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


            // Get the location name from the URL (e.g., "cleared.html?location=forest")
            // This marks the location as cleared so the puzzle can't be repeated.
            messageEl.textContent = "You collected a mysterious GLOWING ORB";
        } else {
            console.warn('playerData object or savePlayerData function not found. Progress will not be saved.');
        }

        boostItemEl.classList.add('hidden');

        returnButton.classList.remove('hidden');

        // Update the inventory display after collecting the item
        //updateInventoryDisplay();
    });

    //updateInventoryDisplay(); // Initial display on page load
    if (checkLocation()) {
        returnButton.classList.remove('hidden');
        returnButton.setAttribute('href', '../../game.html')
        messageEl.textContent = "It appears that you have already been here.";
        combinationCleared = true;
        ped_1.style.opacity = '0.5';
        ped_1.textContent = "☠️";
        ped_2.style.opacity = '0.5';
        ped_2.textContent = "🌱";
        ped_3.style.opacity = '0.5';
        ped_3.textContent = "🍎";
        ped_4.style.opacity = '0.5'; // Make it look used
        ped_4.textContent = "🌸";
    }
});

