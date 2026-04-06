var recognition;
var voices = [];
var LOCAL_SERVER_IP = "http://192.168.1.10:3000";
var isProcessing = false;

var datasheet = [
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
            "DYNAMIC_TIME_CHECK",
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
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

function speak(text) {
    if (text === "DYNAMIC_TIME_CHECK") {
        var now = new Date();
        text = "It is " + now.getHours() + " hours and " + now.getMinutes() + " minutes, Sir.";
    }

    var statusLabel = document.getElementById("js_res");
    if(statusLabel) statusLabel.innerText = "Jarvis: " + text;

    // Stop listening while Jarvis is talking
    if (recognition) { try { recognition.abort(); } catch(e) {} }

    window.speechSynthesis.cancel(); 
    var utterance = new SpeechSynthesisUtterance(text);
    
    // Pick a sophisticated voice
    var jarvisVoice = voices.find(v => v.name.includes('UK English Male') || v.name.includes('Google UK')) || voices[0];
    if (jarvisVoice) utterance.voice = jarvisVoice;
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0; 
    
    utterance.onend = function() {
        if (!isProcessing) setTimeout(startListening, 500);
    };

    window.speechSynthesis.speak(utterance);
}

function sendLocationToJarvis() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                
                ajaxRequest("POST", "https://lakinduKumuditha.pythonanywhere.com/update_location", 
                    {lat: lat, lon: lon}, function(data) {
                        console.log("GPS Link Established, Sir.");
                    }
                );
            },
            function(error) {
                console.error("GPS Error: ", error.message);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        speak("Sir, this device does not support satellite positioning.");
    }
}

function ajaxRequest(method, url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try { callback(JSON.parse(xhr.responseText)); } catch(e) { callback(null); }
        }
    };
    xhr.send(data ? JSON.stringify(data) : null);
}

function handleLogic(query) {
    var transcript = query.toLowerCase().trim();
    var response = null;

    // Local Datasheet Search
    for (var i = 0; i < datasheet.length; i++) {
        for (var q = 0; q < datasheet[i].questions.length; q++) {
            if (transcript.includes(datasheet[i].questions[q])) {
                response = datasheet[i].responses[Math.floor(Math.random() * datasheet[i].responses.length)];
                break;
            }
        }
    }

    if (response) {
        speak(response);
    } else {
        // Hand off to PythonAnywhere Cloud
        isProcessing = true;
        document.getElementById("js_res").innerText = "Jarvis: Consulting Sith-ka-lu AI...";
        ajaxRequest("POST", "https://lakinduKumuditha.pythonanywhere.com/send_command", {command: transcript}, function() {
            pollForResponse();
        });
    }
}

function pollForResponse() {
    if (!isProcessing) return;
    ajaxRequest("GET", "https://lakinduKumuditha.pythonanywhere.com/get_response", null, function(data) {
        if (data && data.command && data.command !== "none" && data.command !== "processing...") {
            isProcessing = false;
            speak(data.command);
            ajaxRequest("POST", "https://lakinduKumuditha.pythonanywhere.com/update_jarvis", {text: "none"}, function(){});
        } else {
            setTimeout(pollForResponse, 2000);
        }
    });
}

function startListening() {
    var status = document.getElementById("js_res");
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        status.innerText = "Error: Browser Incompatible.";
        return;
    }

    if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        recognition.onstart = function() {
            status.innerText = "Listening...";
            document.getElementById("arc-reactor").classList.add("active-pulse");
        };

        recognition.onresult = function(event) {
            var transcript = event.results[0][0].transcript;
            document.getElementById("js_res").innerText = "You: " + transcript;
            handleLogic(transcript);
        };

        recognition.onend = function() {
            document.getElementById("arc-reactor").classList.remove("active-pulse");
            if (!isProcessing && !window.speechSynthesis.speaking) {
                setTimeout(startListening, 600);
            }
        };
    }
    try { recognition.start(); } catch(e) {}
}

window.onload = function() {
    document.getElementById("init-button").onclick = function() {
        var accessCode = prompt("Biometric Scan Required:");
        if (accessCode === "jarvis197777911981@@") {
            this.style.display = "none";
            document.getElementById("boot-screen").style.display = "none";
            
            sendLocationToJarvis();

            var hour = new Date().getHours();
            var greeting = (hour < 12) ? "Good Morning" : (hour < 18) ? "Good Afternoon" : "Good Evening";
            speak(greeting + ", Sir. Access granted. All systems online.");
        } else {
            alert("Access Denied.");
        }
    };
};
