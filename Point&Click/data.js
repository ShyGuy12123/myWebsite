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