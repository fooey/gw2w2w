var refreshMinDelay = 2000;
var refreshMaxDelay = 5000;

var objectivesInitialized = false;


var prevMatchDetails, prevIncomes;

/*
 * 
 * Match Details Events
 * 
 */

function onInit(){
	console.log('** onInit()');
	
	var gaData = {
		'hitType': 'event',					// Required.
		'eventCategory': 'App',				// Required.
		'eventAction': 'Data Initialized',	// Required.
		'nonInteraction': true
	};
	ga('send', gaData);
}

function onMatchData(){
	//console.log('** onMatchData()');
	
	var matchDetails = Anet.getMatchDetails();
	
	$indicator.stop().fadeOut();
	
	if(!objectivesInitialized){
		generateLayout(matchDetails);
		writeTitle(matchDetails);
		
		Guilds.init($('#guildsList'));
		Scoreboard.init(matchDetails);
		EventLog.init($('#log'));
		Objectives.init($('#maps'));
		
		objectivesInitialized = true;
	}
	else{
		Scoreboard.update(matchDetails);
	}

	
	
	// deep copy to break copy by reference
	prevMatchDetails = JSON.parse(JSON.stringify(matchDetails)); 
	
	
	// queue up the next data refresh
	setTimeout(function(){
		$indicator
			.stop()
			.fadeIn('fast', function(){
				Anet.refresh()
			});
	}, randRange(refreshMinDelay,refreshMaxDelay));
}



function onGuildData(){
	console.log('** onGuildData()');
	var guilds = Anet.getGuilds();
	
	Objectives.updateGuilds(guilds);
	Guilds.update(guilds);
}



function cloneObjAsDefault(inOjb){
	var outObj = JSON.parse(JSON.stringify(inOjb));
	outObj.owner.color = 'base';
	
	return outObj;
}



function onOwnerChange(mapName, curObj, oldObj, appendToLog){
	if(appendToLog === undefined){
		appendToLog = true;
	}
	if(oldObj === undefined){
		oldObj = cloneObjAsDefault(curObj);
	}
	
	Objectives.updateOwner(mapName, curObj, oldObj, appendToLog);
}



function onClaimerChange(mapName, curObj, oldObj, appendToLog){
	if(appendToLog === undefined){
		appendToLog = true;
	}
	if(oldObj === undefined){
		oldObj = cloneObjAsDefault(curObj);
	}
	
	var $li = $objectives[curObj.id];
	
	if(curObj.guildId){
		var logHtml = renderExternal('log-newClaimer', {timeStamp: dateFormat(new Date(), 'isoTime'), mapName: mapName, curObj: curObj});
		EventLog.write(logHtml, true);
		
		Objectives.appendGuild(curObj);
		onGuildData();
	}
	else{
		Objectives.removeGuild(curObj.id);
	}
		
}




/*
 * 
 * Match Details Views
 * 
 */

function generateLayout(matchDetails){	
	//console.log('writeInitialDetails()', matchDetails);
	
	var match = Anet.getMatch();
		
	var $matchDetails = $(renderExternal('matchDetails'));
	var overallScores = renderExternal('matchDetails-overallScores', {matchDetails: matchDetails, match: match});
	var logHtml = renderExternal('log', {mapTypes: matchDetails.mapTypes});
	
	_.each(matchDetails.mapTypes, function(mapType, i){
		var $map = $matchDetails.find('#breakdown-' + mapType.key);
		var map = matchDetails.maps[mapType.key];
		
		var mapHtml = renderExternal('matchDetails-map', {mapType: mapType, map: map});
		var mapScoreHtml = renderExternal('matchDetails-MapScore', {mapType: mapType, map: map, match: match});
		var $mapObjectivesHtml = $(renderExternal('matchDetails-objectives', {mapType: mapType, map: map, objectivesMap: objectiveGroups[mapType.key]}));
		
		$map
			.append(mapHtml)
			.find('.scores')
				.append(mapScoreHtml)
			.end()
			.find('.objectives')
				.append($mapObjectivesHtml)
			.end()
	});
	
	$matchDetails
		.find('.hide')
			.hide()
		.end()
		.appendTo($content);
		
	$('#logContainer').append(logHtml);
	$('#scoreOverall').append(overallScores);
}



function writeTitle(){
	var match = Anet.getMatch();
	$('#worldTitle')
		.html(
			'<li><a class="team red" href="' + match.redWorld.href + '">' + match.redWorld.name + '</a></li>'
			+ '<li><a class="team blue" href="' + match.blueWorld.href + '">' + match.blueWorld.name + '</a></li>'
			+ '<li><a class="team green" href="' + match.greenWorld.href + '">' + match.greenWorld.name + '</a></li>'
		)
		.find('li:contains(' + Anet.getWorld().name + ')')
			.addClass('active')
		.end();
}