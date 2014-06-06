var date = new Date();
var tidalState;

$(document).ready(function() {
	//TIME			
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	var milthours = hours;
	if(ampm=="pm")milthours = 12+milthours; 
	var tideTime = milthours+"."+minutes;
	
  	$("#time").text(strTime);

	//WINDS 
	var windurl = "http://pipes.yahoo.com/pipes/pipe.run?_id=2FV68p9G3BGVbc7IdLq02Q&_render=json&feedcount=10&feedurl=http%3A%2F%2Fwww.ndbc.noaa.gov%2Fdata%2Flatest_obs%2Ffbis1.rss"
	$.getJSON( windurl, function( data ) {
		var strData = data.value.items[0].description;		
		var tmpArr = strData.split("<br />");
		//wind direction		
		var windDirWhole =  tmpArr[2].split("</strong>");		
		var windDirSpliter = windDirWhole[1].split("(");
		var windDir =  windDirSpliter[0];
		var windAngle = windDirSpliter[1].replace('&#176;)','');
		var windDirStr = windDir+ ' | ' +	windAngle+"°";
		$("#windDir").text(windDirStr);
		
		//wind speed
		var windSpeedTemp =  tmpArr[3].split("</strong>");
		var windSpeed = windSpeedTemp[1];
		$("#windSpeed").text(windSpeed);		
	});	

	//WAVES
	var waveurl = "http://pipes.yahoo.com/pipes/pipe.run?_id=2FV68p9G3BGVbc7IdLq02Q&_render=json&feedcount=10&feedurl=http%3A%2F%2Fwww.ndbc.noaa.gov%2Fdata%2Flatest_obs%2F41004.rss"
 	$.getJSON( waveurl, function( data ) {
 		var strData = data.value.items[0].description;
 		var tmpArr = strData.split("<br />");
 		
 		//wave height
 		var waveheightTemp =  tmpArr[5].split("</strong>");
 		var waveHeight = waveheightTemp[1];
 		$("#waveHeight").text(waveHeight);
 		//wave period
 		var waveperiodTemp =  tmpArr[6].split("</strong>");
 		var wavePeriod = waveperiodTemp[1];
 		$("#wavePeriod").text(wavePeriod);
 		//wave direction
 		var waveDirTemp =  tmpArr[8].split("</strong>");
 		var waveDirSpliter = waveDirTemp[1].split("(");
		var waveDir =  waveDirSpliter[0];
		var waveAngle = waveDirSpliter[1].replace('&#176;)','');
		var waveDirStr = waveDir+ ' | ' +	waveAngle+"°";
 		$("#waveDir").text(waveDirStr);
 	});

 	//TIDES
 	var tideurl = "../js/app/data.json"
 	$.getJSON( tideurl, function( data ) {

 		var datestring = today(); 		
 		var tidalinfo = data.datainfo.data.item;
 		var previous;
 		var previousTide; 
 		var previousI
 		var tidalState ="ebb"

 		

 		$.each(tidalinfo, function(i,d){

 			if(d.date==datestring){ 				
 				var addthis = "<p>"+d.highlow+"-  "+d.time+"   "+d.predictions_in_ft+" ft"+"</p>"
 				$("#tides").append(addthis);
 				
 				//determine ebb vs flood
 				var wholeTime = d.time.split(" ");
 				var arrTime = wholeTime[0].split(":"); 				
 				var thisAmPm = wholeTime[1];
 				arrTime[0] = parseInt(arrTime[0]);
 				if(thisAmPm == "PM")arrTime[0] = arrTime[0] +12;
 				var thisTime = arrTime[0]+"."+arrTime[1];

 				if(previous){
 					
 					//handle slack
 					if(Number(tideTime) == Number(thisTime))tidalState ="Slack"
 					//	
 					if(Number(tideTime) > Number(previous) && Number(tideTime) < Number(thisTime) ){ 						
 						if(previousTide =="L" && d.highlow == "H")tidalState ="flood";
 						if(previousTide =="H" && d.highlow == "L")tidalState ="ebb";
 					}else{

 					}



 				}else{

 					if(d.highlow == "H" && !previousI)tidalState ="flood";
 					if(d.highlow == "L" && !previousI)tidalState ="ebb";
 				}
 				
 				if(Number(tideTime) > Number(thisTime)){
 					previous = thisTime;
 					previousTide = d.highlow;
 				}

 				previousI = i;
 				

 			};			
 		});

 		if(tidalState =="flood"){
 			$("#tides").css("background","url(css/arrow_up.png) no-repeat center");
 			//$('myOjbect').css('background-image', 'url(' + imageUrl + ')');
 		}
 		if(tidalState =="ebb"){
 			$("#tides").css("background","url(css/arrow_down.png) no-repeat center");
 		}
 		//if slack don't add background arrow
 	});
});


//helper functions
//parse simple string
function simpleStr(str){
	//todo
}

//parse direction string
function direction(dir){
	//todo
}

//get today's date in YYYY/MM/YY
function today(){
	// GET YYYY, MM AND DD FROM THE DATE OBJECT
	var yyyy = date.getFullYear().toString();
	var mm = (date.getMonth()+1).toString();
	var dd  = date.getDate().toString();
	 
	// CONVERT mm AND dd INTO chars
	var mmChars = mm.split('');
	var ddChars = dd.split('');
	 
	// CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
	var datestring = yyyy + '/' + (mmChars[1]?mm:"0"+mmChars[0]) + '/' + (ddChars[1]?dd:"0"+ddChars[0]);

	return datestring;
}
