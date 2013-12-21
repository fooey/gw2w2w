"use strict"
_.mixin(_.string.exports());


if(window.location.pathname !== window.location.pathname.toLowerCase()){
	window.location.pathname = window.location.pathname.toLowerCase();
}


var urlPath = window.location.pathname.toLowerCase().split('/')
	, urlLangSlug = urlPath[1] || 'en'
	, urlWorldSlug = urlPath[2];


var Anet
	, Scoreboard
	, Objectives
	, EventLog
	, Guilds;

var langs
	, lang
	, worlds
	, world
	, matches
	, match
	//, matchDetails
	, guilds;
	
	
var $content, $quickNav, $indicator = $('#indicator')
var $maps, $scoreBoards, $objectives, $guildsList;





 $(function () {
 	"use strict";
	
	gaqRankTracker();
	
	$content = $('#content')
		, $quickNav = $('#quickNav')
		, $indicator = $('#indicator')
	
	$maps
		, $scoreBoards = { overall: {}, maps: {}}
		, $objectives = {}
	
	
	
	
	if(!urlWorldSlug){
		var listeners = {
			onInit: worldOptions_onInit
			, onWorldData: worldOptions_onWorldData
			, onMatchesData: worldOptions_onMatchesData
		};
	}
	else{
		var listeners = {
			onInit: onInit
			, onMatchData: onMatchData
			, onGuildData: onGuildData
			, onOwnerChange: onOwnerChange
			, onClaimerChange: onClaimerChange
		};
		
		Scoreboard = new objScoreboard();
		Objectives = new objObjectives();
		EventLog = new objEventLog();
		Guilds = new objGuilds();
	}
	
	
	Anet = new AnetAPI(urlLangSlug, urlWorldSlug, listeners);
	
	
	/*
	 * Write Common Views
	 */
	writeQuickLang();
	writeQuickWorlds();
	writeAttribution();
	
	
	
	
	/*
	 * 
	 * 	User Interaction
	 * 
	 */
	
	$content.on('click tabClick', '#logTabs a', function(){
		var $that = $(this);
		
		$that
			.closest('li')
				.addClass('active')
				.siblings()
					.removeClass('active')
				.end()
			.end();
		
		EventLog.toggleTabTo($that.data('target'));
		EventLog.highlightMap($that.data('target'));
		
		var gaData = {
		  'hitType': 'event',			// Required.
		  'eventCategory': 'Tabs',		// Required.
		  'eventAction': 'Changed Tab',	// Required.
		  'eventLabel': $that.data('target')
		};
		//console.log('Post To GA:', gaData);
		ga('send', gaData);
		
	});
	
	$content.on('click', '.serverName', function(){
		var $that = $(this);
		var target =$that.data('target');
		
		$('#logTabs a').each(function(){
			if($(this).data('target') === target){
				$(this).trigger('tabClick');
			}
		});
	});
	
	
	$('#audioToggle').on('click', function(e){
		e.preventDefault();
		var $that = $(this);
		
		//togle stored state
		$that.data('enabled', !$that.data('enabled'));
		
		EventLog.playNotification();
		
		if($that.data('enabled')){
			$that.hide().html('<i class="icon-volume-up"></i>').fadeIn();
		}
		else{
			$that.hide().html('<span class="icon-stack"><i class="icon-ban-circle icon-stack-base text-error"></i><i class="icon-volume-up"></i></span>').fadeIn();
		}
		
		
		
		var gaData = {
		  'hitType': 'event',				// Required.
		  'eventCategory': 'Audio',			// Required.
		  'eventAction': 'Toggle State',	// Required.
		  'eventLabel': ($that.data('enabled')) ? 'Enabled' : 'Disabled'
		};
		ga('send', gaData);
	});
	
	
	$content.on('mouseenter mouseleave', '#log li', function(e){
		var $that = $(this)
			, id = $that.data('id')
			, $objLi = $objectives[id];
			
		$objLi.toggleClass('highlight');
	});
	
	
	
	var windowHasFocus = 1;
	$(window)
		.on('focus', function(){
			if(!windowHasFocus){
				windowHasFocus = 1;			
				
				var gaData = {
				  'hitType': 'event',			// Required.
				  'eventCategory': 'App',		// Required.
				  'eventAction': 'Focus',		// Required.
				  'eventLabel': 'Gained'
				};
				ga('send', gaData);
			}
		})
		.on('blur', function(){
			if(windowHasFocus){
				windowHasFocus = 0;
				
				var gaData = {
				  'hitType': 'event',			// Required.
				  'eventCategory': 'App',		// Required.
				  'eventAction': 'Focus',		// Required.
				  'eventLabel': 'Lost'
				};
				ga('send', gaData);
			}
		});
	
	
});



	

/*
 * 
 * Common Views
 * 
 */


var writeQuickLang = function (){
	var html = renderExternal('quickLang', {langs: Anet.getLangs()});
	$quickNav.append(html);
};

var writeQuickWorlds = function(){
	$quickNav.find('li:hidden').show();
};

var writeAttribution = function(){
	var html = renderExternal('attrib');
	$('.container').append(html);
};




