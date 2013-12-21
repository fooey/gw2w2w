/*
 * 
 * WorldOptions Events
 * 
 */

function worldOptions_onInit(){
	console.log("** worldOptions_onInit()");
	$indicator
		.stop()
		.fadeOut();
		
	writeWorldOptionsBase();
	
	
	var gaData = {
		'hitType': 'event',					// Required.
		'eventCategory': 'App',				// Required.
		'eventAction': 'Data Initialized',	// Required.
		'nonInteraction': true
	};
	ga('send', gaData);
}

function worldOptions_onWorldData(){
	console.log("** worldOptions_onWorldData()");
	
	
	var worlds = { 'US': {}, 'EU': {}};
	
	_.each(worlds, function(o, region){
		_.each(Anet.getLangs(), function(lang, i){
			worlds[region][lang.name] = _.filter(Anet.getWorlds(), function(world){return world.region === region && world.lang === lang.label})
		});
	});
	
	
	var html = renderExternal('worldOptions-worlds', {
		worlds: worlds
		, currentLang: urlLangSlug
	});
	
	$('#worldLists')
		.hide()
		.html(html)
		.slideDown();
}

function worldOptions_onMatchesData(){
	console.log("** worldOptions_onMatchesData()");
	
	var allMatches = Anet.getMatches();
	var matches = {
		us: _.filter(allMatches, function(world){return world.id.substring(0,1) == 1})
		, eu: _.filter(allMatches, function(world){return world.id.substring(0,1) == 2})
	};
	
	var html = renderExternal('worldOptions-matches', {
		matches: matches
		, currentLang: urlLangSlug
	});
	
	$('#matchLists')
		.hide()
		.html(html)
		.slideDown();
}



/*
 * 
 * WorldOptions Views
 * 
 */

function writeWorldOptionsBase(){
	if(!$('#worldLists').length){
		var html = renderExternal('worldOptions', {});
		
		$content
			.html(html);
	}
}