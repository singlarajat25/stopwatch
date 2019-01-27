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
var resetFlag = parseInt(localStorage.getItem("resetFlag"));


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

function start() {
    timerStatus = "started";
    resetFlag = false;
    document.getElementById("start").style.display = "none";
    document.getElementById("pause").style.display = "inline-block";
    startStop();
}

function pause() {
    timerStatus = "stopped";
    document.getElementById("start").innerHTML = "Resume";
    document.getElementById("start").style.display = "inline-block";
    document.getElementById("pause").style.display = "none";
    lapLock = true;
    resetFlag = true;
    localStorage.setItem("resetFlag", resetFlag);
    startStop();
}

function startStop() {
    if (timerStatus === "started") {
        interval = window.setInterval(stopWatch, 1000);
        historyLock = false;
        lapLock = false;
    } else if (timerStatus === "stopped") {
        window.clearInterval(interval);
    }
}

function showHistory() {
    if (!isHistoryVisible) {
        document.getElementById("divHistory").style.display = "block";
        isHistoryVisible = true;
    } else {
        document.getElementById("divHistory").style.display = "none";
        isHistoryVisible = false;
    }
    historyLock = false;
    printHistory();
}

function reset() {
    window.clearInterval(interval);
    interval = null;
    timerStatus = "reset";
    if (!historyLock) {
        var output = + displayHours + ":" + displayMinutes + ":" + displaySeconds;
        if(historyArr.length === 10){
            historyArr.splice(0,1);
            historyArr.push(output);

        }else{
            historyArr.push(output);
        }
        saveHistoryintoLS(historyArr);
        printHistory();
        historyLock = true;
    }
    lapLock = true;
    seconds = hours = minutes = 0;

    laps = [];
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

function saveHistoryintoLS(historyArr) {
    localStorage.setItem("historyArr", JSON.stringify(historyArr));
}

function getHistoryfromLS() {
    if (!localStorage.historyArr) {
        localStorage.historyArr = JSON.stringify([]);
    } return JSON.parse(localStorage.historyArr);
}

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

function lap() {
    if (!lapLock) {
        var output = + displayHours + ":" + displayMinutes + ":" + displaySeconds;
        laps.push(output);
        saveLapsIntoLS(laps);
        printLaps();
    }
}

function getLapsfromLS() {
    if (!localStorage.laps) {
        localStorage.laps = JSON.stringify([]);
    } return JSON.parse(localStorage.laps);
}

function saveLapsIntoLS(laps) {
    localStorage.setItem("laps", JSON.stringify(laps));
}

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