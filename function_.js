let recognition;
let voices = [];
let isWaitingForCity = false; 
let isProcessing = false;

// --- VOICE INITIALIZATION ---
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
    let greeting;

    if (hour >= 0 && hour < 12) {
        greeting = "Good Morning, Sir. All systems are online.";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Good Afternoon, Sir. All systems are online.";
    } else {
        greeting = "Good Evening, Sir. All systems are online.";
    }

    speak(greeting)
}

window.onload = function() {
    const accessCode = prompt("Biometric Scan Required. Enter Passcode:");
    
    if (accessCode !== "jarvis197777911981@@") { 
        document.body.innerHTML = "<h1>Access Denied. System Locked.</h1>";
        window.location.href = "https://google.com"; 
    } else {
        speak("Access granted. Welcome back, Sir.");
        requestWakeLock(); 
    }
}

function requestWakeLock() {
    greeting()
    startListening()
}

function startListening() {
    const status = document.getElementById("js_res");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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
            console.log("Mic Active");
            document.getElementById("arc-reactor").classList.add("active-pulse");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            status.innerText = "You: " + transcript;
            
            handleLogic(transcript);
            document.getElementById("arc-reactor").classList.remove('active-pulse')
        };

        recognition.onerror = (event) => {
            console.error("Recognition Error: ", event.error);
            if (event.error === 'not-allowed') {
                status.innerText = "Microphone Blocked. Use HTTPS or Local Server.";
            }
        };
        
        recognition.onend = () => {
            if (!window.speechSynthesis.speaking && !isProcessing) {
                console.log("Mic cycled. Restarting...");
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {}
                }, 1000);
            }
        };
    }

    try {
        recognition.start();
    } catch (e) {
        console.log("Mic is already active.");
    }
}

async function handleLogic(query) {
    const reactor = document.getElementById("arc-reactor");
    const transcript = query.toLowerCase();

    if (transcript.includes("wake up pc") || transcript.includes("turn on workstation")) {
        reactor.style.filter = "hue-rotate(180deg) brightness(2)";
        speak("Initiating local wake-on-LAN protocol. Powering up the workstation, Sir.");

        try {
            const localResponse = await fetch("http://192.168.1.10:3000/wake"); 
            const result = await localResponse.json();
            console.log("Local Bridge Response:", result);
        } catch (error) {
            console.error("Local Bridge unreachable:", error);
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

        if (response.ok) {
            console.log("Sent to Cloud. Polling for answer...");
            pollForResponse(); 
        } else {
            status.innerText = "Cloud Error: " + response.status;
            isProcessing = false;
            startListening();
        }
    } catch (error) {
        console.error("Post Error:", error);
        status.innerText = "Cloud connection failed.";
        isProcessing = false;
        startListening();
    }
}

async function pollForResponse() {
    const url = "https://lakinduKumuditha.pythonanywhere.com/get_response";
    const statLabel = document.getElementById("js_res");

    if (isProcessing) {
        statLabel.innerText = "Processing Sir...";
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        
        const hasCommand = data.command && data.command !== "none" && data.command !== "processing...";
        const isNotDebug = !data.command.toLowerCase().includes("debug") && !data.command.toLowerCase().includes("processing");

        if (hasCommand && isNotDebug) {
            if (data.command.trim() === "false") {
                console.log("Jarvis: Empty response received. Resetting system.");
                isProcessing = false;
                await resetCloudResponse();
                statLabel.innerText = "Listening...";
                startListening();
                return;
            }
            console.log("Jarvis says: " + data.command);
            isProcessing = false;
            speak(data.command);
            await resetCloudResponse();
            return;
        }

        setTimeout(pollForResponse, 2000);

    } catch (error) {
        console.error("Polling Error:", error);
        setTimeout(pollForResponse, 5000); 
    }
}

async function resetCloudResponse() {
    await fetch("https://lakinduKumuditha.pythonanywhere.com/update_jarvis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "none" })
    });
}
