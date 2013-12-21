var objObjectives = function(){
	"use strict"
	
	var self = this;
	var initialized = false;
	var $maps;
	
	
	
	
	/*
	 * PUBLIC
	 */
	self.init = function($obj){
		console.log('** objObjectives.init()');
		$maps = $obj;
		initializeObjectives();
		updateTimers();

		return self;
	};
	
	
	//self.update = function(matchDetails){}

	
	
	
	self.updateOwner = function (mapName, curObj, oldObj, appendToLog){
		var $li = $objectives[curObj.id];
		var oldSprite = 'sprite-' + oldObj.owner.color + '-' + oldObj.type;
		var curSprite = 'sprite-' + curObj.owner.color + '-' + curObj.type;
		
		self.removeGuild(curObj.id);
	
		$li
			.removeClass(oldObj.owner.color)
			.addClass(curObj.owner.color)
			.find('.sprite2small')
				.removeClass(oldSprite)
				.addClass(curSprite)
			.end();
			
		if(curObj.guildId){
			Objectives.appendGuild(curObj);
			Guilds.initGuild(curObj.guildId);
		}
		
		if(appendToLog && curObj.generic !== 'Ruin'){
			var logHtml = renderExternal('log-newOwner', {timeStamp: dateFormat(new Date(), 'isoTime'), mapName: mapName, curObj: curObj, oldObj: oldObj});
			EventLog.write(logHtml, true);
		}
	}


	self.updateGuilds = function (guilds){
		$('.guild:has(i)').each(function(i){ // find spinners
			var $that = $(this);
			var guildId = $that.data('guildid');
			
			if(guilds[guildId]){
				$that.html('<a href="#guild-' + guildId + '"><abbr class="guild-' + guildId + '" title="' + guilds[guildId].name + '">[' + guilds[guildId].tag + ']</abbr></a>')
			}
		});
	};
	
	
	
	self.appendGuild = function (curObj){
		var guild = Anet.getGuild(curObj.guildId);
		
		var $guildHtml = $('<sup class="guild" data-guildid="' + curObj.guildId + '"><i class="icon-spinner icon-spin"></i></sup>');
		
		var $guild = Guilds.getGuildListing(curObj.guildId);
		Guilds.appendObjectiveToGuildHistory(curObj);
		
		self.removeGuild(curObj.id);
		$objectives[curObj.id].append($guildHtml);
		
		
	};
	
	
	
	self.removeGuild = function (objId){
		$objectives[objId].find('.guild').remove();
	}
	
	


	/*
	 * PRIVATE
	 */

	var initializeObjectives = function (){
		$maps.find('.objective')
			.each(function(i){
				initializeObjective($(this));
			})
		.end()
	};


	
	var initializeObjective = function ($li){
		var id = $li.data('id');
		var obj = Anet.getObjectiveBy('id', id);
		
		// cache element to $objectives object for fast lookup
		$objectives[id] = $li;
		
		if(obj){
			var spriteClass = 'sprite-base-' + obj.type;
				
			$li
				.find('.objName')
					.attr('title', obj.name)
					.html(obj.name)
				.end()
				.find('.sprite2small')
					.attr('title', obj.name)
					.addClass(spriteClass)
				.end()
				.find('.recapTimer')
					.html('?:??')
					.addClass('unknown')
				.end();
				
			onOwnerChange(obj.mapKey, obj, undefined, false);
		}
	};
	
	

	// first invoked by writeInitialDetails
	var fullStateKnown = false;
	var updateTimers = function updateTimers(){
		var objectives = Anet.getObjectives()
			, initTime = Anet.getInitTime()
			, now = new Date()
			, buffDuration = 5 * 60 * 1000;
			
		_.each(objectives, function(o, index){
			var $li = $objectives[o.id]
				, $timer = $li.find('.recapTimer')
				, timerVisible = $timer.is(':visible')
			
			if(o.generic == 'Ruin'){
				if(timerVisible){
					$timer.hide();
				}
			}
			else if(o.lastCaptured !== initTime){
				var expires = new Date();
				expires.setTime(o.lastCaptured.getTime() + buffDuration);
				
				var timeRemaining = expires.getTime() - now.getTime();
				
				if(timeRemaining <= 0 && timerVisible){
					$timer.fadeOut();
				}
				else if (timeRemaining > 0 && !timerVisible){
					$timer.fadeIn();
				}
				
				$timer.filter('.unknown').removeClass('unknown');
				
				if(timeRemaining > 0){
					var timerText = minuteFormat(timeRemaining);
					//console.log(timerText);
					$timer.text(timerText);
				}
				
				//console.log(o.lastCaptured.getTime(), expires.getTime(), now.getTime(), expires.getTime() > now.getTime(), timeRemaining, timerVisible);
			}
		});
		
			
		// when to hide 'unknown state' indicators
		if(!fullStateKnown){
			var elapsed = (now.getTime() - initTime.getTime());
			if(elapsed > buffDuration){
				fullStateKnown = true;
				$('#warmupWarning').slideUp();
				$('.recapTimer.unknown')
					.fadeOut('fast', function(){
						$(this).removeClass('unknown')
					})
			}
			else{
				var timeRemaining = buffDuration - (elapsed);
				var timerText = minuteFormat(timeRemaining);
				$('.recapTimer.unknown').html(timerText);
			}
		}
		
		setTimeout(updateTimers, 1*1000);
	};
	
	
	
	
	return self;
};






var objectiveGroups = {
	'Center': {
		'Castle':{
			alert: 'well'
			, objectives: [
				9			//sm
			]
		}
		, 'Red Corner':{
			alert: 'error'
			, objectives: [
				1			//overlook
				, 20		//veloka
				, 17		//mendons
				, 18		//anz
				, 19		//ogre
				, 5			//pang
				, 6			//speldan
			]
		}
		, 'Blue Corner':{
			alert: 'info'
			, objectives: [
				2			//valley
				, 22		//bravost
				, 15		//langor
				, 16		//quentin
				, 21		//durios
				, 8 		//umber
				, 7			//dane
			]
		}
		, 'Green Corner':{
			alert: 'success'
			, objectives: [
				3			//lowlands
				, 13		//jerrifer
				, 11		//aldons
				, 14		//klovan
				, 12		//wildcreek
				, 4 		//golanta
				, 10		//rogues
			]
		}
	}
	
	, 'RedHome': {
		'North':{
			alert: 'error'
			, objectives: [
				37			//keep
				, 33		//bay
				, 32		//hills
				, 38		//longview
				, 40		//cliffside
				, 39 		//godsword
				, 52		//hopes
				, 51		//astral
			]
		}
		,'South':{
			alert: 'well'
			, objectives: [
				35			//briar
				, 36		//lake
				, 34		//lodge
				, 53		//vale
				, 50 		//water
			]
		}
		,'Ruins':{
			alert: 'warning'
			, objectives: [
				62			//temple
				, 63		//hollow
				, 64		//estate
				, 65		//orchard
				, 66 		//ascent
			]
		}
	}
	
	, 'BlueHome': {
		'North':{
			alert: 'info'
			, objectives: [
				23			//keep
				, 27		//bay
				, 31		//hills
				, 30		//woodhaven
				, 28		//dawns
				, 29 		//spirit
				, 58		//gods
				, 60		//star
			]
		}
		,'South':{
			alert: 'well'
			, objectives: [
				25			//briar
				, 26		//lake
				, 24		//champ
				, 59		//vale
				, 61 		//water
			]
		}
		,'Ruins':{
			alert: 'warning'
			, objectives: [
				71			//temple
				, 70		//hollow
				, 69		//estate
				, 68		//orchard
				, 67 		//ascent
			]
		}
	}
	
	, 'GreenHome': {
		'North':{
			alert: 'success'
			, objectives: [
				46			//keep
				, 44		//bay
				, 41		//hills
				, 47		//sunny
				, 57		//crag
				, 56 		//titan
				, 48		//faith
				, 54		//fog
			]
		}
		,'South':{
			alert: 'well'
			, objectives: [
				45			//briar
				, 42		//lake
				, 43		//lodge
				, 49		//vale
				, 55 		//water
			]
		}
		,'Ruins':{
			alert: 'warning'
			, objectives: [
				76			//temple
				, 75		//hollow
				, 74		//estate
				, 73		//orchard
				, 72 		//ascent
			]
		}
	}
};
