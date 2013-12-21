

var AnetAPI = function AnetAPI(langSlug, worldSlug, listeners){
	"use strict"
	
	// more generic than referencing by function name AnetAPI
	var self = this;
	
	var nonListeners = { 
		onInit: function(){}
		, onWorldData: function(){}
		, onMatchesData: function(){}
		, onObjectivesData: function(){}
		, onGuildData: function(){}
		, onMatchData: function(){}
		, onOwnerChange: function(){}
		, onClaimerChange: function(){}
	}; 
	
	// onInit, onWorldData, onMatchesData, onObjectivesData, onGuildData, onMatchData, onOwnerChange, onClaimerChange
	self.listeners = $.extend({}, nonListeners, listeners);
	
	
	/*
	 * 
	 * properites
	 * 
	 */
	this.initTime = new Date();
	
	
	this.api = 'https://api.guildwars2.com/v1';	
	this.apiSlugs = {
		worlds: '/world_names.json'
		, matches: '/wvw/matches.json'
		, objectives: '/wvw/objective_names.json'
		, matchDetails: '/wvw/match_details.json'	//?match_id=1-7
		, guilds: '/guild_details.json'				//?guild_id=1-7
	};
	
	this.langs = [
		{slug: 'en', label: 'EN', href: '/en', name: 'English'}
		, {slug: 'de', label: 'DE', href: '/de', name: 'Deutsch'}
		, {slug: 'fr', label: 'FR', href: '/fr', name: 'Français'}
		, {slug: 'es', label: 'ES', href: '/es', name: 'Español'}
	];
	
	this.colors = ['red', 'blue', 'green'];
	
	this.listenerDelayMS = 10;
	this.recheckDelayMS = 100;
	this.recheckMaxAttempts = 50;
	
	
	
	/*
	 * 
	 * public methods
	 * 
	 */
	
	
	/*
	 * local getters
	 */
	
	this.getInitTime = function(){
		return self.initTime;
	};
	
	this.getColors = function(){
		return self.colors;
	};
	
	this.getLang = function(){
		return self.lang;
	};
	
	this.getLangs = function(){
		return self.langs;
	};
	
		
	this.getWorld = function(){
		return self.world;
	};
	
	this.getWorlds = function(){
		return self.worlds;
	};
	
	this.getMatch = function(){
		return self.match;
	};
	
	this.getMatches = function(){
		return self.matches;
	};
		
	
	this.getObjectives = function(){
		return self.objectives;
	};
	
	this.getMatchDetails = function(id){
		return self.matchDetails;
	};
	
	this.getGuild = function(id){
		return self.guilds[id];
	};
	
	this.getGuilds = function(){
		return self.guilds;
	};
	
	this.getBonuses = function(){
		return self.matchDetails.bonuses;
	};
	
	this.refresh = function(callback){
		console.log('refresh')
		setMatchDetails();
	}
	
	this.objectivesLookup = {
		'en': ",Overlook,Valley,Lowlands,Golanta Clearing,Pangloss Rise,Speldan Clearcut,Danelon Passage,Umberglade Woods,Stonemist Castle,Rogue's Quarry,Aldon's Ledge,Wildcreek Run,Jerrifer's Slough,Klovan Gully,Langor Gulch,Quentin Lake,Mendon's Gap,Anzalias Pass,Ogrewatch Cut,Veloka Slope,Durios Gulch, Bravost Escarpment,Garrison,Champion's Demense,Redbriar,Greenlake,Ascension Bay,Dawn's Eyrie,The Spiritholme,Woodhaven,Askalion Hills,Etheron Hills,Dreaming Bay,Victor's Lodge,Greenbriar,Bluelake,Garrison,Longview,The Godsword,Cliffside,Shadaran Hills,Redlake,Hero's Lodge,Dreadfall Bay,Bluebriar,Garrison,Sunnyhill,Faithleap,Bluevale Refuge,Bluewater Lowlands,Astralholme,Arah's Hope,Greenvale Refuge,Foghaven,Redwater Lowlands,The Titanpaw,Cragtop,Godslore,Redvale Refuge,Stargrove,Greenwater Lowlands,Temple of Lost Prayers,Battle's Hollow,Bauer's Estate,Orchard Overlook,Carver's Ascent,Carver's Ascent,Orchard Overlook,Bauer's Estate,Battle's Hollow,Temple of Lost Prayers,Carver's Ascent,Orchard Overlook,Bauer's Estate,Battle's Hollow,Temple of Lost Prayers".split(',')
		, 'fr': ",Belvédère,Vallée,Basses terres,Clairière de Golanta,Montée de Pangloss,Forêt rasée de Speldan,Passage Danelon,Bois d'Ombreclair,Château Brumepierre,Carrière des voleurs,Corniche d'Aldon,Piste du Ruisseau sauvage,Bourbier de Jerrifer,Petit ravin de Klovan,Ravin de Langor,Lac Quentin,Faille de Mendon,Col d'Anzalias,Percée de Gardogre,Flanc de Veloka,Ravin de Durios,Falaise de Bravost,Garnison,Fief du champion,Bruyerouge,Lac Vert,Baie de l'Ascension,Promontoire de l'aube,L'antre des esprits,Gentesylve,Collines d'Askalion,Collines d'Etheron,Baie des rêves,Pavillon du vainqueur,Vertebranche,Lac bleu,Garnison,Longuevue,L'Epée divine,Flanc de falaise,Collines de Shadaran,Rougelac,Pavillon du Héros,Baie du Noir déclin,Bruyazur,Garnison,Colline ensoleillée,Ferveur,Refuge de bleuval,Basses terres d'Eau-Azur,Astralholme,Espoir d'Arah,Refuge de Valvert,Havre gris,Basses terres de Rubicon,Bras du titan,Sommet de l'escarpement,Divination,Refuge de Valrouge,Bosquet stellaire,Basses terres d'Eau-Verdoyante,Temple des prières perdues,Vallon de bataille,Domaine de Bauer,Belvédère du Verger,Côte du couteau,Côte du couteau,Belvédère du Verger,Domaine de Bauer,Vallon de bataille,Temple des prières perdues,Côte du couteau,Belvédère du Verger,Domaine de Bauer,Vallon de bataille,Temple des prières perdues".split(',')
		, 'es': ",Mirador,Valle,Vega,Claro Golanta,Colina Pangloss,Claro Espeldia,Pasaje Danelon,Bosques Clarosombra,Castillo Piedraniebla,Cantera del Pícaro,Cornisa de Aldon,Pista Arroyosalvaje,Cenagal de Jerrifer,Barranco Klovan,Barranco Langor,Lago Quentin,Zanja de Mendon,Paso Anzalias,Tajo de la Guardia del Ogro,Pendiente Veloka,Barranco Durios,Escarpadura Bravost,Fuerte,Dominio del Campeón,Zarzarroja,Lagoverde,Bahía de la Ascensión,Aguilera del Alba,La Isleta Espiritual,Refugio Forestal,Colinas Askalion,Colinas Etheron,Bahía Onírica,Albergue del Vencedor,Zarzaverde,Lagoazul,Fuerte,Vistaluenga,La Hoja Divina,Despeñadero,Colinas Shadaran,Lagorrojo,Albergue del Héroe,Bahía Salto Aciago,Zarzazul,Fuerte,Colina Soleada,Salto de Fe,Refugio Valleazul,Tierras Bajas de Aguazul,Isleta Astral,Esperanza de Arah,Refugio de Valleverde,Refugio Neblinoso,Tierras Bajas de Aguarroja,La Garra del Titán,Cumbrepeñasco,Sabiduría de los Dioses,Refugio Vallerojo,Arboleda de las Estrellas,Tierras Bajas de Aguaverde,Templo de las Pelgarias,Hondonada de la Battalla,Hacienda de Bauer,Mirador del Huerto,Ascenso del Trinchador,Ascenso del Trinchador,Mirador del Huerto,Hacienda de Bauer,Hondonada de la Battalla,Templo de las Pelgarias,Ascenso del Trinchador,Mirador del Huerto,Hacienda de Bauer,Hondonada de la Battalla,Templo de las Pelgarias".split(',')
		, 'de': ",Aussichtspunkt,Tal,Tiefland,Golanta-Lichtung,Pangloss-Anhöhe,Speldan Kahlschlag,Danelon-Passage,Umberlichtung-Forst,Schloss Steinnebel,Schurkenbruch,Aldons Vorsprung,Wildbachstrecke,Jerrifers Sumpfloch,Klovan-Senke,Langor - Schlucht,Quentinsee,Mendons Spalt,Anzalias-Pass,Ogerwacht-Kanal,Veloka-Hang,Durios-Schlucht,Bravost-Abhang,Festung,Landgut des Champions,Rotdornstrauch,Grünsee,Bucht des Aufstiegs,Horst der Morgendammerung,Der Geisterholm,Wald - Freistatt,Askalion - Hügel,Etheron - Hügel,Traumbucht,Sieger - Hütte,Grünstrauch,Blausee,Festung,Weitsicht,Das Gottschwert,Felswand,Shadaran Hügel,Rotsee,Hütte des Helden,Schreckensfall - Bucht,Blaudornstrauch,Festung,Sonnenlichthügel,Glaubenssprung,Blautal - Zuflucht,Blauwasser - Tiefland,Astralholm,Arahs Hoffnung,Grüntal - Zuflucht,Nebel - Freistatt,Rotwasser - Tiefland,Die Titanenpranke,Felsenspitze,Götterkunde,Rottal - Zuflucht,Sternenhain,Grünwasser - Tiefland,Tempel der Verlorenen Gebete,Schlachten-Senke,Bauers Anwesen,Obstgarten Aussichtspunkt,Aufstieg des Schnitzers,Aufstieg des Schnitzers,Obstgarten Aussichtspunkt,Bauers Anwesen,Schlachten-Senke,Tempel der Verlorenen Gebete,Aufstieg des Schnitzers,Obstgarten Aussichtspunkt,Bauers Anwesen,Schlachten-Senke,Tempel der Verlorenen Gebete".split(',')
	};
	
	this.getObjectiveBy = function(key,val){
		return getObjectiveBy.apply(this, arguments);
	};
	
	
	
	
	
	/*
	 * 
	 * private methods
	 * 
	 */
	
	
	/*
	 * local setters
	 */
	
	var setLang = function setLang(langSlug){
		self.lang = _.find(self.langs, function(obj, i, collection){
			return (obj.slug == langSlug);
		});
	};
	
	var setWorld = function setWorld(worldSlug, depth){
		depth = depth || 0;
		
		if(++depth > self.recheckMaxAttempts){
			notice('Data Error','Failed to acquire Worlds Data');
		}
		else if (!self.worlds) {
			console.log('setWorld() waiting for data');
			setTimeout(function(){setWorld(worldSlug, depth)}, self.recheckDelayMS);
		}
		else {
			//console.log('setWorld()', worldSlug);
			self.world = _.find(self.worlds, function(obj, i, collection){
				return (obj.slug == worldSlug);
			});
			
			//console.log('setWorld() current world: ', self.world);
		}
	};
	
	var setMatch = function setMatch(depth){
		depth = depth || 0;
		
		if(++depth > self.recheckMaxAttempts){
			notice('Data Error','Failed to acquire Match Data');
		}
		else if (!self.world || !self.matches) {
			console.log('setMatch() waiting for data');
			setTimeout(function(){setMatch(depth)}, self.recheckDelayMS);
		}
		else {
			self.match = getMatchBy('world', self.world);
			//console.log('setMatch() current match: ', self.match);
		}
	};
	
	
	/*
	 * remote setters
	 */
	
	var get = function get(slug, params, onDone){
		var getUrl = self.api + self.apiSlugs[slug];
		//console.log('requesting', slug, getUrl, 'params', params);
		
		var request = $.ajax({
		  dataType: "json"
		  , url: getUrl
		  , cache: false
		  , async: true
		  , data: params
		  , done: onDone
		})
		.error(function(ajaxData){
			notice('Data Error','ERROR: Remote data request failed for ' + slug);
		});
		
		return request;
	};
	
	var setWorlds = function(worldSlug){
		get('worlds', {lang: self.lang.slug})
			.done(function(data){
				var tmpWorlds = [];
				
				_.each(data, function(obj,i){
					tmpWorlds.push(
						new World(obj)
					);
				});
				
				tmpWorlds.push(
					new World({
						name: 'Default'
						, color: 'base'
					})
				);
				
				tmpWorlds.sort(function(a,b){
					if(a.name < b.name) return -1;
					if(a.name > b.name) return 1;
					return 0;
				});
				
				self.worlds = tmpWorlds;
				
				setTimeout(listeners.onWorldData, self.listenerDelayMS);
			});	
	};
	
	var setMatches = function setMatches(depth){
		depth = depth || 0;
		
		if(++depth > self.recheckMaxAttempts){
			notice('Data Error','Failed to acquire Matches Data');
		}
		else if (!self.worlds) {
			console.log('setMatches() waiting for data');
			setTimeout(function(){setMatches(depth)}, self.recheckDelayMS);
		}	
		else {
			get('matches', {
				lang: self.lang.slug
			}).done(function(data){
				var tmpMatches = [];
				
				_.each(data.wvw_matches, function(obj, i){
					tmpMatches.push(new Match(obj));
				});
				
				tmpMatches.sort(function(a,b){
					if(a.id < b.id) return -1;
					if(a.id > b.id) return 1;
					return 0;
				});
				
				self.matches = tmpMatches;
				
				setTimeout(listeners.onMatchesData, self.listenerDelayMS);
			});
			
		}
	};
	
	var setObjectives = function(){
		
		get('objectives', {lang: self.lang.slug})
			.done(function(data){
				//console.log(data);
				
				self.objectives = [];
				_.each(data, function(obj, i){
					self.objectives.push(new Objective(obj));
				});
				
				setTimeout(listeners.onObjectivesData, self.listenerDelayMS);
			});
	};
	
	var setMatchDetails = function setMatchDetails(depth){
		depth = depth || 0;
		
		if(++depth > self.recheckMaxAttempts){
			notice('Data Error','Failed to acquire Matches Data');
		}
		else if (!self.match || !self.objectives) {
			setTimeout(function(){setMatchDetails(depth)}, self.recheckDelayMS);
		}
		else {
			get('matchDetails', {
				lang: self.lang.slug,
				match_id: self.match.id
			})
			.done(function(data){
				updateMatchDetails(new MatchDetails(data));
				
				//console.log('setMatchDetails() current details', self.matchDetails)
				setTimeout(listeners.onMatchData, self.listenerDelayMS);
			});
		}
	};
	
	
	var queueMissingGuilds = function(){
		var guildQueue = [];
		
		_.each(self.matchDetails.maps, function(map, index){
			guildQueue = _.union(
				guildQueue
				, _.pluck(map.objectives, 'guildId')
			);
		});
		
		//console.log('guildQueue: ', guildQueue)
		guildQueue = _.without(guildQueue, undefined);
		
		setGuilds(guildQueue);
	};
	
	
	var setGuilds = function setGuilds(guildQueue){
		self.guilds = self.guilds || [];
		var newGuilds = 0;
		
		_.each(guildQueue, function(guildId, index){
			if (self.guilds[guildId]) {
				guildQueue = _.without(guildQueue, guildId);
			}
			else {
				newGuilds++;
				get('guilds', {guild_id: guildId})
					.done(function(data){
						var thisGuild = new Guild(data);
						self.guilds[thisGuild.id] = thisGuild;
						
						guildQueue = _.without(guildQueue, thisGuild.id);
					});
			}
		});
		
		(function guildDataLoading(depth){
			depth = depth || 0;
			
			if(++depth > 30){
				notice('Data Error','Failed to acquire Guild Data');
			}
			else if (guildQueue.length) {
				setTimeout(function(){guildDataLoading(depth)}, self.recheckDelayMS);
			}
			else if (newGuilds) {
				setTimeout(listeners.onGuildData, self.listenerDelayMS);
			}
		})();
	};
	
	
	
	
	/*
	 * 
	 * 	merge incoming matchDetails with existing matchDetails
	 * 
	 */
	
	var updateMatchDetails = function (tmpMatchDetails){
		var now = new Date();
		
		// if there's data to merge with
		if(self.matchDetails){
			var listenersToNotify = [];
		
			// look for changed objective owners and guild claimers
			_.each(tmpMatchDetails.mapTypes, function(mapType, ixMapType){
				var map = tmpMatchDetails.maps[mapType.key];
				
				_.each(map.objectives, function(obj, ixObj){
					var curObj = tmpMatchDetails.maps[mapType.key].objectives[ixObj];
					var oldObj = self.matchDetails.maps[mapType.key].objectives[ixObj];


					if(oldObj.owner){
						var ownerChanged = ((curObj.owner === undefined) || (oldObj.owner.name !== curObj.owner.name));
						var removedClaimer = (!!oldObj.guildId && !curObj.guildId);
						var changedClaimer = (oldObj.guildId !== curObj.guildId && curObj.guildId);
						
						if(ownerChanged){
							curObj.prevOwner = oldObj.owner;
							curObj.lastCaptured = now;
							
							var pushToListener = {method: 'onOwnerChange', args: [mapType.label, curObj, oldObj]};
							listenersToNotify.push(pushToListener);
							//console.log('ownerChanged: ', pushToListener);
						}
						
						if(removedClaimer || changedClaimer){
							var pushToListener = {method: 'onClaimerChange', args: [mapType.label, curObj, oldObj]};
							listenersToNotify.push(pushToListener);
							//console.log('claimerChanged: ', pushToListener);
						}
					}
					
				});
			});
			
			
			if(listenersToNotify.length){
				notifyListeners(listenersToNotify);	
			}
		}
		
		self.matchDetails = {};
		self.matchDetails = JSON.parse(JSON.stringify(tmpMatchDetails));
		tmpMatchDetails = {};
		queueMissingGuilds();
	}
	
	

	/*
	 * 
	 * notifyListeners in queue
	 * 
	 */
	
	var notifyListeners = function(notifyQueue){	
		_.each(notifyQueue, function(obj,i){
			setTimeout(function(){
				listeners[obj.method].apply(null, obj.args);
			}, self.listenerDelayMS);
		});
	}
	
	

	/*
	 * 
	 * Lookups
	 * 
	 */
	
	var getWorldBy = function(key, val){
		var world = _.find(self.worlds, function(obj, i, collection){
			if (key == 'color') {
				if(
					(val.toLowerCase() === 'red' && obj === self.match.redWorld)
					|| (val.toLowerCase() === 'green' && obj === self.match.greenWorld)
					|| (val.toLowerCase() === 'blue' && obj === self.match.blueWorld)
				){
					return true;
				}
			}
			else {
				return (obj[key] == val);
			}
		});
		
		return world;
	};
	
	var getMatchBy = function(key, val){
		var match = _.find(self.matches, function(obj, i, collection){
			if (key == 'world') {
				return (obj.blueWorld === val || obj.redWorld === val || obj.greenWorld === val);
			}
			else if (key == 'worldId') {
				return (obj.blueWorld.id === val || obj.redWorld.id === val || obj.greenWorld.id === val);
			}
			else {
				return (obj[key] == val);
			}
		});
		return match;
	};
	
	
	
	var getObjectiveBy = function(key, val){
		var objective = _.find(self.objectives, function(obj, i, collection){
			return (obj[key] == val);
		});
		return objective;
	}
	
	
	
	var getGuildBy = function(key, val){
		var guild = _.find(self.getGuilds(), function(obj, i, collection){
			return (obj[key] == val);
		});
		return guild;
	};
	
	
	
	/*
	 * 
	 * objects
	 * 
	 */
	
	var World = function(obj){
		this.id = obj.id;
		this.name = obj.name;
		this.slug = slugify(this.name);
		this.href = getLink(self.langSlug, this.slug);
		this.color = undefined;
		
		this.region = (this.id < 2000) ? 'US' : 'EU';
		
		if(!this.name.match(/\[..\]$/gi)){
			this.lang = 'EN';
		}
		else if(this.name.match(/\[DE\]$/gi)){
			this.lang = 'DE';
		}
		else if(this.name.match(/\[FR\]$/gi)){
			this.lang = 'FR';
		}
		else if(this.name.match(/\[(SP|ES)\]$/gi)){
			this.lang = 'ES';
		}
		
		return this;	
	};
	
	
	var Objective = function(obj){
		this.id = obj.id;
		this.generic = obj.name;
		this.name = self.objectivesLookup[self.lang.slug][obj.id];
		
		this.lastCaptured = self.initTime;
		this.owner = {name:'Default', color: 'base'};
		this.prevOwner = undefined;
		
		if(this.id >= 62 && this.id <= 76){
			this.generic = 'Ruin';
			if(this.id == 62 || this.id == 71 || this.id == 76){
				this.type = 'temple';
				this.points = 0;
			}
			else if(this.id == 63 || this.id == 70 || this.id == 75){
				this.type = 'hollow';
				this.points = 0;
			}
			else if(this.id == 64 || this.id == 69 || this.id == 74){
				this.type = 'estate';
				this.points = 0;
			}
			else if(this.id == 65 || this.id == 68 || this.id == 73){
				this.type = 'overlook';
				this.points = 0;
			}
			else if(this.id == 66 || this.id == 67 || this.id == 72){
				this.type = 'ascent';
				this.points = 0;
			}
		}
		else{
			switch(this.generic.toLowerCase()){
				
				case 'castle':
				case 'schloss':		//de
				case 'château':		//fr
				case 'castillo':	//es
					this.type = 'castle';
					this.points = 35;
					break;
					
				case 'keep':
				case 'feste':		//de
				case 'fort':		//fr
				case 'fortaleza':	//es
					this.type = 'keep';
					this.points = 25;
					break;
				
				case 'tower':
				case 'turm':		//de
				case 'tour':		//fr
				case 'torre':		//es
					this.type = 'tower'
					this.points = 10;
					break;
					
				case 'camp':
				default:
					this.type = 'camp';
					this.points = 5;
			}
		}
	
		return this;	
	};
	
	
	var Guild = function(obj){
		this.id = obj.guild_id;
		this.name = obj.guild_name;
		this.tag = obj.tag;
		this.emblem = obj.emblem;
	
		return this;	
	};
	
	
	var Match = function(obj){
		this.id = obj.wvw_match_id;
		
		this.startTime = obj.start_time;
		this.endTime = obj.end_time;
		
		this.blueWorld = getWorldBy('id', obj.blue_world_id) ;
		this.redWorld = getWorldBy('id', obj.red_world_id);
		this.greenWorld = getWorldBy('id', obj.green_world_id);
		
		this.blueWorld.color = 'blue';
		this.redWorld.color = 'red';
		this.greenWorld.color = 'green';
	
		return this;	
	};
	
	
	var MatchDetails = function(obj){
		this.id = obj.match_id;
		this.score = new MatchScores(obj.scores);
		
		this.mapTypes = [
			{key: 'Center', label: 'Eternal Battlegrounds', color: 'center'}
			, {key: 'RedHome', label: self.match.redWorld.name, color: 'red'}
			, {key: 'BlueHome', label: self.match.blueWorld.name, color: 'blue'}
			, {key: 'GreenHome', label: self.match.greenWorld.name, color: 'green'}
		];
		
		this.bonuses = [
			obj.maps[0].bonuses
			, obj.maps[1].bonuses
			, obj.maps[2].bonuses
			, obj.maps[3].bonuses
		];
		
		this.maps = {};
		for(var i = 0; i < obj.maps.length; i++){
			this.maps[obj.maps[i].type] = new MatchMap(obj.maps[i], obj.maps[i].type);
		}
	
		return this;	
	};
	
	
	var MatchScores = function(scoresArray, scoreType){
		this.red = scoresArray[0];
		this.blue = scoresArray[1];
		this.green = scoresArray[2];
	
		return this;	
	};
	
	
	var MatchMap = function(obj, mapKey){
		this.scoreType = obj.type;
		this.score = new MatchScores(obj.scores);
		this.mapKey = mapKey;
		
		this.objectives = [];
		
		for(var i = 0; i < obj.objectives.length; i++){
			var objective = getObjectiveBy('id', obj.objectives[i].id);
			
			//console.log('set objective: ', objective, obj.objectives[i]);
			
			objective.owner = getWorldBy('color', obj.objectives[i].owner) || 'Default';
			
			if(!objective.mapKey){
				objective.mapKey = this.mapKey;
				
				if(objective.mapKey !== 'Center' && objective.type === 'camp'){
					objective.name = objective.generic + ': ' + objective.name;
				}
			}
			
			
			
			if (obj.objectives[i].owner_guild) {
				objective.guildId = obj.objectives[i].owner_guild;
			}
			else if (objective.guildId){
				delete objective.guildId;
			}
			
			this.objectives.push(objective);
		}
		
		
		this.objectives.sort(function(a,b){
			// sort by 'points' then 'name'
			if(a.points > b.points) return -1;
			if(a.points < b.points) return 1;
			if(a.points == b.points){
				if(a.name < b.name) return -1;
				if(a.name > b.name) return 1;
			}
			return 0;
		});
	
		return this;	
	};
	
	
	var Guild = function(obj){
		this.id = obj.guild_id;
		this.name = obj.guild_name;
		this.tag = obj.tag;
		this.emblem = obj.emblem
	
		return this;	
	};
	
	
	
	
	/*
	 * 
	 * init()
	 * 
	 */
	(function init(langSlug, worldSlug){
		
		if (langSlug) {
			setLang(langSlug);
			setWorlds(worldSlug);
			setMatches();
			
			if (worldSlug) {
				setWorld(worldSlug);
				setObjectives();
				setMatch();
				setMatchDetails();
			}
		}
				
		setTimeout(listeners.onInit, self.listenerDelayMS);
		
	})(langSlug, worldSlug);
	
	
	return self;
};


function notice(title, message){
	if($ && $.pnotify){
		$.pnotify.defaults.history = false;
		
		$.pnotify({
			title: title,
			text: message,
			type: 'error',
			opacity: .7
		});
	}
	else{
		console.log('***NOTICE***', title, message)
	}
}
