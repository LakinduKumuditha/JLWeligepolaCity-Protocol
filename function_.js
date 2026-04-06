function speak(text) {
    if (text === "DYNAMIC_TIME_CHECK") {
        var now = new Date();
        text = "It is " + now.getHours() + " hours and " + now.getMinutes() + " minutes, Sir.";
    }

    var statusLabel = document.getElementById("js_res");
    if(statusLabel) statusLabel.innerText = "Jarvis: " + text;

    if (recognition) { try { recognition.abort(); } catch(e) {} }

    window.speechSynthesis.cancel(); 
    var utterance = new SpeechSynthesisUtterance(text);
    
    var jarvisVoice = voices.find(function(v) {
        var name = v.name;
        return (name.includes('Female') || 
                name.includes('Zira') ||    
                name.includes('Samantha') || 
                name.includes('Google UK English') ||
                name.includes('UK English Female')) && 
                v.lang.includes('en');
    }) || voices.find(v => v.lang.includes('en')); 

    if (jarvisVoice) utterance.voice = jarvisVoice;
    
    utterance.rate = 1.0;  
    utterance.pitch = 1.4; 
    
    utterance.onend = function() {
        if (!isProcessing) setTimeout(startListening, 500);
    };

    window.speechSynthesis.speak(utterance);
}
