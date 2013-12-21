 $(function () {
 	"use strict";
	
	_.mixin(_.string.exports());
	
	var refreshTime = (1000 * 5);
	
	
	var $worldList = $('#WorldList');
	var $matchList = $('#MatchList');
	var $main = $('#main');
	
	var $scoreList = $('#scoreList')
		, $mapScores = $('#mapScores')
		, $mapScoreEB = $('#mapScoreEB')
		, $mapScoreRed = $('#mapScoreRed')
		, $mapScoreBlue = $('#mapScoreBlue')
		, $mapScoreGreen = $('#mapScoreGreen');
		
	var $objectives = $('#objectives')
		, $objListEB = $('#objListEB')
		, $objListRed = $('#objListRed')
		, $objListBlue = $('#objListBlue')
		, $objListGreen = $('#objListGreen');
	
	window.world = undefined;
	window.map = undefined;
	window.match = undefined;


	var endPoint = 'https://api.guildwars2.com/v1';
	var slugs = {
		worldNames: '/world_names.json'
		, guildDetails: '/guild_details.json'
		, wvw: {
			matches: '/wvw/matches.json'
			, objectiveNames: '/wvw/objective_names.json'
			, matchDetails: '/wvw/match_details.json'//?match_id=1-7
		}
	};
	
	
	



	var baseDataReady = function(){
		console.log('baseDataReady');
		writeWorlds();
		
		$worldList.find('.active').closest('li').addClass('active');
		window.world = getWorldBy('slug', window.urlData.world);
		window.match = getMatchBy('worldId', window.world.id);
		
		//console.log(window.world, window.match)
		
		setMatchDetails();
	}
	
	
	
	var matchDataReady = function(){
		console.log('matchDataReady');		
		//console.log(globalData.matchDetails, globalData.guildDetails);
		
		var matchId = window.match.wvw_match_id;
		var match = getMatchBy('id', matchId);
		
		var teams = {
			red: getWorldBy('id', match.red_world_id)
			, blue: getWorldBy('id', match.blue_world_id)
			, green: getWorldBy('id', match.green_world_id)
		};
		
		
		writeScores(matchId, teams);
		
		writeObjectives(matchId, teams);
	}
	
	
	
	var setWorlds = function setWorlds(){
		//console.log('updating worlds from remote', window.urlData.lang);
		var request = $.ajax({
		  dataType: "json"
		  , url: (endPoint + slugs.worldNames)
		  , cache: false
		  , data: {
		  	lang: window.urlData.lang
		  }
		}).done(function(data){
			//console.log(data);
			console.log('got worlds');
			globalData.worlds = enrichWorldsData(data);
			
		}).error(function(data){
			alert('ERROR: Could not load world data')
		});
		
		return setWorlds;
	}
	
	
	
	var setMatches = function setMatches(){
		console.log('updating matches from remote', window.urlData.lang);
		var request = $.ajax({
		  dataType: "json"
		  , url: (endPoint + slugs.wvw.matches)
		  , cache: false
		  , data: {
		  	lang: window.urlData.lang
		  }
		}).done(function(data){
			//console.log(data.wvw_matches);
			console.log('got matches');
			globalData.matches = data.wvw_matches;
			
		}).error(function(data){
			alert('ERROR: Could not load match data')
		});
		
		return setMatches;
	}
	
	
	
	var setObjectives = function setObjectives(){
		//console.log('updating objectives from remote', window.urlData.lang);
		var request = $.ajax({
		  dataType: "json"
		  , url: (endPoint + slugs.wvw.objectiveNames)
		  , cache: false
		  , data: {
		  	lang: window.urlData.lang
		  }
		}).done(function(data){
			//console.log(data);
			console.log('got objectives');
			globalData.objectives = data;
			
		}).error(function(data){
			alert('ERROR: Could not load objectives data')
		});
		
		return setObjectives;
	}
	
	
	
	var setMatchDetails = function setMatchDetails(){
		var matchId = window.match.wvw_match_id;
		console.log('updating matchDetails from remote', matchId, window.urlData.lang);
		var request = $.ajax({
		  dataType: "json"
		  , url: (endPoint + slugs.wvw.matchDetails)
		  , cache: false
		  , data: {
		  	lang: window.urlData.lang
			, match_id: matchId
		  }
		}).done(function(data){
			//console.log(data);
			console.log('got matchDetails', matchId);
			globalData.matchDetails[matchId] = data;
			
			setAllGuildDetails(globalData.matchDetails[matchId]);
			
		}).error(function(data){
			alert('ERROR: Could not load matchDetails data')
		});
		
		
		setTimeout(setMatchDetails, refreshTime);
		
		return setMatchDetails;
	}
	
	
	
	var setAllGuildDetails = function setAllGuildDetails(matchData){
		window.guildQueue = [];
		
		_.each(matchData.maps, function(map, index){
			
			window.guildQueue = _.union(
				window.guildQueue
				, _.pluck(map.objectives, 'owner_guild')
			);
			
		});
		
		
		window.guildQueue = _.without(window.guildQueue, undefined);
		
		_.each(window.guildQueue, function(guildId, index){
			if (globalData.guildDetails[guildId]) {
				window.guildQueue = _.without(window.guildQueue, guildId);
			}
			else{
				setGuildDetails(guildId);
			}
		});
		
		(function guildDataLoading(){
			if (window.guildQueue.length) {
				//console.log('guildDataLoading...');
				setTimeout(guildDataLoading, 100);
			}
			else{
				//console.log('... guildData ready');
				matchDataReady();
			}
		})();
		
	}
	
	
	
	var setGuildDetails = function setGuildDetails(guildId){
		//console.log('updating guildDetails from remote', guildId, window.urlData.lang);
		
		var request = $.ajax({
			dataType: "json",
			url: (endPoint + slugs.guildDetails)		//, cache: false
			,
			data: {
				lang: window.urlData.lang,
				guild_id: guildId
			}
		}).done(function(data){
			//console.log(data);
			console.log('got guildDetails', guildId);
			globalData.guildDetails[guildId] = data;
			window.guildQueue = _.without(window.guildQueue, guildId);
			
		}).error(function(data){
			alert('ERROR: Could not load matchDetails data')
		});
		
		return setMatchDetails;
	}
	
	
	
	var enrichWorldsData = function(worldsData){
		$.each(worldsData, function(i,obj){
			obj.slug = _.slugify(obj.name);
		});
		return worldsData;
	}
	
	
	var getWorldHref = function(world){
		var link = [
			''//root
			, window.urlData.lang
			, world.slug
		];
		return link.join('/');
	}
	
	
	var $getWorldLink = function(world){
		var $link = $('<a/>', {
			text: world.name
			, class: 'world'
			, href: getWorldHref(world)
		});
		
		if(window.urlData.world === world.slug){
			$link.addClass('active');
		}
		
		return $link;
	}
	
	
	
	var getWorldBy = function(key, val){
		var world = _.find(globalData.worlds, function(obj, i, collection){
			return (obj[key] == val);
		});
		return world;
	}
	
	
	
	var getMatchBy = function(key, val){
		var match = _.find(globalData.matches, function(obj, i, collection){
			if (key == 'worldId') {
				return (obj.red_world_id == val || obj.blue_world_id == val || obj.green_world_id == val);
			}
			else if (key == 'id') {
				return (obj.wvw_match_id == val);
			}
			else {
				return (obj[key] == val);
			}
		});
		return match;
	}
	
	
	
	var getObjectiveBy = function(key, val){
		var objective = _.find(globalData.objectives, function(obj, i, collection){
			return (obj[key] == val);
		});
		return objective;
	}
	
	
	
	var getGuildBy = function(key, val){
		console.log(globalData.guilds)
		var guild = _.find(globalData.guilds, function(obj, i, collection){
			return (obj[key] == val);
		});
		return guild;
	}
	
	
	
	var writeWorlds = function(){
		globalData.worlds.sort(
			sort_by(
				'name'
				, false
				//, function(a){return a.toUpperCase()}
			)
		);
		
		$.each(globalData.worlds, function(i,obj){
			$('<li />')
				.append($getWorldLink(obj))
				.appendTo($worldList);
		});
	}
	
	
	
	var writeMatches = function(){
		globalData.matches.sort(
			sort_by(
				'wvw_match_id'
				, false
				//, function(a){return a.toUpperCase()}
			)
		);
		
		$.each(globalData.matches, function(i,obj){
			//console.log(obj);
			
			var $redLink = $getWorldLink(getWorldBy('id',obj.red_world_id)).prepend('<span>Red: </span>');
			var $blueLink = $getWorldLink(getWorldBy('id',obj.blue_world_id)).prepend('<span>Blu: </span>');
			var $greenLink = $getWorldLink(getWorldBy('id',obj.green_world_id)).prepend('<span>Grn: </span>');
			
			var $li = $('<li/>').append(
				$('<dl/>')
					.append($('<dt/>', {html: 'Match ' + obj.wvw_match_id}))
						.append($('<dd/>').append($redLink))
						.append($('<dd/>').append($blueLink))
						.append($('<dd/>').append($greenLink))
					/*
					.append('<dt>Time</dt>')
						.append($('<dd/>', {html: obj.start_time}))
						.append($('<dd/>', {html: obj.end_time}))
					*/
					//.append('<dt>Teams</dt>')
				);
			$li.appendTo($matchList);
		});
		$matchList.find('.active').closest('li').addClass('active');
	}
	
	
	
	
	
	var getScorelist = function(scores, teams){
		var $ul = $('<ul/>')
			.append(
				$('<li class="red"/>')
					.append($('<span/>', { class: 'team',	text: teams['red'].name }))
					.append($('<span/>', { class: 'score mono', 	text: _.numberFormat(scores[0]) }))
			)
			.append(
				$('<li class="blue"/>')
					.append($('<span/>', { class: 'team',	text: teams['blue'].name }))
					.append($('<span/>', { class: 'score mono', 	text: _.numberFormat(scores[1]) }))
			)
			.append(
				$('<li class="green"/>')
					.append($('<span/>', { class: 'team',	text: teams['green'].name }))
					.append($('<span/>', { class: 'score mono', 	text: _.numberFormat(scores[2]) }))
			)
	
		return $ul.children();
	}
	
	
	
	
	
	var getMapName = function(mapType){
		var mapNames = {
			'RedHome': teams['red'].name
			, 'BlueHome': teams['blue'].name
			, 'GreenHome': teams['green'].name
			, 'Center': 'Eternal Battlegrounds'
		}; 
		return mapNames[mapType];
	}
	
	
	
	
	
	var writeScores = function(matchId, teams){
		var $mapLists = [$mapScoreRed, $mapScoreGreen, $mapScoreBlue, $mapScoreEB];
		
		$scoreList.find('li:not(.nav-header)').remove();
		$mapScores.find('li:not(.nav-header)').remove();
		
		$scoreList
			.append(getScorelist(globalData.matchDetails[matchId].scores, teams))
			.find('li')
				.addClass('span8')
				.wrap('<h1>');
				
		_.each($mapLists, function($list,ixMap){
			$list.append(getScorelist(globalData.matchDetails[matchId].maps[ixMap].scores, teams))
		});
	}
	
	
	
	
	
	var writeObjectives = function(matchId, teams){
		var maps = globalData.matchDetails[matchId].maps;
		//console.log(maps);
		
		var $objectiveLists = [$objListRed, $objListGreen, $objListBlue, $objListEB];
		
		//console.log(teams);
		
		_.each($objectiveLists, function($list,ixMap){
			$list.find('li:not(.nav-header)').remove();
			
			_.each(globalData.matchDetails[matchId].maps[ixMap].objectives, function(obj,ixObj){
				var objective = getObjectiveBy('id', obj.id);
				var slugged = _.slugify(objective.name);
				var team = teams[obj.owner.toLowerCase()];
				var guild = (obj.owner_guild) ? globalData.guildDetails[obj.owner_guild] : undefined;
				
				var classNames = [
					obj.owner.toLowerCase()
					, slugged
				].join(' ');
				var html = [
					'<span class="obj">' + objective.name + ' <sup>(' + objective.id + ')</sup>' + '</span>'
					//, '<span class="team">' + team.name + '</span>'
				];
				if(guild){
					html.push('<sup class="guild">' + guild.guild_name + '</sup>')
				}
					//html.push(JSON.stringify(obj))
					//html.push(JSON.stringify(objective))
				
				$('<li/>', {
					class: classNames
					, html: html.join(' ')
				})
				.appendTo($list);
				
				//console.log(obj,ixObj,objective);
			});
		})
		
		/*
		_.each(maps, function(map, index){
			console.log(map);
			
			var $map = $('<li/>', {text: mapNames[map.type]});
				
			$map
				.append($mapScores)
				.appendTo($maps);
		});
		*/
	}
	
	
	
	
	
	// Auto Execute
	var initData = function initData(){
		window.globalData = {
			matchDetails: {}
			, guildDetails: {}
		};
		
		setWorlds();
		setMatches();
		setObjectives();
		
		var dataLoadingIterations = 0;
		(function dataLoading(){
			if (
				!globalData.worlds
				|| !globalData.matches
				|| !globalData.objectives
			) {
				dataLoadingIterations++;
				console.log('dataLoading...');
				if (dataLoadingIterations <= 20) {
					setTimeout(dataLoading, 200);
				}
				else{
					console.log('data loading failed after 20 attempts')
				}
			}
			else{
				baseDataReady();
			}
		})();
		
		return initData;
	}(); 
	
	
	
		
	
	
});





var sort_by = function(field, reverse, primer){

  var key = primer ? function (x) { return primer(x[field]); } : function (x) { return x[field]; }

   return function (a,b) {
       var A = key(a), B = key(b);
       return (A < B ? -1 : (A > B ? 1 : 0)) * [1,-1][+!!reverse];                  
   }
};
/*
var slugify = function(str){
	var rStr = str.toLowerCase();
	rStr = rStr.replace(/'/g, '');
	rStr = rStr.replace(/[\[\]\s]{1,}/g, " ");
	rStr = XRegExp.replace(rStr, "\\p{L}", "");
	rStr = rStr.trim().replace(/\s{1,}/g, '-');
	
	return rStr;
};
*/