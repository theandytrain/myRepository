/* Owner: Andy Manivong o/a Point707 Technologies */
/* Edited: September 6th, 2015 */

function convertTorque(unit){
    var ftLbs = document.getElementById("torqueFTLBS");
    var inLbs = document.getElementById("torqueINLBS");
    var nm = document.getElementById("torqueNM");
    var temp = 0.0;
    
    switch(unit){
        case 0: //Convert ft/lbs to in/lbs & n/m
            temp = (ftLbs.value * 12) * 100;
            temp = Math.round(temp)/100;
            inLbs.value = temp;
            
            temp = (ftLbs.value * 1.35581795) * 100;
            temp = Math.round(temp)/100;
            nm.value = temp;
            break;
        case 1: //Convert in/lbs to ft/lbs & n/m
            temp = (inLbs.value * 0.0833333333) * 100;
            temp = Math.round(temp)/100;
            ftLbs.value = temp;
            
            temp = (inLbs.value * 0.112984829) * 100;
            temp = Math.round(temp)/100;
            nm.value = temp;
            break;
        case 2: //Convert n/m to ft/lbs & in/lbs
            temp = (nm.value * 0.737562149) * 100;
            temp = Math.round(temp)/100;
            ftLbs.value = temp;
            
            temp = (nm.value * 8.85074579) * 100;
            temp = Math.round(temp)/100;
            inLbs.value = temp;
            break;
        default:
            break;
    }
    
//    if (unit == 0){
//        console.log("convert hp to kW");
//        temp = (hp.value * 0.745699872)*100;
//        temp = Math.round(temp)/100;
//        kw.value = temp;
//        //1 hp = 0.745699872 kw
//    } else {
//        console.log("convert kW to hp");
//        temp = (kw.value * 1.34102209)*100;
//        temp = Math.round(temp)/100;
//        hp.value = temp;
//        //1 kW = 1.34102209 hp
//    }
}

function moveLabelTorque(){
    //console.log("moveLabel");
    var ftLbs = document.getElementById("torqueFTLBS");
    var inLbs = document.getElementById("torqueINLBS");
    var nm = document.getElementById("torqueNM");
    var ftLbsLabel = document.getElementById("ftLbs_label");
    var inLbsLabel = document.getElementById("inLbs_label");
    var nmLabel = document.getElementById("nm_label");
    
    ftLbsLabel.style.top = ((ftLbs.offsetTop + ftLbs.offsetHeight) - ftLbsLabel.offsetHeight*2)+"px";
    ftLbsLabel.style.left = ((ftLbs.offsetLeft + ftLbs.offsetWidth) - ftLbsLabel.offsetWidth)+"px";
    
    inLbsLabel.style.top = ((inLbs.offsetTop + inLbs.offsetHeight) - inLbsLabel.offsetHeight*2)+"px";
    inLbsLabel.style.left = ((inLbs.offsetLeft + inLbs.offsetWidth) - inLbsLabel.offsetWidth)+"px";
    
    nmLabel.style.top = ((nm.offsetTop + nm.offsetHeight) - nmLabel.offsetHeight*2)+"px";
    nmLabel.style.left = ((nm.offsetLeft + nm.offsetWidth) - nmLabel.offsetWidth)+"px";
}

