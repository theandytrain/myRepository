/* Owner: Andy Manivong o/a Point707 Technologies */
/* Edited: October 6th, 2015 */

// http:/content.guardianapis.com/search?tag=sport%2Fmotorsports&order-by=newest&show-fields=body%2Cthumbnail&page=1&api-key=73q6jvyst9eynpkwqmyxt86r
// with page select ^^

function getNews(){
	console.log("Getting News...");
	var url = "http://content.guardianapis.com/search?tag=sport%2Fmotorsports&order-by=newest&show-fields=body%2Cthumbnail&api-key=73q6jvyst9eynpkwqmyxt86r";
	// without page select ^^
    
    $.getJSON(url, function(data){
              parseAndSave(data);
              });
}

function parseAndSave(d){
	console.log("Parsing Data...");
    //setItem parse data has run, allow check news function call if true
    window.localStorage.setItem("npFlag",true);
	var ele = document.getElementById("newsHeading");
	var ele2 = document.getElementById("newsBody");
	var curPage = document.getElementById("curPage");
	var maxPage = document.getElementById("maxPage");
	var NOP = d.response.pages; //Number of Pages
	var RPP = d.response.results.length //Results Per Page
	var CP = d.response.currentPage; //Current Page
    var top = 0;
    var left = 0;
    var eleBodyId = "";
	var fieldBody = "";
	var webTitle = "";
    var thumbnail = "";
    var bodyId = "";
    
    var infoDate = "";
    var infoTitle = "";
    var infoWebUrl = "";
    var infoType = "";
    //var newsAlert = "";
	
	window.localStorage.setItem("CP",CP);
	
	curPage.value = CP;
	maxPage.value = NOP;
	
	if (CP == 1){document.getElementById("pagePrv").disabled = true;} else {document.getElementById("pagePrv").disabled = false;}
	if (CP == NOP){document.getElementById("pageNxt").disabled = true;} else {document.getElementById("pageNxt").disabled = false;}
		
	ele.innerHTML = "";
	
	for (var x=0;x<RPP;x++){
        //webUrl = d.response.results[x].webUrl;
		webTitle = d.response.results[x].webTitle;
        //thumbnail
        fieldBody = d.response.results[x].fields.body;
        thumbnail = d.response.results[x].fields.thumbnail;
        
        infoDate = d.response.results[x].webPublicationDate;
        infoTitle = d.response.results[x].webTitle;
        infoWebUrl = d.response.results[x].webUrl;
        infoType = d.response.results[x].type;
        
        bodyId = "fieldBody"+x+"";
        
        window.localStorage.setItem(bodyId,fieldBody);
        window.localStorage.setItem(bodyId+"T",thumbnail);
        
        window.localStorage.setItem("infoDate"+bodyId,infoDate);
        window.localStorage.setItem("infoTitle"+bodyId,infoTitle);
        window.localStorage.setItem("infoWebUrl"+bodyId,infoWebUrl);
        window.localStorage.setItem("infoType"+bodyId,infoType);
        
        //if (x == 0){newsAlert=infoDate};
        
		ele.innerHTML += "<button id=\""+bodyId+"B"+"\" class=\"headButton\" onclick=\"changeBody('"+bodyId+"');\"><img class=\"buttonThumb\" src=\""+thumbnail+"\"/>"+webTitle+"</button><BR/>";
        
        eleBodyId = document.getElementById(bodyId+"B");
        
        top = eleBodyId.offsetTop;
        left = eleBodyId.offsetLeft;
        
        //<img class=\"buttonThumb\" src=\""+thumbnail+"\"/>
        
        //ele.innerHTML += "<img class=\"buttonThumb\" style=\"top:"+top+"px;left:"+left+"px;\" src=\""+thumbnail+"\"/>";

        //document.getElementById(bodyId+"B").style.backgroundImage = "url(\""+thumbnail+"\")";
	}
	
    //once this function runs it means user has checked the page. Set news alert item equal to latest news article date
    //window.localStorage.setItem("newsAlert",newsAlert);
    
	ele.innerHTML += "<BR/>";
    setBodySize();
}

function changePage(dir){
	//http://content.guardianapis.com/search?tag=sport%2Fmotorsports&order-by=newest&show-fields=body%2Cthumbnail&page=1&api-key=73q6jvyst9eynpkwqmyxt86r
	var CP = parseInt(window.localStorage.getItem("CP")); //Current Page
	var NP = 0; //Next Page
	var url = "";
	var ele = document.getElementById("newsBody");
	console.log("Changing Page...");
	
	ele.src = "";
	
	if (dir == 0){
		NP = CP-1;
		console.log(CP + " to " + NP);
		url = "http://content.guardianapis.com/search?tag=sport%2Fmotorsports&order-by=newest&show-fields=body%2Cthumbnail&page="+NP+"&api-key=73q6jvyst9eynpkwqmyxt86r";
	} else {
		NP = CP+1;
		console.log(CP + " to " + NP);
		url = "http://content.guardianapis.com/search?tag=sport%2Fmotorsports&order-by=newest&show-fields=body%2Cthumbnail&page="+NP+"&api-key=73q6jvyst9eynpkwqmyxt86r";
	}

	$.getJSON(url, function(data){
              parseAndSave(data);
              });
}

function changeBody(bodyId){
	console.log(bodyId);
	var ele = document.getElementById("newsBody");
    var ele2 = document.getElementById("tableBody");
    var thumbnail = window.localStorage.getItem(bodyId+"T");
    var infoDate = window.localStorage.getItem("infoDate"+bodyId);
    var infoTitle = window.localStorage.getItem("infoTitle"+bodyId);
    var infoWebUrl = window.localStorage.getItem("infoWebUrl"+bodyId);
    var infoType = window.localStorage.getItem("infoType"+bodyId);
    var body = window.localStorage.getItem(bodyId);
    
    /*
    if (infoType == "picture" || infoType = "video" || infoType == "gallery"){
        body = "<img src=\"\"/>"
    }
    */
    
    if (body == "undefined" || body == ""){
        body = "<div class=\"extMedia\"><BR/><BR/>Click below to visit The Guardian to view this media. <BR/><img src=\"img/media.png\"/></div>";
    }
    
    ele.style.backgroundImage = "url(\"\")";
    
    ele.innerHTML = "<b>" + infoTitle + "</b><BR/>";
    ele.innerHTML += "<i>" + infoDate + "</i><BR/>";
    ele.innerHTML += "<BR/>View this article in original format <BR/> <button class=\"webUrl\" onclick=\"viewArticle('"+infoWebUrl+"');\">HERE</button><BR/><hr>";
    ele.innerHTML += "<img class=\"thumbnail\" src=\""+thumbnail+"\"/>";
    ele.innerHTML += body;
    
    ele.style.width = 0+"px";
    ele.style.height = 0+"px";
    
    ele.scrollTop = 0;
    ele.style.width = ele2.offsetWidth+"px";
    ele.style.height = ele2.offsetHeight+"px";
}

function setBodySize(){
    var ele = document.getElementById("newsBody");
    var ele2 = document.getElementById("tableBody");
    
    ele.style.width = 0+"px";
    ele.style.height = 0+"px";
    
    ele.scrollTop = 0;
    ele.style.width = ele2.offsetWidth+"px";
    ele.style.height = ele2.offsetHeight+"px";
}

function viewArticle(link){
    window.open(link,'_system');
}

function guardianRedirect(){
    window.open('http://guardian.co.uk','_system');
}

function back(){
    window.location.href = "index.html";
}
/*
function scrollToTop(){
    var ele = document.getElementById("newsBody");
    
    ele.animate({ scrollTop: 0}, 'slow');
    //ele.scrollTop = 0;
}
 */
//make function for on button click request new page

//Get all news
//Get Next Page till max?





