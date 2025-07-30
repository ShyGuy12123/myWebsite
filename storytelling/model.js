// Controls the data

let story = "";
let aiPrompt = "";
let initialStory = "";
let currentLanguage = "en-US"; // called a language code and can be found on the internet
let currentLanguageName = "English";

let GEMINI_API_KEY = localStorage.getItem('geminiApiKey') || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=`;

async function generateStory(prompt) {
    const BODY = {
        contents: [{
            parts: [{
                text: `${aiPrompt} in ${currentLanguageName}:\n${prompt}`
            }]
        }] 
    };

    if (!GEMINI_API_KEY) {
        const errorMsg = '(Error: Gemini API Key is not set)';
        console.error(errorMsg);
        return errorMsg;
    }

    try {
        const response = await fetch(API_URL + GEMINI_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(BODY)
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '(no response from AI)'; // If one part is missing, it will not try to get the other parts
    } catch (error){
        console.error('Error generating story: ', error);
        return `(Error: ${error.message})`;
    }
}

function appendLine(role, text) {
    story +=  `\n${role}: ${text}`;
    return story;
}

function getStory() {
    return story;
}

function getLanguage() {
    return {lang: currentLanguage, name: currentLanguageName}
}

function loadApiKey() {
    return localStorage.getItem('geminiApiKey');
}

function setLanguage(lang, name) {
    currentLanguage = lang;
    currentLanguageName = name;
}

function setApiKey(key) {
    GEMINI_API_KEY = key;
    localStorage.setItem('geminiApiKey', key);
}


function resetStory() {
    story = initialStory;
    return story;
}

function newPrompt(prompt) {
    aiPrompt = prompt;
}

function initializeStory(initialText) {
    story = initialText;
    initialStory = initialText;
    return story;
}

export default {
    generateStory,
    appendLine,
    getStory,
    getLanguage,
    setLanguage,
    resetStory,
    initializeStory,
    setApiKey,
    newPrompt,
    loadApiKey
}