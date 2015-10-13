function checkLoc(){
    //check user location function
    var lat = parseFloat(window.localStorage.getItem("setLat"));
    var long = parseFloat(window.localStorage.getItem("setLong"));
    
    if (!(isNaN(lat)) && !(isNaN(long))){
        //alert("good");
        return true; //return to index.html
    } else {
        //alert("Something Missing...");
        return false;
    }
}
function checkPullTime(){
    //Function to pull new weather values.
    //Limited one call per 3 hours.
    //Saves data for future reference.
    
    console.log("Check to pull new weather...");
    var date = new Date();
    var hours = date.getHours();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var initialHour = window.localStorage.getItem("initialHourWeather");
    var checkHour = parseInt(window.localStorage.getItem("weatherHours"));
    var checkDay = parseInt(window.localStorage.getItem("weatherDay"));
    var checkMonth = parseInt(window.localStorage.getItem("weatherMonth"));
    var checkYear = parseInt(window.localStorage.getItem("weatherYear"));
    
    console.log("Check Values: " + checkHour + " - " + checkDay + " - " + checkMonth + " - " + checkYear);
    console.log("Check Values2: " + hours + " - " + day  + " - " + month  + " - " + year);
    //initial start check
    if (initialHour != 1){
        console.log("Setting initial hour...");
        window.localStorage.setItem("weatherHours",hours);
        window.localStorage.setItem("weatherDay",day);
        window.localStorage.setItem("weatherMonth",month);
        window.localStorage.setItem("weatherYear",year);
        //window.localStorage.setItem("initialHourWeather",1);
        checkHour=0;checkDay=0;checkMonth=0;checkYear=0;
    }
    
    //if check values have never been set, set them to 0
    //check is done by checking if value is not a number. value should be 'undefined' if not previously set
    if (isNaN(checkHour)){checkHour=0}
    if (isNaN(checkDay)){checkDay=0}
    if (isNaN(checkMonth)){checkMonth=0}
    if (isNaN(checkYear)){checkYear=0}
    
    //check if 3 hours has passed before making call to get new weather
    if (hours > checkHour+3 || day > checkDay || month > checkMonth || year > checkYear){
        console.log("Getting New Weather...");
        window.localStorage.setItem("weatherHours",hours);
        window.localStorage.setItem("weatherDay",day);
        window.localStorage.setItem("weatherMonth",month);
        window.localStorage.setItem("weatherYear",year);
        checkByLoc();
        //navigator.geolocation.getCurrentPosition(onSuccess, onError); //not used;
    } else {
        console.log("Showing Today...");
        showToday();
    }
}
function checkByLoc() {
    //Check weather by Location (lat+long)
    console.log("Getting Position...");
    var lat = window.localStorage.getItem("setLat");
    var long = window.localStorage.getItem("setLong");
    
    var url = "http://api.wunderground.com/api/e1bed7da29ae3cd6/conditions/alerts/forecast10day/lang:EN/hourly/q/"+lat+","+long+".json";
    
    $.getJSON(url, function(data){
              parseAndSave(data);
              });
}

function parseAndSave(d){
    console.log("Updating Forecast...");
    var passDay = new Array();
    var date = null;
    var weatherIconUrl = null;
    var pop = null;
    var humidity = null;
    var qpfDayMM = null;
    var qpfDayIN = null;
    var snowCM = null;
    var snowIN = null;
    var tempMaxC = null;
    var tempMaxF = null;
    var tempMinC = null;
    var tempMinF = null;
    var windspeedKmph = null;
    var windspeedMiles = null;
    var weatherDesc = null;
    var winddirDegree = null;
    var windDirection = null;
    var day = null;
    var data = null;
    var fcLength = d.forecast.simpleforecast.forecastday.length;
    var locationName = null;
    
    /* Hourly */
    var storeHourly = new Array();
    
    /* These are the current conditons by hours (# of hours will be 36?) */
    window.localStorage.setItem("hrLen",d.hourly_forecast.length);

    //Display emergency alerts if present
    if (d.alerts.length > 0){
        window.localStorage.setItem("mrqDescp",d.alerts[0].description);
        window.localStorage.setItem("mrqMsg",d.alerts[0].message);
    } else {
        window.localStorage.setItem("mrqDescp","No Alerts");
        window.localStorage.setItem("mrqMsg","Have a nice day!");
    }
    
    //save hourly forecast
    for (var s=0;s<d.hourly_forecast.length;s++){
        storeHourly[s] = new Array();
        storeHourly[s][0] = d.hourly_forecast[s].FCTTIME.civil;
        storeHourly[s][1] = d.hourly_forecast[s].FCTTIME.weekday_name;
        storeHourly[s][2] = d.hourly_forecast[s].pop;
        storeHourly[s][3] = d.hourly_forecast[s].humidity;
        storeHourly[s][4] = d.hourly_forecast[s].qpf.metric;
        storeHourly[s][5] = d.hourly_forecast[s].snow.metric;
        storeHourly[s][6] = d.hourly_forecast[s].temp.metric;
        storeHourly[s][7] = d.hourly_forecast[s].wspd.metric;
        storeHourly[s][8] = d.hourly_forecast[s].condition;
        storeHourly[s][9] = d.hourly_forecast[s].wdir.degrees;
        storeHourly[s][10] = d.hourly_forecast[s].wdir.dir;
        storeHourly[s][11] = d.hourly_forecast[s].icon_url;
        storeHourly[s][12] = d.hourly_forecast[s].temp.english;
        storeHourly[s][13] = d.hourly_forecast[s].temp.metric;
        storeHourly[s][14] = d.hourly_forecast[s].FCTTIME.hour;
        
        /* "temp": {"english": "-35", "metric": "-37"}, */
        if (storeHourly[s][2] == ""){storeHourly[s][2]=0;}
        if (storeHourly[s][3] == ""){storeHourly[s][3]=0;}
        if (storeHourly[s][4] == ""){storeHourly[s][4]=0;}
        if (storeHourly[s][5] == ""){storeHourly[s][5]=0;}
        if (storeHourly[s][6] == ""){storeHourly[s][6]=0;}
        if (storeHourly[s][7] == ""){storeHourly[s][7]=0;}
        if (storeHourly[s][9] == ""){storeHourly[s][9]=0;}
        if (storeHourly[s][10] == ""){storeHourly[s][10]=0;}
        
        window.localStorage.setItem("storeHourly"+s,storeHourly[s]);
    }
    /* Hourly */
    
    window.localStorage.setItem("fcLength",fcLength);
    
    console.log("Number of Days: "+fcLength);
    
    locationName = d.current_observation.display_location.full;
    window.localStorage.setItem("locationName",locationName);
    
    //main weather data saving function.
    //fcLength is the number of days forecasted
    for (var x=0;x<fcLength;x++){
        data = d.forecast.simpleforecast.forecastday[x];
        day = x;
        
        date = data.date.pretty;
        weatherIconUrl = data.icon_url;
        pop = data.pop;
        humidity = data.avehumidity;
        qpfDayMM = data.qpf_allday.mm;
        qpfDayIN = data.qpf_allday.in;
        snowCM = data.snow_allday.cm;
        snowIN = data.snow_allday.in;
        tempMaxC = data.high.celsius;
        tempMaxF = data.high.fahrenheit;
        tempMinC = data.low.celsius;
        tempMinF = data.low.fahrenheit;
        windspeedKmph = data.avewind.kph;
        windspeedMiles = data.avewind.mph;
        weatherDesc = data.conditions;
        winddirDegree = data.avewind.degrees;
        windDirection = data.avewind.dir;
        
        passDay[0] = date;
        passDay[1] = weatherIconUrl;
        passDay[2] = weatherDesc;
        passDay[3] = pop;
        passDay[4] = humidity;
        passDay[5] = winddirDegree;
        passDay[6] = windDirection;
        
        passDay[7] = qpfDayMM;
        passDay[8] = snowCM;
        passDay[9] = tempMaxC;
        passDay[10] = tempMinC;
        passDay[11] = windspeedKmph;
        
        passDay[12] = qpfDayIN;
        passDay[13] = snowIN;
        passDay[14] = tempMaxF;
        passDay[15] = tempMinF;
        passDay[16] = windspeedMiles;

        window.localStorage.setItem("passDay"+day,passDay);
    }
    
    //all weather saved; move on to show to user
    showToday();
}

/*********************** Todays Day ***********************/
function showToday(){
    document.getElementById("loadImg").style.display = "none";
    var ele = document.getElementById("dayWeather");
    var table = document.getElementById("weatherTable");
    var d = window.localStorage.getItem("passDay"+0);
    var unit = window.localStorage.getItem("unit"); // unit represents english (1) or metric (0)
    var passDay = d.split(",");
    var rainNum = 0;
    var snowNum = 0;
    var tMaxNum = 0;
    var tMinNum = 0;
    var wSNum = 0;
    var kmMH = 0;
    var rUnit = 0;
    var sUnit = 0;
    var dateSplit = passDay[0].split(" ");
    var date = new Date();
    var hours = date.getHours();
    var storeHour = null;
    var hrLen = parseInt(window.localStorage.getItem("hrLen"));
    var curTemp = null;
    var locationName = window.localStorage.getItem("locationName");
    var mrqDescp = window.localStorage.getItem("mrqDescp");
    var mrqMsg = window.localStorage.getItem("mrqMsg");
    
    //check current hour and display temperature in C or F for it.
    for (var i=0;i<hrLen;i++){
        storeHour = window.localStorage.getItem("storeHourly"+i).split(",");
        if (storeHour[14] == hours){
            if (unit == 0){
                curTemp = storeHour[13]+"&deg;";
            } else {
                curTemp = storeHour[12]+"&deg;";
            }
            i=hrLen;
        } else {
            curTemp = "-&deg;";
        }
    }
    
    console.log("Todays Length: "+passDay.length);
    
    //these are values which will be used as an array index depending on the unit (metric or english)
    if (unit == 0){
        rainNum = 8;
        snowNum = 9;
        tMaxNum = 10;
        tMinNum = 11;
        wSNum = 12;
        kmMH = "KMH";
        rUnit = "mm";
        sUnit = "cm";
    } else if (unit == 1){
        rainNum = 13;
        snowNum = 14;
        tMaxNum = 15;
        tMinNum = 16;
        wSNum = 17;
        kmMH = "MPH";
        rUnit = "in";
        sUnit = "in";
    }
    
    /*
     // !! un-used Code !!
     alert(passDay[2]);
     var picSplit = passDay[2].split("/");
     var picLink = "http://icons-ak.wxug.com/i/c/i/"+picSplit[picSplit.length-1];
     passDay[2] = picLink; */
    
    /* Weather Alerts
     
     table.innerHTML += "<tr><td colspan=\"3\" style=\"text-align:center;font-size:15px;color:#325fa3;\"><marquee behavior=\"scroll\" direction=\"left\">"+passDay[3]+"</marquee></td></tr>";
     
     
     <td>"+locationName+"</td>
     
     <td><tlt>RAIN</tlt> "+passDay[rainNum]+" "+rUnit+"<BR/><tlt>SNOW</tlt> "+passDay[snowNum]+" "+sUnit+"</td><td><tlt>P.O.P.</tlt> "+passDay[4]+"%<BR/><tlt>HUM.</tlt> "+passDay[5]+"%</td>
     */
    
    //fill table (#weatherTable) with weather data
    table.innerHTML = "<tr><td colspan=\"1\" style=\"text-align: right;\"><lrg>"+dateSplit[5]+"</lrg></td><td><table><tr><td><tltkms> "+dateSplit[4]+"</tltkms></td></tr><tr><td><tltkm>"+passDay[1]+"</tltkm></td></tr></table></td><td colspan=\"2\" style=\"text-align: center;color:white;\"><lrgdir>"+passDay[3]+"</lrgdir></td></tr>";
    
    table.innerHTML += "<tr><td colspan=\"2\" style=\"text-align: center;\"><img style=\"width:64px;\"src=\""+passDay[2]+"\"/></td><td style=\"text-align:right;color:white;\"><lrg1>"+curTemp+"</lrg1></td><td colspan=\"1\"><div style=\"border-left:2px solid rgba(255, 255, 255, .3);\"><lrg>"+passDay[tMaxNum]+"&deg;</lrg><BR/><lrg>"+passDay[tMinNum]+"&deg;</lrg></div></td></tr>";
    
    table.innerHTML += "<tr style=\"opacity:0.8;\"><td  style=\"text-align:right;\"colspan=\"2\"><img style=\"opacity:0.7;\" class=\"wind-home\" src=\"img/wind.png\"/><lrgkm>"+passDay[wSNum]+"</lrgkm></BR><tltkm>"+kmMH+"</tltkm></td><td colspan=\"2\"style=\"text-align:left;border-left:1px solid #c5ddf0;\"><table><tr><td><lrgdir>"+passDay[6]+"&deg;<BR/>"+passDay[7]+"</lrgdir></td><td><tlt>RAIN</tlt> "+passDay[rainNum]+" "+rUnit+"<BR/><tlt>SNOW</tlt> "+passDay[snowNum]+" "+sUnit+"</td><td><tlt>P.O.P.</tlt> "+passDay[4]+"%<BR/><tlt>HUM.</tlt> "+passDay[5]+"%</td></tr></table></td></tr>";
    
    //Marquee; check if empty; set to empty string if true
    if (mrqDescp == null){
        mrqDescp = " ";
    }
    if (mrqMsg == null){
        mrqMsg = " ";
    }
    
    //Weather alert marquee
    document.getElementById("mrqDiv").innerHTML = "<u>"+locationName + "</u><BR/><i>" + mrqDescp +"</i>"+ document.getElementById("mrqDiv").innerHTML;
    document.getElementById("wetMrq").innerHTML = mrqMsg;
    
    //calculate on a scale of 5 how close the weather is to the user specified conditions
    currentBar();
    window.localStorage.setItem("initialHourWeather",1);
}
/*********************** Todays Day ***********************/

/*********************** CheckUnit ***********************/
function checkUnit(){
    var unit = window.localStorage.getItem("unit");
    
    if (unit != 0 && unit != 1){
        window.localStorage.setItem("unit",0);
        console.log("Setting Default Unit...");
    } else {
        console.log("Unit Set...");
    }
}
/*********************** CheckUnit ***********************/

/*********************** Navigate ***********************/
function navigate(page){
    switch(page){
        case 0:
            window.location="index.html";
            break;
        case 1:
            window.location="sevDay.html";
            break;
        case 2:
            window.location="hourly.html";
            break;
        case 3:
            window.location="day.html";
            break;
        case 4:
            window.location="settings.html";
            break;
        case 5:
            window.location="help.html";
            break;
        default:
            break;
    }
}
/*********************** CheckUnit ***********************/

function point707(){
    window.open('itms-apps://itunes.apple.com/ca/artist/point707-technologies/id564902659','_blank');
    console.log("Redirecting...");
}
function wuRedirect(){
    window.open('http://www.wunderground.com/', '_system');
    console.log("Redirecting...");
}

/*********************** Edit Day ***********************/
function editDay(id){
    //when the user wants to edit an idealDay, save the value of the id and change pages to edit page.
    window.localStorage.setItem("editID",id);
    window.location="edit.html";
}
/*********************** Edit Day ***********************/

function editDay2(){
    //this funciton gets called on edit.html page load
    //automatically pulls stored editId previously saved in editDay
    console.log("Pulling Edit Entry... "+id);
    var id = window.localStorage.getItem("editID");
    var unit = window.localStorage.getItem("unit");
    var db = window.openDatabase("IdealWeather", "1.0", "IdealDB", 200000);

    var name = document.getElementById("nameEDT");
    var weatherDesc = document.getElementById("weatherDescEDT");
    var pop = document.getElementById("popEDT");
    var humid = document.getElementById("humidEDT");
    /**** These values have to be metric and imperial ****/
    var rain = document.getElementById("rainEDT");
    var snow = document.getElementById("snowEDT");
    var tempMax = document.getElementById("tempMaxEDT");
    var tempMin = document.getElementById("tempMinEDT");
    var windSpeed = document.getElementById("windSpeedEDT");
    /**** ^^ These values have to be metric and imperial ****/
    var windDeg = document.getElementById("windDegEDT");
    var windDir = document.getElementById("windDirEDT");

    db.transaction(queryDB, errorDB);

    function queryDB(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEFINEDAY (name unique,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir)');
        tx.executeSql('SELECT * FROM DEFINEDAY WHERE name = ?', [id], querySuccess, errorDB);
    }

    function querySuccess(tx, results){
        //load all of users ideal conditions and display in edit.html
        name.value = results.rows.item(0).name;
        name.disabled = true;
        
        if(results.rows.item(0).pop != "N/A"){pop.value = results.rows.item(0).pop;}
        if(results.rows.item(0).humid != "N/A"){humid.value = results.rows.item(0).humid;}
        if (unit == 0){
            if(results.rows.item(0).rainMM != "N/A"){rain.value = results.rows.item(0).rainMM;}
            if(results.rows.item(0).snowCM != "N/A"){snow.value = results.rows.item(0).snowCM;}
            if(results.rows.item(0).tempMaxC != "N/A"){tempMax.value = results.rows.item(0).tempMaxC;}
            if(results.rows.item(0).tempMinC != "N/A"){tempMin.value = results.rows.item(0).tempMinC;}
            if(results.rows.item(0).windSpeedKMPH != "N/A"){windSpeed.value = results.rows.item(0).windSpeedKMPH;}
        } else {
            if(results.rows.item(0).rainIN != "N/A"){rain.value = results.rows.item(0).rainIN;}
            if(results.rows.item(0).snowIN != "N/A"){snow.value = results.rows.item(0).snowIN;}
            if(results.rows.item(0).tempMaxF != "N/A"){tempMax.value = results.rows.item(0).tempMaxF;}
            if(results.rows.item(0).tempMinF != "N/A"){tempMin.value = results.rows.item(0).tempMinF;}
            if(results.rows.item(0).windSpeedMPH != "N/A"){windSpeed.value = results.rows.item(0).windSpeedMPH;}
        }
        if(results.rows.item(0).windDeg != "N/A"){windDeg.value = results.rows.item(0).windDeg;}
        
        fillSelectXML();
        
        if(results.rows.item(0).weatherDesc != "N/A"){weatherDesc.value = results.rows.item(0).weatherDesc;}
        if(results.rows.item(0).windDir != "N/A"){windDir.value = results.rows.item(0).windDir;}
    }

    function errorDB(err){
        console.log("Error !!(editday2)!! - " + err.message);
    }
}

/* Loading Edit Screen ^^ */

// Fill selectLists with wind direction and weather description #weatherDescEDT & #windDirEDT
function fillSelectXML(){
    var description = null;
    var value = null;
    var wind = new Array("NONE","North","NNE","NE","ENE","East","ESE","SE","SSE","South","SSW","SW","WSW","West","WNW","NW","NNW");
    var weatherDescElement = document.getElementById("weatherDescEDT");
    var windElement = document.getElementById("windDirEDT");
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

//save all values in edit.html
function saveEdit(){
    var db = window.openDatabase("IdealWeather", "1.0", "IdealDB", 200000);
    var unit = window.localStorage.getItem("unit");
    var name = document.getElementById("nameEDT").value;
    var weatherDesc = document.getElementById("weatherDescEDT").value;
    var pop = document.getElementById("popEDT").value;
    var humid = document.getElementById("humidEDT").value;
    /**** These values have to be metric and imperial ****/
    var rain = document.getElementById("rainEDT").value;
    var snow = document.getElementById("snowEDT").value;
    var tempMax = document.getElementById("tempMaxEDT").value;
    var tempMin = document.getElementById("tempMinEDT").value;
    var windSpeed = document.getElementById("windSpeedEDT").value;
    /**** ^^ These values have to be metric and imperial ****/
    var windDeg = document.getElementById("windDegEDT").value;
    var windDir = document.getElementById("windDirEDT").value;
    
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
    
    //Any values which are empty must have placeholder. This placeholder is checked later on to prevent calculation of empty values.
    if (name==""){name="No Name";}
    if (weatherDesc=="NONE"){weatherDesc="N/A";}
    if (pop==""){pop="N/A";}
    if (humid==""){humid="N/A";}
    if (windDeg==""){windDeg="N/A";}
    if (windDir=="NONE"){windDir="N/A";}
    
    //Check metric or english preference and set values to be saved accordingly
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
    
    db.transaction(addEntry, error, success);
    
    function addEntry(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS DEFINEDAY');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEFINEDAY (name unique,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir)');
        tx.executeSql('REPLACE INTO DEFINEDAY (name,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',[name,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir]);
    }
    
    function success() {
        //save day; return to main page (index.html)s
        console.log("Ideal Day Updated...");
        window.location.href="index.html";
    }
    
    function error(err) {
        /* Error 1 means name already exists */
        if (err.code == 1){
            console.log("Error !!(defineDayDatabase)!! - Name Already Exists!");
            //popUp("Name Already Exists!","Please choose another name.<BR/> or <BR/>Press OK to overwrite.","OK","CANCEL",updateDayDatabase,turnOff);
        } else {
            console.log("Error !!(defineDayDatabase)!! - "+err.code+" - "+err.message);
        }
    }
}



/********************************* One Day (SevDay) *********************************/
//This section is for displaying One of the 7 days rating value out of 5 "bars"
function currentBar(){
    var unit = window.localStorage.getItem("unit");
    var db = window.openDatabase("IdealWeather", "1.0", "IdealDB", 200000);
    var numEntries = 0;
    var days = new Array();
    
    db.transaction(queryDB, errorDB);
    
    function queryDB(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEFINEDAY (name unique,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir)');
        tx.executeSql('SELECT * FROM DEFINEDAY', [], querySuccess, errorDB);
    }
    
    function querySuccess(tx, results){
        numEntries = results.rows.length;
        //console.log("Listing Defined Days... "+numEntries);
        
        if (numEntries > 0){
            for (var i=0;i<numEntries;i++){
                var holdConditionArray = new Array();
                holdConditionArray[0] = results.rows.item(i).name;
                holdConditionArray[1] = results.rows.item(i).weatherDesc;
                holdConditionArray[2] = results.rows.item(i).pop;
                holdConditionArray[3] = results.rows.item(i).humid;
                holdConditionArray[4] = results.rows.item(i).rainMM;
                holdConditionArray[5] = results.rows.item(i).rainIN;
                holdConditionArray[6] = results.rows.item(i).snowCM;
                holdConditionArray[7] = results.rows.item(i).snowIN;
                holdConditionArray[8] = results.rows.item(i).tempMaxC;
                holdConditionArray[9] = results.rows.item(i).tempMaxF;
                holdConditionArray[10] = results.rows.item(i).tempMinC;
                holdConditionArray[11] = results.rows.item(i).tempMinF;
                holdConditionArray[12] = results.rows.item(i).windSpeedKMPH;
                holdConditionArray[13] = results.rows.item(i).windSpeedMPH;
                holdConditionArray[14] = results.rows.item(i).windDeg;
                holdConditionArray[15] = results.rows.item(i).windDir;
                days[i] = holdConditionArray;
            }
        }
        currentBar2(days);
    }

    function errorDB(err){
        console.log("Error !!(currentBar)!! - " + err.message);
    }
}

function currentBar2(days){
    //var fcLength = parseInt(window.localStorage.getItem("fcLength"));
    var ele = document.getElementById("curBar");
    var parseWeather = null;
    var monthDay = null;
    var dayLen = days.length;
    var i = 0;
    //console.log("fcLength: "+fcLength);
    console.log("days Length: "+days.length);
    
    while (dayLen>0){ //days counter
        //alert("typeof: "+typeof(days[i+1]));
        var barIMG = new Array();
        var level = new Array();
        var day1 = null;
        var day2 = null;
        var day3 = null;
        var day4 = null;
        
        console.log(days[i][0]);

        parseWeather = window.localStorage.getItem("passDay"+0).split(",");
        
        //if any day = undefined set ID as "noData8z7ee@"; random unique variable to check
        if (typeof(days[i]) != "undefined"){level[0] = barLevel(days[i],parseWeather);barIMG[0] = days[i][0]+"<BR/><img class=\"level\" src=\"img/bar"+level[0]+".png\"/>";day1=days[i][0]}else{barIMG[0]="";day1="noData8z7ee@"}
        
        if (typeof(days[i+1]) != "undefined"){level[1] = barLevel(days[i+1],parseWeather);barIMG[1] = days[i+1][0]+"<BR/><img class=\"level\" src=\"img/bar"+level[1]+".png\"/>";day2=days[i+1][0]}else{barIMG[1]="";day2="noData8z7ee@"}
        
        if (typeof(days[i+2]) != "undefined"){level[2] = barLevel(days[i+2],parseWeather);barIMG[2] = days[i+2][0]+"<BR/><img class=\"level\" src=\"img/bar"+level[2]+".png\"/>";day3=days[i+2][0]}else{barIMG[2]="";day3="noData8z7ee@"}
        
        if (typeof(days[i+3]) != "undefined"){level[3] = barLevel(days[i+3],parseWeather);barIMG[3] = days[i+3][0]+"<BR/><img class=\"level\" src=\"img/bar"+level[3]+".png\"/>";day4=days[i+3][0]}else{barIMG[3]="";day4="noData8z7ee@"}
        
        ele.innerHTML += "<tr><td onclick=\"popSevBar('"+day1+"');\">"+barIMG[0]+"</td><td onclick=\"popSevBar('"+day2+"');\">"+barIMG[1]+"</td><td onclick=\"popSevBar('"+day3+"');\">"+barIMG[2]+"</td><td onclick=\"popSevBar('"+day4+"');\">"+barIMG[3]+"</td></tr>";
        
        dayLen -= 4;
        i += 4;
    }
}

function popSevBar(id){
    var ele = document.getElementById("barBG");
    var db = window.openDatabase("IdealWeather", "1.0", "IdealDB", 200000);
    var days = new Array();
    
    //if id != "noData8z7ee@" it means there is data being passed;
    //continue with database transaction
    if (id != "noData8z7ee@"){
        db.transaction(queryDB, errorDB);
    }
    
    function queryDB(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEFINEDAY (name unique,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir)');
        tx.executeSql('SELECT * FROM DEFINEDAY WHERE name = ?', [id], querySuccess, errorDB);
    }
    
    function querySuccess(tx, results){
        var holdConditionArray = new Array();
        
        holdConditionArray[0] = results.rows.item(0).name;
        holdConditionArray[1] = results.rows.item(0).weatherDesc;
        holdConditionArray[2] = results.rows.item(0).pop;
        holdConditionArray[3] = results.rows.item(0).humid;
        holdConditionArray[4] = results.rows.item(0).rainMM;
        holdConditionArray[5] = results.rows.item(0).rainIN;
        holdConditionArray[6] = results.rows.item(0).snowCM;
        holdConditionArray[7] = results.rows.item(0).snowIN;
        holdConditionArray[8] = results.rows.item(0).tempMaxC;
        holdConditionArray[9] = results.rows.item(0).tempMaxF;
        holdConditionArray[10] = results.rows.item(0).tempMinC;
        holdConditionArray[11] = results.rows.item(0).tempMinF;
        holdConditionArray[12] = results.rows.item(0).windSpeedKMPH;
        holdConditionArray[13] = results.rows.item(0).windSpeedMPH;
        holdConditionArray[14] = results.rows.item(0).windDeg;
        holdConditionArray[15] = results.rows.item(0).windDir;
        
        sevBar(holdConditionArray); //calcualte 7 day bar rating values
        setImg();
        setBarInfo(holdConditionArray);
        ele.style.display = "block";
        //unhide table and show current day rating values (bars)
    }
    
    function errorDB(err){
        console.log("Error !!(popSevBar)!! - " + err.message);
    }
}

function setBarInfo(day){
    var ele = document.getElementById("bar-info");
    var ele2 = document.getElementById("ideal-info");
    var ele3 = document.getElementById("name-info");
    var barInfo = window.localStorage.getItem("barInfo");
    var unit = window.localStorage.getItem("unit");
    var holdOne = window.localStorage.getItem("moveDT1");
    var holdTwo = window.localStorage.getItem("moveDT2");
    
    ele.innerHTML = barInfo;
    ele.onclick = function(){forDay(holdOne,holdTwo);};
    
    ele3.innerHTML = "<button style=\"width:300px;word-wrap:break-word;\" onclick=\"editDay('"+day[0]+"')\">"+day[0]+"</button>";
    ele2.innerHTML += "<tlt>Your Conditions</tlt><BR/>";
    
    if(day[1] != "N/A"){ele2.innerHTML += "&nbsp;"+day[1]+"<BR/>";} //weather description
    
    if (unit == 0){ //check values for "N/A"; if "N/A" is present, user did not enter value so do not display value
        if(day[8] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>High: &nbsp;</tlt>"+day[8]+ "&deg;<BR/>";} //tempMax
        if(day[10] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Low: &nbsp;</tlt>"+day[10]+"&deg;<BR/>";} //tempMin
        if(day[4] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Rain: &nbsp;</tlt>"+day[4]+"<tltkms>mm</tltkms><BR/>";} //rain
        if(day[6] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Snow: &nbsp;</tlt>"+day[6]+"<tltkms>cm</tltkms><BR/>";} //snow
        if(day[12] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Wind SPD: &nbsp;</tlt>"+day[12]+"<tltkms>KMH</tltkms><BR/>";} //windSpeed
    } else {
        if(day[9] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>High: &nbsp;</tlt>"+day[9]+"&deg;<BR/>";} //tempMax
        if(day[11] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Low: &nbsp;</tlt>"+day[11]+"&deg;<BR/>";} //tempMin
        if(day[5] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Rain: &nbsp;</tlt>"+day[5]+"<tltkms>in</tltkms><BR/>";} //rain
        if(day[7] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Snow: &nbsp;</tlt>"+day[7]+"<tltkms>in</tltkms><BR/>";} //snow
        if(day[13] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Wind SPD: &nbsp;</tlt>"+day[13]+"<tltkms>MPH</tltkms><BR/>";} //windSpeed
    }
    
    if(day[14] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Wind DEG: &nbsp;</tlt>"+day[14]+"&deg;<BR/>";} //windDeg
    if(day[15] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>Wind DIR: &nbsp;</tlt>"+day[15]+"<BR/>";} //windDir
    if(day[2] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>P.O.P. &nbsp;</tlt>"+day[2]+"%<BR/>";} //pop
    if(day[3] != "N/A"){ele2.innerHTML += "&nbsp;<tlt>HUM. &nbsp;</tlt>"+day[3]+"%<BR/>";} //humid

    /*
     //Notes used while developing; metric and english values
    0,1,2,3
    unit0 = 4,6,8,10,12
    unit1 = 5,7,9,11,13
    14,15
     */
}

function sevBar(day){ //day = user ideal day
    //Calcualte 7 day rating values; compare 7 day forecast with user input idealDay
    var ele = document.getElementById("sevPop");
    var fcLength = parseInt(window.localStorage.getItem("fcLength"));
    var ele2 = document.getElementById("barBG");
    var ele3 = document.getElementById("bar-info");
    //var elebut = document.getElementById("barbut");
    var parseWeather = null;
    var monthDay = null;
    var dates = new Array(); //need these because <tr> does not extend into for loop unless it is on the same line innerHTML
    var barIMG = new Array();
    var level = null;
    var barInfo = null;
    
    /* ele.innerHTML += "<tr><td colspan=\"5\"><b>"+day[0]+"</b></td></tr>"; */

    for (var x=0;x<fcLength-3;x++){ //weather day counter, 10 days? only need 7
        parseWeather = window.localStorage.getItem("passDay"+x).split(",");
        monthDay = parseWeather[0].split(" "); //split the date
        
        level = barLevel(day,parseWeather); //calc match percent for forecasted days, 7 days
        
        barIMG[x] = "<BR/><img class=\"level\" src=\"img/bar"+level+".png\"/>";
        dates[x] = monthDay[4]+" "+monthDay[5];
    }

    /* <td onclick=\"forDay('"+dates[0]+"','"+day+"');\">"+dates[0]+barIMG[0]+"</td> */
    //alert(ele3.onclick);
    
    ele.innerHTML += "<tr><td onclick=\"forDay('"+dates[1]+"','"+day+"');\">"+dates[1]+barIMG[1]+"</td><td onclick=\"forDay('"+dates[2]+"','"+day+"');\">"+dates[2]+barIMG[2]+"</td><td onclick=\"forDay('"+dates[3]+"','"+day+"');\">"+dates[3]+barIMG[3]+"</td></tr>";
    ele.innerHTML += "<tr><td onclick=\"forDay('"+dates[4]+"','"+day+"');\">"+dates[4]+barIMG[4]+"</td><td onclick=\"forDay('"+dates[5]+"','"+day+"');\">"+dates[5]+barIMG[5]+"</td><td onclick=\"forDay('"+dates[6]+"','"+day+"');\">"+dates[6]+barIMG[6]+"</td></tr>";
    ele2.innerHTML += "<button onclick=\"delDB('"+day[0]+"')\" style=\"background-color:red;\">Delete</button><BR/><BR/>";
    ele2.innerHTML += "<div onclick=\"wuRedirect();\" style=\"background-color: white;\"><img class=\"wuLogo\" src=\"img/wuLogo.png\"/><BR/><font style=\"color: black;font-size:8px;\"><sup>Powered by Weather Underground</sup></font></div>";
    
    //Set local storage to hold day 0 for info table
    barInfo = dates[0] + barIMG[0];
    window.localStorage.setItem("barInfo",barInfo);
    window.localStorage.setItem("moveDT1",dates[0]);
    window.localStorage.setItem("moveDT2",day);
}

/****** Display ******/
function barLevel(day,weather){
    //this function calls function compareNum to calculate how close the user idealDay is vs weather conditions.
    //For example, the user indicates 5mm of rain, and the forecasted weather says 10mm of rain,
    //both values are sent to compareNum and a value is returned.
    var average = 0;
    var numEntries = 0;
    console.log("************* "+day[0]+" - "+weather[0]+" *************");
    if(day[1] != "N/A"){average += compareWord(day[1],weather[3]);numEntries++;} //descp
    if(isNaN(day[2])){/*do nothing*/}else{average += compareNum(day[2],weather[4]);numEntries++;} //pop
    if(isNaN(day[3])){/*do nothing*/}else{average += compareNum(day[3],weather[5]);numEntries++;} //humid
    if(isNaN(day[4])){/*do nothing*/}else{average += compareNum(day[4],weather[8]);numEntries++;} //rain mm
    if(isNaN(day[6])){/*do nothing*/}else{average += compareNum(day[6],weather[9]);numEntries++;} //snow cm
    if(isNaN(day[8])){/*do nothing*/}else{average += compareNum(day[8],weather[10]);numEntries++;} //tempmax
    //if(isNaN(day[10])){/*do nothing*/}else{average += compareNum(day[10],weather[11]);numEntries++;} //tempmin
    if(isNaN(day[10])){/*do nothing*/}else{average += compareMin(day[10],weather[11]);numEntries++;} //tempmin
    if(isNaN(day[12])){/*do nothing*/}else{average += compareNum(day[12],weather[12]);numEntries++;} //windspd
    if(isNaN(day[14])){/*do nothing*/}else{average += compareNum(day[14],weather[6]);numEntries++;} //wind degree
    if(day[15] != "N/A"){average += compareWord(day[15],weather[7]);numEntries++;} //wind dir
    
    //all values are added together and an average is calculated
    average = average/numEntries;
    console.log("Average: "+average);
    average = Math.round(average);
    console.log("Average(round): "+average);
    
    if (isNaN(average)){
        average = 0;
    }
    
    return average;
}

/* Functions to compare idealWeather day vs forecastedWeather day (start) */
function compareNum(day,weather){
    //bar level calculator for single conditions, example: rain Ideal vs rain Forecasted
    console.log("Day Value: "+day+" - Weather Value: "+weather);
    
    var bar = 0;
    
    day = parseInt(day);
    weather = parseInt(weather);
    
    bar = Math.abs(day-weather);
    bar = 5-bar; //bar value = 0 = high, 5 = low
    
    if (bar<0){bar = 0;}
    
    console.log("Bar Value: "+bar);
    
    return bar;
}

function compareMin(day,weather){
    //minimum value compare
    console.log("Day Value: "+day+" - Weather Value: "+weather);
    
    var bar = 0;
    
    day = parseInt(day);
    weather = parseInt(weather);
    
    bar = Math.abs(day-weather);
    bar = 5-bar; //bar value = 0 = high, 5 = low
    
    if (bar<0){bar = 0;}
    
    if (weather >= day){
        bar = 5;
    }
    
    console.log("Bar Value: "+bar);
    
    return bar;
}

function compareWord(day,weather){
    //string compare; "sunny" vs "cloudy" = 0; "sunny" vs "sunny" = 5;
    var bar = 0;
    
    if (day == weather){
        bar = 5;
    } else {
        bar = 0;
    }
    
    console.log("Day Value: "+day+" - Weather Value: "+weather);
    console.log("Bar Value: "+bar);
    
    return bar;
}
/* Functions to compare idealWeather day vs forecastedWeather day (end) */

/***** Hourly *****/
function hrInc(dir){
    //function to scroll through hourly; parameter is direction
    //dir 0 = down, 1 = up
    var hrLen = parseInt(window.localStorage.getItem("hrLen"));
    var counter = parseInt(window.localStorage.getItem("hrCount"));
    var left = document.getElementById("dsp1");
    var center = document.getElementById("dsp2");
    var right = document.getElementById("dsp3");
    var leftTxt = document.getElementById("dspTxt1");
    var centerTxt = document.getElementById("dspTxt2");
    var rightTxt = document.getElementById("dspTxt3");
    var storehour1 = null;
    var storehour2 = null;
    var storehour3 = null;
    var prv = 0;
    var nxt = 0;
    var temp = 0;
    var unit = window.localStorage.getItem("unit");
    //depending on unit, set array index to match metric or english value
    if (unit == 0){
        temp = 13;
    } else {
        temp = 12;
    }
    
    //increase or decrease counter depending on dir
    if (dir == 0){
        counter = counter-1;
    } else if (dir == 1){
        counter = counter+1;
    }
    
    //if counter reaches limits, reset to highest or lowest
    if (counter < 0){ //under counter < 0, reset to highest value, circle back
        counter = (hrLen-1);
    } else if (counter > (hrLen-1)){ //over counter < 36, reset to lowest value, circle back
        counter = 0;
    }
    
    prv = counter-1;
    nxt = counter+1;
    
    if (prv < 0){prv = (hrLen-1);}
    if (nxt > (hrLen-1)){nxt = 0;}
    
    //Get the hourly forecast for an hour before, current time, hour after
    storehour1 = window.localStorage.getItem("storeHourly"+prv).split(",");
    storehour2 = window.localStorage.getItem("storeHourly"+counter).split(",");
    storehour3 = window.localStorage.getItem("storeHourly"+nxt).split(",");
    
    left.src = storehour1[11];
    center.src = storehour2[11];
    right.src = storehour3[11];
    
    //use the arrays storehour1/2/3 and display
    leftTxt.innerHTML = "<tltkms>"+storehour1[0]+"<BR/><u>"+storehour1[1]+"</u><BR/>"+storehour1[8]+"&nbsp;"+storehour1[temp]+"&deg;</tltkms>";
    centerTxt.innerHTML = "<tlt style=\"color:#003380;\">"+storehour2[0]+"<BR/><u>"+storehour2[1]+"</u><BR/>"+storehour2[8]+"&nbsp;"+storehour2[temp]+"&deg;</tlt>";
    rightTxt.innerHTML = "<tltkms>"+storehour3[0]+"<BR/><u>"+storehour3[1]+"</u><BR/>"+storehour3[8]+"&nbsp;"+storehour3[temp]+"&deg;</tltkms>";
    
    console.log("Counter: "+counter);
    window.localStorage.setItem("hrCount",counter);
}

function setImg(){
    //set the initial hourly image - called in hourly.html
    var left = document.getElementById("dsp1");
    var center = document.getElementById("dsp2");
    var right = document.getElementById("dsp3");
    var leftTxt = document.getElementById("dspTxt1");
    var centerTxt = document.getElementById("dspTxt2");
    var rightTxt = document.getElementById("dspTxt3");
    var temp = 0;
    var unit = window.localStorage.getItem("unit");
    if (unit == 0){
        temp = 13;
    } else {
        temp = 12;
    }
    
    for (var i=0;i<3;i++){
        storeHour = window.localStorage.getItem("storeHourly"+i).split(",");
        switch(i){
            case 0:
                left.src = storeHour[11];
                //leftTxt.innerHTML = storeHour[0]+"<BR/>"+storeHour[1];
                leftTxt.innerHTML = "<tltkms>"+storeHour[0]+"<BR/><u>"+storeHour[1]+"</u><BR/>"+storeHour[8]+"&nbsp;"+storeHour[temp]+"&deg;</tltkms>";
                break;
            case 1:
                center.src = storeHour[11];
                //centerTxt.innerHTML = storeHour[0]+"<BR/>"+storeHour[1];
                centerTxt.innerHTML = "<tlt style=\"color:#003380;\">"+storeHour[0]+"<BR/><u>"+storeHour[1]+"</u><BR/>"+storeHour[8]+"&nbsp;"+storeHour[temp]+"&deg;</tlt>";
                window.localStorage.setItem("hrCount",1);
                break;
            case 2:
                right.src = storeHour[11];
                //rightTxt.innerHTML = storeHour[0]+"<BR/>"+storeHour[1];
                rightTxt.innerHTML = "<tltkms>"+storeHour[0]+"<BR/><u>"+storeHour[1]+"</u><BR/>"+storeHour[8]+"&nbsp;"+storeHour[temp]+"&deg;</tltkms>";
                break;
            default:
                break;
        }
    }
}

function forDay(date,day){ //display on click 7 day calculcations for single idealDay
    console.log("Displaying Day...");
    var ele = document.getElementById("forDay");
    var tbl = document.getElementById("forDayTable");
    var fcLength = (parseInt(window.localStorage.getItem("fcLength")))-3;
    var unit = window.localStorage.getItem("unit");
    var parseDate = null;
    var parseWeather = null;
    var useWeather = new Array();
    var x = 0;
    var day = day.split(",");
    var monthSplit = new Array();
    
    date = date.split(" ");

    //alert(day);
    for (var i=0;i<fcLength;i++){ //find the date the user wants to see
        parseWeather = window.localStorage.getItem("passDay"+i).split(",");
        parseDate = parseWeather[0].split(" ");

        if (date[0] == parseDate[4] && date[1] == parseDate[5]){
            useWeather = parseWeather; //put the date into another variable
        }
    }
    monthSplit = useWeather[0].split(" ");
    tbl.innerHTML = "<tr><td class=\"tblTitle\" style=\"text-align:right;\" colspan=\"1\"><tltkms>"+monthSplit[4]+" "+ monthSplit[5] +"</tltkms><BR/><tltkm>"+useWeather[1]+"<tltkm></td><td class=\"tblTitle\" style=\"text-align:left;\" colspan=\"2\"><lrg>"+day[0]+"</lrg></td></tr>";
    
    tbl.innerHTML += "<tr class=\"tblTitle\"><td>Label</td><td>Ideal Weather</td><td>Forecast Weather</td></tr>";
    
    if (day[1] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Description</td><td class=\"fcDay\">"+day[1]+"</td><td class=\"fcWeath\">"+useWeather[3]+"</td></tr>";} //desc
    if (day[2] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">P.O.P.</td><td class=\"fcDay\">"+day[2]+" %</td><td class=\"fcWeath\">"+useWeather[4]+" %</td></tr>";} //pop
    if (day[3] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Humidity</td><td class=\"fcDay\">"+day[3]+" %</td><td class=\"fcWeath\">"+useWeather[5]+" %</td></tr>";} //humid
    
    if (unit == 0){
        if (day[4] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Rain</td><td class=\"fcDay\">"+day[4]+" mm</td><td class=\"fcWeath\">"+useWeather[8]+" mm</td></tr>";} //rainMM
        if (day[6] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Snow</td><td class=\"fcDay\">"+day[6]+" cm</td><td class=\"fcWeath\">"+useWeather[9]+" cm</td></tr>";} //snowCM
        if (day[8] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Temp. Max</td><td class=\"fcDay\">"+day[8]+"&deg;C</td><td class=\"fcWeath\">"+useWeather[10]+"&deg;C</td></tr>";} //tempMaxC
        if (day[10] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Temp. Min</td><td class=\"fcDay\">"+day[10]+"&deg;C</td><td class=\"fcWeath\">"+useWeather[11]+"&deg;C</td></tr>";} //tempMinC
        if (day[12] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Wind Speed</td><td class=\"fcDay\">"+day[12]+" kmh</td><td class=\"fcWeath\">"+useWeather[12]+" kmh</td></tr>";} //windSpdKMH
    } else if (unit == 1){
        if (day[5] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Rain</td><td class=\"fcDay\">"+day[5]+" in</td><td class=\"fcWeath\">"+useWeather[13]+" in</td></tr>";} //rainIN
        if (day[7] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Snow</td><td class=\"fcDay\">"+day[7]+" in</td><td class=\"fcWeath\">"+useWeather[14]+" in</td></tr>";} //snowIN
        if (day[9] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Temp. Max</td><td class=\"fcDay\">"+day[9]+"&deg;F</td><td class=\"fcWeath\">"+useWeather[15]+"&deg;F</td></tr>";} //tempMaxF
        if (day[11] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Temp. Min</td><td class=\"fcDay\">"+day[11]+"&deg;F</td><td class=\"fcWeath\">"+useWeather[16]+"&deg;F</td></tr>";} //tempMinF
        if (day[13] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Wind Speed</td><td class=\"fcDay\">"+day[13]+" mph</td><td class=\"fcWeath\">"+useWeather[17]+" mph</td></tr>";} //windSpdMPH
    }
    
    if (day[14] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Wind Degree</td><td class=\"fcDay\">"+day[14]+"&deg;</td><td class=\"fcWeath\">"+useWeather[6]+"&deg;</td></tr>";} //wind Degree
    if (day[15] != "N/A"){tbl.innerHTML += "<tr><td class=\"fcTl\">Wind Direction</td><td class=\"fcDay\">"+day[15]+"</td><td class=\"fcWeath\">"+useWeather[7]+"</td></tr>";} //wind Direction
    
    tbl.innerHTML += "<tr class=\"tblTitle\"><td colspan=\"3\" onclick=\"closeTbl();\">Close</td></tr>";
    tbl.innerHTML += "<tr style=\"background-color: transparent;\"><td> </td><tr/>";
    tbl.innerHTML += "<tr onclick=\"wuRedirect();\" style=\"background-color: white;\"><td colspan=\"3\"><img class=\"wuLogo\" src=\"img/wuLogo.png\"/><BR/><font style=\"color: black;font-size:8px;\"><sup>Powered by Weather Underground</sup></font></td></tr>";
    
    /*
     0 - name
     1 - weather description
     2 - pop
     3 - humidity
     4 - rainMM
     5 - rainIN
     6 - snowCM
     7 - snowIN
     8 - tempMaxC
     9 - tempMaxF
     10 - tempMinC
     11 - tempMinF
     12 - windSpeedKMPH
     13 - windSpeedMPH
     14 - windDegree
     15 - windDirection
     */
    ele.style.display = "block";
    tbl.style.display = "block";
    window.scrollTo(0,0);
}

function closeTbl(){
    //close table
    var ele = document.getElementById("forDay");
    var tbl = document.getElementById("forDayTable");
    
    ele.style.display = "none";
    tbl.style.display = "none";
    
    console.log("Closing View...");
}


/** DELETE **/
//delete idealDay functions
function delDB2(name,del){
    //add notification
    if (del == 1){
        var db = window.openDatabase("IdealWeather", "1.0", "IdealDB", 200000);
        
        db.transaction(queryDB, errorDB,success);
        
        function queryDB(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEFINEDAY (name unique,weatherDesc,pop,humid,rainMM,rainIN,snowCM,snowIN,tempMaxC,tempMaxF,tempMinC,tempMinF,windSpeedKMPH,windSpeedMPH,windDeg,windDir)');
            tx.executeSql('DELETE FROM DEFINEDAY WHERE name = ?', [name]);
        }
        
        function success(){
            console.log("Entry Deleted...");
            window.location.reload();
        }
        
        function errorDB(err){
            console.log("Error !!(delDB)!! - " + err.message);
        }
    } else {
        closePrompt();
    }
}
function delDB(name){
    var ele = document.getElementById("blockBG");
    var ele2 = document.getElementById("contentPop");
    
    ele.style.display = "block";
    ele2.style.display = "block";
    
    ele2.innerHTML = "<BR/><BR/> You are about to delete an Ideal Day. <BR/> Are you sure you want to? <BR/> <BR/>";
    ele2.innerHTML += "<button onclick=\"delDB2('"+name+"','"+0+"')\" class=\"popBut2\">Cancel</button> <BR/><BR/><BR/>";
    ele2.innerHTML += "<button onclick=\"delDB2('"+name+"','"+1+"')\" class=\"popBut\">Delete</button>";
    
    setTimeout(function(){window.scrollTo(0,0);},100);
}
function closePrompt(){
    var ele = document.getElementById("blockBG");
    var ele2 = document.getElementById("contentPop");
    
    ele.style.display = "none";
    ele2.style.display = "none";
}
function help(dir){
    var ele = document.getElementById("help-img");
    var helpCount = parseInt(window.localStorage.getItem("helpCount"));
    //var imageArray = new Array("home.png","motor.png","forecast.png","settings.png");

    if (dir == 1){
        helpCount++;
        if (helpCount > 5){
            helpCount = 1;
        }
        ele.src = "img/help/help"+helpCount+".png";
        window.localStorage.setItem("helpCount",helpCount);
    } else {
        helpCount--;
        if (helpCount < 1){
            helpCount = 5;
        }
        ele.src = "img/help/help"+helpCount+".png";
        window.localStorage.setItem("helpCount",helpCount);
    }
}






