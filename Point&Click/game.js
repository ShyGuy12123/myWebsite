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

                if (locationId == "forest") {
                    document.getElementById("plains").style.display = "block"
                } else if (locationId == "plains") {
                    document.getElementById("beach").style.display = "block"
                } else if (locationId == "beach") {
                    document.getElementById("island").style.display = "block"
                } else if (locationId == "island") {
                    document.getElementById("mountain").style.display = "block"
                } else if (locationId == "mountain") {
                    document.getElementById("volcano").style.display = "block"
                }
            }
        });
    }

    // Initial setup when the page loads
    updateInventoryDisplay();
    updateLocationStatus();

    // --- NEW DRAGGABLE MAP LOGIC ---
    const gameWorld = document.getElementById('game-world');
    const mapContent = document.getElementById('map-content');

    if (gameWorld && mapContent) {
        let isDragging = false;
        let hasDragged = false; // Flag to distinguish click from drag
        let startX, startY;
        let currentX = 0, currentY = 0;

        // On mousedown, we start the process
        gameWorld.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only react to the main mouse button

            isDragging = true;
            hasDragged = false; // Reset drag flag on new mousedown
            gameWorld.classList.add('active');

            // Store the starting position, accounting for the current transform
            startX = e.pageX - currentX;
            startY = e.pageY - currentY;
        });

        // On mousemove, we move the map
        gameWorld.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault(); // Prevent text selection while dragging
            hasDragged = true; // If the mouse moves, it's a drag

            let newX = e.pageX - startX;
            let newY = e.pageY - startY;

            // Boundary checks to prevent dragging the map out of view
            const maxX = 0;
            const minX = gameWorld.clientWidth - mapContent.clientWidth;
            const maxY = 0;
            const minY = gameWorld.clientHeight - mapContent.clientHeight;

            // Clamp the values within the boundaries
            currentX = Math.max(minX, Math.min(newX, maxX));
            currentY = Math.max(minY, Math.min(newY, maxY));

            mapContent.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        // A function to stop dragging, used by both mouseup and mouseleave
        const stopDragging = () => {
            if (!isDragging) return;
            isDragging = false;
            gameWorld.classList.remove('active');
        };

        gameWorld.addEventListener('mouseup', stopDragging);
        gameWorld.addEventListener('mouseleave', stopDragging);

        // Prevent navigation on location links if the action was a drag
        mapContent.querySelectorAll('a.location').forEach(link => {
            link.addEventListener('click', (e) => {
                if (hasDragged) {
                    e.preventDefault();
                }
            });
        });
    }
});

function resetData() {
    playerData = { ...JSON.parse(JSON.stringify(defaultPlayerData)) };
    savePlayerData();
    window.location.reload();
}
