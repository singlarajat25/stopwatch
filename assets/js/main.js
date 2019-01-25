if(!localStorage.secs){
    localStorage.secs = 0;
}else{
    var seconds = parseInt(localStorage.getItem("secs"));
}

if(!localStorage.getItem("mins")){
    var minutes = 0;
}else{
    var minutes = parseInt(localStorage.getItem("mins"));
}

if(!localStorage.getItem("hrs")){
    var hours = 0;
}else{
    var hours = parseInt(localStorage.getItem("hrs"));
}

console.log(seconds);
console.log(minutes);
console.log(hours);

var displayhours = 0;
var displayminutes = 0;
var displayseconds = 0;
var laps = [];
var historyarr = getHistoryfromLS();
var historyLock = 0;
var lapLock = 0;

var interval = null;
var timerStatus = localStorage.getItem("timerStatus");
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
        displayseconds = "0" + seconds.toString();
    }else{
        displayseconds = seconds;
    }

    if(minutes < 10){
        displayminutes = "0" + minutes.toString();
    }else{
        displayminutes = minutes;
    }

    if(hours < 10){
        displayhours = "0" + hours.toString();
    }else{
        displayhours = hours;
    }

    document.getElementById("display").innerHTML = displayhours+":"+displayminutes+":"+displayseconds;

}

function start(){
    timerStatus = "started";
    document.getElementById("start").setAttribute("style","visibility:hidden");
    document.getElementById("stop").setAttribute("style","visibility:visible");
    document.getElementById("pause").setAttribute("style","visibility:visible");
    startStop();
}

function stop(){
    timerStatus = "stopped";
    document.getElementById("start").setAttribute("style","visibility:visible");
    document.getElementById("stop").setAttribute("style","visibility:hidden");
    document.getElementById("pause").setAttribute("style","visibility:visible");
    document.getElementById("start").innerHTML = "Start";
    startStop();
}


function startStop(){
    if(timerStatus === "started"){
        interval = window.setInterval(stopwatch,1000);
        //document.getElementById("startStop").innerHTML = "Stop";
        //timerStatus = "started";
        historyLock = 0;
        lapLock = 0;
    }else if(timerStatus === "stopped"){
        window.clearInterval(interval);
        //document.getElementById("startStop").innerHTML = "Start";
        //timerStatus = "stopped";
    }
}

function pause(){
    document.getElementById("start").innerHTML = "Resume";
    document.getElementById("start").setAttribute("style","visibility:visible");
    document.getElementById("pause").setAttribute("style","visibility:hidden");
    document.getElementById("stop").setAttribute("style","visibility:visible");
    timerStatus = "stopped";
    window.clearInterval(interval);
}

function showHistory(){
    if(isHistoryVisible==="false"){
        document.getElementById("divHistory").style.display = "block";
        isHistoryVisible = "true";
    }else{
        document.getElementById("divHistory").style.display = "none";
        isHistoryVisible = "false";
    }
    
}

function reset(){
    window.clearInterval(interval);
    interval = null;
    timerStatus = "stopped";
    if(historyLock === 0){
        var output =+ displayhours+":"+displayminutes+":"+displayseconds;
        historyarr.push(output);
        saveHistoryintoLS(historyarr);
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
    document.getElementById("pause").setAttribute("style","visibility:visible");
    document.getElementById("stop").setAttribute("style","visibility:hidden");
    localStorage.clear();
}
