if(!localStorage.secs){
    var seconds = 0;
}else{
    var seconds = parseInt(localStorage.getItem("secs"));
}

if(!localStorage.mins){
    var minutes = 0;
}else{
    var minutes = parseInt(localStorage.getItem("mins"));
}

if(!localStorage.hrs){
    var hours = 0;
}else{
    var hours = parseInt(localStorage.getItem("hrs"));
}

if(!localStorage.timerStatus){
    var timerStatus = null;
}else{
    var timerStatus = localStorage.getItem("timerStatus");
}

if(!localStorage.historyLock){
    var historyLock = 0;
}else{
    var historyLock = localStorage.getItem("historyLock");
}

var laps = getLapsfromLS();
var historyArr = getHistoryfromLS();
var resetFlag = parseInt(localStorage.getItem("resetFlag"));

var displayHours = 0;
var displayMinutes = 0;
var displaySeconds = 0;

var lapLock = 0;
var interval = null;
var isHistoryVisible = "false";

function stopwatch(){
    seconds++;
    if( seconds === 60){
        minutes++;
        seconds = 0;

        if( minutes === 60){
            hours++;
            minutes = 0;

            if( hours/24 === 1){
                seconds = 0;
                minutes = 0;
                hours = 0;
            }

        }else if( minutes > 60){
            while( minutes > 60){
                minutes -= 60;
                hours++;
            }
        }
    }else if( seconds > 60){
        while(seconds > 60){
            seconds -= 60;
            minutes++;
        }
    }
    
    if(seconds < 10){
        displaySeconds = "0" + seconds.toString();
    }else{
        displaySeconds = seconds;
    }

    if(minutes < 10){
        displayMinutes = "0" + minutes.toString();
    }else{
        displayMinutes = minutes;
    }

    if(hours < 10){
        displayHours = "0" + hours.toString();
    }else{
        displayHours = hours;
    }

    document.getElementById("display").innerHTML = displayHours+":"+displayMinutes+":"+displaySeconds;

}

function start(){
    timerStatus = "started";
    resetFlag = 0;
    document.getElementById("start").setAttribute("style","visibility:hidden");
    document.getElementById("pause").setAttribute("style","visibility:visible");
    startStop();
}

function pause(){
    timerStatus = "stopped";
    document.getElementById("start").innerHTML = "Resume";
    document.getElementById("start").setAttribute("style","visibility:visible");
    document.getElementById("pause").setAttribute("style","visibility:hidden");
    lapLock = 1;
    resetFlag = 1;
    localStorage.setItem("resetFlag",resetFlag);
    startStop();
}

function startStop(){
    if(timerStatus === "started"){
        interval = window.setInterval(stopwatch,1000);
        historyLock = 0;
        lapLock = 0;
    }else if(timerStatus === "stopped"){
        window.clearInterval(interval);
    }
}

function showHistory(){
    if(isHistoryVisible==="false"){
        document.getElementById("divHistory").style.display = "block";
        isHistoryVisible = "true";
    }else{
        document.getElementById("divHistory").style.display = "none";
        isHistoryVisible = "false";
    }
    historyLock = 0;
    printHistory();    
}

function reset(){
    window.clearInterval(interval);
    interval = null;
    timerStatus = "reset";
    if(historyLock === 0){
        var output =+ displayHours+":"+displayMinutes+":"+displaySeconds;
        historyArr.push(output);
        saveHistoryintoLS(historyArr);
        printHistory();
        historyLock = 1;
    }
    lapLock = 1;
    seconds = hours = minutes = 0;
    
    laps = [];
    document.getElementById("display").innerHTML = "00:00:00";
    document.getElementById("start").innerHTML = "Start";
    document.getElementById("displaylap").innerHTML = "";
    document.getElementById("start").setAttribute("style","visibility:visible");
    document.getElementById("pause").setAttribute("style","visibility:hidden");
    localStorage.removeItem("secs");
    localStorage.removeItem("mins");
    localStorage.removeItem("hrs");
    localStorage.removeItem("timerStatus");
    localStorage.removeItem("timeOnClock");
    localStorage.removeItem("laps");
    resetFlag = 1;
    localStorage.setItem("resetFlag",resetFlag);
}

function saveHistoryintoLS(historyArr){
    localStorage.setItem("historyArr",JSON.stringify(historyArr));
}

function getHistoryfromLS(){
    if(!localStorage.historyArr){
        localStorage.historyArr = JSON.stringify([]);
    }return JSON.parse(localStorage.historyArr);
}

function printHistory(){
    if(historyLock === 0){
        document.getElementById("historyList").innerHTML = "";
        historyArr.forEach(function(his){
            var li = document.createElement("li");
            li.textContent = his;
            document.getElementById("historyList").appendChild(li);
        });
    }
}

function clearHistory(){
    historyArr =[];
    localStorage.removeItem("historyArr");
    document.getElementById("historyList").innerHTML = "";
    historyLock = 1;
    localStorage.setItem("historyLock",historyLock);
}

function lap(){
    if(lapLock === 0){
        var output =+ displayHours+":"+displayMinutes+":"+displaySeconds;
        laps.push(output);
        saveLapsIntoLS(laps);
        printLaps();
    }
}

function getLapsfromLS(){
    if(!localStorage.laps){
        localStorage.laps  = JSON.stringify([]);
    }return JSON.parse(localStorage.laps);
}

function saveLapsIntoLS(laps){
    localStorage.setItem("laps",JSON.stringify(laps));
}

function printLaps(){
    if(lapLock === 0){
        document.getElementById("displaylap").innerHTML = "";
        laps.forEach(function(lap){
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
    if(!resetFlag){
        localStorage.setItem("timeOnClock", new Date());
    }else{
        localStorage.removeItem("timeOnClock");
    }
    localStorage.setItem("timerStatus",timerStatus);
    return "";
};

window.onload = function(){
    
    if(!localStorage.timeOnClock){
        var timeOnClock = 0;
    }else{
        var timeOnClock = localStorage.getItem("timeOnClock");
    }
    if(timeOnClock){
        seconds += parseInt((new Date() - new Date(timeOnClock))/1000);
    }
    printHistory(historyArr);
    printLaps(laps);
    if( timerStatus === "started" ){
        start();
    }else if( timerStatus === "stopped" ){
        pause();
    }else{
        reset();
    }
}