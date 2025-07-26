const defaultPlayerData = {
    level: 1,
    xp: 0,
    maxXp: 10,
    xpMultiplier: 1,
    hp: 25,
    maxHp: 25,
    hpMultiplier: 1,
    attackPower: 5,
    attackMultiplier: 1,
    items: [],
    clearedLocations: []
};

// The main player data object, loaded from localStorage or set to default
let playerData = {};

/**
 * Saves the current player data to localStorage.
 */
function savePlayerData() {
    try {
        localStorage.setItem('rpgPlayerData', JSON.stringify(playerData));
        console.log('Player data saved.');
    } catch (e) {
        console.error('Failed to save player data:', e);
    }
}

/**
 * Loads player data from localStorage. If no data is found,
 * it initializes with the default player data.
 */
function loadPlayerData() {
    let loadedData = {};
    try {
        const savedData = localStorage.getItem('rpgPlayerData');
        // We parse only if savedData is a non-empty string
        if (savedData) {
            loadedData = JSON.parse(savedData);
            // We must ensure loadedData is an object, not null or other primitive
            if (typeof loadedData !== 'object' || loadedData === null) {
                console.warn('Corrupted player data found (was not an object), resetting.');
                loadedData = {}; // Reset if data is corrupted (e.g., saved as "null")
            }
        }
    } catch (e) {
        console.error('Failed to parse player data, will use default:', e);
        // If parsing fails, loadedData remains {}
    }
    // Merge the loaded data with a deep copy of the default data.
    // This ensures all properties from defaultPlayerData exist.
    // Properties from loadedData will overwrite the defaults.
    playerData = { ...JSON.parse(JSON.stringify(defaultPlayerData)), ...loadedData };

    // A small correction for HP: ensure current HP isn't higher than max HP.
    playerData.hp = Math.min(playerData.maxHp, playerData.hp);
    console.log('Player data initialized/loaded.');
}

const gameData = {
    locations: {
        forest: {
            name: 'The Dark Forest',
            description: 'You have entered the dark forest. It is eerily quiet, and the ancient trees block out most of the sunlight.',
            image: '', // Add a URL like 'images/forest.jpg' to show a background image
            backgroundColor: '#082e12', // Fallback color if no image is present
            maxEnemies: 10,
            clearedMessage: "You have stumbled upon a clearing.",
            filePath: 'forest'
        },
        plains: {
            name: 'The Great Plains',
            description: 'You have entered the great plains. Its rolling fields reveal a monsterous structure in the distance.',
            image: '', // Add a URL like 'images/forest.jpg' to show a background image
            backgroundColor: '#78B857', // Fallback color if no image is present
            maxEnemies: 20,
            clearedMessage: "You have arrived at the structure.",
            filePath: 'plains'
        },
        beach: {
            name: 'Sun-Kissed Beach',
            description: 'You arrive at a beautiful beach. The sun is warm, and the waves are gently crashing on the shore.',
            image: '',
            backgroundColor: '#dbc795',
            maxEnemies: 25,
            clearedMessage: "You have found a horrible operation taking place!",
            filePath: 'beach'
        },
        island: {
            name: 'The Mysterious Island',
            description: 'You have set out to arrive at the island',
            image: '', // Add a URL like 'images/forest.jpg' to show a background image
            backgroundColor: '#8fb0c2', // Fallback color if no image is present
            maxEnemies: 30,
            clearedMessage: "You have arrived on the shore.",
            filePath: 'island'
        },
        mountain: {
            name: 'The Tall Mountain',
            description: 'You begin to climb the steep mountain. The air is thin here, and the view from the craggy peaks is breathtaking.',
            image: '',
            backgroundColor: '#4e5559',
            maxEnemies: 35,
            clearedMessage: "Is something glittering in the rockbed? You go to check it out.",
            filePath: 'mountain'
        },
        volcano: {
            name: 'The Trecherous Volcano',
            description: 'You have entered the dark forest. It is eerily quiet, and the ancient trees block out most of the sunlight.',
            image: '', // Add a URL like 'images/forest.jpg' to show a background image
            backgroundColor: '#543837', // Fallback color if no image is present
            maxEnemies: 40,
            clearedMessage: "You have found the final lair of the ORGANIZATION!",
            filePath: 'volcano'
        },
        default: {
            name: 'A Mysterious Area',
            description: '',
            image: '',
            backgroundColor: '#707070',
            maxEnemies: 5,
            clearedMessage: "You've cleared the area."
        }
    }
};