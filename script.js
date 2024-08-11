const voiceSelect = document.getElementById("voiceSelect");
const rateInput = document.getElementById("rate");
const rateValue = document.getElementById("rateValue");
let currentUtterance = null; // Store the current utterance

// Function to populate the voice select dropdown with available voices
function populateVoiceList() {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = ''; // Clear existing options
    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Event listener for the rate input field to update the rate value
rateInput.addEventListener("input", () => {
    rateValue.textContent = rateInput.value;
    if (currentUtterance) {
        // Stop the current utterance and start a new one with the updated rate
        speechSynthesis.cancel();
        startSpeech();
    }
});

// Voices are loaded asynchronously, so we need to wait for them to be ready
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
} else {
    populateVoiceList();
}

// Function to start speech
function startSpeech() {
    const text = document.getElementById("text").value;
    if (text.trim() === "") return; // Do nothing if the text is empty
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    const selectedVoiceIndex = voiceSelect.value;
    const voices = speechSynthesis.getVoices();
    currentUtterance.voice = voices[selectedVoiceIndex];
    currentUtterance.rate = parseFloat(rateInput.value); // Set the speech rate based on user input
    
    // When the speech is done, clear the current utterance
    currentUtterance.onend = () => {
        currentUtterance = null; // Clear the current utterance when done
    };
    
    speechSynthesis.speak(currentUtterance);
}

// Event listener for the speak button
document.getElementById("speakButton").addEventListener("click", () => {
    startSpeech();
});
