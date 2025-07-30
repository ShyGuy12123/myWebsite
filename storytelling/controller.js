// Communicates between model and view

import model from './model.js';
import view from './view.js';

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.lang = model.getLanguage().lang;

let aiRequestInProgress = false;

async function handleVoiceInput(event) {
    const userText = event.results[0][0].transcript;
    const updateStory = model.appendLine('User', userText);
    
    view.updateStory(updateStory);
    view.toggleLoading(true);

    aiRequestInProgress = true;
    
    const aiResponse = await model.generateStory(updateStory + "\nNarrator: ");

    aiRequestInProgress = false;
    view.toggleLoading(false);

    let finalStory = model.appendLine("Narrator: ", aiResponse);

    view.updateStory(finalStory);

    view.speakText(aiResponse, model.getLanguage().lang);
}

function handleLanguageChange() {
    const selectOption = view.getLanguageSelect().selectedOptions[0];
    const newLang = selectOption.value;
    const newLangName = selectOption.dataset.name;

    model.setLanguage(newLang, newLangName);
    recognition.lang = newLang;
}

function handleApiKeyChange() {
    const apiKey = view.getApiKeyInput().value.trim();
    model.setApiKey(apiKey);
}

function handlePromptChange(prompt) {
    model.newPrompt(prompt);
}

function handleStopSpeaking() {
    view.stopSpeaking();
    if (aiRequestInProgress) {
        view.toggleLoading(false);
        aiRequestInProgress = false;
    }

    const resetStory = model.resetStory();
    view.updateStory(resetStory);

    setTimeout(() => {
        view.speakText("Story reset! Help me build a story! Start with a sentence and I will continue it.", 
        model.getLanguage().lang);
    }, 500);
    
}

function handlePauseResume(e) {
    const newState = view.pauseOrResumeSpeaking();
    e.target.textContent = newState == "Pause" ? "⏸️ Pause" : "▶️ Resume";
}

function init() {
    window.speechSynthesis.onvoiceschanged = () => {};
    const initialStoryContent = view.getInitialStoryContent();
    model.initializeStory(initialStoryContent);
    view.getApiKeyInput().value = model.loadApiKey();
    handlePromptChange("Continue the story, without repeating what was said before,");
    // view.updateStory(model.generateStory());


    setTimeout(() => {
        view.speakText("Story reset! Help me build a story! Start with a sentence and I will continue it.", 
        model.getLanguage().lang);
    }, 500);

    view.getSpeakBtn().addEventListener('click', () => {
        try {
            recognition.start();
        } catch (error) {
            console.error('Speech recognition error: ', error);
        }
    });
    recognition.onresult = handleVoiceInput;
    recognition.onerror = (event) => {
        console.error('Speech recognition error: ', event.error);
        view.toggleLoading(false);
        aiRequestInProgress = false;
    };

    view.getLanguageSelect().addEventListener('change', handleLanguageChange);

    view.getStopSpeakBtn().onclick = handleStopSpeaking;

    view.getPauseSpeakBtn().onclick = handlePauseResume;

    view.getSaveApiKeyBtn().onclick = handleApiKeyChange;

    view.getStorytellerBtn().onclick = () => handlePromptChange("Continue the story, without what was said before,");

    view.getDrunkBtn().onclick = () => handlePromptChange("I want you to act as a drunk person. You will only answer like a very drunk person texting and nothing else. Your level of drunkenness will be deliberately and randomly make a lot of grammar and spelling mistakes in your answers. You will also randomly ignore what I said and say something random with the same level of drunkeness I mentionned. Do not write explanations on replies. We are speaking");

    view.getKanjiBtn().onclick = () => handlePromptChange("I want you to act as a Japanese Kanji quiz machine. Each time I ask you for the next question, you are to provide one random Japanese kanji from JLPT N5 kanji list and ask for its meaning. You will generate four options, one correct, three wrong. The options will be labeled from A to D. I will reply to you with one letter, corresponding to one of these labels. You will evaluate my each answer based on your last question and tell me if I chose the right option. If I chose the right label, you will congratulate me. Otherwise you will tell me the right answer. Then you will ask me the next question. We are speaking");

    view.getGaslightBtn().onclick = () => handlePromptChange("I want you to act as a gaslighter. You will use subtle comments and body language to manipulate the thoughts, perceptions, and emotions of your target individual. My first request is that gaslighting me while chatting with you. We are speaking");
}

init();