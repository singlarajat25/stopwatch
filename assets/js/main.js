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
