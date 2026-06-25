const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const charCount = document.getElementById("charCount");
const historyList = document.getElementById("history");

inputText.addEventListener("input", () => {
    charCount.textContent = inputText.value.length;
});

async function translateText(){

    let text = inputText.value;

    if(!text){
        alert("Enter text first");
        return;
    }

    let source =
    document.getElementById("sourceLang").value;

    let target =
    document.getElementById("targetLang").value;

    try{

        let url =
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

        let response = await fetch(url);

        let data = await response.json();

        let translated = data[0][0][0];

        outputText.value = translated;

        saveHistory(text, translated);

    }
    catch(err){
        alert("Translation Failed");
        console.log(err);
    }
}

function copyText(){

    navigator.clipboard.writeText(
        outputText.value
    );

    alert("Copied!");
}

function speakText(){

    let speech =
    new SpeechSynthesisUtterance(
        outputText.value
    );

    window.speechSynthesis.speak(speech);
}

function swapLanguages(){

    let source =
    document.getElementById("sourceLang");

    let target =
    document.getElementById("targetLang");

    let temp = source.value;

    source.value = target.value;
    target.value = temp;
}

function voiceInput(){

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

    if(!SpeechRecognition){
        alert("Voice Recognition not supported");
        return;
    }

    const recognition =
    new SpeechRecognition();

    recognition.start();

    recognition.onresult = function(event){

        inputText.value =
        event.results[0][0].transcript;

        charCount.textContent =
        inputText.value.length;
    };
}

function saveHistory(original, translated){

    let history =
    JSON.parse(
        localStorage.getItem("translations")
    ) || [];

    history.unshift({
        original,
        translated
    });

    localStorage.setItem(
        "translations",
        JSON.stringify(history)
    );

    loadHistory();
}

function loadHistory(){

    let history =
    JSON.parse(
        localStorage.getItem("translations")
    ) || [];

    historyList.innerHTML = "";

    history.slice(0,10).forEach(item => {

        let li =
        document.createElement("li");

        li.textContent =
        `${item.original} ➜ ${item.translated}`;

        historyList.appendChild(li);
    });
}

loadHistory();

document
.getElementById("themeBtn")
.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
    );
});

if(localStorage.getItem("theme")==="true"){
    document.body.classList.add("dark");
}