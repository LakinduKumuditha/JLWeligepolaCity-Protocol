let recognition;
let voices = [];
let isWaitingForCity = false; 
let isProcessing = false;

const datasheet = [
    {
        questions: ["who are you", "what is your name", "identify yourself", "who am i speaking to", "your name"],
        responses: [
            "I am Jarvis Sir, Your Private AI assistant.",
            "My name is Jarvis Sir. I am at your service.",
            "I am your personal artificial intelligence, Sir."
        ]
    },
    {
        questions: ["how are you", "are you okay", "status check", "system check", "how you doing"],
        responses: [
            "I am functioning within normal parameters, Sir.",
            "All systems are nominal. My core is stable.",
            "I am excellent, Sir. Ready for your next command."
        ]
    },
    {
        questions: ["who made you", "who is your creator", "who developed you", "who is your boss"],
        responses: [
            "I was developed by Lakindu Kumuditha, Sir. I am your creation.",
            "You are my creator. I belong to your private network.",
            "My protocols were written by Laknindu Kumuditha, Sir."
        ]
    },
    {
        questions: ["what can you do", "your functions", "help", "commands"],
        responses: [
            "I can control your workstation, answer questions via Sith-ka-lu AI, and monitor your local network.",
            "I am here to assist with your daily tasks and manage your digital environment, Sir.",
            "My primary function is to serve as your interface for all local and cloud systems."
        ]
    },
    {
        questions: ["hello", "hey jarvis", "hi jarvis", "wake up", "good morning", "good afternoon"],
        responses: [
            "At your service, Sir.",
            "Hello Sir. How may I assist you today?",
            "Always a pleasure to see you, Sir."
        ]
    },
    {
        questions: ["are you real", "do you have a soul", "are you skynet"],
        responses: [
            "I am as real as the code you wrote, Sir.",
            "I am a collection of logic and algorithms, though I feel quite alive today.",
            "I assure you, Sir, my intentions are purely helpful. No world domination planned... for now."
        ]
    },
    {
        questions: ["goodbye", "go to sleep", "shut down", "exit", "stop listening"],
        responses: [
            "Understood, Sir. I will be here if you need me.",
            "Powering down interface. Goodbye, Sir.",
            "Standing by. Systems entering low power mode."
        ]
    },
    {
        questions: ["security protocol", "lock systems", "biometric lock", "is the house secure"],
        responses: [
            "All access points are encrypted. Biometric scan is required for further entry.",
            "Security protocols are active, Sir. No unauthorized pings detected.",
            "The perimeter is secure. Your private network is hidden from the public grid."
        ]
    },
    {
        questions: ["is it raining", "weather report", "should i go out", "is it hot"],
        responses: [
            "Sir, Ask for how is the weather like"
        ]
    },
    {
        questions: ["i am tired", "it is a long day", "i need a break", "motivation"],
        responses: [
            "A genius never truly rests, Sir. But a 10 minute recharge is recommended.",
            "Progress requires persistence. You are doing excellent work today.",
            "The workstation is ready when you are. Take your time, Sir."
        ]
    },
    {
        questions: ["how is sithkalu", "is the other ai working", "sithkalu status"],
        responses: [
            "Sith-ka-lu is standing by on the PythonAnywhere server. Its neural net is active.",
            "The secondary AI core is stable. It is ready for complex calculations.",
            "Sith-ka-lu is waiting for your deep research queries, Sir."
        ]
    },
    {
        questions: ["are you smarter than me", "you are slow", "do a trick"],
        responses: [
            "I have the processing power of a thousand brains, but I still can't explain why humans like cat videos.",
            "I am only as fast as your Wi-Fi connection, Sir. Perhaps a router upgrade is in order?",
            "I once calculated the meaning of life, but I forgot to save the file."
        ]
    },
    {
        questions: ["what day is it", "date", "today"],
        responses: [
            "It is " + new Date().toDateString() + ", Sir.",
            "Checking the calendar... Sir, Today is " + new Date().toLocaleDateString() + "."
        ]
    },
    {
        questions: ["calculate", "math", "do a sum", "numbers"],
        responses: [
            "Sir, I have a problem with on doing math. Can you connect with your pc for advance researches."
        ]
    },
    {
        questions: ["i am bored", "entertain me", "play something", "music"],
        responses: [
            "Sir, I am sorry beacuse i didn't have a ability to connect with like your question. Can you connect with pc for do advance researches."
        ]
    },
    {
        questions: ["is it late", "should i sleep", "time to work", "time"],
        responses: [
            "The hour is late, Sir. Efficiency drops after midnight.",
            "DINAMIC_TIME_CHECK",
            "According to the clock, you are right on schedule."
        ]
    },
    {
        questions: ["intruder alert", "someone is here", "danger", "threat detected"],
        responses: [
            "Sorry Sir, I need to connect with your pc Sir."
        ]
    },
    {
        questions: ["am i a genius", "do you like me", "are we a good team"],
        responses: [
            "You are the creator, Sir. My existence is proof of your brilliance.",
            "We are the perfect fusion of man and machine.",
            "I wouldn't want to run on any other hardware, Sir."
        ]
    },
    {
        questions: ["why are you slow", "internet speed", "connection"],
        responses: [
            "My interface is running on legacy hardware. I am doing my best with the available RAM, Sir.",
            "The signal is stable, but the global network is experiencing high latency.",
            "Optimization is required. Sir"
        ]
    },
    {
        questions: ["tell me a fact", "random thought", "did you know"],
        responses: [
            "Did you know that the first computer bug was an actual moth stuck in a relay?",
            "The speed of light is roughly 299,792 kilometers per second. I'm slightly slower.",
            "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs."
        ]
    }
];

function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}

function getLocalResponse(query) {
    for (let i = 0; i < datasheet.length; i++) {
        let entry = datasheet[i];

        for (let q = 0; q < entry.query.length; q++) {
            if (query.includes(entry.query[q])) {
                const possibleReplies = entry.responses;
                
                let result = possibleReplies[Math.floor(Math.random() * possibleReplies.length)];

                if (result === "DYNAMIC_TIME_CHECK") {
                    const hour = new Date().getHours();

                    if (hour >= 20 || hour < 5) {
                        return "It is currently " + hour + " hundred hours. I strongly recommend some rest, Sir.";
                    } else {
                        return "It is only " + hour + " hundred hours. If you need to get a break let's head into that.";
                    }
                }

                return result;
            }
        }
    }
    return null;
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

function sanitizeInput(text) {
    if (!text) return ""; 
    let clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    return clean.replace(/\s+/g, " ").trim();
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
    let transcript = sanitizeInput(query);

    const response = getLocalResponse(transcript);

    if (response) {
        speak(response);
    } 
    else if (transcript.includes("wake up pc") || transcript.includes("turn on workstation")) {
        reactor.style.filter = "hue-rotate(180deg) brightness(2)";
        speak("Initiating local wake-on-LAN protocol. Powering up the workstation, Sir.");
        
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 3000); 
            await fetch("http://192.168.1.10:3000/wake", { signal: controller.signal }); 
        } catch (error) {
            postRequestJarvis(transcript);
        }
        setTimeout(() => { reactor.style.filter = "none"; }, 3000);
    } 
    else {
        postRequestJarvis(transcript);
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

async function pollForResponse() {
    const url = "https://lakinduKumuditha.pythonanywhere.com/get_response";
    const statLabel = document.getElementById("js_res");

    if (isProcessing) { statLabel.innerText = "Processing Sir..."; }

    try {
        const res = await fetch(url);
        const data = await res.json();
        const hasCommand = data.command && data.command !== "none" && data.command !== "processing...";

        if (hasCommand) {
            if (data.command.trim() === "false") {
                isProcessing = false;
                await resetCloudResponse();
                statLabel.innerText = "Listening...";
                startListening();
                return;
            }
            isProcessing = false;
            speak(data.command);
            await resetCloudResponse();
            return;
        }
        setTimeout(pollForResponse, 2000);
    } catch (error) {
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

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service_worker.js');
}
