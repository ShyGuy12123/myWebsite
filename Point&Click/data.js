const defaultPlayerData = {
    level: 1,
    xp: 0,
    maxXp: 10,
    hp: 25,
    maxHp: 25,
    attackPower: 5,
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
            backgroundColor: '#1B5E20', // Fallback color if no image is present
            maxEnemies: 5,
            clearedMessage: "You have cleared the forest of its menacing creatures!"
        },
        beach: {
            name: 'Sun-Kissed Beach',
            description: 'You arrive at a beautiful beach. The sun is warm, and the waves are gently crashing on the shore.',
            image: '',
            backgroundColor: '#0288D1',
            maxEnemies: 4,
            clearedMessage: "The beach is now safe for all to enjoy."
        },
        mountain: {
            name: 'The Tall Mountain',
            description: 'You begin to climb the steep mountain. The air is thin here, and the view from the craggy peaks is breathtaking.',
            image: '',
            backgroundColor: '#455A64',
            maxEnemies: 1,
            clearedMessage: "The Stone Golem has been vanquished and the mountain path is clear."
        },
        default: {
            name: 'A Mysterious Area',
            description: '',
            image: '',
            backgroundColor: '#333',
            maxEnemies: 3,
            clearedMessage: "You've cleared the area."
        }
    }
};