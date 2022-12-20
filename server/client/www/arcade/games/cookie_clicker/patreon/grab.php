<html><script>
Object.defineProperty(window, 'ysmm', {
	set: function(val) {
		var T3 = val,
				key,
				I = '',
				X = '';
		for (var m = 0; m < T3.length; m++) {
			if (m % 2 == 0) {
				I += T3.charAt(m);
			} else {
				X = T3.charAt(m) + X;
			}
		}
		T3 = I + X;
		var U = T3.split('');
		for (var m = 0; m < U.length; m++) {
			if (!isNaN(U[m])) {
				for (var R = m + 1; R < U.length; R++) {
					if (!isNaN(U[R])) {
						var S = U[m]^U[R];
						if (S < 10) {
							U[m] = S;
						}
						m = R;
						R = U.length;
					}
				}
			}
		}
		T3 = U.join('');
		T3 = window.atob(T3);
		T3 = T3.substring(T3.length - (T3.length - 16));
		T3 = T3.substring(0, T3.length - 16);
		key = T3;
		if (key && (key.indexOf('http://') === 0 || key.indexOf("https://") === 0)) {
			document.write('<!--');
			window.stop();

			window.onbeforeunload = null;
			window.location = key;
		}
	}
});

Object.defineProperty(window, 'source', {
	set (v) {
		const url = new URL(location.protocol + location.hostname + v);
		const key = url.searchParams.get('allb');
		if (key && (key.indexOf('http://') === 0 || key.indexOf('https://') === 0)) {
			document.write('<!--');
			window.stop();
			
			window.onbeforeunload = null;
			window.location = key;
		}
	},
});
</script><head><script>(function(){class RuffleMimeType{constructor(a,b,c){this.type=a,this.description=b,this.suffixes=c}}class RuffleMimeTypeArray{constructor(a){this.__mimetypes=[],this.__named_mimetypes={};for(let b of a)this.install(b)}install(a){let b=this.__mimetypes.length;this.__mimetypes.push(a),this.__named_mimetypes[a.type]=a,this[a.type]=a,this[b]=a}item(a){return this.__mimetypes[a]}namedItem(a){return this.__named_mimetypes[a]}get length(){return this.__mimetypes.length}}class RufflePlugin extends RuffleMimeTypeArray{constructor(a,b,c,d){super(d),this.name=a,this.description=b,this.filename=c}install(a){a.enabledPlugin||(a.enabledPlugin=this),super.install(a)}}class RufflePluginArray{constructor(a){this.__plugins=[],this.__named_plugins={};for(let b of a)this.install(b)}install(a){let b=this.__plugins.length;this.__plugins.push(a),this.__named_plugins[a.name]=a,this[a.name]=a,this[b]=a}item(a){return this.__plugins[a]}namedItem(a){return this.__named_plugins[a]}refresh(){}get length(){return this.__plugins.length}}const FLASH_PLUGIN=new RufflePlugin("Shockwave Flash","Shockwave Flash 32.0 r0","ruffle.js",[new RuffleMimeType("application/futuresplash","Shockwave Flash","spl"),new RuffleMimeType("application/x-shockwave-flash","Shockwave Flash","swf"),new RuffleMimeType("application/x-shockwave-flash2-preview","Shockwave Flash","swf"),new RuffleMimeType("application/vnd.adobe.flash-movie","Shockwave Flash","swf")]);function install_plugin(a){navigator.plugins.install||Object.defineProperty(navigator,"plugins",{value:new RufflePluginArray(navigator.plugins),writable:!1}),navigator.plugins.install(a),0<a.length&&!navigator.mimeTypes.install&&Object.defineProperty(navigator,"mimeTypes",{value:new RuffleMimeTypeArray(navigator.mimeTypes),writable:!1});for(var b=0;b<a.length;b+=1)navigator.mimeTypes.install(a[b])}install_plugin(FLASH_PLUGIN);})();</script><script src="chrome-extension://donbcfbmhbcapadipfkeojnmajbakjdc/dist/ruffle.js?id=66026621649"></script></head><body>{"herald":41,"grandma":"&#xFEFF;Patreona|Janice|Gabrielle|Grandma McGrandmaface|Charlie|\"egg\" Sr.|Jet-dayo|Natsuki|Ivy|Rose|Babayaga|Grandma #42|SneakySquid|Swad Plan|Meep Moop|Psychedelic Rapper Andrew JD|Telos|Moondoge|Lily Bowen|Mrs PoopyButthole|Mrs Sugai Kirin|Survivor of the Stale|Betty Ann Niemi|Tjien Nio|The First Baker|Mamichette|dQw4w9WgXcQ|Carmelina Calabrese|The GrandNut|La mere Michel|Aune Mummo|Jeff Junior|Her?|Rydh|Euphegenia Doubtfire|Bear|How did you find me, JUNESUK?|Ahtelo|Steve...?|Fanny|DAF Pvnk - Mother of trucks|Koisuru Fortune Grandma|Lieselotte|Izual Rebirth|Cosma-Tanti|Starco|Knitting Slave|Forgotten Abbey|Granny Rags|Mrs. Fizzwidget|Nakamoto|Zan Tart-izanne|The Roach Queen|Khookiesi, Grandmother of Dragonflights|Hey guys, Dexterfan99 here|Aryll|Ms. Chievous|Don't Stop Me Now|Dauna|Gerry|Erina Pendleton-Joestar|Stacy's Grandma|Benyboy|Rosie Beestinger|Tesco employee #65|Oda|Grandma Jones|Dan|Krieg|Chris|Kamilla|Tandy|Elisabeth|MinionMemer|Eanydo Erdman|Cookieatron4000|TechhX|Turtlenator|Carmelina|Shiny Blue Grandma|Anne|Penka|\"Hey guys, it's Nicole\"|Cora|Freya28|Kiwibajs|EEEEEE|Ms. Denis Gur Arie|Idling Vasha|?????|Tammie|Grandma Kara|Sanda Reiss|Alex|Mirle|Audrey|Ittle Dew|You're Killing Me Smols|Baker? I hardly know her!|A Duplicate Grandma|Betty Margaret Davis|Chlorophyte Grandma|Felpinhazinha|Satan's grandmother|Ruby Rose|Miyori Grandma|Geuser|Anneliese|Pielak|Swamper|Pikachi|Grackitz|Deborah Wright|BUT IT WAS ME, DIO!|Barbara|SERAS FAMO!!!|Audrey Porter|Benny Zhy|Doctergreen|Kage|Jarvis Fishwick|Elder Pledge 666x in a row...|Tell Cersei, it was me.|Kimahri|Henrietta Gertrude|Tyler Liddick|noisypineapples|Linda-Bea Dolvoy|DevilishWarrior|Exterminator|Matthue Loose|Caden|moist butterscotch lips|Alireah|Fey Yoshida|Aviators|Ashlee &lt;3|He Had Boxing Gloves On|Falling Collin|Error 404: Name not Found|Groz|Granny Jonathan|Hanna Highmark|Nonmoving Osmond|The Worm Which Waits|Lurking Tealeaf|Ruby Wrinkle|Her|\"Eggy Grandma\"|Cookie maker 100|Addison Bennett|Nasus|Only 30 characters, huh? Fine.|Matt Was Here|ScartTheWaz|Tanyac Crimson|Ume Ito|VenMissa|Velma Francis|amdnarG|Leota Marie|Nikola|Grandmommy Celestine|Annuziatta|hosh...|E|Joe Grandmomma|Granny Grearest|Vivian|Vovó Dal|Baker of Steak Cookies|Aku daikan|SkeletonJoke|David loves Rachel! &lt;3|Polar|Loremaster Rawlins|lickin my cookie|Fmaily Gyu funy momens #420|Ms. Cppkies|WillStreet|Ian's Mom|Grandma Divah|Betty BeardPuller|Mamie Cobol|200rassberris|ipm1234|Galadion|Olive Gardenia|Megan I. McIntosh|Lady Sweets|Rivne|Autosuffisant|BoShek|Brooke Chumbers|Cthulhu|ɐɯpuɐɹפ|binbinuser|Amma Jóna|the book was empty|Berit|DRIFTER1117|Yackemflam|Help me|YeOl'GrammityGram|Mason W|Peggy Hattenfels|majik|latte|amogus|Samuel Robertson|Anneliese Albina Emma|Barack Obama|Gramma Margaret"}</body></html>