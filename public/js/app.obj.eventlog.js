var objEventLog = function(){
	"use strict"
	
	var self = this;	
	var $log;
	
	
	
	
	/*
	 * PUBLIC
	 */
	self.init = function($obj){
		console.log('** objEventLog.init()');
		$log = $obj;
		return self;
	};
	
	
	self.write = function(logHtml, playAudio){
		var logSize = $log.find('li').length;
		var mapToShow = getLogMapToShow();
		
		var $li = $(logHtml)
			.hide()
			.prependTo($log);
	
		if(mapToShow === 'all' || $li.filter('.' + mapToShow).length){
			$li.slideDown('slow');
			
			if(playAudio){
				this.playNotification();
			}
			
		}
				
		zebraStripeVisibleLog();
	};
	
	
	
	self.toggleTabTo = function(mapKey){
		//console.log('toggleTabTo() ', mapKey);
		
		if(mapKey == 'all'){
			$log.find('li').show();
		}
		else{
			$log
				.find('li:not(.' + mapKey + ')')
					.hide()
				.end()
				.find('li.' + mapKey)
					.show()
				.end();
		}
		
		zebraStripeVisibleLog();
	}
	
	
	
	self.highlightMap = function(mapKey){
		var $map = $('#breakdown-' + mapKey);
		$('.breakdown').removeClass('active');
		$map.addClass('active');
	}



	self.playNotification = function(){
		if($('#audioToggle').data('enabled')){
			$('#audioNotification').get(0).play();
		}
	}
	
	
	
	
	/*
	 * PRIVATE
	 */
	
	var zebraStripeVisibleLog = function(){
		$log.find('li')
			.removeClass('alt')
			.filter(':visible:even')
				.addClass('alt');
	}
	
	
	
	var getLogMapToShow = function(){
		return $('#logTabs li.active a').data('target') || 'all';
	}
	
	
	
	
	return self;
};
