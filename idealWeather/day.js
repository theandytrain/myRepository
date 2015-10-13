//day.html specific functions

/* ************************************** */
/* ************ Fill Select ************* */
/* ************************************** */

function fillSelectXML(){
    //Fill select lists with weather description and wind direction values
    var description = null;
    var value = null;
    var wind = new Array("NONE","North","NNE","NE","ENE","East","ESE","SE","SSE","South","SSW","SW","WSW","West","WNW","NW","NNW");
    var weatherDescElement = document.getElementById("weatherDesc");
    var windElement = document.getElementById("windDir");
    var descriptionLength = 0;
    var windLength = wind.length;
    
    description = document.getElementsByTagName("description");
    
    descriptionLength = description.length;
    
    for (var i=0; i<descriptionLength; i++){
        value = description[i].childNodes[0].nodeValue;
        weatherDescElement.options[i] = new Option(value);
    }
    
    for (var i=0; i<windLength;i++){
        windElement.options[i] = new Option(wind[i]);
    }
}

/* ************************************** */
/* ************ Fill Select ************* */
/* ************************************** */


/* ************************************** */
/* ********* defineDayDatabases ********* */
/* ************************************** */
/* if they dont define a value - do not use it "N/A" */
function defineDayDatabase(){
    var validCheck = true;
    var db = window.openDatabase("IdealWeather", "1.0", "IdealDB", 200000);
    var unit = window.localStorage.getItem("unit");
    var name = document.getElementById("name").value;
    var weatherDesc = document.getElementById("weatherDesc").value;
    var pop = document.getElementById("pop").value;
    var humid = document.getElementById("humid").value;
    /**** These values have to be metric and imperial ****/
    var rain = document.getElementById("rain").value;
    var snow = document.getElementById("snow").value;
    var tempMax = document.getElementById("tempMax").value;
    var tempMin = document.getElementById("tempMin").value;
    var windSpeed = document.getElementById("windSpeed").value;
    /**** ^^ These values have to be metric and imperial ****/
    var windDeg = document.getElementById("windDeg").value;
    var windDir = document.getElementById("windDir").value;
    
    var rainMM = 0;
    var snowCM = 0;
    var tempMaxC = 0;
    var tempMinC = 0;
    var windSpeedKMPH = 0;
    var rainIN = 0;
    var snowIN = 0;
    var tempMaxF = 0;
    var tempMinF = 0;
    var windSpeedMPH = 0;
    
    /* Input check (start) */
    if (name==""){name="No Name";}
    if (weatherDesc=="NONE"){weatherDesc="N/A";}
    if (pop==""){pop="N/A";}
    if (humid==""){humid="N/A";}
    if (windDeg==""){windDeg="N/A";}
    if (windDir=="NONE"){windDir="N/A";}

    if (unit == 0){
        if (rain==""){rainMM="N/A";rainIN="N/A";}else{rainMM = rain;rainIN = rain*0.0393701;rainMM = parseFloat(rainMM).toFixed(0);rainIN = parseFloat(rainIN).toFixed(2);}
        if (snow==""){snowCM="N/A";snowIN="N/A";}else{snowCM = snow;snowIN = snow*0.393701;snowCM = parseFloat(snowCM).toFixed(0);snowIN = parseFloat(snowIN).toFixed(2);}
        if (tempMax==""){tempMaxC="N/A";tempMaxF="N/A";}else{tempMaxC = tempMax;tempMaxF = (tempMax*1.8)+32;tempMaxC = parseFloat(tempMaxC).toFixed(0);tempMaxF = parseFloat(tempMaxF).toFixed(0);}
        if (tempMin==""){tempMinC="N/A";tempMinF="N/A";}else{tempMinC = tempMin;tempMinF = (tempMin*1.8)+32;tempMinC = parseFloat(tempMinC).toFixed(0);tempMinF = parseFloat(tempMinF).toFixed(0);}
        if (windSpeed==""){windSpeedKMPH="N/A";windSpeedMPH="N/A";}else{windSpeedKMPH = windSpeed;windSpeedMPH = windSpeed*0.621371;windSpeedKMPH = parseFloat(windSpeedKMPH).toFixed(0);windSpeedMPH = parseFloat(windSpeedMPH).toFixed(0);}
    } else {
        if (rain==""){rainMM="N/A";rainIN="N/A";}else{rainMM = rain*25.4;rainIN = rain;rainMM = parseFloat(rainMM).toFixed(0);rainIN = parseFloat(rainIN).toFixed(2);}
        if (snow==""){snowCM="N/A";snowIN="N/A";}else{snowCM = snow*2.54;snowIN = snow;snowCM = parseFloat(snowCM).toFixed(0);snowIN = parseFloat(snowIN).toFixed(2);}
        if (tempMax==""){tempMaxC="N/A";tempMaxF="N/A";}else{tempMaxC = (tempMax-32)*0.55555555555556;tempMaxF = tempMax;tempMaxC = parseFloat(tempMaxC).toFixed(0);tempMaxF = parseFloat(tempMaxF).toFixed(0);}
        if (tempMin==""){tempMinC="N/A";tempMinF="N/A";}else{tempMinC = (tempMin-32)*0.55555555555556;tempMinF = tempMin;tempMinC = parseFloat(tempMinC).toFixed(0);tempMinF = parseFloat(tempMinF).toFixed(0);}
        if (windSpeed==""){windSpeedKMPH="N/A";windSpeedMPH="N/A";}else{windSpeedKMPH = windSpeed*1.60934;windSpeedMPH = windSpeed;windSpeedKMPH = parseFloat(windSpeedKMPH).toFixed(0);windSpeedMPH = parseFloat(windSpeedMPH).toFixed(0);}
    }
    /* Input check (end) */
    
    for (var i=0;i<name.length;i++){ //names cannot contain "," as it interferes with display
        if (name[i] == ","){
            validCheck = false;
        }
    }
    
    if (validCheck == true){
        db.transaction(addEntry, error, success);
    } else {
        var codeSend = {
        code:1,
        message:"invalid Char",
        };
        error(codeSend);
    }
    
    function addEntry(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS DEFINEDAY');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEFINEDAY (name unique,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir)');
        tx.executeSql('INSERT INTO DEFINEDAY (name,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[name,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir]);
    }
    
    function success() {
        console.log("Ideal Day Added...");
        window.location.href="index.html";
    }
    
    function error(err) {
        /* Error 1 means name already exists */
        if (err.code == 1 || err.code == 6){
            console.log("Error !!(defineDayDatabase)!! - Name Already Exists!");
            console.log("OR");
            console.log("Error !!(defineDayDatabase)!! - Invalid Character Detected!");
            document.getElementById("name").placeholder = "Invalid Name";
            document.getElementById("name").style.background = "red";
            //popUp("Name Already Exists!","Please choose another name.<BR/> or <BR/>Press OK to overwrite.","OK","CANCEL",updateDayDatabase,turnOff);
        } else {
            console.log("Error !!(defineDayDatabase)!! - "+err.code+" - "+err.message);
        }
    }
}
/* ************************************** */
/* ********* defineDayDatabases ********* */
/* ************************************** */


