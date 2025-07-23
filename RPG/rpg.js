// --- GAME SETUP ---
const player = {
    name: 'Hero',
    maxHp: 100,
    currentHp: 100,
    attackPower: 10,
    currentXp: 0,
    maxXp: 10,
    level: 1,
};

const enemyTypes = [
    {
        name: 'Slime',
        maxHp: 50,
        attackPower: 5,
        cssClass: 'slime',
    },
    {
        name: 'Goblin',
        maxHp: 70,
        attackPower: 8,
        cssClass: 'goblin',
    }
];

let currentEnemy = {};

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
        logMessage(`You have defeated the ${currentEnemy.name}!`);

        const xpGained = Math.floor((Math.random() * currentEnemy.maxHp) / 3) + 1;
        player.currentXp += 30;

        logMessage(`You gained ${xpGained} experience points.`);

        while (player.currentXp >= player.maxXp) {
            player.currentXp -= player.maxXp;
            let hpIncrease = Math.floor(Math.random() * player.maxXp * 0.2) + 1
            player.level += 1;
            player.maxHp += hpIncrease;
            player.currentHp += hpIncrease;
            player.attackPower += Math.floor(Math.random() * player.maxXp * 0.2) + 1;

            player.maxXp += Math.round(player.level * 0.5);
            logMessage(`--------------------------------------------------`);
            logMessage(`Your Attack Power is now ${player.attackPower}.`);
            logMessage(`Your HP is now ${player.maxHp}.`);
            logMessage(`--------------------------------------------------`);
            logMessage(`You leveled up! You are now level ${player.level}.`);
            logMessage(`--------------------------------------------------`);
        }

        updateUI();

        // Spawn the next enemy after a delay
        logMessage('A new challenger approaches...');
        setTimeout(spawnEnemy, 2000);

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
    const damage = Math.floor(Math.random() * player.attackPower) + 1;
    currentEnemy.currentHp = Math.max(0, currentEnemy.currentHp - damage);
    logMessage(`You attack the ${currentEnemy.name} for ${damage} damage.`);
    updateUI();
    endOfTurn();
}

function playerHeal() {
    disableButtons();
    const heal = Math.floor(Math.random() * player.attackPower) + 1;
    player.currentHp = Math.min(player.maxHp, player.currentHp + heal);
    logMessage(`You heal yourself for ${heal} HP.`);
    updateUI();
    endOfTurn();
}



// Function to handle an enemy's attack
function enemyAttack() {
    const damage = Math.floor(Math.random() * currentEnemy.attackPower) + 1;
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

    const enemyTemplate = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
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

// --- INITIALIZE ---
spawnEnemy();