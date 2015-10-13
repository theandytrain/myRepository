/* Owner: Andy Manivong o/a Point707 Technologies */
/* Edited: October 6th, 2015 */

function onSuccess(position) {
    var qFlag = parseFloat(window.localStorage.getItem("qFlag"));
    var kmh = 0;
    
    window.localStorage.setItem("cLat",position.coords.latitude);
    window.localStorage.setItem("cLon",position.coords.longitude);

    if (qFlag == 1){
        window.localStorage.setItem("qLat",position.coords.latitude);
        window.localStorage.setItem("qLon",position.coords.longitude);
    }
    if (position.coords.speed > 0.5){
        //kmh = position.coords.speed*3.6; 0.26
        kmh = position.coords.speed*3.6;
    } else {
        kmh = 0;
    }

    //console.log("m/s: " + position.coords.speed);
    //console.log("kmh: " + kmh.toFixed(0));

    zeroTime(kmh);
}

function zeroTime(kmh){
    var stopReset = parseFloat(window.localStorage.getItem("stopReset"));
    var spdDiv = document.getElementById("spdDiv");
    var unitDsp = document.getElementById("unitDsp");
    var ele2 = document.getElementById("zSix");
    var ele3 = document.getElementById("qMile");
    var ele4 = document.getElementById("zHund");
    var mph = (kmh*0.621371).toFixed(0);
    var flag = parseFloat(window.localStorage.getItem("flag"));
    var qFlag = parseFloat(window.localStorage.getItem("qFlag"));
    var hFlag = parseFloat(window.localStorage.getItem("hFlag"));
    var sixty = window.localStorage.getItem("sixty");
    var quart = window.localStorage.getItem("quart");
    var hund = window.localStorage.getItem("hund");
    var init = new Date().getTime();
    var timeTaken = 0;
    var timeTaken2 = 0;
    var timeTaken3 = 0;
    var quartDis = 0;
    var unit = window.localStorage.getItem("spdTog");
    //console.log("kmh: "+kmh);
    if (stopReset == 1){
        //document.getElementById("armBTN").innerHTML = "re-arm";
        document.getElementById("armBTN").disabled = false;
        document.getElementById("armBTN").className = "armBlink";
    } else {
        //document.getElementById("armBTN").innerHTML = "armed";
        document.getElementById("armBTN").disabled = true;
        document.getElementById("armBTN").className = "arm";
    }
    
    /* Current Speed Display */
    if (unit == 0){
        spdDiv.innerHTML = kmh.toFixed(0)+"<sub style=\"font-size:12px;\">kmph</sub>";
        //unitDsp.innerHTML = "kmph";
    } else if (unit == 1){
        spdDiv.innerHTML = mph+"<sub style=\"font-size:12px;\">mph</sub>";
        //unitDsp.innerHTML = "mph";
    } else {
        spdDiv.innerHTML = kmh.toFixed(0)+"<sub style=\"font-size:12px;\">kmph</sub>";
        //unitDsp.innerHTML = "kmph";
    }
    
    /* Distance */
    if (qFlag != 0){
        quartDis = getDistance();
        //document.getElementById("dis").innerHTML = quartDis + "<font size=\"1\">mi</font>";
    }
    
    /* 1/4 Mile Flags */
    if (qFlag == 0 && mph == 0 && stopReset != 1){
        ele3.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Ready!";
        window.localStorage.setItem("qFlag",1); // (1) initiate count, stationary
    } else if (qFlag == 1 && mph >= 1) {
        ele3.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Timing...";
        window.localStorage.setItem("quart",init);
        window.localStorage.setItem("qFlag",2); // (2) timer start, moving
    } else if (qFlag == 2 && quartDis >= 0.25) { //quarter mile
        timeTaken2 = init - quart;
        window.localStorage.setItem("quart",null);
        window.localStorage.setItem("qFlag",0); // reset flag, timer stop
        if (unit == 1){
            ele3.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> "+(timeTaken2/1000).toFixed(2)+"<sub>s</sub> <b>@</b> "+mph+"<sub>mph</sub>";
        } else {
            ele3.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> "+(timeTaken2/1000).toFixed(2)+"<sub>s</sub> <b>@</b> "+kmh.toFixed(0)+"<sub>kmph</sub>";
        }
        window.localStorage.setItem("stopReset",1);
        document.getElementById("saveBTN").disabled = false;
        document.getElementById("saveBTN").className = "saveAlert";
    } else if (qFlag == 2 && mph == 0 && stopReset != 1){
        window.localStorage.setItem("quart",null);
        window.localStorage.setItem("qFlag",0);
        ele3.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Ready!";
    }
    //alert(mph);
    
    /* 0-60 Flags */
    if (flag == 0 && mph == 0 && stopReset != 1){
        //alert("flag1");
        ele2.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Ready!";
        window.localStorage.setItem("flag",1); // (1) initiate count, stationary
        document.getElementById("saveBTN").disabled = true;
        document.getElementById("saveBTN").className = "saveAlertStop";
    } else if (flag == 1 && mph >= 1) {
        //alert("flag2");
        ele2.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Timing...";
        window.localStorage.setItem("sixty",init);
        window.localStorage.setItem("flag",2); // (2) timer start, moving
    } else if (flag == 2 && mph >= 60) {
        //alert("flag3");
        timeTaken = init - sixty;
        window.localStorage.setItem("sixty",null);
        window.localStorage.setItem("flag",0); // reset flag, timer stop
        ele2.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> "+(timeTaken/1000).toFixed(2) +"<sub>s</sub>";
        window.localStorage.setItem("stopReset",1);
        document.getElementById("saveBTN").disabled = false;
        document.getElementById("saveBTN").className = "saveAlert";
        //alert(timeTaken);
    } else if (flag == 2 && mph == 0 && stopReset != 1){
        window.localStorage.setItem("sixty",null);
        window.localStorage.setItem("flag",0);
        ele2.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Ready!";
    }
    
    /* 0-100 Flags */
    if (hFlag == 0 && mph == 0 && stopReset != 1){
        //alert("flag1");
        ele4.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Ready!";
        window.localStorage.setItem("hFlag",1); // (1) initiate count, stationary
    } else if (hFlag == 1 && mph >= 1) {
        //alert("flag2");
        ele4.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Timing...";
        window.localStorage.setItem("hund",init);
        window.localStorage.setItem("hFlag",2); // (2) timer start, moving
    } else if (hFlag == 2 && mph >= 100) {
        //alert("flag3");
        timeTaken3 = init - hund;
        window.localStorage.setItem("hund",null);
        window.localStorage.setItem("hFlag",0); // reset flag, timer stop
        ele4.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> "+(timeTaken3/1000).toFixed(2) +"<sub>s</sub>";
        window.localStorage.setItem("stopReset",1);
        document.getElementById("saveBTN").disabled = false;
        document.getElementById("saveBTN").className = "saveAlert";
        //alert(timeTaken);
    } else if (hFlag == 2 && mph == 0 && stopReset != 1){
        window.localStorage.setItem("hund",null);
        window.localStorage.setItem("hFlag",0);
        ele4.innerHTML = "<img class=\"flags\" src=\"img/timer.png\"/> Ready!";
    }
    //setTimeout(getPos, 100);
}

function onError(error) {
    //alert('geoLocation Error: ' + error.code + '\n' +
          //'Message: ' + error.message + '\n');
    var spdDiv = document.getElementById("spdDiv");
    var unit = window.localStorage.getItem("spdTog");
    window.localStorage.setItem("stopReset",0);

    if (unit == 0){
        spdDiv.innerHTML = 0;
    } else if (unit == 1){
        spdDiv.innerHTML = 0;
    } else {
        spdDiv.innerHTML = 0;
    }
    
    //window.localStorage.setItem("stopReset",0);
    
    setTimeout(getLoc, 5000);
    zeroTime(0);
    //console.log("GeoLocation Error: "+error.message);
}

function getDistance(){
    var lat1 = parseFloat(window.localStorage.getItem("qLat"));
    var lon1 = parseFloat(window.localStorage.getItem("qLon"));
    var lat2 = parseFloat(window.localStorage.getItem("cLat"));
    var lon2 = parseFloat(window.localStorage.getItem("cLon"));
    //alert(lat1 +"\n"+ lon1 +"\n"+ lat2 +"\n"+ lon2);
    var a = 0;
    var c = 0;
    var d = 0;
    var R = 6371; // Radius of the earth in km 6371 actual(6378.1 km)
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();

    a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) *
    Math.cos(lat1) * Math.cos(lat2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    d = ((R*c)*0.621371);
    //d = R*c;
    return d.toFixed(2);
}

function toggleSpd(){
    var unit = window.localStorage.getItem("spdTog");
    
    if (unit == 0){
        window.localStorage.setItem("spdTog",1);
        unit = 1;
    } else if (unit == 1){
        window.localStorage.setItem("spdTog",0);
        unit = 0;
    }
    
    if (unit == 0){
        spdDiv.innerHTML = "-";
    } else if (unit == 1){
        spdDiv.innerHTML = "-";
    } else {
        spdDiv.innerHTML = "-";
    }
}

function resetAll(){
    window.localStorage.setItem("stopReset",0);
}

function setSpd(){
    //var ele = document.getElementById("toggle");
    var unit = window.localStorage.getItem("spdTog");
    //alert(unit);
    if (unit == 0){
        //ele.src = "img/togkmh.png";
    } else if (unit == 1){
        //ele.src = "img/togmph.png";
    } else {
        //ele.src = "img/togkmh.png";
        window.localStorage.setItem("spdTog",0);
    }
}

function saveTime(){
    var db = window.openDatabase("Point707", "1.0", "Speeds", 1000000);
    var qMile = document.getElementById("qMile").innerHTML;
    var zSix = document.getElementById("zSix").innerHTML;
    var zHund = document.getElementById("zHund").innerHTML;
    var flag = parseFloat(window.localStorage.getItem("flag"));
    var qFlag = parseFloat(window.localStorage.getItem("qFlag"));
    var hFlag = parseFloat(window.localStorage.getItem("hFlag"));
    
    if (flag != 0){zSix = "DNF";}
    if (qFlag != 0){qMile = "DNF";}
    if (hFlag != 0){zHund = "DNF";}
    
    db.transaction(saveDB, error, success);
    
    function saveDB(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS TIMES');
        tx.executeSql('CREATE TABLE IF NOT EXISTS TIMES (id INTEGER PRIMARY KEY,qMile,zSix,zHund)');
        tx.executeSql('INSERT INTO TIMES (qMile,zSix,zHund) VALUES (?,?,?);',[qMile,zSix,zHund]);
    }
    
    function success(){
        document.getElementById("saveBTN").disabled = true;
        document.getElementById("saveBTN").className = "saveAlertStop";
        //resetAll();
        //alert("Time Saved");
    }
    
    function error(err){
        alert("Error Code (SaveTime): " + err.code);
    }
}

function readTime(){
    var db = window.openDatabase("Point707", "1.0", "Speeds", 1000000);
    var ele = document.getElementById("timeTable");
    var ele2 = document.getElementById("popUpDiv");
    
    ele.style.display = "table";
    ele2.style.display = "block";
    
    db.transaction(loadTimes, error, success2);
    
    function loadTimes(tx){
        //tx.executeSql('DROP TABLE IF EXISTS TIMES');
        tx.executeSql('CREATE TABLE IF NOT EXISTS TIMES (id INTEGER PRIMARY KEY,qMile,zSix,zHund)');
        tx.executeSql('SELECT * FROM TIMES', [], success, error);
    }
    
    function success(tx, results){
        var numEntries = results.rows.length;
        var id = 0;
        var qMile = 0;
        var zSix = 0;
        var zHund = 0;
        
        ele.innerHTML = "<tr class=\"tbClose\"><td onclick=\"closeTable();\" colspan=\"4\">Close</td></tr><tr class=\"tbHead\"><td width=\"10%\">Run</td><td width=\"40%\">1/4 Mile</td><td width=\"25%\">0-60<font size=\"1\">mph</font></td><td width=\"25%\">0-100<font size=\"1\">mph</font></td></tr>";
        
        for (var i=0;i<numEntries;i++){
            id = results.rows.item(i).id;
            qMile = results.rows.item(i).qMile;
            zSix = results.rows.item(i).zSix;
            zHund = results.rows.item(i).zHund;

            if (typeof qMile == "undefined"){
                qMile = "-";
            }
            if (typeof zSix == "undefined"){
                zSix = "-";
            }
            if (typeof zHund == "undefined"){
                zHund = "-";
            }
            
            ele.innerHTML += "<tr id=\"run"+id+"\" class=\"tbCont\" onclick=\"delTB('"+id+"')\"><td>"+id+"</td><td>"+qMile+"</td><td>"+zSix+"</td><td>"+zHund+"</td></tr>";
        }
        //alert(ele.offsetHeight);
        ele2.style.minHeight = (ele.offsetHeight+35)+"px";
        //alert(ele2.offsetHeight);
        //alert("Success");
    }
    
    function success2(){
        //alert("Read Success");
    }
    
    function error(err){
        alert("Error Code (readTime): " + err.code);
    }
}

function delTB(id,chk){
    //alert("in");
    var ele = document.getElementById("run"+id);
    var notClear = window.localStorage.getItem("notClear");
    
    if (chk == "x"){
        //alert(chk);
        ele.onclick = function(){delTB(id);};
        window.localStorage.setItem("notClear",1);
    } else {
        if (notClear == 1){
            var holdEle = ele.innerHTML;

            window.localStorage.setItem("tempEle",holdEle);
            
            ele.onclick = function(){};
            ele.innerHTML = "<td onclick=\"revertTB('"+id+"')\" colspan=\"2\" style=\"background-color: #98d1cc;\">Cancel</td><td onclick=\"confirmDelete('"+id+"');\" colspan=\"2\" style=\"background-color: #c06d6d;\">Delete</td>";
            window.localStorage.setItem("notClear",0);
        }
    }
}

function revertTB(id){
    var holdEle = window.localStorage.getItem("tempEle");
    var ele = document.getElementById("run"+id);
    
    ele.innerHTML = holdEle;
    ele.onclick = function(){delTB(id,"x");};
}

function confirmDelete(id){
    var db = window.openDatabase("Point707", "1.0", "Speeds", 1000000);
    db.transaction(deleteRow, error, success);
    
    function deleteRow(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS TIMES (id INTEGER PRIMARY KEY,qMile,zSix,zHund)');
        tx.executeSql('DELETE FROM TIMES WHERE id = ?', [id]);
    }

    function success(){
        readTime();
        window.localStorage.setItem("notClear",1);
        //alert("success");
    }
    function error(err) {
        //alert("Error: " + err.code);
    }
}

function closeTable(){
    var ele = document.getElementById("popUpDiv");
    var ele2 = document.getElementById("timeTable");
    
    ele.style.display = "none";
    ele2.style.display = "none";
}

function redirect(){
    window.open('http://bit.ly/AppStoreAM','_system');
}

function direct_news(){
    window.location.href = "news.html";
}

function redirect_ig(){
    window.open('http://bit.ly/1HZxu4M','_system');
}

function redirect_fb(){
    window.open('http://on.fb.me/1BP13DU','_system');
}

function QMTC(){
    window.open('http://bit.ly/707_QMTC','_system');
}

function accept(){
    document.getElementById("safety").style.display = "none";
    document.addEventListener("deviceready",onReady,false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    console.log("Terms Accepted...");
}

//store most recent date, check if value has changed, if so, change news button icon to newsAlert.png
//if no value stored, set to newest date
//parse news has to run before this function can work?

function checkNews(){ //fixed news issue, may consider removing incase too many calls to theGuardian done on October 8th 2015; after 3.0 submit (currently inReview);
    console.log("checking news...");
    LAD();
    if (window.localStorage.getItem("npFlag")){
        var bodyId = "fieldBody"+0+"";
        var infoDate = window.localStorage.getItem("infoDate"+bodyId);
        var newsAlert = window.localStorage.getItem("newsAlert");
        var ele = document.getElementById("newsNav");
        var ele2 = document.getElementById("newsNav2");
        
        if (typeof(newsAlert) == 'undefined'){
            console.log("Setting initial news alert flag to: "+infoDate);
            window.localStorage.setItem("newsAlert",infoDate);
        } else {
            console.log("newsAlert flag is present. Checking if new...");
            if (newsAlert != infoDate){
                console.log("new article available");
                ele.src = "img/newsAlert.png";
                ele2.src = "img/newsAlert.png";
            } else {
                console.log("no change in news");
                ele.src = "img/news.png";
                ele2.src = "img/news.png";
            }
        }
    } else {
        console.log("parse function has not run");
    }
}

function LAD(){
    var url = "http://content.guardianapis.com/search?tag=sport%2Fmotorsports&order-by=newest&show-fields=body%2Cthumbnail&api-key=73q6jvyst9eynpkwqmyxt86r";
    // without page select ^^
    
    $.getJSON(url, function(data){
              parseDate(data);
              });
}
function parseDate(d){
    var articleDate = "";
    
    articleDate = d.response.results[0].webPublicationDate;
    
    window.localStorage.setItem("newsAlert",articleDate);
}



/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}




