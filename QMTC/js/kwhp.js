/* Owner: Andy Manivong o/a Point707 Technologies */
/* Edited: September 6th, 2015 */

function converthpkw(unit){
    var hp = document.getElementById("powerHP");
    var kw = document.getElementById("powerKW");
    var temp = 0.0;

    if (unit == 0){
        console.log("convert hp to kW");
        temp = (hp.value * 0.745699872)*100;
        temp = Math.round(temp)/100;
        kw.value = temp;
        //1 hp = 0.745699872 kw
    } else {
        console.log("convert kW to hp");
        temp = (kw.value * 1.34102209)*100;
        temp = Math.round(temp)/100;
        hp.value = temp;
        //1 kW = 1.34102209 hp
    }
}

function moveLabelKWHP(){
    //console.log("moveLabel");
    var hp = document.getElementById("powerHP");
    var kw = document.getElementById("powerKW");
    var hpLabel = document.getElementById("hp_label");
    var kwLabel = document.getElementById("kw_label");
    
    hpLabel.style.top = ((hp.offsetTop + hp.offsetHeight) - hpLabel.offsetHeight*2)+"px";
    hpLabel.style.left = ((hp.offsetLeft + hp.offsetWidth) - hpLabel.offsetWidth)+"px";
    
    kwLabel.style.top = ((kw.offsetTop + kw.offsetHeight) - kwLabel.offsetHeight*2)+"px";
    kwLabel.style.left = ((kw.offsetLeft + kw.offsetWidth) - kwLabel.offsetWidth)+"px";
}

