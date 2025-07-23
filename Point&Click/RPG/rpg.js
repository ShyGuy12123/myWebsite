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

// --- GAME SETUP ---
const player = {
    name: 'Hero',
    maxHp: 25,
    currentHp: 25,
    attackPower: 3,
    currentXp: 0,
    maxXp: 10,
    level: 1,
};

// A central place for all enemy stats and details
const enemyTemplates = {
    'Forest Slime': { name: 'Slime', maxHp: 10, attackPower: 5, cssClass: 'slime' },
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

// Function to update the UI
function updateUI() {
    // Update player HP
    playerHpText.textContent = `${player.currentHp} / ${player.maxHp}`;
    playerHealthBar.style.width = `${(player.currentHp / player.maxHp) * 100}%`;

    // Update player XP
    playerXpText.textContent = `${player.currentXp} / ${player.maxXp} XP`;
    playerXpBar.style.width = `${(player.currentXp / player.maxXp) * 100}%`;

    // Update enemy HP
    enemyNameElement.textContent = currentEnemy.name;
    enemyHpText.textContent = `${currentEnemy.currentHp} / ${currentEnemy.maxHp}`;
    enemyHealthBar.style.width = `${(currentEnemy.currentHp / currentEnemy.maxHp) * 100}%`;
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
        player.currentXp += xpGained;

        logMessage(`You gained ${xpGained} experience points.`);

        // --- LEVEL UP CHECK ---
        while (player.currentXp >= player.maxXp) {
            player.currentXp -= player.maxXp;
            let hpIncrease = Math.round(randomInRange(0.5, 1) * 2)
            player.level += 1;
            player.maxHp += hpIncrease;
            player.currentHp += hpIncrease;
            player.attackPower += Math.round(randomInRange(0.5, 1) * 2);

            player.maxXp += Math.round(player.level * 0.5);
            logMessage(`--------------------------------------------------`);
            logMessage(`Your Attack Power is now ${player.attackPower}.`);
            logMessage(`Your HP is now ${player.maxHp}.`);
            logMessage(`--------------------------------------------------`);
            logMessage(`You leveled up! You are now level ${player.level}.`);
            logMessage(`--------------------------------------------------`);
        }

        updateUI();

        // --- VICTORY CHECK ---
        const locationInfo = gameData.locations[gameLocation] || gameData.locations.default;
        const maxEnemies = locationInfo.maxEnemies;

        logMessage(`Enemies defeated: ${enemiesDefeated} / ${maxEnemies}`);

        if (enemiesDefeated >= maxEnemies) {
            // Location cleared!
            logMessage(locationInfo.clearedMessage);
            logMessage('Returning to the map...');
            disableButtons();
            setTimeout(() => {
                window.location.href = `cleared.html?location=${gameLocation}`;
            }, 4000); // 4-second delay before redirecting
        } else {
            // Spawn the next enemy after a delay
            logMessage('A new challenger approaches...');
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
    const damage = Math.floor(randomInRange(0.75, 1.25) * player.attackPower) + 1;
    currentEnemy.currentHp = Math.max(0, currentEnemy.currentHp - damage);
    logMessage(`You attack the ${currentEnemy.name} for ${damage} damage.`);
    updateUI();
    endOfTurn();
}

function playerHeal() {
    disableButtons();
    const heal = Math.floor(randomInRange(0.75, 1.25) * player.attackPower) + 1;
    player.currentHp = Math.min(player.maxHp, player.currentHp + heal);
    logMessage(`You heal yourself for ${heal} HP.`);
    updateUI();
    endOfTurn();
}



// Function to handle an enemy's attack
function enemyAttack() {
    const damage = Math.floor(randomInRange(0.75, 1.25) * currentEnemy.attackPower) + 1;
    player.currentHp = Math.max(0, player.currentHp - damage);
    logMessage(`The ${currentEnemy.name} attacks you for ${damage} damage.`);
    updateUI();

    if (player.currentHp <= 0) {
        logMessage('You have been defeated... Game Over.');
        // The button is already disabled from the player's turn.
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

logMessage(`You enter the ${gameLocation}...`)

// Spawn the first enemy for this location
spawnEnemy();