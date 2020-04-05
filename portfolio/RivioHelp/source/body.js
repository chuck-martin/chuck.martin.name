var mHiddenPane;
var mBodyDocument;
var mBodyPane;
var mOpaqueKey;
var mWebServer;
var mbSSL = true; // leave TRUE=ON - Ward
var mCSSDir = "/ebopsweb/apputil/css/"; // may change by partner someday
var mAppImgDir = "/ebopsweb/images/Apps/"; // application images
var mDAY_IN_MS = 86400000 ; //24 * 60 * 60 *1000 millisecs
var mLogoutPage = "/ebopsweb/apputil/logoff.asp"
// Enviro Class : Product System Environment
function Enviro() {
	var sHost = mBodyPane.location.hostname;
	Enviro.host = sHost;
	if (-1 == sHost.indexOf(".")) Enviro.type = "LOCALHOST"; // local if no '.' in hostname
	else if (-1 < sHost.indexOf("test")) Enviro.type = "TEST";
	else if (-1 < sHost.indexOf("qa"))	Enviro.type = "QA";
	else Enviro.type = "PROD";
	mbSSL = "LOCALHOST" != Enviro.type; // off only if local host - Ward
}

// Partner Class
function Partner (){
	var sKey = GetCookie("PARTNERKEY");
	Partner.sKey = sKey = (null == sKey) ? "" : sKey.toUpperCase();
//	sKey = "BOFA" // Test case -- remove from production
//	If class defined here, HTML in a span of that class is NOT displayed.
	var i=0, classes= new Array(); // Standard classes
		if ("BOFA" != sKey)	classes[i++]="BOFAONLY";
		if ("BOFA" == sKey)	classes[i++]="NONBOFA";
		if ("BIZTRO" != sKey) classes[i++]="BIZTROONLY";
	mBodyDocument.write("<STYLE>\n."+classes.join("{display:none}\n.")+"{display:none}</style>");
	// Roll your own later
	Partner.hideClass = function (psClassNm) {mBodyDocument.write("<STYLE>."+psClassNm+" {display:none}</style>")}
}
// Browser Mfg / Version specific Facts & Methods
var browser = new Object();
browser.version = parseInt(navigator.appVersion);
browser.isNN = false;
browser.isIE = false;
if (navigator.appName.indexOf("Netscape") != -1) { 
    browser.isNN = true;
    browser.getInnerWidth = function() {return window.innerWidth;};
    browser.getInnerHeight = function() {return window.innerHeight;};
	window.captureEvents(Event.RESIZE); // redraw if window resizes
	window.onresize = function () {history.go(0); return false};
    }
else if (navigator.appName.indexOf("Microsoft") != -1){
    browser.isIE = true;
    browser.getInnerWidth = function() {return document.body.clientWidth;};
    browser.getInnerHeight = function() {return document.body.clientHeight;};
    }
// Write HTML to retrieve browser-specific main CSS with rootname, psCSSNm, e.g. writeMainCSS("Biztro")
function writeMainCSS(psCSSNm){
//	sCSS = psCSSNm + ((navigator.platform == "MacPPC") ? "Mac" : ""); // special CSS for Macs
	sCSS = psCSSNm; // until ready w/ browser specific CSSs
	mBodyDocument.write("<LINK REL='stylesheet' HREF='"+mCSSDir+sCSS+".css' NAME='MAINCSS'>");
}
// Turn obj name string into a valid obj ref
function getObjRef(obj) {
    if (typeof obj == "string") {
		if (browser.isIE) return eval("document.all."+ obj + ".style");
		else return eval("document."+obj);
	}
    else
       return obj;
}
// <BODY> OnFocus and OnLoad handlers
mOnFocusFncs = Array(0); // items should be fnc call strings
mOnFocusFncs.push = function (item) {this[this.length] = item; return item}
mOnFocusFncs.pop = function () {var item=this[this.length-1]; this.length = this.length-1; return item}
function onFocusHandler(){
	for (var i=0; i < mOnFocusFncs.length; i++) eval(mOnFocusFncs[i]);
}
mOnLoadFncs = Array(0);
mOnLoadFncs.push = mOnFocusFncs.push; // same fn
function onLoadHandler(){
	BttnArray.showBotBttns();
	for (var i=0; i < mOnLoadFncs.length; i++) eval(mOnLoadFncs[i]);
  PAGEIDcookieHandler();
}
// String Class Extension: return string repeated n times
String.prototype.repeat = function (n){var r = new Array(n+1); return r.join(this)}

/*****
AppButton Class
.name = app's name for the bttn (required)
.label = text displayed on bttn
.onClick = javascript to exec on click; if null, default to mHiddenPane.submitXForm(name)
.tagAttribs = addition tag attributes; if null, default to CLASS='APPBUTTON'
******/
function Bttn(name,label,onClick,tagAttribs){
	this.name = name;
	this.label = (!label) ? name : label;
	this.onClick = (!onClick) ? "mHiddenPane.submitXForm('"+name+"');" : onClick;
	this.tagAttribs = (!tagAttribs) ? "CLASS='BODYTEXTSMALL'" : tagAttribs ;
}
Bttn.prototype.toHTML = function () {
	var r = "<INPUT TYPE='button' NAME=\""+this.name + "\" VALUE=\"" + this.label;
	r+="\" onClick=\""+this.onClick + "\" " + this.tagAttribs +"><span class=SPACER>.</span>";
	return r
}
// Button Array Class
function BttnArray(name) {
	this.name = (!name) ? "BttnArray" : name;
	this.order = new Array(0);
	this.align = "left";
	this.arrayStyle = "FORMCOLORDARK";
}
// BttnArray Class Properties
BttnArray.botBttns=Array(0); // each is {anchor name, bottom button layer nm}; See BttnArray.toDocBot
BttnArray.align = "left";
BttnArray.arrayStyle = "FORMCOLORDARK";
BttnArray.topBttnArrayStyle = "FORMCOLORDARK";

// BttnArray Class Methods
// Std HTML that surrounds buttons when written.
BttnArray.preHTML = function (align, arrayStyle){
	return "<table width=100% align=center cellpadding=1 cellspacing=0 border=0 class='"+arrayStyle+"'>" +
		"<tr><td height=4 class=SPACER>.</td></tr><tr><td align="+align+"><img src='"+mAppImgDir+"space.gif' WIDTH='11' HEIGHT='4'>";
}
BttnArray.postHTML = function ()
	{return "</td></tr><tr><td height=4 class=SPACER>.</td></tr></table>"};

//  Multiple button array output. Any number of args allowed; ignores all except either a BttnArray or a string (optional)
// Unless an arg is a string w/ 1st letter 'N' (for "no wrapper"), wrap in class's  HTML wrapper
BttnArray.toHTML = function (args) {
	var args; var w=""; var wrap=true; var none=true;
	if (!args) return w;
	if (-1 != args.constructor.toString().indexOf("native code"))
		{arguments=args};// args is the caller's 'arguments' array (see BttnArray.toDoc); use it
	for (var i=0; i<arguments.length; i++) {
		var arg = arguments[i];
		if ("string" == typeof arg && "N" == arg.substr(0,1).toUpperCase()) {wrap=false;};
		if ("object" == typeof arg && arg.constructor == BttnArray){
			if (none) {w += arg.toHTML("N"); none = w==""}
			else {w += "&nbsp;"+arg.toHTML("N")}
		} 
	}
	if (!none && wrap) {w = BttnArray.preHTML(BttnArray.align,BttnArray.arrayStyle)+w+BttnArray.postHTML()};
	return w;
}
// Call .toHTML and write to document
BttnArray.toDoc = function () {mBodyDocument.write(BttnArray.toHTML(arguments));}

// Call .toHTML and write to document w/ surrounding layer
BttnArray.toDocBot = function () {BttnArray.writeLayer(BttnArray.toHTML(arguments));}
	
// Write button to hidden layer and schedule it to be revealed.
BttnArray.writeLayer = function (w) {
	if (w == "") return;
	if (browser.isIE) { // not working yet in NN so always write buttons in NN
		// drop anchor and prepare layer
		var num=mBodyDocument.anchors.length
		var aNm="XBTTNSBOTA"+num; var layerNm="XBTTNSBOT"+num;
		BttnArray.botBttns[BttnArray.botBttns.length]=[aNm,layerNm]; // remember for showBotBttns
		w="<STYLE>."+layerNm+" {position:relative;visibility:hidden}</style><DIV><A NAME="+aNm+"></A></DIV><DIV ID="+layerNm+" class="+layerNm+">"+w+"</DIV>";
	}
	mBodyDocument.write(w);
}

// Reveals the hidden bottom buttons layer(s) if page requires scrolling. See BttnArray.writeLayer
BttnArray.showBotBttns = function  (){
	var theAnchors = mBodyDocument.anchors;
	for (i=0; i < BttnArray.botBttns.length; i++) {
		var v=0;
		var anchorNm=BttnArray.botBttns[i][0]
		var layerNm=BttnArray.botBttns[i][1]
		for (var j=0; j < theAnchors.length; j++) {
			if (theAnchors[j].name == anchorNm) 
				{v = (browser.isNN)? theAnchors[j].y : theAnchors[j].offsetTop; break;}
		}
		var show = (v - browser.getInnerHeight()) > -30;
		var theObj = getObjRef(layerNm);
		if (show && "object"== typeof theObj) {theObj.visibility = (browser.isNN? "show":"visible");}
//		alert("v: "+v+" visibility: "+theObj.visibility);
	}
}

//BttnArray instance methods. Allow overriding of class methods on individual bttn array basis
BttnArray.prototype.add = function (name,label,onClick,tagAttribs) {
	var wasAdded = this[name]; //Dup bttn add redefines; not added to order;
	this[name] = new Bttn(name,label,onClick,tagAttribs);
	if (!wasAdded) this.order[this.order.length]=name;
}
BttnArray.prototype.relabel = function (name,newLabel) {
	var b = this[name];
	if (b) b.label=newLabel;
}
// Compose HTML, wrapped in array's HTML wrapper unless wrap begins w/ 'N'
BttnArray.prototype.toHTML = function (wrap) {
	var w="";
	for (var i=0; i < this.order.length; i++) {
		var b=this[this.order[i]];
		if (b) {w+=((w!="")? "&nbsp;":"")+b.toHTML()}
	}
	if (w != "") {
		if ("string" != typeof wrap || "N" != wrap.substr(0,1).toUpperCase())
			{w = this.preHTML(this.align,this.arrayStyle)+w+this.postHTML()}
	}
	return w;
}
// Std HTML that surrounds buttons when written. Could override by setting object's own methods
BttnArray.prototype.preHTML = BttnArray.preHTML
BttnArray.prototype.postHTML = BttnArray.postHTML

// Write array to document, wrapped in array's HTML wrapper unless wrap begins w/ 'N'
BttnArray.prototype.toDoc = function (wrap){mBodyDocument.write(this.toHTML(wrap))};

// Write array to document. Will show if browser is vertically scrolling. Typically called for bttns at bottom
BttnArray.prototype.toDocBot = function (wrap){BttnArray.writeLayer(this.toHTML(wrap));}
	
// FrameTable Class
function FrameTable() {this.isUsed = false;} 
FrameTable.open = function (width, bgcolor, topBttnArrayStyle) {
	var sOldBtnArrayStyle = X_BTTNS.arrayStyle;
	if ("undefined" == typeof topBttnArrayStyle) topBttnArrayStyle = BttnArray.topBttnArrayStyle
	X_BTTNS.arrayStyle = topBttnArrayStyle;
	X_BTTNS.toDoc();
	X_BTTNS.arrayStyle = sOldBtnArrayStyle;
	if (("undefined" != typeof width) && (width !="") && (width!="100%")) {
		width=" width="+width;
		this.isUsed = true;
	}
	else
		width=" width=100%"; 
	if (("undefined" != typeof bgcolor) && (bgcolor!= "") && (bgcolor.toUpperCase()!="WHITE"))
		this.isUsed = true;
	else
		bgcolor="white";
	if (this.isUsed) {
		mBodyDocument.write("<TABLE cellpadding=4 cellspacing=0 border=0 bgcolor="+bgcolor+width+"><TR><TD>");
	}
}
FrameTable.close = function (botBttns) {
	botBttns = ("undefined"==typeof botBttns || botBttns=="") ? "O": botBttns.toString().substr(0,1).toUpperCase();
	switch(botBttns) {
		case "F": X_BTTNS.toDoc(); break; // "FORCE BTTNS"; always show buttons
		case "N": break; // "NO BTTNS" don't write buttons
		default: X_BTTNS.toDocBot(); // OPTIONAL. Show if would scroll
	}
	if (this.isUsed)
	 mBodyDocument.write("</TD></TR></TABLE>"); 
}
// Find name (nm) in NameValueArray and write its corresponding value
function writeNV(nvArray, nm){
	var val;
	if (!nm || nm == "") val="&nbsp;"
	else { 
		val = nm + " - Unknown";
		if (nvArray != null)
			for (var i = 0; i < nvArray.length; i++) {
				if (nvArray[i][0] == nm) {val = nvArray[i][1]; break}
			}
	}
	document.write(val);
}

function MM_preloadImages() {
    if (mBodyDocument.images) {
        var imgFiles = MM_preloadImages.arguments;
        if (mBodyDocument.preloadArray == null) {
            mBodyDocument.preloadArray = new Array();
        }
        var i = mBodyDocument.preloadArray.length;
        with (mBodyDocument) {
            for (var j = 0; j < imgFiles.length; j++) {
                if (imgFiles[j].charAt(0) != "#") {
                    mBodyDocument.preloadArray[i] = new Image();
                    mBodyDocument.preloadArray[i++].src = imgFiles[j];
                }
            }
        }
    }
}
// Calculate repeated row suffix. Handles the one-row (no suffix) case.
// TODO: Turn into class and then fix references everywhere. Correct TASKMGMT.JS:TaskChooserRow.setVars() also
function setFldSuffix(sFldRoot) {
	if ("undefined"==typeof miRecRow) miRecRow=0;
	if (miRecRow==0) {
		if ("undefined"==eval("typeof mX_FORM."+sFldRoot)) {miRecRow=1; msFldSuffix="_0"}
		else {msFldSuffix=""};
	}
	else msFldSuffix="_"+miRecRow++;
}
// Textarea max length. Ex: ..onChange="mHiddenPane.TAMaxLength(this, 255)"..
function TAMaxLength(pvTA, piMax){
//	if (pvTA.value.length > piMax) {
//		alert("Maximum length is "+piMax+" characters; truncating ..");
//		pvTA.value= pvTA.value.substr(0,piMax);
//	}
}
function MM_swapImage() {
    var i, j = 0, objStr, obj, swapArray = new Array(), oldArray = mBodyDocument.MM_swapImgData;
    for (i = 0; i < (MM_swapImage.arguments.length - 2); i += 3) {
        objStr = MM_swapImage.arguments[(navigator.appName == "Netscape") ? i : i + 1];
        if ((objStr.indexOf("mBodyDocument.layers[") == 0 && mBodyDocument.layers == null) || (objStr.indexOf("mBodyDocument.all[") == 0 && mBodyDocument.all == null)) {
            objStr = "mBodyDocument" + objStr.substring(objStr.lastIndexOf("."), objStr.length);
        }
        obj = eval(objStr);
        if (obj != null) {
            swapArray[j++] = obj;
            swapArray[j++] = (oldArray == null || oldArray[j - 1] != obj) ? obj.src : oldArray[j];
            obj.src = MM_swapImage.arguments[i + 2];
        }
    }
    mBodyDocument.MM_swapImgData = swapArray;
}

function MM_swapImgRestore() {
    if (mBodyDocument.MM_swapImgData != null) {
        for (var i = 0; i < (mBodyDocument.MM_swapImgData.length - 1); i += 2) {
            mBodyDocument.MM_swapImgData[i].src = mBodyDocument.MM_swapImgData[i + 1];
        }
    }
}

function SetBodyDocument(pBodyDocument){
  mBodyDocument = pBodyDocument;
  mBodyDocument.write(); //must else 1st time body.js does silent abort
}


function SwapGuideItem(psItem, piStep, psState) {
  var sName;
  var sOnImg;
  var sImgID;
  var sTmp;
  sName = "mBodyDocument." + psItem + "_" + piStep + "_" + psState;
  sTmp = "/ebopsweb/images/dashboard2/gd_" + psItem + "_" + piStep;
  sImgID = '#' + psItem + '_' + piStep + '_' + psState;
  sOnImg =  sTmp + '_ovr.gif';
  MM_swapImage(sName,sName,sOnImg,sImgID);
}      

function SwapRestore() {MM_swapImgRestore();}

function GetCookie (psName) {
  var sCookie = mBodyDocument.cookie;
  var iBeg = sCookie.indexOf(psName+"=");
  if (iBeg == -1)
  	return null;
  else {
  	iBeg += psName.length +1
	var iEnd = sCookie.indexOf(";",iBeg)
	if (iEnd == -1) iEnd = sCookie.length
	return unescape(sCookie.substring(iBeg,iEnd));
  }
}
function SetCookie (psName, psValue, pdExpires, psPath, psDomain, pbIsSecure) {
	var iArgCnt = arguments.length;
	mBodyDocument.cookie = psName+"="+ escape(psValue) +
		((iArgCnt > 2) ? "; expires="+pdExpires.toGMTString() : "")+
		((iArgCnt > 3 && 0 < psPath.length) ? "; path="+psPath : "")+
		((iArgCnt > 4 && 0 < psDomain.length) ? "; domain="+psDomain : "")+
		((iArgCnt > 5 && pbIsSecure == true) ? "; secure" : "");	
}
function DeleteCookie (psName, psPath, psDomain, pbIsSecure) {
	var iArgCnt = arguments.length;
	if (iArgCnt < 2) psPath="";
	if (iArgCnt < 3) psDomain="";
	if (iArgCnt < 4) pbIsSecure=false;
	SetCookie(psName,"",new Date(1995,1,1),psPath,psDomain,pbIsSecure);
}
  
function CheckSequenceNumber(piCurSeq) {
	var iLastSeq = parseInt(GetCookie("lsq"));
	if (iLastSeq > 0 && iLastSeq > parseInt(piCurSeq)) // back encountered 
		// think about using mBodyDocument.history here
		GoURL2("/ebopsweb/apputil/wceditor.asp?WCI=BACK", iLastSeq);
}
  
 function alternatingColorClass(pColor1,pColor2){
// Alternate btwn two background colors (or reuse the current color with 'sameColor' method)
// Biztro standard alternating colors are used if none specified in one or both args
	this.first = false;
	this.color1 = (((arguments.length < 1) || (pColor1 == ""))?'#eeeeee' : pColor1)
	this.color2 = (((arguments.length < 2) || (pColor2 == ""))? "white" : pColor2)
	
	this.altColor = function (pTagText){
	// pTagText is everything that caller would put btwn tag brackets, e.g. the "TR" in "<TR>"
		this.first = !this.first;
		mBodyDocument.write("<" + pTagText + " BGCOLOR=" + (this.first ? this.color1 : this.color2)+">");
	};
	this.sameColor = function (pTagText){
	// pTagText is everything that caller would put btwn tag brackets, e.g. the "TR" in "<TR>"
		mBodyDocument.write("<" + pTagText + " BGCOLOR=" + (this.first ? this.color1 : this.color2)+">");
	};
	this.closeTag = function (pTag){
	// Add close tag by script because span checker can't see open tag hidden by other calls
    // Ex: if arg is "TR", writes "</TR>"
		mBodyDocument.write("</" + pTag +">");
	};
 }

function scrollToAnchor(pAnchorName,pScrollToTop) {
  // Scroll to the anchor called pAnchorName
  	var theAnchors = mBodyDocument.anchors;
  	for (var i = 0; i < theAnchors.length; i++) {
  		if (theAnchors[i].name == pAnchorName) {
  			if (browser.isIE)
  				theAnchors[i].scrollIntoView()//scrollIntoView(pScrollToTop) not working
  			else 
  				mBodyPane.scrollTo(theAnchors[i].x,theAnchors[i].y);
			if (pScrollToTop == false)
				mBodyPane.scrollBy(0,(45 - browser.getInnerHeight()));
  			break;
  		}
  	}
  }

function submitXForm(btnClicked) {return submitXFormCore(btnClicked)}
// Programmer can cover submitXForm and still reach core fnc
function submitXFormCore(btnClicked) {
	if ("undefined"!=typeof mbsubmitXFORM_wasCalledBefore) {//trap IE rapid click bug
//		alert("Patience ...");
		history.go(0);
		return ;
	}
  SetCookie("BTNID", btnClicked); // for Usage Analysis 05/11/2001 (RickR)
	mX_FORM.BUTTON_IMG.value=btnClicked;
	mX_FORM.submit();
	mbsubmitXFORM_wasCalledBefore=true;
	return true;
}

function DeleteConfirmation() {
	if (window.confirm('You are deleting the record. Click OK to continue. Click Cancel to stop.'))
		return submitXFormCore('Delete');
	else
		return false;
}

/* We need to combine these two functions (DeleteConfirmation and DeleteConfirmation2)
   as per Raghu, where the function itself takes an argument
   which tells what the returned function(value) should be. */
   
function DeleteConfirmation2() {
	if (window.confirm('You are deleting the record. Click OK to continue. Click Cancel to stop.'))
		return submitXForm('Delete');
	else
		return false;
}

// Set checked state of all check boxes with root name sFldRootNm same as checked state of vCheckAllBox
// ex: <INPUT TYPE=CHECKBOX onClick="mHiddenPane.CheckAll(this,'HIDE_FLAG')">
function CheckAll(vCheckAllBox, sFldRootNm) {
	var bIsChecked = vCheckAllBox.checked;
	var objs = mX_FORM.elements;
	for (var i =0 ; i < objs.length; i++){
		if (objs[i].type == "checkbox" && -1 < objs[i].name.indexOf(sFldRootNm)) objs[i].checked = bIsChecked;
	}
}

function GetCompleteURL (psURL,bIsSecure)  {
	var sURL = psURL, sAnchor="";
	if (sURL.indexOf("#") > -1) {
		var URLparts = sURL.split("#");
		sURL=URLparts[0];
		sAnchor="#"+URLparts[1];
	}
	var iCurSeq = GetCookie("lsq");
	if (iCurSeq == null) iCurSeq = 1;
	iCurSeq = parseInt(iCurSeq) + 1;
	if (mOpaqueKey != null)
		sURL += ((0 > sURL.indexOf("?"))? "?" : "&")+ "opaque=" + mOpaqueKey;
	sURL += ((0 > sURL.indexOf("?"))? "?" : "&")+ "lsq=" + iCurSeq + sAnchor;
  sURL += "#gohere";
	if (sURL.indexOf("http") != 0)
		sURL =((bIsSecure)?"https" : "http")+"://" + location.hostname + sURL;
	return sURL
}
function GetCompleteURL2 (psURL, piCurSeq){
  return psURL + ((0 > psURL.indexOf("?")) ? "?":"&") + "lsq=" + piCurSeq;
}
function GetCompleteSecureURL (psURL) {return GetCompleteURL(psURL,true)}

function GoAnchor(anAnchor){// Cover function to go to an Anchor on the page
	mBodyDocument.location.href=anAnchor;
}
function GoAddChecklist(piTID){
	GoURL("/ebopsweb/apputil/wceditor.asp?WCI=WICLEditor&parms=^"+piTID+"^6");
}
// Pop up browser with corp site (w/optional destination string)
function goBiztroCorpSite(psDest){
	var sHost = (Enviro.type == "PROD") ? "corp.biztro.com":"corp.biztrotest.com";
	var sDest = "";
	if ("undefined" != typeof psDest)
		sDest = ((0 == psDest.length || "/"== psDest.substr(0,1)) ? "":"/")+psDest;
//	alert("Would go to: "+"http://" + sHost + sDest);
	w=window.open("http://" + sHost + sDest);
	if (w) w.focus();
}
function GoGuideURL(psURL){mBodyDocument.location.href = GetCompleteURL(psURL,mbSSL)}
function GoGuides() {
  var selValue;
  selValue = mX_FORM.DASHBOARD_GUIDES.options[mX_FORM.DASHBOARD_GUIDES.options.selectedIndex].value
  if (selValue == "0")
    alert ("Select one of the guides and click 'Go'");
  else
  	GoGuideURL("/ebopsweb/apputil/wceditor.asp?WCI=WIGuideStart&parms=^" + selValue);
}
function GoURL (psURL, psNew){
	var sURL = GetCompleteURL(psURL);
	if (arguments.length == 2) window.open(sURL) ;
	else mBodyDocument.location.href = sURL;
}
function GoURL2 (psURL, piCurSeq){
	mBodyDocument.location.replace(GetCompleteURL2(psURL, piCurSeq));
}
function GoSecureURL (psURL){
	mBodyDocument.location.href = GetCompleteSecureURL(psURL);
}

// Popup Win Fns
function Certify(URL){
	popupWin = window.open(URL, 'Participant', 'location,scrollbars,width=450,height=300')
	window.top.name = 'opener';
}
function openNewWindow(pTargetURL, pTitle){
	pTargetURL = GetCompleteURL(pTargetURL);
	var w = window.open(pTargetURL, pTitle, "width=600,height=400,location=1,toolbar=1,status=1,menubar=1,scrollbars=1,resizable=1,directories=1");
	if (w) w.focus();
}
function ShowLearnMore(TargetURL) {
	w = window.open(GetCompleteURL(TargetURL), "learnmore", "scrollbars=yes,resizable=yes,width=750,height=550");
	// I have removed the w.focus from here and put it in the HTML documents.  w.focus was causing a nasty bug if you
	// tried to navigate too many times to the same window.  See Jim Baron if you have questions. 
	//if (w) w.focus();
}
function ShowPopupContent(TargetURL){
	UrlToOpen = GetCompleteURL("/ebopsweb/help/context_frame.asp?Goto=" + TargetURL);
	var w = window.open(UrlToOpen, "help", "scrollbars=yes,resizable=yes,width=600,height=400");
	if (w) w.focus();
}
function ShowHelpPopup(TargetURL){
	var w = window.open(TargetURL, "help", "scrollbars=yes,resizable=yes,width=600,height=400");
	if (w) w.focus();
}
function ShowPopupReport(TargetURL){
	UrlToOpen = GetCompleteURL(TargetURL);
	var w = window.open(UrlToOpen, "report", "scrollbars=yes,resizable=yes,width=600,height=400");
	if (w) w.focus();
}         
function ShowPopupSearch(TargetURL) {
	TargetURL = GetCompleteURL(TargetURL);
	var w = window.open(TargetURL, "search", "scrollbars=yes,resizable=yes,width=500,height=300");
	if (w) w.focus();
}
function ShowPopupPrice(TargetURL) {
	TargetURL = GetCompleteURL(TargetURL);
	var w = window.open(TargetURL, "search", "scrollbars=yes,resizable=yes,width=500,height=350");
	if (w) w.focus();
}
// generic popup. TODO: migrate others to use it.
function ShowPopupWindow(psURL, psTitle, psIsURLComplete, psAttribs, pbRtnWinHandle){
	if (!psAttribs) psAttribs = "dependent,scrollbars,resizable,width=500,height=300";
	if (!psIsURLComplete) psURL = mHiddenPane.GetCompleteURL(psURL);
	var w = window.open(psURL, psTitle, psAttribs);
	if (w) w.focus();
	if (pbRtnWinHandle) return w;
}
function GetLoginURL (psURL)  {
	 var sURL = psURL;
         var iCurSeq = GetCookie("lsq");
	 if (iCurSeq == null) iCurSeq = 1;
	    iCurSeq = parseInt(iCurSeq) + 1;
	 sURL += ((sURL.indexOf("?") < 0)? "?" : "&")+ "lsq=" + iCurSeq;
	 sURL =((mbSSL)?"https" : "http")+"://" + document.domain + sURL;
         window.location.href = sURL;
}
function DefineGlobalStyles() {
	// Define browser-specific global styles
	// NB: Defs can be superceded by a style def after body.js (e.g. the Biztro.css include)
	var s="<STYLE>" +
		".NUMTEXTBOX {font: 10pt default;" + ((browser.isIE)? " text-align:right":"")+"}" +
		"</STYLE>";
	mBodyDocument.write(s);
}
function Logout(psURL) {
	var iArgCount = arguments.length;
	if (iArgCount > 0) window.location.href = mLogoutPage + "?url=" + psURL;
	else window.location.href = mLogoutPage;	
	
}
function doNothing(){};

var newCustomWin; // - global variable that holds the custom window handle
function gotoCustomURL ( customURL ) {
	if ( customURL == "" ) return ;
	
	if ( customURL.toLowerCase().indexOf ("http") == -1 )
		customURL = "http://" + customURL;
		
	if ( ! newCustomWin || newCustomWin.closed ){
		newCustomWin = window.open ( customURL );
	} else {
		newCustomWin.location = customURL;
	}
	newCustomWin.focus();
	return ;
}

function findFormElement(elementID) {
	for (i = 0; i < document.forms.length; i++) {
		var curForm = document.forms[i];
		if (curForm.elements[elementID]) {
			 return curForm.elements[elementID].value;
		}
	}
}

function DisplayHelp() {
	var sURL;
	sURL = "http://" + location.host + "/ebopsweb/help.asp?PageID=" + findFormElement("PAGEID");
	var w = window.open(sURL, "Help", "scrollbars=yes,resizable=no,width=733,height=424");
	if (w) w.focus();
}

function DisplayHelpPage(psHelpID) {
	var sURL;
	sURL = "http://" + location.host + "/ebopsweb/apputil/wceditor.asp?WCI=WIHelpEditor&MODE=NOSTACK&menukey=" + psHelpID;
	var w = window.open(sURL, "Help", "scrollbars=yes,resizable=no,width=733,height=424");
	if (w) w.focus();
}

function LinkToHelp(psHelpID,psTarget) {
	var sURL;
	sURL = "/ebopsweb/apputil/wceditor.asp?WCI=WIHelpEditor&MODE=NOSTACK&menukey=" + psHelpID;
	if ((psTarget == "") || (psTarget == null)) psTarget = "gohere";
  sURL = sURL + "#" + psTarget;
	window.location.href = sURL;
}

function DisplayCSCWindow(psURL) {
	var w = window.open(psURL, "CSC", "scrollbars=yes,resizable=no,width=733,height=424");
	if (w) w.focus();
}

function NavigateMainSite(psURL) {
	window.opener.document.location.href = psURL;
}

function doEscalate(host, tasktype, partition, anonymous) {
	if (!doCheckBrowser())
		return;
	if (top.chatclient != null) {
		alert("You're already using LiveHelp!");
					return;
	}
	if (anonymous != true) {
		var userName = prompt("You are about to enter LiveHelp! " + "Please type your first name below:", "");
		if (userName == null || userName.length == 0)
			return;
		if (userName.length > 15) {
			alert("That's a little long! Try something under 15 characters!");
			return;
		}
		for (var i = 0; i < userName.length; i++) {
			var c = userName.substring(i,i+1);
			if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) {
				alert("Please limit your userName to alphabetic characters.");
				return;
			}
		}
	}
	else
		var userName = '';
	var go = "https://" + host + "/" + partition + "/oneshot.asp" + "?uri=" + escape(document.location.toString()) + "&tasktype=" + tasktype + "&uid=" + userName;
	chat=window.open(go, 'LiveHelp', 'width=600,height=400');
	open.chat
}

function doCheckBrowser() {

	// browser
	var NN = (navigator.appName.indexOf("Netscape") != -1);
	var IE = (navigator.appName.indexOf("Microsoft") != -1);

	// version
	var V3 = (navigator.appVersion.indexOf("3.") != -1);
	var V4 = (navigator.appVersion.indexOf("4.") != -1);
	var V5 = (navigator.appVersion.indexOf("5.") != -1);

	// platform
	var MAC = (navigator.appVersion.indexOf("Macintosh") != -1);
	var WIN = (navigator.appVersion.indexOf("Win") != -1);

	if ( (NN || IE) && (V3 || V4 || V5) )
		return true;
	else {
		alert("Sorry, WebCenter does not support this browser.\n" +
		"You need one of the following:\n\n" +
		"       Netscape 3/4/6  \n" +
		"       Internet Explorer 3/4/5 ");
		return false;
	}
}


//  An example call would be:
// <script>AltPartnerHTML("Company", "B2P||Nonprofit", "BOFA||Small Business")</script> 
//
function AltPartnerHTML(psRegHTML) {
	var bAlt = false;
	var sDelim = "||"; // an arbitrary, unlikely double char separator
	for (i=1; i < arguments.length; i++) {
		var Alt = arguments[i].split(sDelim);
		//not working for some reason if (Partner.skey == Alt[0]) {
		//soooo...test if it's a substring
		if (Partner.sKey.indexOf(Alt[0]) > -1){
			bAlt=true;
			break;
		}
	}
	document.write( (bAlt) ? Alt[1] : psRegHTML);
}


function BodyJSStart() {
	mHiddenPane = this;
	mBodyPane = this;
	mHiddenPane.SetBodyDocument (document);
	mBodyPane.X_BTTNS = new BttnArray("X_BTTNS");
	new Enviro();
	new Partner();
	DefineGlobalStyles();
 }
BodyJSStart();

//Writes PAGEID cookie for usage analysis. (RickR) 5/11/2001
function PAGEIDcookieHandler() {
  var strPageID = "";
  if (document.X_FORM.PAGEID) {
    strPageID = document.X_FORM.PAGEID.value;
  }
  SetCookie("PAGEID", strPageID);
}