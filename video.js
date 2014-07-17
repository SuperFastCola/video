(function(win){

		if(!window.console) console = {log:function(){}};

		//public instance variable 
		Video.prototype.holder = false;
		Video.prototype.video_playing = false;
		Video.prototype.hiddenClass = "hidden";
		Video.prototype.poster = false;
		Video.prototype.vimeo = false;
		Video.prototype.changeExtension = true;
		Video.prototype.youtube = false;
		Video.prototype.override = false;
		Video.prototype.flashVersion = 9;
		Video.prototype.flashVersionMessage = "<h2>This Video Requires Flash Player Version " + Video.prototype.flashVersion + "</h2>";

		//static class variable declared once for the class type
		Video.prototype.playHTML5 = false;

		//initial constructor for game
		function Video(width,height,container,autoplay,hiddenClass){
			var _width = width;
			var _height = height;
			var _container = container;
			var _autoplay = (typeof autoplay != "undefined")?true:false;
			this.hiddenClass = (typeof hiddenClass != "undefined")?hiddenClass:"hidden";

			if(typeof window.HTMLVideoElement != "undefined"){
				this.playHTML5 = true;
			}

			//getter functions
			this.getWidth = function(){ return _width;};
			this.getHeight = function(){ return _height;};

			this.setOverride = function(val){
				if(val){
					this.playHTML5 = false;
				}
				else{
					this.playHTML5 = true;
				}
			}

			this.setWidth = function(val){ 
				_width = val; 
				this.holder.width = val;
			};
			this.setHeight = function(val){
				_height = val; 
				this.holder.height = val;
			};

			this.checkForFlash = function(minimumFlashVersion){
				//http://www.matthewratzloff.com/blog/2007/06/26/detecting-plugins-in-internet-explorer-and-a-few-hints-for-all-the-others/#flash-player
				var isInstalled = false;
				var version = null;

				if(window.ActiveXObject){
				  var control = null;
				  try{
				    control = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				  }catch(e) {
				    return false;
				  }

				  if(control){
				    isInstalled = true;
				    version = control.GetVariable('$version').substring(4);
				    version = version.split(',');
				    version = parseFloat(version[0] + '.' + version[1]);
				    return true;
				  }
				}
				else {
				  // Check navigator.plugins for "Shockwave Flash"
				  return false;
				}
			}

			this.getContainer = function(){ return _container;};

			this.getAutoPlay = function(){return _autoplay;};

			this.attachVideo = function(val,types){				
				if(Boolean(this.vimeo) && !this.playHTML5){
					this.createVimeo(this.vimeo);
				}
				else if(this.playHTML5){
					this.createHTMLVideo(val,types);
				}
				else{
					alert("Video Cannot Play");
				}
			}//end setSource

			//this.getFallBack = function(){ return _fallback;};
			//this.setFallBack = function(val){ _fallback = val;};

			this.createVimeo = function(vimeoID){

				var ie78 = new RegExp(/msie\s(7|8)/i);

				if(this.checkForFlash(this.flashVersion)){

					if(ie78.exec(navigator.userAgent)){
						this.holder = document.createElement('<iframe src="https://player.vimeo.com/video/' +  vimeoID + '?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1&amp;api=1" width="' + this.getWidth()  +  '" height="' + this.getHeight()  +  '"  id="subvideo" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
						document.getElementById(this.getContainer()).className = "";
					}
					else{
						this.holder = document.createElement("iframe");
						this.holder.width = this.getWidth();
						this.holder.height =  this.getHeight();
						this.holder.id =  "subvideo";
						this.frameborder= 0;
						this.webkitAllowFullScreen = true;
						this.mozallowfullscreen = true;
						this.allowFullScreen = true;
						this.holder.src = "https://player.vimeo.com/video/"+ vimeoID + "?&api=1" + ((this.getAutoPlay())?"&autoplay=1":"");
						//this.vimeoListener();
					}

					this.appendVideoToParent();
				}
				else{
					document.getElementById(this.getContainer()).innerHTML = this.flashVersionMessage;
				}
			}

			this.createHTMLVideo = function(val,types){

				//types needs to be an array

				var moviefile = (this.changeExtension)?(String(val).replace(/\.\w{3}/,"")):val;
				this.holder = document.createElement("video"); 

				this.holder.width = this.getWidth();
				this.holder.height =  this.getHeight();
				this.holder.id =  "subvideo";
				this.holder.preload = "auto";
				this.holder.controls = true;

				if(this.getAutoPlay()){
					this.holder.autoplay = true;
				}

				if(this.poster){
					this.holder.poster = this.poster;
					this.holder.style.backgroundImage = 'url(' + this.poster + ')';
				}

				var sourceObjects = new Array();

				for(var i in types){

					var vtype = String(types[i]).toLowerCase();
					var source = document.createElement("source");
					
					switch(vtype){
						case 'mp4':
							source.src = (this.changeExtension)?(moviefile + ".mp4"):moviefile;
							source.type = "video/mp4";
						break;

						case 'webm':
							source.src = (this.changeExtension)?(moviefile + ".webm"):moviefile;
							source.type = "video/webm";
						break;

						case 'ogv':
							source.src = (this.changeExtension)?(moviefile + ".ogv"):moviefile;
							source.type = "video/ogg";
						break;
					}
					
					this.holder.appendChild(source);
				}

				var noVideo = document.createTextNode("Your browser does not support the video tag.");
				this.appendVideoToParent();


				//add kill video event
				window.Video.killVideo = this.killVideo.bind(this);
				this.holder.addEventListener("ended",window.Video.killVideo);
			}

		}


		//public function to attach game to parnet object
		Video.prototype.appendVideoToParent = function(){
			if(this.holder){
				var hldr = document.getElementById(this.getContainer());
				
				if(!this.video_playing){
					hldr.appendChild(this.holder);
					this.video_playing = true;
				}

				document.getElementById(this.getContainer()).className = "";
			}
		}


		//public function to attach game to parnet object
		Video.prototype.playVideo = function(evt){
			if(this.playHTML5 && this.holder){
				this.holder.play();
			}
		}

		//public function to attach game to parnet object
		Video.prototype.stopVideo = function(evt){
			if(this.playHTML5 && this.holder){
				this.holder.pause();
			}
		}

		//public function to attach game to parnet object
		Video.prototype.killVideo = function(evt){

			if(this.holder){
				var hldr = document.getElementById(this.getContainer());
				var subvideo = document.getElementById("subvideo");

				if(typeof subvideo != "undefined"){
					hldr.removeChild(subvideo);
				}

				hldr.className = this.hiddenClass;

				this.holder = null;
				this.video_playing = false;

				if(this.vimeo){
		    		this.removeVimeoListeners();
		    	}
			}

		}


		//https://developer.vimeo.com/player/js-api#universal-with-froogaloop
		Video.prototype.vimeoListener = function(){
			
			// Listen for messages from the player
			if (window.addEventListener){
			    window.addEventListener('message', this.vimeoMessageReceived, false);
			}
			else {
			    window.attachEvent('onmessage', this.vimeoMessageReceived, false);
			}
			
			document.getElementById(this.getContainer()).className = "";

			window.Video.vimeoReady = this.vimeoReady.bind(this);
			window.Video.vimeoProgress = this.vimeoProgress.bind(this);
			window.Video.vimeoPaused = this.vimeoPaused.bind(this);
			window.Video.vimeoFinished = this.vimeoFinished.bind(this);
		}
		// Handle messages received from the player
		Video.prototype.vimeoMessageReceived = function(e) {
		   	try{
			    var data = JSON.parse(e.data);
			    
			    switch(data.event) {
			        case 'ready':
						this.Video.vimeoReady();
			            break;
			           
			        case 'playProgress':
			            this.Video.vimeoProgress(data.data);
			            break;
			            
			        case 'pause':
			            this.Video.vimeoPaused();
			            break;
			           
			        case 'finish':
			            this.Video.vimeoFinished();
			            break;
			    }
			}
			catch(e){
				console.log(e);
			}
		}

		// Helper function for sending a message to the player
		Video.prototype.postToVimeo = function(action, value){

		    var data = { method: action };
		    var vid = document.getElementById("subvideo");
		    var vidurl = vid.src.split('?')[0];
		    if (value) {
		        data.value = value;
		    }
		    vid.contentWindow.postMessage(JSON.stringify(data), vidurl);
		}
		
		Video.prototype.vimeoReady = function(){
			console.log("Video Ready");
		    this.postToVimeo('addEventListener', 'pause');
		    this.postToVimeo('addEventListener', 'finish');
		    this.postToVimeo('addEventListener', 'playProgress');
		}

		Video.prototype.vimeoPaused = function() {
		    console.log('paused');
		}

		Video.prototype.vimeoFinished = function() {
		    console.log('finished');
		    this.killVideo();
		}

		Video.prototype.vimeoProgress = function(data) {
			if(data.seconds>0){
				 console.log(data.seconds);
			}
		}

		Video.prototype.removeVimeoListeners = function(){
			if (window.removeEventListener){
			    window.removeEventListener('message', this.vimeoMessageReceived, false);
			}
			else {
			    window.detachEvent('onmessage', this.vimeoMessageReceived, false);
			}
		}

		win.Video = Video;

}(window));
