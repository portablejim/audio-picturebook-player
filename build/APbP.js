apbp={};apbp.version="0.1";apbp.playerIndex=0;(function(e){apbp.apbpDefaults={poster:"",showPosterWhenEnded:false,defaultWidth:480,defaultHeight:270,width:-1,height:-1,aspectRatio:"12:9",defaultSeekBackwardInterval:function(e){return e.duration*.05},defaultSeekForwardInterval:function(e){return e.duration*.05},setDimensions:true,startVolume:.8,loop:false,autoRewind:true,enableAutosize:true,timeFormat:"",alwaysShowHours:false,showTimecodeFrameCount:false,framesPerSecond:25,autosizeProgress:true,alwaysShowControls:false,clickToPlayPause:true,features:["playpause","current","progress","duration","tracks","volume","fullscreen"],hidableControls:true,enableKeyboard:true,pauseOtherPlayers:true,hideVolumeOnTouchDevices:true,loopPlaylist:false,audioVolume:"horizontal",muteText:mejs.i18n.t("Mute Toggle"),allyVolumeControlText:mejs.i18n.t("Use Up/Down Arrow keys to increase or decrease volume."),playText:mejs.i18n.t("Play"),pauseText:mejs.i18n.t("Pause"),nextText:"Next Track",prevText:"Previous Track",fullscreenText:"Fullscreen",keyActions:[{keys:[32,179],action:function(e,a){if(a.paused||a.ended){a.play()}else{a.pause()}}},{keys:[38],action:function(e,a){e.container.find(".apbp-volume-slider").css("display","block");if(e.hidableControls){e.startControlsTimer()}var t=Math.min(a.volume+.1,1);a.setVolume(t)}},{keys:[40],action:function(e,a){e.container.find(".apbp-volume-slider").css("display","block");if(e.hidableControls){e.startControlsTimer()}var t=Math.max(a.volume-.1,0);a.setVolume(t)}},{keys:[37,227],action:function(e,a){if(!isNaN(a.duration)&&a.duration>0){if(e.hidableControls){e.startControlsTimer()}var t=Math.max(a.currentTime-e.options.defaultSeekBackwardInterval(a),0);a.setCurrentTime(t)}}},{keys:[39,228],action:function(e,a){if(!isNaN(a.duration)&&a.duration>0){if(e.hidableControls){e.startControlsTimer()}var t=Math.min(a.currentTime+e.options.defaultSeekForwardInterval(a),a.duration);a.setCurrentTime(t)}}},{keys:[70],action:function(e,a){if(typeof e.enterFullScreen!="undefined"){if(e.isFullScreen){e.exitFullScreen()}else{e.enterFullScreen()}}}},{keys:[77],action:function(e,a){e.container.find(".apbp-volume-slider").css("display","block");if(e.hidableControls){e.startControlsTimer()}if(e.media.muted){e.setMuted(false)}else{e.setMuted(true)}}}]};apbp.playerIndex=0;apbp.players={};apbp.audioPicturebookPlayer=function(a,t){if(!(this instanceof apbp.audioPicturebookPlayer)){return new apbp.audioPicturebookPlayer(a,t)}var i=this;i.$media=i.$node=e(a);i.node=i.media=i.$media[0];if(!i.node){return}if(typeof i.node.player!="undefined"){return i.node.player}if(typeof t=="undefined"){t=i.$node.data("mejsoptions")}i.options=e.extend({},apbp.apbpDefaults,t);if(!i.options.timeFormat){i.options.timeFormat="mm:ss";if(i.options.alwaysShowHours){i.options.timeFormat="hh:mm:ss"}if(i.options.showTimecodeFrameCount){i.options.timeFormat+=":ff"}}mejs.Utility.calculateTimeFormat(0,i.options,i.options.framesPerSecond||25);i.id="apbp_"+apbp.playerIndex++;apbp.players[i.id]=i;i.init();return i};apbp.audioPicturebookPlayer.prototype={hasFocus:false,controlsAreVisible:true,init:function(){var a=this,t=mejs.MediaFeatures;meOptions=e.extend(true,{},a.options,{success:function(e,t){a.apbpReady(e,t)},error:function(e){a.handleError(e)}}),tagName=a.media.tagName.toLowerCase();a.isVideo=false;a.$media.removeAttr("controls");var i=mejs.i18n.t("Audio Player");e('<span class="apbp-offscreen">'+i+"</span>").insertBefore(a.$media);a.container=e('<div id="'+a.id+'" class="apbp-container '+(mejs.MediaFeatures.svgAsImg?"svg":"no-svg")+" mep-paused"+'" tabindex="0" role="application" aria-label="'+i+'">'+'<div class="apbp-clear"></div>'+'<div class="apbp-inner">'+'<div class="apbp-mediaelement"></div>'+'<div class="apbp-layers">'+'<div class="apbp-poster apbp-layer"></div>'+'<div class="apbp-images apbp-layer"></div>'+'<div class="apbp-paused-overlay apbp-layer">'+'<span class="apbp-overlay-image-button"></span>'+"</div>"+'<div class="apbp-control-overlay apbp-layer">'+'<div class="apbp-control-overlay-left"><span class="apbp-overlay-image-button"></span></div>'+'<div class="apbp-control-overlay-center"><span class="apbp-overlay-image-button"></span></div>'+'<div class="apbp-control-overlay-right"><span class="apbp-overlay-image-button"></span></div>'+"</div>"+"</div>"+'<div class="apbp-controls"></div>'+"</div>"+"</div>").addClass(a.$media[0].className).insertBefore(a.$media).focus(function(e){if(!a.controlsAreVisible){var t=a.container.find(".apbp-playpause-button > button");t.focus()}});a.container.addClass((t.isAndroid?"apbp-android ":"")+(t.isiOS?"apbp-ios ":"")+(t.isiPad?"apbp-ipad ":"")+(t.isiPhone?"apbp-iphone ":""));if(t.isiOS){var s=a.$media.clone();a.container.find(".apbp-mediaelement").append(s);a.$media.remove();a.$node=a.$media=s;a.node=a.media=s[0]}else{a.container.find(".apbp-mediaelement").append(a.$media)}a.node.player=a;a.controls=a.container.find(".apbp-controls");a.layers=a.container.find(".apbp-layers");meOptions.pluginWidth=a.width;meOptions.pluginHeight=a.height;a.media=mejs.MediaElement(a.$media[0],meOptions);a.calculatePlayerHeight(a.layers);addEvent("resize",window,function(){a.calculatePlayerHeight(a.layers)},true);a.modcontrollayer(a,a.container.find(".apbp-control-overlay"));var n=function e(t){a.resetControlsTimeout(a.controls)};e(a.controls).on("mousemove",n);e(a.controls).on("mousedown",n);if(a.options.features.includes("progress")){a.controls.append('<div class="apbp-progress">'+'<div class="apbp-progress-loaded" />'+'<div class="apbp-progress-current" />'+'<span class="apbp-time-float" style="display: none;">'+'<span class="apbp-time-float-current">00:00</span>'+'<span class="apbp-time-float-corner"></span>'+"</span>"+"</div>")}var o=e('<div class="apbp-control-buttons" />');a.controls.append(o);this.buildprevtrack(this,o,this.layers,this.media);this.buildplaypause(this.player,o,this.layers,this.media);this.buildnexttrack(this,o,this.layers,this.media);o.append('<span class="apbp-controls-timestamp"><span class="apbp-timestamp-current">00:00</span> / <span class="apbp-timestamp-total"></span></span>');o.append('<span class="apbp-controls-spacer"></span>');a.buildvolume(a,o,a.layers,a.$media[0]);a.buildprogressbar(this,a.controls,a.media);this.buildaudiofullscreen(this,o,this.layers,this.media);a.genPlaylist(a,o,a.layers,a.$media[0]);a.loaded=a.controls.find(".apbp-progress-loaded");a.total=a.controls.find(".apbp-progress-current");e(a.media).on("progress",function(e){this.player.updateCurrent();this.player.updateTotal()});e(a.media).on("timeupdate",function(e){this.player.updateSlides(a.media,a.layers.find(".apbp-images"),e.currentTime)})},calculatePlayerHeight:function(e){var a=this.options.aspectRatio.split(":");var t=a[1]/a[0];var i=e.width()*t;this.controls.removeClass("apbp-vanishing");this.controls.removeClass("apbp-vanishing-visible");this.controlsAreVisible=true;if(this.isFullScreen){e.height("");if(window.innerHeight-this.controls.height()>i){e.height(window.innerHeight-this.controls.height())}else{e.height("100%");this.controls.addClass("apbp-vanishing");this.resetControlsTimeout(this.controls)}}else{e.height(e.width()*t)}},setPlayerHeight:function(e,a){if(!this.options.setDimensions){return false}if(typeof a!="undefined"){e.height=a}},buildvolume:function(a,t,i,s){if((mejs.MediaFeatures.isAndroid||mejs.MediaFeatures.isiOS)&&this.options.hideVolumeOnTouchDevices)return;var n=this,o=n.options.audioVolume,l=o=="horizontal"?e('<span class="apbp-button apbp-volume-button apbp-mute">'+'<button type="button" aria-controls="'+n.id+'" title="'+n.options.muteText+'" aria-label="'+n.options.muteText+'"><i class="fa "></i></button>'+"</span>"+'<span class="apbp-horizontal-volume-slider" tabindex="0">'+'<span class="apbp-offscreen">'+n.options.allyVolumeControlText+"</span>"+'<div class="apbp-horizontal-volume-total"></div>'+'<div class="apbp-horizontal-volume-current"></div>'+'<div class="apbp-horizontal-volume-handle"></div>'+"</span>").appendTo(t):e('<span class="apbp-button apbp-volume-button apbp-mute">'+'<button type="button" aria-controls="'+n.id+'" title="'+n.options.muteText+'" aria-label="'+n.options.muteText+'"></button>'+'<span class="apbp-volume-slider" tabindex="0">'+'<span class="apbp-offscreen">'+n.options.allyVolumeControlText+"</span>"+'<div class="apbp-volume-total"></div>'+'<div class="apbp-volume-current"></div>'+'<div class="apbp-volume-handle"></div>'+"</span>"+"</span>").appendTo(t),r=n.container.find(".apbp-volume-slider, .apbp-horizontal-volume-slider"),p=n.container.find(".apbp-volume-total, .apbp-horizontal-volume-total"),d=n.container.find(".apbp-volume-current, .apbp-horizontal-volume-current"),u=n.container.find(".apbp-volume-handle, .apbp-horizontal-volume-handle"),c=function(e,a){if(!r.is(":visible")&&typeof a=="undefined"){r.show();c(e,true);r.hide();return}e=Math.max(0,e);e=Math.min(e,1);if(e===0){l.removeClass("apbp-mute").addClass("apbp-unmute");l.children("button").attr("title",mejs.i18n.t("Unmute")).attr("aria-label",mejs.i18n.t("Unmute"))}else{l.removeClass("apbp-unmute").addClass("apbp-mute");l.children("button").attr("title",mejs.i18n.t("Mute")).attr("aria-label",mejs.i18n.t("Mute"))}var t=p.position();if(o=="vertical"){var i=p.height(),s=i-i*e;u.css("top",Math.round(t.top+s-u.height()/2));d.height(i-s);d.css("top",t.top+s)}else{var n=p.width(),f=n*e;u.css("left",Math.round(t.left+f-u.width()/2));d.width(Math.round(f))}},f=function(e){var a=null,t=p.offset();if(o==="vertical"){var i=p.height(),n=e.pageY-t.top;a=(i-n)/i;if(t.top===0||t.left===0){return}}else{var l=p.width(),r=e.pageX-t.left;a=r/l}a=Math.max(0,a);a=Math.min(a,1);c(a);if(a===0){s.setMuted(true)}else{s.setMuted(false)}s.setVolume(a)},b=false,m=false;l.hover(function(){r.show();m=true},function(){m=false;if(!b&&o=="vertical"){r.hide()}});var h=function(e){var a=Math.floor(s.volume*100);r.attr({"aria-label":mejs.i18n.t("volumeSlider"),"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":a,"aria-valuetext":a+"%",role:"slider",tabindex:0})};r.bind("mouseover",function(){m=true}).bind("mousedown",function(e){f(e);n.globalBind("mousemove.vol",function(e){f(e)});n.globalBind("mouseup.vol",function(){b=false;n.globalUnbind(".vol");if(!m&&o=="vertical"){r.hide()}});b=true;return false}).bind("keydown",function(e){var a=e.keyCode;var t=s.volume;switch(a){case 38:t+=.1;break;case 40:t=t-.1;break;default:return true}b=false;c(t);s.setVolume(t);return false}).bind("blur",function(){r.hide()});l.find("button").click(function(){s.setMuted(!s.muted)});l.find("button").bind("focus",function(){r.show()});e(s).on("volumechange",function(e){if(!b){if(s.muted){c(0);l.removeClass("apbp-mute").addClass("apbp-unmute")}else{c(s.volume);l.removeClass("apbp-unmute").addClass("apbp-mute")}}h(e)});if(a.options.startVolume===0){s.setMuted(true)}if(s.pluginType==="native"){s.setVolume(a.options.startVolume)}e(n.container).on("controlsresize",function(){c(s.volume)})},changePoster:function(e){var a=this;a.layers.find(".apbp-poster").css("background-image",'url("'+e+'")');a.layers.find(".apbp-poster").show()},changeSlides:function(a,t,i,s){this.layers.find(".apbp-images").empty();if(t){var n=[];for(var o in t){var l=t[o];if(l.length==2){var r=e.trim(mejs.Utility.convertSMPTEtoSeconds(l[0]));if(!r){continue}n[n.length]=e('<div class="apbp-slide-image" style="background-image: url(\''+l[1]+'\');" data-start="'+r+'" />')}}this.layers.find(".apbp-images").append(n)}},updateCurrent:function(){if(this.media.duration>0&&this.media.currentTime>=0){this.controls.find(".apbp-timestamp-current").text(mejs.Utility.secondsToTimeCode(this.media.currentTime,this.options));var e=this.media.currentTime/this.media.duration*100;var a=this.getLoadedPercent();this.controls.find(".apbp-progress-current").css("width",e+"%");this.controls.find(".apbp-progress-loaded").css("width",a+"%")}},updateSlides:function(a,t,i){var s=a.currentTime;if(s>.1){t.addClass("apbp-blackout")}else{t.removeClass("apbp-blackout")}var n=t.children();n.css("opacity",0);var o=n.filter(function(t,i){return e(i).data("start")<=a.currentTime&&s>0});e(o[o.length-1]).css("opacity",1)},getLoadedPercent:function(e){var a=this,t=e!==undefined?e.target:a.media,i=null;if(t&&t.buffered&&t.buffered.length>0&&t.buffered.end&&t.duration){i=t.buffered.end(t.buffered.length-1)/t.duration}else if(t&&t.bytesTotal!==undefined&&t.bytesTotal>0&&t.bufferedBytes!==undefined){i=t.bufferedBytes/t.bytesTotal}else if(e&&e.lengthComputable&&e.total!==0){i=e.loaded/e.total}return i*100},updateTotal:function(){if(this.media.duration>=0){this.controls.find(".apbp-timestamp-total").text(mejs.Utility.secondsToTimeCode(this.media.duration,this.options))}},buildplaylist:function(a,t,i,s){var n=this;var o=e('<div class="apbp-button apbp-playlist-plugin-button apbp-playlist-button '+(a.options.playlist?"apbp-hide-playlist":"apbp-show-playlist")+'">'+'<button type="button" aria-controls="'+a.id+'" title="'+a.options.playlistText+'"><i class="fa fa-list"></i></button>'+"</div>");o.appendTo(t).click(function(){n.togglePlaylistDisplay(a,i,s)});n.playlistToggle=n.controls.find(".apbp-playlist-button")},togglePlaylistDisplay:function(a,t,i,s){var n=this;if(!!s){a.options.playlist=s==="show"?true:false}else{a.options.playlist=!a.options.playlist}e(i).trigger("mep-playlisttoggle",[a.options.playlist]);if(a.options.playlist){t.children(".apbp-playlist").fadeIn();n.playlistToggle.removeClass("apbp-show-playlist").addClass("apbp-hide-playlist")}else{t.children(".apbp-playlist").fadeOut();n.playlistToggle.removeClass("apbp-hide-playlist").addClass("apbp-show-playlist")}},genPlaylist:function(a,t,i,s){var n=this,o=e('<div class="apbp-playlist apbp-layer">'+'<ul class="apbp"></ul>'+"</div>").appendTo(i);if(!!e(s).data("showplaylist")){a.options.playlist=true;e("#"+a.id).find(".apbp-overlay-play").hide()}if(!a.options.playlist){o.hide()}var l=function(e){var a=e.split("/");if(a.length>0){return decodeURIComponent(a[a.length-1])}else{return""}};var r=[],p,d="";e("#"+a.id).find(".apbp-mediaelement source").each(function(){if(e(this).parent()[0]&&e(this).parent()[0].canPlayType){p=e(this).parent()[0].canPlayType(this.type)}else if(e(this).parent()[0]&&e(this).parent()[0].player&&e(this).parent()[0].player.media&&e(this).parent()[0].player.media.canPlayType){p=e(this).parent()[0].player.media.canPlayType(this.type)}else{console.error("Cannot determine if we can play this media (no canPlayType()) on"+e(this).toString())}if(!d&&(p==="maybe"||p==="probably")){d=this.type}if(!!d&&this.type===d){if(e.trim(this.src)!==""){var a={};a.source=e.trim(this.src);if(e.trim(this.title)!==""){a.name=e.trim(this.title)}else{a.name=l(a.source)}a.poster=e(this).data("poster");a.slides=e(this).data("slides");a.slidesinline=e(this).data("slides-inline");a.slideslang=e(this).data("slides-lang");r.push(a)}}});for(var u in r){var c=e('<li data-url="'+r[u].source+'" data-poster="'+r[u].poster+(!r[u].slides?"":'" data-slides="'+r[u].slides)+(!r[u].slideslang?"":'" data-slides-lang="'+r[u].slideslang)+'" title="'+r[u].name+'"><span>'+r[u].name+"</span></li>");c.data("slides-inline",r[u].slidesinline);i.find(".apbp-playlist > ul").append(c);if(e(a.media).hasClass("mep-slider")){c.css({"background-image":'url("'+c.data("poster")+'")'})}}i.find("li:first").addClass("current played");var f=i.find("li:first").first();a.changePoster(f.data("poster"));a.changeSlides(f.data("slides"),f.data("slides-inline"),f.data("slides-lang"),f.data("poster"));a.container.trigger("trackUpdate",[0,r.length]);i.find(".apbp-playlist > ul li").click(function(){if(!e(this).hasClass("current")){e(this).addClass("played");a.playTrack(e(this))}else{if(!a.media.paused){a.pause()}else{a.play()}}});e(s).on("ended",function(){a.playNextTrack()});e(s).on("playing",function(){a.container.removeClass("mep-paused").addClass("mep-playing");if(a.isVideo){n.togglePlaylistDisplay(a,i,s,"hide")}});e(s).on("play",function(){if(!a.isVideo){i.find(".apbp-poster").show()}},false);e(s).on("pause",function(){a.container.removeClass("mep-playing").addClass("mep-paused")})},buildplaypause:function(a,t,i,s){var n=this,o=n.options,l=e('<span class="apbp-button apbp-playpause apbp-playpause-play" >'+'<button type="button" aria-controls="'+n.id+'" title="'+o.playText+'" aria-label="'+o.playText+'">'+'<i class="fa"></i>'+"</button>"+"</span>").appendTo(t).click(function(e){e.preventDefault();if(s.paused){s.play()}else{s.pause()}return false}),r=l.find("button");function p(e){if("play"===e){l.removeClass("apbp-playpause-play").addClass("apbp-playpause-pause");r.attr({title:o.pauseText,"aria-label":o.pauseText})}else{l.removeClass("apbp-playpause-pause").addClass("apbp-playpause-play");r.attr({title:o.playText,"aria-label":o.playText})}}p("pse");e(s).on("play",function(){p("play")});e(s).on("playing",function(){p("play")});e(s).on("pause",function(){p("pse")});e(s).on("paused",function(){p("pse")})},buildprevtrack:function(a,t,i,s){var n=this;var o=e('<span class="apbp-button apbp-previous">'+'<button type="button" aria-controls="'+a.id+'" title="'+a.options.prevText+'"><i class="fa fa-step-backward"></i></button>'+"</span>");o.appendTo(t).click(function(){e(s).trigger("apbp-playprevtrack");a.playPrevTrack()});e(a.container).on("trackUpdate",function(e,t,i){if(t<=0&&!a.loopPlaylist){o.addClass("apbp-disabled");o.find("button").prop("disabled",true)}else{o.removeClass("apbp-disabled");o.find("button").prop("disabled",false)}});n.prevTrack=n.controls.find(".apbp-prevtrack-button")},prevTrackClick:function(){var e=this;e.prevTrack.trigger("click")},buildnexttrack:function(a,t,i,s){var n=this;var o=e('<div class="apbp-button apbp-next">'+'<button type="button" aria-controls="'+a.id+'" title="'+a.options.nextText+'"><i class="fa fa-step-forward"></i></button>'+"</div>");o.appendTo(t).click(function(){e(s).trigger("apbp-playnexttrack");a.playNextTrack()});a.container.on("trackUpdate",function(e,t,i){if(t>=i-1&&!a.loopPlaylist){o.addClass("apbp-disabled");o.find("button").prop("disabled",true)}else{o.removeClass("apbp-disabled");o.find("button").prop("disabled",false)}});n.nextTrack=n.controls.find(".apbp-nexttrack-button")},nextTrackClick:function(){var e=this;e.nextTrack.trigger("click")},playNextTrack:function(){var e=this,a;var t=e.layers.find(".apbp-playlist > ul > li");var i=t.filter(".current");var s=t.not(".played");if(s.length<1){i.removeClass("played").siblings().removeClass("played");s=t.not(".current")}var n=false;a=i.next();if(a.length<1&&e.options.loopPlaylist){a=i.siblings().first();n=true}e.options.loop=false;if(a.length==1){a.addClass("played");e.playTrack(a)}},playPrevTrack:function(){var e=this,a;var t=e.layers.find(".apbp-playlist > ul > li");var i=t.filter(".current");var s=t.filter(".played").not(".current");if(s.length<1){i.removeClass("played");s=t.not(".current")}a=i.prev();if(a.length<1&&e.options.loopPlaylist){a=i.siblings().last()}if(a.length==1){i.removeClass("played");this.playTrack(a)}},playTrack:function(e){var a=this;try{a.media.pause()}catch(e){}a.media.setSrc(e.data("url"));if(!a.media.isLoaded){a.media.load()}a.changePoster(e.data("poster"));a.changeSlides(e.data("slides"),e.data("slides-inline"),e.data("slides-lang"),e.data("poster"));a.media.play();e.addClass("current").siblings().removeClass("current");var t=e.parent().children().length,i=e.index();a.container.trigger("trackUpdate",[i,t])},apbpReady:function(a,t){var i=this,s=mejs.MediaFeatures,n=t.getAttribute("autoplay"),o=!(typeof n=="undefined"||n===null||n==="false"),l,r;if(i.created){return}else{i.created=true}i.media=a;i.domNode=t;i.updateCurrent();i.updateTotal();i.updateSlides(i.media,i.layers.find(".apbp-images"),0);e(i.media).on("loadedmetadata",function(e){if(i.updateCurrent){i.updateCurrent()}if(i.updateTotal){i.updateTotal()}this.player.updateSlides(i.media,i.layers.find(".apbp-images"),e.currentTime)});e(i.media).on("loadeddata",function(e){if(i.updateCurrent){i.updateCurrent()}if(i.updateTotal){i.updateTotal()}});var p=null;e(i.media).on("timeupdate",function(){if(p!==this.duration){this.player.updateCurrent()}})},buildaudiofullscreen:function(a,t,i,s){var n=this;if(mejs.MediaFeatures.hasTrueNativeFullScreen){var o=function(e){if(screenfull.isFullscreen){if(screenfull.enabled){}else{a.container.addClass("apbp-fakefullscreen")}a.container.addClass("apbp-fullscreen");a.isFullScreen=true}else{if(screenfull.enabled){}else{a.container.removeClass("apbp-fakefullscreen")}a.container.removeClass("apbp-fullscreen");a.isFullScreen=false}a.calculatePlayerHeight(a.layers)};a.globalBind(mejs.MediaFeatures.fullScreenEventName,o)}n.fullscreenBtn=e('<div class="apbp-button apbp-fullscreen-expandcontract">'+'<button type="button" aria-controls="'+n.id+'" title="'+n.options.fullscreenText+'" aria-label="'+n.options.fullscreenText+'"><i class="fa"></i></button>'+"</div>");n.fullscreenBtn.appendTo(t);var l=function(e){if(a.isFullScreen){if(screenfull.enabled){screenfull.exit()}else{a.container.removeClass("apbp-fakefullscreen")}a.container.removeClass("apbp-fullscreen");a.isFullScreen=false}else{if(screenfull.enabled){screenfull.request(a.container[0])}else{a.container.addClass("apbp-fakefullscreen")}a.container.addClass("apbp-fullscreen");a.isFullScreen=true}};n.fullscreenBtn.on("click",l)},buildprogressbar:function(e,a,t){var i=this,s=a.find(".apbp-progress"),n=a.find(".apbp-progress-loaded"),o=a.find(".apbp-progress-current"),l=a.find(".apbp-time-float"),r=a.find(".apbp-time-float-current");var p=function(a){var i=s.offset(),n=s.width(),o=0,p=0,u=0,c;if(a.originalEvent&&a.originalEvent.changedTouches){c=a.originalEvent.changedTouches[0].pageX}else if(a.changedTouches){c=a.changedTouches[0].pageX}else{c=a.pageX}if(t.duration){if(c<i.left){c=i.left}else if(c>n+i.left){c=n+i.left}u=c-i.left;o=u/n;p=o<=.02?0:o*t.duration;if(d&&p!==t.currentTime){t.setCurrentTime(p)}if(!mejs.MediaFeatures.hasTouch){console.log("Width: ",l.width());l.css("left",u-l.width()/2);r.html(mejs.Utility.secondsToTimeCode(p,e.options));l.show()}}},d=false,u=false,c=0,f=false,b=e.options.autoRewind;s.bind("mousedown touchstart",function(e){if(e.which===1||e.which===0){d=true;p(e);i.globalBind("mousemove.dur touchmove.dur",function(e){p(e)});i.globalBind("mouseup.dur touchend.dur",function(e){d=false;l.hide();i.globalUnbind(".dur")})}}).bind("mouseenter",function(e){u=true;i.globalBind("mousemove.dur",function(e){p(e)});if(!mejs.MediaFeatures.hasTouch){l.show()}}).bind("mouseleave",function(e){u=false;if(!d){i.globalUnbind(".dur");l.hide()}})},modcontrollayer:function(e,a){var t=this;a.css("opacity",0);var i=function e(i){t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a)};a.find(".apbp-control-overlay-left").on("mousemove",i);a.find(".apbp-control-overlay-right").on("mousemove",i);a.find(".apbp-control-overlay-center").on("mousemove",i);a.find(".apbp-control-overlay-left span").on("click touchend",function e(i){if(t.controlsLayerVisible){t.playPrevTrack()}else{t.controlsLayerVisible=true}t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a);i.preventDefault()});a.find(".apbp-control-overlay-right span").on("click touchend",function e(i){if(t.controlsLayerVisible){t.playNextTrack()}else{t.controlsLayerVisible=true}t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a);i.preventDefault()});a.find(".apbp-control-overlay-center span").on("click touchend",function e(i){if(t.controlsLayerVisible){if(t.media.paused){t.media.play()}else{t.media.pause()}}else{t.controlsLayerVisible=true}t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a);i.preventDefault()})},resetControlLayerTimeout:function(e){if(typeof this.controlsLayerTimeout==="number"){window.clearTimeout(this.controlsLayerTimeout);delete this.controlsLayerTimeout;this.controlsLayerTimeout=null}e.css("opacity",1);var a=this;a.controlsLayerVisible=true;this.controlsLayerTimeout=window.setTimeout(function(e){return function(){e.css("opacity",0);a.controlsLayerVisible=false}}(e),2e3)},resetControlsTimeout:function(e){var a=this;if(typeof this.controlsTimeout==="number"){window.clearTimeout(this.controlsTimeout);delete this.controlsTimeout;this.controlsTimeout=null}e.addClass("apbp-vanishing-visible");a.controlsAreVisible=true;var t=function e(){a.controls.removeClass("apbp-vanishing-visible");a.controlsAreVisible=false};this.controlsTimeout=window.setTimeout(t,2e3)}};(function(){var a=/^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;function t(t,i){var s={d:[],w:[]};e.each((t||"").split(" "),function(e,t){var n=t+"."+i;if(n.indexOf(".")===0){s.d.push(n);s.w.push(n)}else{s[a.test(t)?"w":"d"].push(n)}});s.d=s.d.join(" ");s.w=s.w.join(" ");return s}apbp.audioPicturebookPlayer.prototype.globalBind=function(a,i,s){var n=this;a=t(a,n.id);if(a.d)e(document).bind(a.d,i,s);if(a.w)e(window).bind(a.w,i,s)};apbp.audioPicturebookPlayer.prototype.globalUnbind=function(a,i){var s=this;a=t(a,s.id);if(a.d)e(document).unbind(a.d,i);if(a.w)e(window).unbind(a.w,i)}})();if(typeof e!="undefined"){e.fn.audiopicturebookplayer=function(a){if(a===false){this.each(function(){var a=e(this).data("audiopicturebookplayer");if(a){a.remove()}e(this).removeData("audiopicturebookplayer")})}else{this.each(function(){e(this).data("audiopicturebookplayer",new apbp.audioPicturebookPlayer(this,a))})}return this};e(document).ready(function(){e(".apbp-player").audiopicturebookplayer()})}window.MediaElementPlayer=mejs.MediaElementPlayer})(jQuery);