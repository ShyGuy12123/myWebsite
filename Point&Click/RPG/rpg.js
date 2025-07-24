// --- GAME LOGIC ---

/**
 * Generates a random floating-point number between a min (inclusive) and a max (exclusive).
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} A random number within the specified range.
 */

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Selects an item from a pool based on weights.
 * @param {Array<Object>} pool The pool of items to choose from. Each item must have a 'weight' property.
 * @returns {Object} The selected item.
 */
function getWeightedRandom(pool) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of pool) {
        if (random < item.weight) {
            return item;
        }
        random -= item.weight;
    }
}

// --- DATA LOADING ---
if (typeof loadPlayerData !== 'function' || typeof gameData === 'undefined') {
    console.error('data.js is not loaded correctly.');
    document.body.innerHTML = '<h1>Error: Game data could not be loaded.</h1>';
} else {
    loadPlayerData();
}

// A central place for all enemy stats and details
// Note: In a larger game, this might live in data.js
const enemyTemplates = {
    'Forest Slime': { name: 'Slime', maxHp: 10, attackPower: 2, cssClass: 'slime' },
    'Slime': { name: 'Slime', maxHp: 50, attackPower: 5, cssClass: 'slime' },
    'Goblin': { name: 'Goblin', maxHp: 70, attackPower: 8, cssClass: 'goblin' },
    'Giant Crab': { name: 'Giant Crab', maxHp: 80, attackPower: 12, cssClass: 'crab' },
    'Stone Golem': { name: 'Stone Golem', maxHp: 120, attackPower: 10, cssClass: 'golem' }
};

// Defines which enemies can spawn in each location and their frequency (weight)
const locationEnemyPools = {
    'forest': [
        { type: 'Goblin', weight: 0 }, // 70% chance
        { type: 'Forest Slime', weight: 100 }   // 30% chance
    ],
    'beach': [
        { type: 'Giant Crab', weight: 80 },
        { type: 'Slime', weight: 20 }
    ],
    'mountain': [
        { type: 'Stone Golem', weight: 100 } // Always a Stone Golem
    ],
    'default': [ // A fallback for when no location is specified
        { type: 'Slime', weight: 100 }
    ]
};

// --- INITIALIZATION ---
const urlParams = new URLSearchParams(window.location.search);
const gameLocation = urlParams.get('location') || 'default'; // Use 'default' if no location is provided

let currentEnemy = {};
let enemiesDefeated = 0;

// --- DOM ELEMENTS ---
const playerName = document.getElementById('player-name');
const playerHpText = document.getElementById('player-hp-text');
const playerHealthBar = document.getElementById('player-health-bar');
const playerXpText = document.getElementById('player-xp-text');
const playerXpBar = document.getElementById('player-xp-bar');
const enemyCharacterElement = document.getElementById('enemy-character');
const enemyNameElement = document.querySelector('#enemy-character .character-name');
const enemyHpText = document.getElementById('enemy-hp-text');
const enemyHealthBar = document.getElementById('enemy-health-bar');
const messageLog = document.getElementById('message-log');
const attackButton = document.getElementById('attack-button');
const healButton = document.getElementById('heal-button');


// --- GAME LOGIC ---

// Function to add a message to the log
function logMessage(message) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.prepend(newMessage); // Add new messages to the top
}

function calculateXpForNextLevel(level) {
    return Math.floor(9 + Math.pow(level, 1.5));
}

// Function to update the UI
function updateUI() {
    // Update player name and level
    playerName.textContent = `Lvl ${playerData.level} Hero`;

    // Update player HP
    playerHpText.textContent = `${playerData.hp} / ${playerData.maxHp} HP`;
    playerHealthBar.style.width = `${(playerData.hp / playerData.maxHp) * 100}%`;

    // Update player XP
    const xpForNextLevel = calculateXpForNextLevel(playerData.level);
    playerXpText.textContent = `${playerData.xp} / ${playerData.maxXp} XP`;
    playerXpBar.style.width = `${(playerData.xp / playerData.maxXp) * 100}%`;

    // Update enemy HP
    if (currentEnemy && currentEnemy.name) {
        enemyNameElement.textContent = currentEnemy.name;
        enemyHpText.textContent = `${currentEnemy.currentHp} / ${currentEnemy.maxHp} HP`;
        enemyHealthBar.style.width = `${(currentEnemy.currentHp / currentEnemy.maxHp) * 100}%`;
        enemyCharacterElement.style.display = ''; // Show the enemy element
    } else {
        // Hide enemy details if there is no enemy
        enemyCharacterElement.style.display = 'none';
    }
}

function handleLevelUp() {
    // Use a while loop in case the player gains enough XP for multiple levels at once
    while (playerData.xp >= playerData.maxXp) {
        playerData.xp -= playerData.maxXp;
        playerData.level += 1;
        const hpIncrease = Math.round(randomInRange(1, 2));
        const attackIncrease = Math.round(randomInRange(1, 2));
        playerData.maxHp += hpIncrease;
        playerData.attackPower += attackIncrease;
        playerData.hp += hpIncrease; // Full heal on level up

        logMessage(`--------------------------------------------------`);
        logMessage(`You leveled up! You are now level ${playerData.level}!`);
        logMessage(`Max HP increased by ${hpIncrease}. You are fully healed.`);
        logMessage(`Attack Power increased by ${attackIncrease}.`);
        logMessage(`--------------------------------------------------`);

        // Get the XP requirement for the *new* level
        playerData.maxXp = calculateXpForNextLevel(playerData.level);
    }
}

function disableButtons() {
    attackButton.disabled = true;
    healButton.disabled = true;
}

function enableButtons() {
    attackButton.disabled = false;
    healButton.disabled = false;
}

function endOfTurn() {
    if (currentEnemy.currentHp <= 0) {
        // --- ENEMY DEFEATED ---
        logMessage(`You have defeated the ${currentEnemy.name}!`);
        enemiesDefeated++;

        // --- GAIN EXPERIENCE ---
        const xpGained = Math.round(randomInRange(0.5, 1) * currentEnemy.maxHp) + 1;
        playerData.xp += xpGained;

        logMessage(`You gained ${xpGained} experience points.`);

        // --- LEVEL UP CHECK ---
        handleLevelUp();

        updateUI();

        // --- VICTORY CHECK ---
        const locationInfo = gameData.locations[gameLocation] || gameData.locations.default;
        const maxEnemies = locationInfo.maxEnemies;

        logMessage(`Enemies defeated: ${enemiesDefeated} / ${maxEnemies}`);

        if (enemiesDefeated >= maxEnemies) {
            // Location cleared!
            logMessage(locationInfo.clearedMessage);
            logMessage('Returning to the map...');
            savePlayerData(); // Save progress before leaving
            disableButtons();
            setTimeout(() => {
                window.location.href = `cleared.html?location=${gameLocation}`;
            }, 4000); // 4-second delay before redirecting
        } else {
            // Spawn the next enemy after a delay
            logMessage('A new challenger approaches...');
            savePlayerData(); // Save progress between enemies
            setTimeout(spawnEnemy, 2000);
        }

    } else {
        // Enemy's turn
        logMessage(`The ${currentEnemy.name} is preparing its attack...`);
        setTimeout(enemyAttack, 1000); // Wait a second before the enemy attacks
    }
}

// Function to handle a player's attack
function playerAttack() {
    // Disable the button to prevent spamming during the enemy's turn.
    disableButtons();

    // Calculate damage with a bit of randomness
    const damage = Math.floor(randomInRange(0.75, 1.25) * playerData.attackPower) + 1;
    currentEnemy.currentHp = Math.max(0, currentEnemy.currentHp - damage);
    logMessage(`You attack the ${currentEnemy.name} for ${damage} damage.`);
    updateUI();
    endOfTurn();
}

function playerHeal() {
    disableButtons();
    const heal = Math.floor(randomInRange(0.75, 1.25) * playerData.attackPower) + 1;
    playerData.hp = Math.min(playerData.maxHp, playerData.hp + heal);
    logMessage(`You heal yourself for ${heal} HP.`);
    updateUI();
    endOfTurn();
}



// Function to handle an enemy's attack
function enemyAttack() {
    const damage = Math.floor(randomInRange(0.75, 1.25) * currentEnemy.attackPower) + 1;
    playerData.hp = Math.max(0, playerData.hp - damage);
    logMessage(`The ${currentEnemy.name} attacks you for ${damage} damage.`);
    updateUI();

    if (playerData.hp <= 0) {
        logMessage('You have been defeated... Returning to the map.');
        disableButtons();
        playerData.hp = playerData.maxHp; // Restore HP for the next attempt
        savePlayerData();
        setTimeout(() => {
            window.location.href = '../game.html';
        }, 3000);
    } else {
        // It's the player's turn again, so re-enable the button.
        enableButtons();
    }
}

// Function to spawn a new random enemy
function spawnEnemy() {
    // Clean up old classes from the previous enemy
    if (currentEnemy.cssClass) {
        enemyCharacterElement.classList.remove(currentEnemy.cssClass);
    }

    // Select an enemy pool based on the location, or use the default
    const enemyPool = locationEnemyPools[gameLocation] || locationEnemyPools['default'];
    const chosenEnemyInfo = getWeightedRandom(enemyPool);
    const enemyTemplate = enemyTemplates[chosenEnemyInfo.type];

    // Create a copy so we don't modify the original template
    currentEnemy = { ...enemyTemplate, currentHp: enemyTemplate.maxHp };

    // Add the new class for the current enemy
    enemyCharacterElement.classList.add(currentEnemy.cssClass);

    logMessage(`A wild ${currentEnemy.name} appears!`);
    updateUI();
    enableButtons();
}

// --- EVENT LISTENERS ---
attackButton.addEventListener('click', () => {
    playerAttack();
});

healButton.addEventListener('click', () => {
    playerHeal();
});

// --- GAME START ---

// Set the initial message based on the location

logMessage(`You enter the ${gameLocation}...`);
updateUI(); // Initial UI update for player stats before the first enemy appears

// Spawn the first enemy for this location
spawnEnemy();