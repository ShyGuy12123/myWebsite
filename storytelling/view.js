// Client side script

// get all the elements from the DOM
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyBtn = document.getElementById('saveApiKey');

const storyDiv = document.getElementById('story'); //const should be all caps with underscore
const speakBtn = document.getElementById('speakBtn');
const stopSpeakBtn = document.getElementById('stopSpeakBtn');
const pauseSpeakBtn = document.getElementById('pauseSpeakBtn');

const storytellerBtn = document.getElementById('storytellerBtn');
const drunkBtn = document.getElementById('drunkBtn');
const kanjiBtn = document.getElementById('kanjiBtn');
const gaslightBtn = document.getElementById('gaslightBtn');

const languageSelect = document.getElementById('languageSelect');
const loadingDiv = document.getElementById('loading');

function updateStory(text) {
    if (storyDiv) {
        storyDiv.textContent = text;
    }
}

function toggleLoading(show) {
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'block' : 'none'; //very short hand if statement
    }
}

function getApiKeyInput() {
    return apiKeyInput;
}

function getSaveApiKeyBtn() {
    return saveApiKeyBtn;
}

function getStopSpeakBtn() {
    return stopSpeakBtn;
}

function getPauseSpeakBtn() {
    return pauseSpeakBtn;
}

function getSpeakBtn() {
    return speakBtn;
}

function getStorytellerBtn() {
    return storytellerBtn;
}

function getDrunkBtn() {
    return drunkBtn;
}

function getKanjiBtn() {
    return kanjiBtn;
}

function getGaslightBtn() {
    return kanjiBtn;
}


function getLanguageSelect() {
    return languageSelect;
}

function getInitialStoryContent() {
    return storyDiv ? storyDiv.textContent.trim() : 
        'Narrator: help me build a story! Start with a sentence and I will continue it.';
}

function speakText(text, lang) {
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        const voices = speechSynthesis.getVoices()

        if (voices.length == 0) {
            setTimeout(() => speakText(text, lang), 100);
            return;
        }

        const voice = voices.find(v => v.lang.startsWith(lang));
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
    } catch (error) {
        console.error('Speech synthesis error: ', error);
    }
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
}   

function pauseOrResumeSpeaking() {
    if (window.speechSynthesis.speaking) {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            return "Pause";
        } else {
            window.speechSynthesis.pause();
            return "Resume";
        }
    }
    return "Pause";
}

export default {
    updateStory,
    toggleLoading,
    getStopSpeakBtn,
    getPauseSpeakBtn,
    getSpeakBtn,
    getLanguageSelect,
    getInitialStoryContent,
    speakText,
    stopSpeaking,
    pauseOrResumeSpeaking,
    getApiKeyInput,
    getSaveApiKeyBtn,
    getStorytellerBtn,
    getDrunkBtn,
    getKanjiBtn,
    getGaslightBtn

};