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
