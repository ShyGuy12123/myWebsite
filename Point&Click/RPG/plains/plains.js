document.addEventListener('DOMContentLoaded', async () => {
    // Make sure player data is loaded first
    if (typeof loadPlayerData !== 'function') {
        console.error('data.js is not loaded or loadPlayerData function is missing.');
        return;
    }
    // Use await if loadPlayerData is async, otherwise this is fine
    await loadPlayerData();

    // --- DOM Elements ---
    const messageEl = document.getElementById('puzzle-message');
    const redButton = document.getElementById('redButton');
    const blueButton = document.getElementById('blueButton');
    const yellowButton = document.getElementById('yellowButton');
    const greenButton = document.getElementById('greenButton');
    const metalDoor = document.getElementById('continueButton');
    const returnButton = document.getElementById('return-button');

    // --- Game State ---
    let combinationCleared = false;
    let itemCollected = false;
    let isPlayerTurn = false;
    const puzzle = [];
    let playerSequence = [];
    const locationId = 'plains';

    // Map numbers to buttons for easier access and to keep code DRY
    const buttons = {
        1: { el: blueButton, color: 'blue' },
        2: { el: redButton, color: 'red' },
        3: { el: yellowButton, color: 'yellow' },
        4: { el: greenButton, color: 'green' }
    };

    // --- Utility Functions ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function setButtonsDisabled(disabled) {
        Object.values(buttons).forEach(btn => btn.el.disabled = disabled);
        isPlayerTurn = !disabled;
        if (disabled) {
            Object.values(buttons).forEach(btn => btn.el.style.filter = 'brightness(50%)');
        } else {
            Object.values(buttons).forEach(btn => btn.el.style.filter = 'brightness(100%)');
        }
    }

    // --- Puzzle Logic ---
    async function displaySequence() {
        setButtonsDisabled(true);
        messageEl.textContent = "Watch the sequence...";
        await sleep(1000); // Pause before starting

        for (const colorNum of puzzle) {
            const button = buttons[colorNum];
            if (button) {
                button.el.style.filter = 'brightness(150%)'; // Flash effect
                await sleep(500); // How long the flash lasts
                button.el.style.filter = 'brightness(50%)'; // Reset
                await sleep(250); // Pause between flashes
            }
        }

        messageEl.textContent = "Your turn. Repeat the sequence.";
        setButtonsDisabled(false);
    }

    function checkPlayerSequence() {
        // Check if the player's input so far is correct
        for (let i = 0; i < playerSequence.length; i++) {
            if (playerSequence[i] !== puzzle[i]) {
                messageEl.textContent = "That's not right. Watch the sequence again.";
                playerSequence = []; // Reset player input
                setTimeout(displaySequence, 1500); // Re-display the sequence after a delay
                return;
            }
        }

        // If the player has entered the full, correct sequence
        if (playerSequence.length === puzzle.length) {
            combinationCleared = true;
            messageEl.textContent = "You hear a thud! The metal door opens.";
            metalDoor.classList.remove('closed');
            metalDoor.classList.add('open');
            setButtonsDisabled(true);
        }
    }

    function handlePlayerInput(colorNumber) {
        if (!isPlayerTurn || combinationCleared) return;

        playerSequence.push(colorNumber);
        checkPlayerSequence();
    }

    // --- Initialization ---
    function initializeGame() {
        // Check if the location has already been cleared
        if (playerData.clearedLocations && playerData.clearedLocations.includes('plains')) {
            combinationCleared = true;
            messageEl.textContent = "You have already beaten this outpost.";
            metalDoor.classList.add('closed'); // Hide item if already collected
            returnButton.classList.remove('hidden');
            setButtonsDisabled(true);
            // Object.values(buttons).forEach(btn => btn.el.style.opacity = '0.5');
            return;
        }

        // Generate a new puzzle sequence (using 4 colors now)
        for (let i = 0; i < 4; i++) {
            puzzle.push(Math.floor(Math.random() * 4) + 1);
        }
        console.log("Puzzle sequence:", puzzle); // For debugging

        // Start the game by showing the sequence
        displaySequence();
    }

    // --- Event Listeners ---
    blueButton.addEventListener('click', () => handlePlayerInput(1));
    redButton.addEventListener('click', () => handlePlayerInput(2));
    yellowButton.addEventListener('click', () => handlePlayerInput(3));
    greenButton.addEventListener('click', () => handlePlayerInput(4));

    // Click on the boost item
    metalDoor.addEventListener('click', () => {
        if (combinationCleared) {
            messageEl.textContent = "You entered the outpost!";
        
            setTimeout(() => {
            window.location.href = "../rpg.html?location=plains&indoor=true&scripted=1";
            }, 3000);
        }    // Add specific item/bonus for this puzzle if needed
    });
    // --- Start Game ---
    initializeGame();
});
