// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  VARIABLES  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

var seconds = 0;
var minutes = 0;
var hours = 0;
var timerStatus = null;
var historyLock = false;
var displayHours = 0;
var displayMinutes = 0;
var displaySeconds = 0;
var lapLock = false;
var interval = null;
var isHistoryVisible = false;
var laps = getLapsfromLS();
var historyArr = getHistoryfromLS();
var resetFlag = false;

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  LOCAL STORAGE  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

if (localStorage.secs) {
    seconds = parseInt(localStorage.getItem("secs"));
}

if (localStorage.mins) {
    minutes = parseInt(localStorage.getItem("mins"));
}

if (localStorage.hrs) {
    hours = parseInt(localStorage.getItem("hrs"));
} 

if (localStorage.timerStatus) {
    timerStatus = localStorage.getItem("timerStatus");
}

if (localStorage.historyLock) {
    historyLock = localStorage.getItem("historyLock");
}

if (localStorage.resetFlag) {
    resetFlag = localStorage.getItem("resetFlag");
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  FUNCTIONS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Function of calculating timer values - 
function stopWatch() {
    seconds++;
    if (seconds === 60) {
        minutes++;
        seconds = 0;

        if (minutes === 60) {
            hours++;
            minutes = 0;

            if (hours / 24 === 1) {
                seconds = 0;
                minutes = 0;
                hours = 0;
            }

        } else if (minutes > 60) {
            while (minutes > 60) {
                minutes -= 60;
                hours++;
            }
        }
    } else if (seconds > 60) {
        while (seconds > 60) {
            seconds -= 60;
            minutes++;
        }
    }

// Converting timer values into strings to print them on display - 
    if (seconds < 10) {
        displaySeconds = "0" + seconds.toString();
    } else {
        displaySeconds = seconds;
    }

    if (minutes < 10) {
        displayMinutes = "0" + minutes.toString();
    } else {
        displayMinutes = minutes;
    }

    if (hours < 10) {
        displayHours = "0" + hours.toString();
    } else {
        displayHours = hours;
    }

    document.getElementById("display").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;

}

// Function to initiate the stopWatch - 
function start() {
    timerStatus = "started";
    resetFlag = false;
    document.getElementById("start").style.display = "none";
    document.getElementById("pause").style.display = "inline-block";
    
    // Calling iterative fuction which is responsibe for running stopwatch continously - 
    startStop();
}

// Function to stop the stopWatch - 
function pause() {
    timerStatus = "stopped";
    document.getElementById("start").innerHTML = "Resume";
    document.getElementById("start").style.display = "inline-block";
    document.getElementById("pause").style.display = "none";
    // Enabling Lap flag to avoid printing of laps on diplay - 
    lapLock = true;
    // Enabling reset flag to avoid continuatiuon of stopwatch on page reload/browser reload - 
    resetFlag = true;
    localStorage.setItem("resetFlag", resetFlag);
    startStop();
}

// Function to call stopWatch function repeatedly after every 1 second - 
function startStop() {
    // Checking the status of stopWatch to decide start/stop event - 
    if (timerStatus === "started") {
        interval = window.setInterval(stopWatch, 1000);
        // Updating History flag to allow it to be printed on display - 
        historyLock = false;
        lapLock = false;
    } else if (timerStatus === "stopped") {
        window.clearInterval(interval);
    }
}

// Function to Show/Hide History Div - 
function showHistory() {
    if (!isHistoryVisible) {
        document.getElementById("divHistory").style.display = "block";
        isHistoryVisible = true;
    } else {
        document.getElementById("divHistory").style.display = "none";
        isHistoryVisible = false;
    }
    historyLock = false;
    //Printing History onto display - 
    printHistory();
}

// Function to reset the stopWatch - 
function reset() {
    window.clearInterval(interval);
    interval = null;
    timerStatus = "reset";
    if (!historyLock) {
        var output = + displayHours + ":" + displayMinutes + ":" + displaySeconds;
        //Checking if Max History Limit is reached - 
        if(historyArr.length === 10){
            historyArr.splice(0,1);
            historyArr.push(output);

        }else{
            historyArr.push(output);
        }
        //Saving History array in LS - 
        saveHistoryintoLS(historyArr);
        printHistory();
        historyLock = true;
    }
    lapLock = true;
    seconds = hours = minutes = 0;

    laps = [];
    //Reseting everything and deleting all local Storage data except history array - 
    document.getElementById("display").innerHTML = "00:00:00";
    document.getElementById("start").innerHTML = "Start";
    document.getElementById("displaylap").innerHTML = "";
    document.getElementById("start").style.display = "inline-block";
    document.getElementById("pause").style.display = "none";
    localStorage.removeItem("secs");
    localStorage.removeItem("mins");
    localStorage.removeItem("hrs");
    localStorage.removeItem("timerStatus");
    localStorage.removeItem("timeOnClock");
    localStorage.removeItem("laps");
    resetFlag = true;
    localStorage.setItem("resetFlag", resetFlag);
}

// Function to Save history onto LS - 
function saveHistoryintoLS(historyArr) {
    localStorage.setItem("historyArr", JSON.stringify(historyArr));
}

// Funtion to get history from LS - 
function getHistoryfromLS() {
    if (!localStorage.historyArr) {
        localStorage.historyArr = JSON.stringify([]);
    } return JSON.parse(localStorage.historyArr);
}

// Function to print history on display - 
function printHistory() {
    if (!historyLock) {
        document.getElementById("historyList").innerHTML = "";
        historyArr.forEach(function (his) {
            var li = document.createElement("li");
            li.textContent = his;
            document.getElementById("historyList").appendChild(li);
        });
    }
}

// Function to clear history from display and LS - 
function clearHistory() {
    historyArr = [];
    localStorage.removeItem("historyArr");
    document.getElementById("historyList").innerHTML = "";
    if(timerStatus === "started"){
        historyLock = false;
    }else{
        historyLock = true;
    }
    localStorage.setItem("historyLock", historyLock);
}

// Function to record Lap - 
function lap() {
    if (!lapLock) {
        var output = + displayHours + ":" + displayMinutes + ":" + displaySeconds;
        laps.push(output);
        saveLapsIntoLS(laps);
        printLaps();
    }
}

// Function to retrieve laps from LS in case of reload/reopen browser window -
function getLapsfromLS() {
    if (!localStorage.laps) {
        localStorage.laps = JSON.stringify([]);
    } return JSON.parse(localStorage.laps);
}

// Funtion to save laps onto LS - 
function saveLapsIntoLS(laps) {
    localStorage.setItem("laps", JSON.stringify(laps));
}

// Funtion to print laps on display - 
function printLaps() {
    if (!lapLock) {
        document.getElementById("displaylap").innerHTML = "";
        laps.forEach(function (lap) {
            var li = document.createElement("li");
            li.textContent = lap;
            document.getElementById("displaylap").appendChild(li);
        });
    }
}

// Function to capture window reload event and saving all data in LS - 
window.onbeforeunload = function () {
    seconds = parseInt(displaySeconds);
    minutes = parseInt(displayMinutes);
    hours = parseInt(displayHours);
    localStorage.setItem("secs", seconds);
    localStorage.setItem("mins", minutes);
    localStorage.setItem("hrs", hours);
    if (!resetFlag) {
        localStorage.setItem("timeOnClock", new Date());
    } else {
        localStorage.removeItem("timeOnClock");
    }
    localStorage.setItem("timerStatus", timerStatus);
    return "";
}

// Function to capture window load event and retrieving necessary data from LS - 
window.onload = function () {

    if (!localStorage.timeOnClock) {
        var timeOnClock = 0;
    } else {
        var timeOnClock = localStorage.getItem("timeOnClock");
    }
    if (timeOnClock) {
        seconds += parseInt((new Date() - new Date(timeOnClock)) / 1000);
    }
    console.log(parseInt((new Date() - new Date(timeOnClock)) / 1000));
    console.log(seconds);
    console.log(timerStatus);
    printHistory(historyArr);
    printLaps(laps);
    if (timerStatus === "started") {
        start();
    } else if (timerStatus === "stopped") {
        pause();
    } else {
        reset();
    }
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  THE END  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<