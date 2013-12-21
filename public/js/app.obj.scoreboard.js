var objScoreboard = function(){
	"use strict"
	
	var self = this;
	var $scoreBoards = { overall: {}, maps: {}}
	
	
	
	
	/*
	 * PUBLIC
	 */
	self.init = function(matchDetails){
		console.log('** objScoreboard.init()');
		cacheScoreBoards(matchDetails);
		return self;
	};
	
	
	
	self.update = function(matchDetails){
		updateMatchScores(matchDetails);
		updateMatchIncomes(matchDetails);
		updateMatchHoldings();
	};
	
	
	
	
	
	/*
	 * PRIVATE
	 */

	var cacheScoreBoards = function (matchDetails){
		var colors = Anet.getColors();
		var mapTypes = matchDetails.mapTypes;
		
		_.each(colors, function(color, i){
			$scoreBoards.overall[color] = $('#' + color + 'ScoreBoard');
			
			_.each(mapTypes, function(mapType, i){
				$scoreBoards.maps[mapType.key] = $scoreBoards.maps[mapType.key] || {};
				$scoreBoards.maps[mapType.key][color] = $('#mapScoreBoard-' + color + '-' + mapType.key);
			});
		});
	};
	
	
	
	var updateMatchScores = function (matchDetails){
		var colors = Anet.getColors();
		var mapTypes = matchDetails.mapTypes;
		
		_.each(colors, function(color, i){
			
			// update overall scores
			if(matchDetails.score[color] !== prevMatchDetails.score[color] ){
				var $scoreBoard = $scoreBoards.overall[color];
				var score = matchDetails.score[color];

				updateScoreHtml($scoreBoard, score, '.score');
			}
			
			// update match scores
			_.each(mapTypes, function(mapType, i){
				if(matchDetails.maps[mapType.key].score[color] !== prevMatchDetails.maps[mapType.key].score[color] ){
					var $scoreBoard = $scoreBoards.maps[mapType.key][color];
					var score = matchDetails.maps[mapType.key].score[color];
					
					updateScoreHtml($scoreBoard, score, '.score');
				}
			});
		})
	};
	
	
	
	var updateMatchIncomes = function (matchDetails){
		var incomes = calculateIncomes(matchDetails);
		var colors = Anet.getColors();
		var mapTypes = matchDetails.mapTypes;
		
		_.each(colors, function(color, i){
			
			if(!prevIncomes || incomes.overall[color] !== prevIncomes.overall[color]){
				var $scoreBoard = $scoreBoards.overall[color];
				var income = incomes.overall[color];
				
				updateScoreHtml($scoreBoard, income, '.income');
				//console.log('update overall income: ', color, income);
				
			}
			_.each(mapTypes, function(mapType, i){
				
				if(!prevIncomes || incomes.maps[mapType.key][color] !== prevIncomes.maps[mapType.key][color]){
					var $scoreBoard = $scoreBoards.maps[mapType.key][color];
					var income = incomes.maps[mapType.key][color];
					
					updateScoreHtml($scoreBoard, income, '.income');
					//console.log('update map income: ', mapType.key, color, income);
				}
			});
		});
		
		prevIncomes = JSON.parse(JSON.stringify(incomes)); // deep copy to break copy by reference
	};



	var updateMatchHoldings = function (){
		var $scoreOverall = $('#scoreOverall');
	
		$('.holdingCount').text('0');
		
		var objectives = Anet.getObjectives();
		_.each(objectives, function(obj, i){
			var objColor = (obj.owner && obj.owner.color) ? obj.owner.color : 'base';
			if(objColor != 'base'){
				var thisElement = $scoreOverall.find('.' + objColor).find('.' + obj.type);
				var curVal = parseInt(thisElement.text());
				thisElement.text(++curVal);
				//console.log(obj)
			}
		});
		
		var bonuses = Anet.getBonuses();
		_.each(bonuses, function(mapBonuses, i){
			if(mapBonuses.length){
				_.each(mapBonuses, function(bonus, i){
					if(bonus.type === 'bloodlust'){
						var thisSelector = '#num' + bonus.owner + 'Bloodlust' ;
						var thisElement = $(thisSelector);
						var curVal = parseInt(thisElement.text());
						thisElement.text(++curVal);
					}
				});
			}
		});
	};



	var calculateIncomes = function (matchDetails){
		var objectives = Anet.getObjectives();
		var colors = Anet.getColors();
		var mapTypes = matchDetails.mapTypes;
		var incomes = { overall: {}, maps: {}};
		
		_.each(colors, function(color, i){
			incomes.overall[color] = 0;
			
			_.each(mapTypes, function(mapType, i){
				incomes.maps[mapType.key] = incomes.maps[mapType.key] || {};
				incomes.maps[mapType.key][color] = 0;
			});
		});
		
		_.each(objectives, function(obj, i){
			var objColor = (obj.owner && obj.owner.color) ? obj.owner.color : 'base';
			if(objColor != 'base'){
				incomes.overall[objColor] += obj.points;
				incomes.maps[obj.mapKey][objColor] += obj.points;
			}
		});
		
		
		return incomes;
	};



	var updateScoreHtml = function ($scoreBoard, score, selector){
		$scoreBoard
			.find(selector)
			.fadeOut('fast', function(){
				$(this).html(_.numberFormat(score)).fadeIn('slow');
			})
	};
	
	
	
	return self;
};