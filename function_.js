let recognition;
let voices = [];
let isWaitingForCity = false; 
let isProcessing = false;

function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}

window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function speak(text) {
    const statusLabel = document.getElementById("js_res");
    statusLabel.innerText = "Jarvis: " + text;

    if (recognition) {
        try { recognition.stop(); } catch(e) {}
    }

    window.speechSynthesis.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const femaleVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') || 
        voice.name.includes('Female') || 
        voice.name.includes('Zira')
    );

    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.2; 
    
    utterance.onend = () => {
        if (recognition && !isProcessing) {
            try { 
                recognition.start(); 
            } catch(e) {
                console.log("Mic restart ignored - already active.");
            }
        }
    };

    window.speechSynthesis.speak(utterance);
}

window.onload = function() {
    const initBtn = document.getElementById("init-button");
    const bootStatus = document.getElementById("boot-status");

    initBtn.onclick = function() {
        const accessCode = prompt("Biometric Scan Required. Enter Passcode:");
        
        if (accessCode !== "jarvis197777911981@@") { 
            document.body.innerHTML = "<h1>Access Denied. System Locked.</h1>";
            window.location.href = "https://google.com"; 
        } else {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
            
            bootStatus.innerText = "AUTHENTICATED. LOADING OS...";
            initBtn.style.display = "none";
            
            setTimeout(() => {
                document.getElementById("boot-screen").style.opacity = "0";
                setTimeout(() => {
                    document.getElementById("boot-screen").style.display = "none";
                    speak("Access granted. Welcome back, Sir.");
                    requestWakeLock(); 
                }, 500);
            }, 1000);
        }
    }
}

const LOCAL_SERVER_IP = "http://192.168.1.10:3000"; 

async function triggerWakeUp() {
    const reactor = document.getElementById("arc-reactor");
    reactor.classList.add("active-pulse");
    speak("Accessing local area network. Wait for turn on the your pc sir");

    try {
        const response = await fetch(`${LOCAL_SERVER_IP}/wake`);
        const data = await response.json();
        if(data.status === "Success") {
            speak("Workstation is online, Sir.");
        }
    } catch (error) {
        console.error("Local Network Error:", error);
        speak("Sir, I cannot reach the local server. Is the bridge active?");
    }
}

function greeting() {
    const hour = new Date().getHours();
    let msg = (hour < 12) ? "Good Morning" : (hour < 16) ? "Good Afternoon" : (hour < 18) ? "Good Evening": "Good Night";
    speak(msg + ", Sir. All systems are online.");
}

function requestWakeLock() {
    greeting();
    startListening();
}

function startListening() {
    const status = document.getElementById("js_res");
    const SpeechRecognition = window.SpeechRecognition || 
                              window.webkitSpeechRecognition || 
                              window.mozSpeechRecognition || 
                              window.msSpeechRecognition;

    if (!SpeechRecognition) {
        status.innerText = "Browser not supported.";
        return;
    }

    if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false; 
        recognition.interimResults = false;

        recognition.onstart = () => {
            status.innerText = "Listening...";
            document.getElementById("arc-reactor").classList.add("active-pulse");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            status.innerText = "You: " + transcript;
            handleLogic(transcript);
            document.getElementById("arc-reactor").classList.remove('active-pulse');
        };

        recognition.onend = () => {
            if (!window.speechSynthesis.speaking && !isProcessing) {
                setTimeout(() => {
                    try { recognition.start(); } catch(e) {}
                }, 1000);
            }
        };
    }
    try { recognition.start(); } catch (e) {}
}

async function handleLogic(query) {
    const reactor = document.getElementById("arc-reactor");
    const transcript = query.toLowerCase();

    if (transcript.includes("wake up pc") || transcript.includes("turn on workstation")) {
        reactor.style.filter = "hue-rotate(180deg) brightness(2)";
        speak("Initiating local wake-on-LAN protocol. Powering up the workstation, Sir.");
        try {
            await fetch("http://192.168.1.10:3000/wake"); 
        } catch (error) {
            postRequestJarvis(query);
        }
        setTimeout(() => { reactor.style.filter = "none"; }, 3000);
    } else {
        postRequestJarvis(query);
    }
}

async function postRequestJarvis(query) {
    const url = "https://lakinduKumuditha.pythonanywhere.com/send_command";
    const status = document.getElementById("js_res");
    isProcessing = true;
    if (recognition) try {recognition.stop();} catch(e) {}

    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: query })
        });
        if (response.ok) { pollForResponse(); } 
        else { isProcessing = false; startListening(); }
    } catch (error) {
        isProcessing = false; startListening();
    }
}

function pollForResponse() {
    const statLabel = document.getElementById("js_res");
    
    // 1. Cache-Buster: Adding a unique timestamp prevents the old phone 
    // from showing you 'old' data from its memory.
    const timestamp = new Date().getTime();
    const url = "https://lakinduKumuditha.pythonanywhere.com/get_response?t=" + timestamp;

    if (isProcessing) { 
        statLabel.innerText = "Processing Sir..."; 
    }

    // 2. Using XHR instead of Fetch for Android 5.1.1 stability
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // Request is finished
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    
                    const hasCommand = data.command && 
                                      data.command !== "none" && 
                                      data.command !== "processing...";

                    if (hasCommand) {
                        if (data.command.trim() === "false") {
                            isProcessing = false;
                            resetCloudResponse(); // Call the reset
                            statLabel.innerText = "Listening...";
                            startListening();
                            return;
                        }
                        
                        isProcessing = false;
                        speak(data.command);
                        resetCloudResponse(); // Call the reset
                        return;
                    }
                    
                    // No command yet? Wait 2 seconds and try again
                    setTimeout(pollForResponse, 2000);
                    
                } catch (e) {
                    console.error("JSON Parse Error on J1", e);
                    setTimeout(pollForResponse, 5000);
                }
            } else {
                // If server is down or connection lost, wait 5 seconds
                setTimeout(pollForResponse, 5000);
            }
        }
    };

    xhr.send();
}

async function resetCloudResponse() {
    await fetch("https://lakinduKumuditha.pythonanywhere.com/update_jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "none" })
    });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service_worker.js');
}
