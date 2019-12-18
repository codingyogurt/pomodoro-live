// I refer views as scene got catched to Java programming still

// scene with the big play button
const startScene = document.querySelector(".start-scene");
// scene with all the other controls and the main timer
const mainScene = document.querySelector(".main-scene");
// scene where we set the time for each session default is 25
const settingsScene = document.querySelector(".settings-scene");

const playBtn = document.querySelector(".play");

// edit button for each scene. easier for layout.
const settingsBtnStart = document.querySelector(".start-scene .edit");
const settingsBtnSettings = document.querySelector(".settings-scene .edit");
const settingsBtnMain = document.querySelector(".main-scene .edit");

const stopBtn = document.querySelector(".stop");
const pauseBtn = document.querySelector(".pause");
const resetBtn = document.querySelector(".reset");
const adjustBtn = document.querySelector(".adjust");
const minusBtns = document.querySelectorAll(".minus");
const plusBtns = document.querySelectorAll(".plus");

// switch variable to monitor if paused button is pressed before any other process
let switchPause = false;

let currentSession = "";
let sessionNumber = 0;

const SESSION = "session";
const BREAK = "break";
const REST = "rest";

settingsBtnStart.addEventListener("click", showSettings);

settingsBtnSettings.addEventListener("click", closeSettings);

settingsBtnMain.addEventListener("click", showSettings);

// Starting the timer
playBtn.addEventListener("click", () => {
    startTimer();
    resetAll();
    showMain();
});

// stop the timer
stopBtn.addEventListener("click", () => {
    clearInterval(decrement);
    showStart();
    resetAll();
});

// pause the timer and toggle pause button
pauseBtn.addEventListener("click", (e) => {
    const eClassList = e.target.classList;
    updatePauseBtn(eClassList);
});

// resets the timer back 0 remembering current session
resetBtn.addEventListener("click", () => {
    initTimerParam(currentSession);
    timer.textContent = secToTimeStr(seconds);
});

// button in settings. restarts everthing to main screen
adjustBtn.addEventListener("click", () => {
    clearInterval(decrement);
    showStart();
    resetAll();
});

// button for minus buttons in settings
minusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        settingChangeValue(btn.nextElementSibling, "minus");
    })
});

// button for plus buttons in settings
plusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        settingChangeValue(btn.previousElementSibling, "plus");
    })
});

// resets all states and switch monitoring variables
function resetAll(){
    sessionNumber = 0;
    initTimerParam(SESSION);
    updateSessionText();
    // for the pause/play button
    const eClassList = pauseBtn.classList;
    eClassList.add("fa-pause");
    eClassList.remove("fa-play");
    switchPause = false; // pause
}

// updates the pause button's icon and at the same time manage the timer
function updatePauseBtn() {
    const eClassList = pauseBtn.classList;
    eClassList.toggle("fa-pause");
    eClassList.toggle("fa-play");

    if (eClassList.contains("fa-pause")) {
        switchPause = true; // play
        startTimer();
        // console.log("Playing from pause");
    } else if (eClassList.contains("fa-play")) {
        switchPause = false; // pause
        clearInterval(decrement);
        // console.log("Pause from playing");
    }
}

function showStart() {
    mainScene.classList.remove("fade");
    startScene.classList.add("fade");
    settingsScene.classList.remove("fade");
}

function showSettings() {
    settingsScene.classList.add("fade");
}

function closeSettings() {
    settingsScene.classList.remove("fade");
}

function showMain() {
    mainScene.classList.add("fade");
    startScene.classList.remove("fade");
    settingsScene.classList.remove("fade");
}

// updates the value of parameters in settings, depends on what is passed
function settingChangeValue(valueTarget, method) {
    let currentValue = Number(valueTarget.textContent);

    if (currentValue < 25) {
        if (method === "plus") {
            currentValue++;
            valueTarget.textContent = currentValue;
        }
    }

    if (currentValue > 1) {
        if (method === "minus") {
            currentValue--;
            valueTarget.textContent = currentValue.toString();
        }
    }
}

// End of UI codes

const timer = document.querySelector(".timer");
const sessionValue = document.querySelector(".session-value");
const breakValue = document.querySelector(".break-value");
const restValue = document.querySelector(".rest-value");
const sessionText = document.querySelector(".session");
const beepAudio = document.querySelector(".beep-audio");

// global params
let seconds = 0;
let decrement = true;

// for testing purposes. turning on code is found in initTimerParam function
function testMode() {
    seconds = 3;
}

// returns seconds equivalent of a value in the settings. also sets the currentSession variable for monitoring
function initTimerParam(stringType) {
    switch (stringType) {
        case SESSION:
            seconds = sessionValue.textContent * 60;
            break;
        case BREAK:
            seconds = breakValue.textContent * 60;
            break;
        case REST:
            seconds = restValue.textContent * 60;
            break;
    }
    currentSession = stringType;

    // un-comment only if testing
    // testMode();

    return seconds;
}

// converts seconds to string of time hh:mm:ss. puts 0 on seconds < 10
function secToTimeStr(sec) {
    let hour = 0, minute = 0;
    hour = Math.floor(sec / 3600);
    sec = sec - (hour * 3600);
    minutes = Math.floor(sec / 60);
    sec = sec - (minutes * 60);

    function format(n) {
        return n < 10 ? "0" + n : n;
    }

    return hour > 0 ? `${format(hour)}:${format(minutes)}:${format(sec)}` :
        `${format(minutes)}:${format(sec)}`;
}

// starts a job (setInterval()) to decrement seconds global variable and display formatted equivalent stops at 0
function startTimer() {
    
    decrement = setInterval (function(){
        if (seconds === -1){
            clearInterval(decrement);
            sessionMonitorUpdate();
        }
        timer.textContent = secToTimeStr(seconds--);
    }, 1000);


}

// updates timer and other variables depending on current session and sessionNumber value. plays sound.
function sessionMonitorUpdate() {
    // console.log(currentSession + " sesh:" + (sessionNumber));

    if (currentSession === SESSION && sessionNumber < 3) {
        initTimerParam(BREAK);
    } else if (currentSession === BREAK && sessionNumber < 3) {
        sessionNumber++;
        initTimerParam(SESSION);
    } else if (currentSession === SESSION && sessionNumber === 3) {
        initTimerParam(REST);
    } else if (currentSession === REST) {
        clearInterval(decrement);
        showStart();
        resetAll();
    }

    updatePauseBtn();

    updateSessionText();

    beepAudio.play();
}

// updates session text
function updateSessionText() {
    if (currentSession === REST) {
        sessionText.textContent = "Congratulations! Please Rest :)";
        return;
    } else if (currentSession === BREAK) {
        sessionText.textContent = `Break ${sessionNumber + 1}`;
        return;
    }
    sessionText.textContent = `Session ${sessionNumber + 1}`;
}





