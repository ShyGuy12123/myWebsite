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

    // The Natural Enemies

    'Easy Slime': { name: 'Slime', maxHp: 10, attackPower: 2, cssClass: 'slime' },
    'Slime': { name: 'Slime', maxHp: 20, attackPower: 5, cssClass: 'slime' },
    'Hard Slime': { name: 'Slime', maxHp: 50, attackPower: 10, cssClass: 'slime' },

    'Easy Spider': { name: 'Spider', maxHp: 8, attackPower: 2, cssClass: 'spider' },
    'Spider': { name: 'Spider', maxHp: 25, attackPower: 4, cssClass: 'spider' },
    'Hard Spider': { name: 'Spider', maxHp: 30, attackPower: 8, cssClass: 'spider' },

    'Easy Goblin': { name: 'Goblin', maxHp: 20, attackPower: 4, cssClass: 'goblin' },
    'Goblin': { name: 'Goblin', maxHp: 30, attackPower: 8, cssClass: 'goblin' },
    'Hard Goblin': { name: 'Goblin', maxHp: 60, attackPower: 16, cssClass: 'goblin' },

    'Easy Giant Crab': { name: 'Giant Crab', maxHp: 50, attackPower: 8, cssClass: 'crab' },
    'Giant Crab': { name: 'Giant Crab', maxHp: 80, attackPower: 12, cssClass: 'crab' },
    'Hard Giant Crab': { name: 'Giant Crab', maxHp: 120, attackPower: 18, cssClass: 'crab' },

    'Easy Stone Golem': { name: 'Stone Golem', maxHp: 100, attackPower: 10, cssClass: 'golem' },
    'Stone Golem': { name: 'Stone Golem', maxHp: 120, attackPower: 14, cssClass: 'golem' },
    'Hard Stone Golem': { name: 'Stone Golem', maxHp: 180, attackPower: 20, cssClass: 'golem' },

    // The Evil Organization

    'Easy Scout': { name: 'Scout', maxHp: 25, attackPower: 10, cssClass: 'scout' },
    'Scout': { name: 'Scout', maxHp: 40, attackPower: 16, cssClass: 'scout' },
    'Hard Scout': { name: 'Scout', maxHp: 60, attackPower: 24, cssClass: 'scout' },

    'Easy Mechanic': { name: 'Mechanic', maxHp: 50, attackPower: 20, cssClass: 'mechanic' },
    'Mechanic': { name: 'Mechanic', maxHp: 70, attackPower: 25, cssClass: 'mechanic' },
    'Hard Mechanic': { name: 'Mechanic', maxHp: 90, attackPower: 30, cssClass: 'mechanic' },

    'Easy Grunt': { name: 'Grunt', maxHp: 60, attackPower: 24, cssClass: 'grunt' },
    'Grunt': { name: 'Grunt', maxHp: 90, attackPower: 30, cssClass: 'grunt' },
    'Hard Grunt': { name: 'Grunt', maxHp: 120, attackPower: 50, cssClass: 'grunt' },

    'Easy Ranger': { name: 'Ranger', maxHp: 110, attackPower: 60, cssClass: 'ranger' },
    'Ranger': { name: 'Ranger', maxHp: 160, attackPower: 100, cssClass: 'ranger' },
    'Hard Ranger': { name: 'Ranger', maxHp: 210, attackPower: 150, cssClass: 'ranger' },

    // Scripted Enemies

    'Operation Manager': { name: 'Operation Manager', maxHp: 75, attackPower: 10, cssClass: 'om' },

    'Hard Operation Manager': { name: 'Operation Manager', maxHp: 150, attackPower: 50, cssClass: 'om' },

    'Regional Leader': { name: 'Regional Leader', maxHp: 200, attackPower: 140, cssClass: 'rl' },

    'The Boss': { name: 'The Boss', maxHp: 500, attackPower: 500, cssClass: 'boss' },
};

// Defines which enemies can spawn in each location and their frequency (weight)
const locationEnemyPools = {
    'forest': [
        { type: 'Easy Goblin', weight: 31 },
        { type: 'Easy Slime', weight: 31 },
        { type: 'Easy Spider', weight: 32 },

        { type: 'Goblin', weight: 2 },
        { type: 'Slime', weight: 2 },
        { type: 'Spider', weight: 2 },

        // { type: 'Hard Goblin', weight: 5 },
        // { type: 'Hard Slime', weight: 2 },
        // { type: 'Hard Spider', weight: 3 }
    ],
    'beach': [
        { type: 'Easy Giant Crab', weight: 20 },
        { type: 'Easy Stone Golem', weight: 1 }, 

        { type: 'Giant Crab', weight: 25 },
        { type: 'Slime', weight: 10 }, 

        { type: 'Hard Giant Crab', weight: 2 },
        { type: 'Hard Slime', weight: 2 },

        { type: 'Easy Scout', weight: 2 },
        { type: 'Scout', weight: 7 },
        { type: 'Hard Scout', weight: 10 },

        { type: 'Easy Grunt', weight: 10 },
        { type: 'Grunt', weight: 10 },

        { type: 'Easy Ranger', weight: 1 },
    ],
    'mountain': [
        { type: 'Easy Stone Golem', weight: 5 },

        { type: 'Stone Golem', weight: 15 },

        { type: 'Hard Stone Golem', weight: 30 }, 

        { type: 'Hard Scout', weight: 10 },

        { type: 'Grunt', weight: 5 },
        { type: 'Hard Grunt', weight: 15 },

        { type: 'Mechanic', weight: 5 },
        { type: 'Hard Mechanic', weight: 5 },

        { type: 'Ranger', weight: 5 },
        { type: 'Hard Ranger', weight: 5 },
    ],
    'plains': [
        { type: 'Easy Goblin', weight: 21 },
        { type: 'Easy Slime', weight: 22 },

        { type: 'Goblin', weight: 20 },
        { type: 'Slime', weight: 20 },
        
        { type: 'Hard Goblin', weight: 1 },
        { type: 'Hard Slime', weight: 1 },
        
        { type: 'Easy Scout', weight: 10 },
        { type: 'Scout', weight: 5 },
    ],
    'island': [
        { type: 'Easy Giant Crab', weight: 17 },
        { type: 'Easy Stone Golem', weight: 1 }, 

        { type: 'Giant Crab', weight: 16 },
        { type: 'Slime', weight: 5 }, 

        { type: 'Hard Giant Crab', weight: 5 },
        { type: 'Hard Slime', weight: 3 },
        { type: 'Hard Goblin', weight: 18 }, 

        { type: 'Hard Scout', weight: 5 },

        { type: 'Easy Grunt', weight: 5 },
        { type: 'Grunt', weight: 5 },
        { type: 'Hard Grunt', weight: 10 },

        { type: 'Easy Mechanic', weight: 5 },

        { type: 'Easy Ranger', weight: 4 },
        { type: 'Ranger', weight: 1 },
    ],
    'volcano': [

        { type: 'Stone Golem', weight: 10 },

        { type: 'Hard Stone Golem', weight: 20 }, 

        { type: 'Hard Scout', weight: 5 },

        { type: 'Grunt', weight: 2 },
        { type: 'Hard Grunt', weight: 25 },

        { type: 'Mechanic', weight: 1 },
        { type: 'Hard Mechanic', weight: 10 },

        { type: 'Ranger', weight: 2 },
        { type: 'Hard Ranger', weight: 25 },
    ],
    'default': [ // A fallback for when no location is specified
        { type: 'Slime', weight: 100 }
    ]
};

// --- INITIALIZATION ---


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
    playerXpText.textContent = `${playerData.xp} / ${playerData.maxXp} XP`;
    playerXpBar.style.width = `${(playerData.xp / playerData.maxXp) * 100}%`;

    // Update enemy HP
    if (currentEnemy && currentEnemy.name) {
        enemyNameElement.textContent = currentEnemy.name;
        enemyHpText.textContent = `${currentEnemy.currentHp} / ${currentEnemy.maxHp} HP`;
        enemyHealthBar.style.width = `${(currentEnemy.currentHp / currentEnemy.maxHp) * 100}%`;
        enemyCharacterElement.style.display = ``; // Show the enemy element
    } else {
        // Hide enemy details if there is no enemy
        enemyCharacterElement.style.display = `none`;
    }
}

function handleLevelUp() {
    // Use a while loop in case the player gains enough XP for multiple levels at once
    while (playerData.xp >= playerData.maxXp) {
        playerData.xp -= playerData.maxXp;
        playerData.level += 1;
        const hpIncrease = Math.round((randomInRange(1, 4) * ((playerData.level^0.5) / 20) +1) * playerData.hpMultiplier);
        const attackIncrease = Math.round((randomInRange(1, 4) * ((playerData.level^0.5) / 20) +1) * playerData.attackMultiplier);
        playerData.maxHp += hpIncrease;
        playerData.attackPower += attackIncrease;
        playerData.hp += hpIncrease; // Full heal on level up

        logMessage(`--------------------------------------------------`);
        logMessage(`HP increased by ${hpIncrease}! It is now ${playerData.maxHp}!`);
        logMessage(`Attack Power increased by ${attackIncrease}! It is now ${playerData.attackPower}!`);
        logMessage(`--------------------------------------------------`);
        logMessage(`You leveled up! You are now level ${playerData.level}!`);
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
        const xpGained = Math.round(((randomInRange(0.5, 1) * currentEnemy.maxHp) / 2) * playerData.xpMultiplier) + 1;
        playerData.xp += xpGained;

        logMessage(`You gained ${xpGained} experience points.`);

        // --- LEVEL UP CHECK ---
        handleLevelUp();

        updateUI();

        // --- VICTORY CHECK ---

        logMessage(`Enemies defeated: ${enemiesDefeated} / ${maxEnemies}`);

        if (enemiesDefeated >= maxEnemies) {
            // Location cleared!
            
            // logMessage(`Returning to the map...`);
            savePlayerData(); // Save progress before leaving
            disableButtons();
            setTimeout(() => {
                 if (gameLocation == "forest") {
                    logMessage(locationInfo.clearedMessage);
                    if (returnUrl != "") {
                        if (gainItem == true) {
                            playerData.clearedLocations.push("forest");

                            playerData.hp = Math.floor(playerData.hp * 1.5);
                            playerData.maxHp = Math.floor(playerData.maxHp * 1.5);
                            playerData.hpMultiplier = 1.5;
                            playerData.items.push('Glowing Orb of Health');
                
                            savePlayerData();

                            setTimeout(() => {
                                logMessage('The GLOWING ORB began to pulse! You could feel it increasing your hp by 50%!');
                            }, 4000);
                            console.log('Player data updated:', playerData);
                        }
                        window.location.href = returnUrl;
                    } else {
                        window.location.href = `${locationInfo.filePath}/${gameLocation}.html`;
                    }
                    
                } else if (gameLocation == "plains") {
                    if (returnUrl != "") {
                        if (gainItem == true) {
                            playerData.clearedLocations.push("plains");

                            playerData.attackPower = Math.floor(playerData.hp * 1.25);
                            playerData.attackMultiplier = 1.25;
                            playerData.items.push('Robotic Arm');
                
                            savePlayerData();

                            setTimeout(() => {
                                logMessage('The ROBOTIC ARM began to whir! You could feel it increasing your attack power by 25%!');
                            }, 4000);
                            console.log('Player data updated:', playerData);
                        }
                        window.location.href = returnUrl;
                    } else {
                        console.log('It should work');
                        window.location.href = `${locationInfo.filePath}/${gameLocation}.html`;
                    }    
                } else {
                    console.log('Why is it here?');
                    window.location.href = `cleared.html?location=` + gameLocation;
                }
                
            }, 4000); // 4-second delay before redirecting
        } else {
            // Spawn the next enemy after a delay
            logMessage(`A new challenger approaches...`);
            savePlayerData(); // Save progress between enemies
            if (scriptedEnemy != "") {
                setTimeout(spawnScriptedEnemy(scriptedEnemy), 2000);
            } else {
                setTimeout(spawnEnemy, 2000);
            }
        }
    } else {
        // Enemy`s turn
        logMessage(`The ${currentEnemy.name} is preparing its attack...`);
        setTimeout(enemyAttack, 1000); // Wait a second before the enemy attacks
    }
}

// Function to handle a player`s attack
function playerAttack() {
    // Disable the button to prevent spamming during the enemy`s turn.
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



// Function to handle an enemy`s attack
function enemyAttack() {
    if (currentEnemy.currentHp <= currentEnemy.maxHp / 2 && midMatchMessage != "") {
        logMessage(midMatchMessage);
        midMatchMessage = "";
        updateUI();
        setTimeout(() => {
          }, 1500);
    }
    const damage = Math.floor(randomInRange(0.75, 1.25) * currentEnemy.attackPower) + 1;
    playerData.hp = Math.max(0, playerData.hp - damage);
    logMessage(`The ${currentEnemy.name} attacks you for ${damage} damage.`);
    updateUI();

    if (playerData.hp <= 0) {
        logMessage(`You have been defeated... Returning to the map.`);
        disableButtons();
        playerData.hp = playerData.maxHp; // Restore HP for the next attempt
        savePlayerData();
        setTimeout(() => {
        
        window.location.href = `../game.html`;
        }, 3000);
    } else {
        // It`s the player`s turn again, so re-enable the button.
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
    const enemyPool = locationEnemyPools[gameLocation] || locationEnemyPools[`default`];
    const chosenEnemyInfo = getWeightedRandom(enemyPool);
    const enemyTemplate = enemyTemplates[chosenEnemyInfo.type];

    // Create a copy so we don`t modify the original template
    currentEnemy = { ...enemyTemplate, currentHp: enemyTemplate.maxHp };

    // Add the new class for the current enemy
    enemyCharacterElement.classList.add(currentEnemy.cssClass);

    currentEnemy.maxHp = Math.floor(currentEnemy.maxHp * randomInRange(0.75, 1.25));
    currentEnemy.currentHp = currentEnemy.maxHp;
    currentEnemy.attackPower = Math.floor(currentEnemy.attackPower * randomInRange(0.75, 1.25));

    logMessage(`A ${currentEnemy.name} appears!`);
    updateUI();
    enableButtons();
}

function spawnScriptedEnemy(enemyType) {
    // Clean up old classes from the previous enemy
    if (currentEnemy.cssClass) {
        enemyCharacterElement.classList.remove(currentEnemy.cssClass);
    }

    // Select an enemy pool based on the location, or use the default
    const enemyTemplate = enemyTemplates[enemyType];

    // Create a copy so we don`t modify the original template
    currentEnemy = { ...enemyTemplate, currentHp: enemyTemplate.maxHp };

    // Add the new class for the current enemy
    enemyCharacterElement.classList.add(currentEnemy.cssClass);

    currentEnemy.maxHp = currentEnemy.maxHp;
    currentEnemy.currentHp = currentEnemy.maxHp;
    currentEnemy.attackPower = currentEnemy.attackPower;

    logMessage(`A ${currentEnemy.name} appears!`);
    updateUI();
    enableButtons();
}

// --- EVENT LISTENERS ---
attackButton.addEventListener(`click`, () => {
    playerAttack();
});

healButton.addEventListener(`click`, () => {
    playerHeal();
});

// --- GAME START ---

// Set the initial message based on the location
const urlParams = new URLSearchParams(window.location.search);
const gameLocation = urlParams.get(`location`) || `default`; // Use `default` if no location is provided

const locationInfo = gameData.locations[gameLocation] || gameData.locations.default;
document.getElementById("title-message").textContent = locationInfo.name;
if (urlParams.get(`indoor`) == true) {
    document.getElementById("battle-scene").style.backgroundColor = 'brown';

} else {
    document.getElementById("battle-scene").style.backgroundColor = locationInfo.backgroundColor;

}

let maxEnemies = (Math.floor(locationInfo.maxEnemies * randomInRange(0.75, 1.25))) + 1;

let currentEnemy = {};
let enemiesDefeated = 0;
let returnUrl = "";
let midMatchMessage = "";
let scriptedEnemy = "";

let gainItem = false;

if (urlParams.get(`scripted`) >= 1){

    if (gameLocation == "forest") {
        if (urlParams.get(`scripted`) == 1) {
            logMessage(`You turn to leave when a booming man looms over you.`);
            updateUI();

            spawnScriptedEnemy("Operation Manager");

            maxEnemies = 1;

            returnUrl = "../game.html";

            midMatchMessage = "     \"I WILL GET THAT POWER STONE!\"";

            gainItem = true;
        }
    } else if (gameLocation == "plains") {
        if (urlParams.get(`scripted`) == 1) {
            logMessage(`You enter the outpost to find some grunts blocking your way.`);
            updateUI();

            spawnScriptedEnemy("Easy Grunt");

            scriptedEnemy = "Easy Grunt";

            maxEnemies = 3;

            returnUrl = "plains/plains2.html";

        } else if (urlParams.get(`scripted`) == 2) {
            logMessage('You venture deeper to find more grunts.');
            updateUI();

            spawnScriptedEnemy("Grunt")

            scriptedEnemy = "Grunt";

            maxEnemies = 2;

            returnUrl = "plains/plains3.html";
        } else if (urlParams.get(`scripted`) == 3) {
            logMessage('You venture deeper to find more grunts.');
            updateUI();

            spawnScriptedEnemy("Hard Operation Manager")

            maxEnemies = 1;

            returnUrl = "../game.html";

            midMatchMessage = "     \"YOU WON\'T GET AWAY FROM ME!\"";

            gainItem = true;
        }
    }

} else {
    

    logMessage(`You enter the ${gameLocation}...`);
    updateUI(); // Initial UI update for player stats before the first enemy appears

    // Spawn the first enemy for this location

    spawnEnemy(); 
}
