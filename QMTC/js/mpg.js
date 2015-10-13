/* Owner: Andy Manivong o/a Point707 Technologies */
/* Edited: September 6th, 2015 */

function convertMPG(unit){
    var lpkm = document.getElementById("lpkm");
    var mpg = document.getElementById("mpg");
    var temp = 0.0;

    if (unit == 0){
        console.log("convert L/100km to MPG");
        temp = (((100*3.785411784)/lpkm.value)/1.609344)*1000;
        temp = Math.round(temp)/1000;
        mpg.value = temp;
        //1 hp = 0.745699872 kw
    } else {
        console.log("convert MPG to L/100KM");
        temp = ((100*3.785411784)/(1.609344*mpg.value))*1000;
        temp = Math.round(temp)/1000;
        lpkm.value = temp;
        //1 kW = 1.34102209 hp
    }
}

function getLPKM(){
    var litres = document.getElementById("lpkm_IPL");
    var km = document.getElementById("lpkm_IPKM");
    var output = document.getElementById("lpkm_OP");
    var temp = 0.0;
    
    temp = ((litres.value/km.value)*100)*100;
    temp = Math.round(temp)/100;
    output.value = temp;
    /*
     12L / 250km = 0.048*100 = 4.8L/100km
     */
}

function getMPG(){
    var gallons = document.getElementById("mpg_IPG");
    var mile = document.getElementById("mpg_IPM");
    var output = document.getElementById("mpg_OP");
    var temp = 0.0;
    
    temp = (mile.value/gallons.value)*100;
    temp = Math.round(temp)/100;
    
    output.value = temp;
    /*
     250mile / 6Gallons = 41.67mpg
     */
}

function mpgConvert(unit){
    var mpgUS = document.getElementById("mpgUS");
    var mpgUK = document.getElementById("mpgUK");
    var temp = 0.0;
    
    //USmpg to UKmpg
    if (unit == 0){
        temp = (mpgUS.value*1.2009499255398)*100;
        temp = Math.round(temp)/100;
        mpgUK.value = temp;
    } else { //UKmpg to USmpg
        temp = (mpgUK.value*0.83267418460479)*100;
        temp = Math.round(temp)/100;
        mpgUS.value = temp;
    }
}

function zeroLPKM(){
    var output = document.getElementById("lpkm_OP");
    
    output.value = "";
}

function zeroMPG(){
    var output = document.getElementById("mpg_OP");
    
    output.value = "";
}

function moveLabelMPG(){
    //console.log("moveLabel");
    var lpkm = document.getElementById("lpkm");
    var mpg = document.getElementById("mpg");
    var lpkmLabel = document.getElementById("lpkm_label");
    var mpgLabel = document.getElementById("mpg_label");
    
    lpkmLabel.style.top = ((lpkm.offsetTop + lpkm.offsetHeight) - lpkmLabel.offsetHeight*2)+"px";
    lpkmLabel.style.left = ((lpkm.offsetLeft + lpkm.offsetWidth) - lpkmLabel.offsetWidth)+"px";
    
    mpgLabel.style.top = ((mpg.offsetTop + mpg.offsetHeight) - mpgLabel.offsetHeight*2)+"px";
    mpgLabel.style.left = ((mpg.offsetLeft + mpg.offsetWidth) - mpgLabel.offsetWidth)+"px";
}


