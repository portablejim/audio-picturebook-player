apbp={};apbp.version="0.1";apbp.playerIndex=0;(function(h){apbp.legacy={testForFlexbox:function(){var e=document.documentElement.style;if("flexWrap"in e||"WebkitFlexWrap"in e||"msFlexWrap"in e){return true}return false},testForSvg:function(){var e=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect;if(e){return true}return false}};apbp.apbpDefaults={poster:"",showPosterWhenEnded:false,defaultWidth:480,defaultHeight:270,width:-1,height:-1,aspectRatio:"12:9",defaultSeekBackwardInterval:function(e){return e.duration*.05},defaultSeekForwardInterval:function(e){return e.duration*.05},setDimensions:true,startVolume:.8,loop:false,autoRewind:true,enableAutosize:true,timeFormat:"",alwaysShowHours:false,showTimecodeFrameCount:false,framesPerSecond:25,autosizeProgress:true,alwaysShowControls:false,clickToPlayPause:true,features:["playpause","current","progress","duration","tracks","volume","fullscreen"],hidableControls:true,enableKeyboard:true,pauseOtherPlayers:true,hideVolumeOnTouchDevices:true,loopPlaylist:false,audioVolume:"horizontal",muteText:mejs.i18n.t("Mute Toggle"),allyVolumeControlText:mejs.i18n.t("Use Up/Down Arrow keys to increase or decrease volume."),playText:mejs.i18n.t("Play"),pauseText:mejs.i18n.t("Pause"),nextText:"Next Track",prevText:"Previous Track",fullscreenText:"Fullscreen",stacking:false,handleFastclick:false,keyActions:[{keys:[32,179],action:function(e,a){if(a.paused||a.ended){a.play()}else{a.pause()}}},{keys:[38],action:function(e,a){e.container.find(".apbp-volume-slider").css("display","block");if(e.hidableControls){e.startControlsTimer()}var t=Math.min(a.volume+.1,1);a.setVolume(t)}},{keys:[40],action:function(e,a){e.container.find(".apbp-volume-slider").css("display","block");if(e.hidableControls){e.startControlsTimer()}var t=Math.max(a.volume-.1,0);a.setVolume(t)}},{keys:[37,227],action:function(e,a){if(!isNaN(a.duration)&&a.duration>0){if(e.hidableControls){e.startControlsTimer()}var t=Math.max(a.currentTime-e.options.defaultSeekBackwardInterval(a),0);a.setCurrentTime(t)}}},{keys:[39,228],action:function(e,a){if(!isNaN(a.duration)&&a.duration>0){if(e.hidableControls){e.startControlsTimer()}var t=Math.min(a.currentTime+e.options.defaultSeekForwardInterval(a),a.duration);a.setCurrentTime(t)}}},{keys:[70],action:function(e,a){if(typeof e.enterFullScreen!="undefined"){if(e.isFullScreen){e.exitFullScreen()}else{e.enterFullScreen()}}}},{keys:[77],action:function(e,a){e.container.find(".apbp-volume-slider").css("display","block");if(e.hidableControls){e.startControlsTimer()}if(e.media.muted){e.setMuted(false)}else{e.setMuted(true)}}}]};apbp.playerIndex=0;apbp.players={};apbp.audioPicturebookPlayer=function(e,a){if(!(this instanceof apbp.audioPicturebookPlayer)){return new apbp.audioPicturebookPlayer(e,a)}if(!apbp.legacy.testForSvg()){return}var t=this;t.$media=t.$node=h(e);t.node=t.media=t.$media[0];if(!t.node){return}if(typeof t.node.player!="undefined"){return t.node.player}if(typeof a=="undefined"){a=t.$node.data("mejsoptions")}t.options=h.extend({},apbp.apbpDefaults,a);if(!t.options.timeFormat){t.options.timeFormat="mm:ss";if(t.options.alwaysShowHours){t.options.timeFormat="hh:mm:ss"}if(t.options.showTimecodeFrameCount){t.options.timeFormat+=":ff"}}mejs.Utility.calculateTimeFormat(0,t.options,t.options.framesPerSecond||25);t.id="apbp_"+apbp.playerIndex++;apbp.players[t.id]=t;t.init();return t};apbp.audioPicturebookPlayer.prototype={hasFocus:false,controlsAreVisible:true,playpausesvg:'<svg xmlns="http://www.w3.org/2000/svg" class="needsclick" viewBox="0 0 512 512"><circle style="fill:#fff;fill-opacity:1;stroke:none;" id="bg" class="needsclick" cx="256" cy="256" r="240" /><path class="play needsclick" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"/><path class="pause needsclick" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-16 328c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160zm112 0c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160z"/></svg>',init:function(){var i=this,e=mejs.MediaFeatures;meOptions=h.extend(true,{},i.options,{success:function(e,a){i.apbpReady(e,a)},error:function(e){i.handleError(e)}}),tagName=i.media.tagName.toLowerCase();i.isVideo=false;i.$media.removeAttr("controls");var a=mejs.i18n.t("Audio Player");h('<span class="apbp-offscreen">'+a+"</span>").insertBefore(i.$media);i.container=h('<div id="'+i.id+'" class="apbp-container '+(mejs.MediaFeatures.svgAsImg?"svg":"no-svg")+(apbp.legacy.testForFlexbox()?" flex ":" noFlex ")+" mep-paused"+'" tabindex="0" role="application" aria-label="'+a+'">'+'<div class="apbp-clear"></div>'+'<div class="apbp-inner">'+'<div class="apbp-mediaelement"></div>'+'<div class="apbp-layers">'+'<div class="apbp-poster apbp-layer"></div>'+'<div class="apbp-images apbp-layer"></div>'+'<div class="apbp-paused-overlay apbp-layer">'+'<span class="apbp-overlay-image-button">'+this.playpausesvg+"</span>"+"</div>"+'<div class="apbp-control-overlay apbp-layer">'+'<div class="apbp-control-overlay-left"><span class="apbp-overlay-image-button"></span></div>'+'<div class="apbp-control-overlay-center"><span class="apbp-overlay-image-button">'+this.playpausesvg+"</span></div>"+'<div class="apbp-control-overlay-right"><span class="apbp-overlay-image-button"></span></div>'+"</div>"+"</div>"+'<div class="apbp-controls"></div>'+"</div>"+"</div>").addClass(i.$media[0].className).insertBefore(i.$media).focus(function(e){if(!i.controlsAreVisible){var a=i.container.find(".apbp-playpause-button > button");a.focus()}});i.container.addClass((e.isAndroid?"apbp-android ":"")+(e.isiOS?"apbp-ios ":"")+(e.isiPad?"apbp-ipad ":"")+(e.isiPhone?"apbp-iphone ":""));if(true){var t=i.$media.clone();h(i.container.find(".apbp-mediaelement")).append(t);i.$media.remove();i.$node=i.$media=t;i.node=i.media=t[0]}else{h(i.container.find(".apbp-mediaelement")).append(i.$media)}i.node.player=i;i.controls=i.container.find(".apbp-controls");i.layers=i.container.find(".apbp-layers");meOptions.pluginWidth=i.width;meOptions.pluginHeight=i.height;i.media=mejs.MediaElement(i.$media[0],meOptions);i.calculatePlayerHeight(i.layers);addEvent("resize",window,function(){i.calculatePlayerHeight(i.layers)},true);i.modcontrollayer(i,i.container.find(".apbp-control-overlay"));var s=function s(e){i.resetControlsTimeout(i.controls)};h(i.controls).on("mousemove",s);h(i.controls).on("mousedown",s);if(i.options.features.includes("progress")){i.controls.append('<div class="apbp-progress">'+'<div class="apbp-progress-loaded" />'+'<div class="apbp-progress-current" />'+'<span class="apbp-time-float" style="display: none;">'+'<span class="apbp-time-float-current">00:00</span>'+'<span class="apbp-time-float-corner"></span>'+"</span>"+"</div>")}var n=h('<div class="apbp-control-buttons" />');i.controls.append(n);this.buildprevtrack(this,n,this.layers,this.media);this.buildplaypause(this.player,n,this.layers,this.media);this.buildnexttrack(this,n,this.layers,this.media);n.append('<span class="apbp-controls-timestamp"><span class="apbp-timestamp-current">00:00</span> / <span class="apbp-timestamp-total"></span></span>');n.append('<span class="apbp-controls-spacer"></span>');i.buildvolume(i,n,i.layers,i.$media[0]);i.buildprogressbar(this,i.controls,i.media);this.buildaudiofullscreen(this,n,this.layers,this.media);i.genPlaylist(i,n,i.layers,i.$media[0]);i.loaded=i.controls.find(".apbp-progress-loaded");i.total=i.controls.find(".apbp-progress-current");h(i.media).on("progress",function(e){this.player.updateCurrent();this.player.updateTotal()});h(i.media).on("timeupdate",function(e){i.updateSlides(i.media,i.layers.find(".apbp-images"),e.currentTime);if(i.media.duration-i.media.currentTime<20&&i.media.readyState==4&&i.media.nearEnd!=true){i.media.nearEnd=true;var a=i.preload.querySelector('[src="'+e.currentTarget.src+'"]').nextSibling;while(a&&1!=a.nodeType){a=a.nextSibling}a.preload="auto";console.log("Preload next track"+a.src)}else if(i.media.currentTime<1&&i.media.nearEnd==true){i.media.nearEnd=false}});var l=i.media.parentElement;i.preload=document.createElement("div");i.preload.classList="apbp-preload";h(l).append(i.preload);h(i.media).find("source").each(function(e,a){var t=document.createElement("audio");if(i.media.children[e].src!=undefined){t.src=i.media.children[e].src;t.controls=false;t.autoplay=false;t.preload="none";i.preload.appendChild(t)}})},calculatePlayerHeight:function(e){var a=this.options.aspectRatio.split(":");var t=a[1]/a[0];var i=e.width()*t;this.controls.removeClass("apbp-vanishing");this.controls.removeClass("apbp-vanishing-visible");this.controlsAreVisible=true;e.removeClass("hide-apbp-layers");if(i==0){e.addClass("hide-apbp-layers")}else if(this.isFullScreen){e.height("");if(window.innerHeight-this.controls.height()>i){e.height(window.innerHeight-this.controls.height())}else{e.height("100%");this.controls.addClass("apbp-vanishing");this.resetControlsTimeout(this.controls)}}else{e.height(e.width()*t)}if(e.parent().width()<320){e.parent().removeClass("apbp-small");e.parent().addClass("apbp-tiny")}else if(e.parent().width()<500){e.parent().removeClass("apbp-tiny");e.parent().addClass("apbp-small")}else{e.parent().removeClass("apbp-tiny");e.parent().removeClass("apbp-small")}},setPlayerHeight:function(e,a){if(!this.options.setDimensions){return false}if(typeof a!="undefined"){e.height=a}},buildvolume:function(e,a,t,o){if((mejs.MediaFeatures.isAndroid||mejs.MediaFeatures.isiOS)&&this.options.hideVolumeOnTouchDevices)return;var i=this,r=i.options.audioVolume,p=r=="horizontal"?h('<span class="apbp-button apbp-volume-button apbp-mute">'+'<button type="button" aria-controls="'+i.id+'" title="'+i.options.muteText+'" aria-label="'+i.options.muteText+'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971z"/><path class="sound-waves" d="M438.056 10.141C422.982.92 403.283 5.668 394.061 20.745c-9.221 15.077-4.473 34.774 10.604 43.995C468.967 104.063 512 174.983 512 256c0 73.431-36.077 142.292-96.507 184.206-14.522 10.072-18.129 30.01-8.057 44.532 10.076 14.528 30.016 18.126 44.531 8.057C529.633 438.927 576 350.406 576 256c0-103.244-54.579-194.877-137.944-245.859zM480 256c0-68.547-36.15-129.777-91.957-163.901-15.076-9.22-34.774-4.471-43.994 10.607-9.22 15.078-4.471 34.774 10.607 43.994C393.067 170.188 416 211.048 416 256c0 41.964-20.62 81.319-55.158 105.276-14.521 10.073-18.128 30.01-8.056 44.532 6.216 8.96 16.185 13.765 26.322 13.765a31.862 31.862 0 0 0 18.21-5.709C449.091 377.953 480 318.938 480 256zm-96 0c0-33.717-17.186-64.35-45.972-81.944-15.079-9.214-34.775-4.463-43.992 10.616s-4.464 34.775 10.615 43.992C314.263 234.538 320 244.757 320 256a32.056 32.056 0 0 1-13.802 26.332c-14.524 10.069-18.136 30.006-8.067 44.53 10.07 14.525 30.008 18.136 44.53 8.067C368.546 316.983 384 287.478 384 256z"/></svg></button>'+"</span>"+'<span class="apbp-horizontal-volume-slider" tabindex="0">'+'<span class="apbp-offscreen">'+i.options.allyVolumeControlText+"</span>"+'<div class="apbp-horizontal-volume-total"></div>'+'<div class="apbp-horizontal-volume-current"></div>'+'<div class="apbp-horizontal-volume-handle"></div>'+"</span>").appendTo(a):h('<span class="apbp-button apbp-volume-button apbp-mute">'+'<button type="button" aria-controls="'+i.id+'" title="'+i.options.muteText+'" aria-label="'+i.options.muteText+'"></button>'+'<span class="apbp-volume-slider" tabindex="0">'+'<span class="apbp-offscreen">'+i.options.allyVolumeControlText+"</span>"+'<div class="apbp-volume-total"></div>'+'<div class="apbp-volume-current"></div>'+'<div class="apbp-volume-handle"></div>'+"</span>"+"</span>").appendTo(a),d=i.container.find(".apbp-volume-slider, .apbp-horizontal-volume-slider"),u=i.container.find(".apbp-volume-total, .apbp-horizontal-volume-total"),c=i.container.find(".apbp-volume-current, .apbp-horizontal-volume-current"),f=i.container.find(".apbp-volume-handle, .apbp-horizontal-volume-handle"),m=function(e,a){if(!d.is(":visible")&&typeof a=="undefined"){d.show();m(e,true);d.hide();return}e=Math.max(0,e);e=Math.min(e,1);if(e===0){p.removeClass("apbp-mute").addClass("apbp-unmute");p.children("button").attr("title",mejs.i18n.t("Unmute")).attr("aria-label",mejs.i18n.t("Unmute"))}else{p.removeClass("apbp-unmute").addClass("apbp-mute");p.children("button").attr("title",mejs.i18n.t("Mute")).attr("aria-label",mejs.i18n.t("Mute"))}var t=u.position();if(r=="vertical"){var i=u.height(),s=i-i*e;f.css("top",Math.round(t.top+s-f.height()/2));c.height(i-s);c.css("top",t.top+s)}else{var n=u.width(),l=n*e;f.css("left",Math.round(t.left+l-f.width()/2));c.width(Math.round(l))}},s=function(e){var a=null,t=u.offset();if(r==="vertical"){var i=u.height(),s=e.pageY-t.top;a=(i-s)/i;if(t.top===0||t.left===0){return}}else{var n=u.width(),l=e.pageX-t.left;a=l/n}a=Math.max(0,a);a=Math.min(a,1);m(a);if(a===0){o.setMuted(true)}else{o.setMuted(false)}o.setVolume(a)},n=false,l=false;p.hover(function(){d.show();l=true},function(){l=false;if(!n&&r=="vertical"){d.hide()}});var b=function(e){var a=Math.floor(o.volume*100);d.attr({"aria-label":mejs.i18n.t("volumeSlider"),"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":a,"aria-valuetext":a+"%",role:"slider",tabindex:0})};d.bind("mouseover",function(){l=true}).bind("mousedown",function(e){s(e);i.globalBind("mousemove.vol",function(e){s(e)});i.globalBind("mouseup.vol",function(){n=false;i.globalUnbind(".vol");if(!l&&r=="vertical"){d.hide()}});n=true;return false}).bind("keydown",function(e){var a=e.keyCode;var t=o.volume;switch(a){case 38:t+=.1;break;case 40:t=t-.1;break;default:return true}n=false;m(t);o.setVolume(t);return false}).bind("blur",function(){d.hide()});p.find("button").click(function(){o.setMuted(!o.muted)});p.find("button").bind("focus",function(){d.show()});h(o).on("volumechange",function(e){if(!n){if(o.muted){m(0);p.removeClass("apbp-mute").addClass("apbp-unmute")}else{m(o.volume);p.removeClass("apbp-unmute").addClass("apbp-mute")}}b(e)});if(e.options.startVolume===0){o.setMuted(true)}if(o.pluginType==="native"){o.setVolume(e.options.startVolume)}h(i.container).on("controlsresize",function(){m(o.volume)})},changePoster:function(e){var a=this;a.layers.find(".apbp-poster").css("background-image",'url("'+e+'")');a.layers.find(".apbp-poster").show()},changeSlides:function(e,a,t,i){this.layers.find(".apbp-images").empty();if(a){var s=[];var n=[];for(var l=0;l<a.length;l++){var o=a[l];if(o.length==2){var r=h.trim(mejs.Utility.convertSMPTEtoSeconds(o[0]));if(!r){continue}s[s.length]=h('<div class="apbp-slide-image" style="background-image: url(\''+o[1]+'\');" data-start="'+r+'" />');n[n.length]=r}}if(!this.options.stacking){for(var p=1;p<n.length;p++){s[p-1].attr("data-end",n[p])}}this.layers.find(".apbp-images").append(s)}},updateCurrent:function(){if(this.media.duration>0&&this.media.currentTime>=0){this.controls.find(".apbp-timestamp-current").text(mejs.Utility.secondsToTimeCode(this.media.currentTime,this.options));var e=this.media.currentTime/this.media.duration*100;var a=this.getLoadedPercent();this.controls.find(".apbp-progress-current").css("width",e+"%");this.controls.find(".apbp-progress-loaded").css("width",a+"%")}},updateSlides:function(t,e,a){var i=t.currentTime;if(i>.1){e.addClass("apbp-blackout")}else{e.removeClass("apbp-blackout")}var s=e.children();s.css("opacity",0);var n=s.filter(function(e,a){return h(a).data("start")<=t.currentTime&&i>0&&(!h(a).data("end")||h(a).data("end")>t.currentTime)});n.css("opacity",1)},getLoadedPercent:function(e){var a=this,t=e!==undefined?e.target:a.media,i=null;if(t&&t.buffered&&t.buffered.length>0&&t.buffered.end&&t.duration){i=t.buffered.end(t.buffered.length-1)/t.duration}else if(t&&t.bytesTotal!==undefined&&t.bytesTotal>0&&t.bufferedBytes!==undefined){i=t.bufferedBytes/t.bytesTotal}else if(e&&e.lengthComputable&&e.total!==0){i=e.loaded/e.total}return i*100},updateTotal:function(){if(this.media.duration>=0){this.controls.find(".apbp-timestamp-total").text(mejs.Utility.secondsToTimeCode(this.media.duration,this.options))}},buildplaylist:function(e,a,t,i){var s=this;var n=h('<div class="apbp-button apbp-playlist-plugin-button apbp-playlist-button '+(e.options.playlist?"apbp-hide-playlist":"apbp-show-playlist")+'">'+'<button type="button" aria-controls="'+e.id+'" title="'+e.options.playlistText+'"><i class="fa fa-list"></i></button>'+"</div>");n.appendTo(a).click(function(){s.togglePlaylistDisplay(e,t,i)});s.playlistToggle=s.controls.find(".apbp-playlist-button")},togglePlaylistDisplay:function(e,a,t,i){var s=this;if(!!i){e.options.playlist=i==="show"?true:false}else{e.options.playlist=!e.options.playlist}h(t).trigger("mep-playlisttoggle",[e.options.playlist]);if(e.options.playlist){a.children(".apbp-playlist").fadeIn();s.playlistToggle.removeClass("apbp-show-playlist").addClass("apbp-hide-playlist")}else{a.children(".apbp-playlist").fadeOut();s.playlistToggle.removeClass("apbp-hide-playlist").addClass("apbp-show-playlist")}},genPlaylist:function(e,a,t,i){var s=this,n=h('<div class="apbp-playlist apbp-layer">'+'<ul class="apbp"></ul>'+"</div>").appendTo(t);if(!!h(i).data("showplaylist")){e.options.playlist=true;h("#"+e.id).find(".apbp-overlay-play").hide()}if(!e.options.playlist){n.hide()}var l=function(e){var a=e.split("/");if(a.length>0){return decodeURIComponent(a[a.length-1])}else{return""}};var o=[],r,p="";h("#"+e.id).find(".apbp-mediaelement source").each(function(){if(h(this).parent()[0]&&h(this).parent()[0].canPlayType){r=h(this).parent()[0].canPlayType(this.type)}else if(h(this).parent()[0]&&h(this).parent()[0].player&&h(this).parent()[0].player.media&&h(this).parent()[0].player.media.canPlayType){r=h(this).parent()[0].player.media.canPlayType(this.type)}else{console.error("Cannot determine if we can play this media (no canPlayType()) on"+h(this).toString())}if(!p&&(r==="maybe"||r==="probably")){p=this.type}if(!!p&&this.type===p){if(h.trim(this.src)!==""){var e={};e.source=h.trim(this.src);if(h.trim(this.title)!==""){e.name=h.trim(this.title)}else{e.name=l(e.source)}e.poster=h(this).data("poster");e.slides=h(this).data("slides");e.slidesinline=h(this).data("slides-inline");e.slideslang=h(this).data("slides-lang");o.push(e)}}});for(var d in o){var u=h('<li data-url="'+o[d].source+'" data-poster="'+o[d].poster+(!o[d].slides?"":'" data-slides="'+o[d].slides)+(!o[d].slideslang?"":'" data-slides-lang="'+o[d].slideslang)+'" title="'+o[d].name+'"><span>'+o[d].name+"</span></li>");u.data("slides-inline",o[d].slidesinline);t.find(".apbp-playlist > ul").append(u);if(h(e.media).hasClass("mep-slider")){u.css({"background-image":'url("'+u.data("poster")+'")'})}}t.find("li:first").addClass("current played");var c=t.find("li:first").first();e.changePoster(c.data("poster"));e.changeSlides(c.data("slides"),c.data("slides-inline"),c.data("slides-lang"),c.data("poster"));e.container.trigger("trackUpdate",[0,o.length]);t.find(".apbp-playlist > ul li").click(function(){if(!h(this).hasClass("current")){h(this).addClass("played");e.playTrack(h(this))}else{if(!e.media.paused){e.pause()}else{e.play()}}});h(i).on("ended",function(){e.playNextTrack()});h(i).on("playing",function(){e.container.removeClass("mep-paused").addClass("mep-playing");if(e.isVideo){s.togglePlaylistDisplay(e,t,i,"hide")}});h(i).on("play",function(){if(!e.isVideo){t.find(".apbp-poster").show()}},false);h(i).on("pause",function(){e.container.removeClass("mep-playing").addClass("mep-paused")})},buildplaypause:function(e,a,t,i){var s=this,n=s.options,l=h('<span class="apbp-button apbp-playpause apbp-playpause-play" >'+'<button type="button" aria-controls="'+s.id+'" title="'+n.playText+'" aria-label="'+n.playText+'">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="play" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/><path class="pause" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"/>'+"</button>"+"</span>").appendTo(a).click(function(e){e.preventDefault();if(i.paused){i.play()}else{i.pause()}return false}),o=l.find("button");function r(e){if("play"===e){l.removeClass("apbp-playpause-play").addClass("apbp-playpause-pause");o.attr({title:n.pauseText,"aria-label":n.pauseText})}else{l.removeClass("apbp-playpause-pause").addClass("apbp-playpause-play");o.attr({title:n.playText,"aria-label":n.playText})}}r("pse");h(i).on("play",function(){r("play")});h(i).on("playing",function(){r("play")});h(i).on("pause",function(){r("pse")});h(i).on("paused",function(){r("pse")})},nexttracksvg:function(e,a){var t="";if(a){t='transform="rotate(180,224,256)"'}return'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path '+t+' d="M 41.14804,498.27885 V 13.721154 c 0,-7.5426429 6.171254,-13.71389652 13.713897,-13.71389652 h 54.855583 c 7.54265,0 13.7139,6.17125362 13.7139,13.71389652 V 215.31544 L 346.85366,8.4641606 c 23.54219,-19.5423036 59.9983,-3.1999093 59.9983,28.1134884 V 475.42235 c 0,31.3134 -36.45611,47.65579 -59.9983,28.11349 L 123.43142,297.94167 v 200.33718 c 0,7.54264 -6.17125,13.71389 -13.7139,13.71389 H 54.861937 c -7.542643,0 -13.713897,-6.17125 -13.713897,-13.71389 z"/></svg>'},buildprevtrack:function(i,e,a,t){var s=this;var n=h('<span class="apbp-button apbp-previous">'+'<button type="button" aria-controls="'+i.id+'" title="'+i.options.prevText+'">'+i.nexttracksvg(false)+"</button>"+"</span>");n.appendTo(e).click(function(){h(t).trigger("apbp-playprevtrack");i.playPrevTrack()});h(i.container).on("trackUpdate",function(e,a,t){if(a<=0&&!i.loopPlaylist){n.addClass("apbp-disabled");n.find("button").prop("disabled",true)}else{n.removeClass("apbp-disabled");n.find("button").prop("disabled",false)}});s.prevTrack=s.controls.find(".apbp-prevtrack-button")},prevTrackClick:function(){var e=this;e.prevTrack.trigger("click")},buildnexttrack:function(i,e,a,t){var s=this;var n=h('<div class="apbp-button apbp-next">'+'<button type="button" aria-controls="'+i.id+'" title="'+i.options.nextText+'">'+i.nexttracksvg(true,true)+"</button>"+"</div>");n.appendTo(e).click(function(){h(t).trigger("apbp-playnexttrack");i.playNextTrack()});i.container.on("trackUpdate",function(e,a,t){if(a>=t-1&&!i.loopPlaylist){n.addClass("apbp-disabled");n.find("button").prop("disabled",true)}else{n.removeClass("apbp-disabled");n.find("button").prop("disabled",false)}});s.nextTrack=s.controls.find(".apbp-nexttrack-button")},nextTrackClick:function(){var e=this;e.nextTrack.trigger("click")},playNextTrack:function(){var e=this,a;var t=e.layers.find(".apbp-playlist > ul > li");var i=t.filter(".current");var s=t.not(".played");if(s.length<1){i.removeClass("played").siblings().removeClass("played");s=t.not(".current")}var n=false;a=i.next();if(a.length<1&&e.options.loopPlaylist){a=i.siblings().first();n=true}e.options.loop=false;if(a.length==1){a.addClass("played");e.playTrack(a)}},playPrevTrack:function(){var e=this,a;var t=e.layers.find(".apbp-playlist > ul > li");var i=t.filter(".current");var s=t.filter(".played").not(".current");if(s.length<1){i.removeClass("played");s=t.not(".current")}a=i.prev();if(a.length<1&&e.options.loopPlaylist){a=i.siblings().last()}if(a.length==1){i.removeClass("played");this.playTrack(a)}},playTrack:function(e){var a=this;try{a.media.pause()}catch(s){}a.media.setSrc(e.data("url"));if(!a.media.isLoaded){a.media.load()}a.changePoster(e.data("poster"));a.changeSlides(e.data("slides"),e.data("slides-inline"),e.data("slides-lang"),e.data("poster"));a.media.play();e.addClass("current").siblings().removeClass("current");var t=e.parent().children().length,i=e.index();a.container.trigger("trackUpdate",[i,t])},apbpReady:function(e,a){var t=this,i=mejs.MediaFeatures,s=a.getAttribute("autoplay"),n=!(typeof s=="undefined"||s===null||s==="false"),l,o;if(t.created){return}else{t.created=true}t.media=e;t.domNode=a;t.updateCurrent();t.updateTotal();t.updateSlides(t.media,t.layers.find(".apbp-images"),0);h(t.media).on("loadedmetadata",function(e){if(t.updateCurrent){t.updateCurrent()}if(t.updateTotal){t.updateTotal()}t.updateSlides(t.media,t.layers.find(".apbp-images"),e.currentTime)});h(t.media).on("loadeddata",function(e){if(t.updateCurrent){t.updateCurrent()}if(t.updateTotal){t.updateTotal()}});var r=null;h(t.media).on("timeupdate",function(){if(r!==this.duration){this.player.updateCurrent()}})},buildaudiofullscreen:function(a,e,t,i){var s=this;if(mejs.MediaFeatures.hasTrueNativeFullScreen){var n=function(e){if(screenfull.isFullscreen){a.container.addClass("apbp-fullscreen");a.isFullScreen=true}else{a.container.removeClass("apbp-fullscreen");a.isFullScreen=false}a.calculatePlayerHeight(a.layers)};a.globalBind(mejs.MediaFeatures.fullScreenEventName,n);h(window.document).on("fullscreenchange",n)}else{var n=function(e){if(screenfull.isFullscreen){if(screenfull.enabled){}else{a.container.addClass("apbp-fakefullscreen")}a.container.addClass("apbp-fullscreen");a.isFullScreen=true}else{if(screenfull.enabled){}else{a.container.removeClass("apbp-fakefullscreen")}a.container.removeClass("apbp-fullscreen");a.isFullScreen=false}a.calculatePlayerHeight(a.layers)};a.globalBind(mejs.MediaFeatures.fullScreenEventName,n)}s.fullscreenBtn=h('<span class="apbp-button apbp-fullscreen-expandcontract">'+'<button type="button" aria-controls="'+s.id+'" title="'+s.options.fullscreenText+'" aria-label="'+s.options.fullscreenText+'">'+'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 32 448 448"><path class="compress" d="M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z"/><path class="expand" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"/></svg>'+"</button>"+"</span>");var l=false;console.log(a.options);console.log(a.options.features);if(a.options&&a.options.features){for(var o=0;o<a.options.features.length;o++){console.log(a.options.features[o]);if(a.options.features[o]=="fullscreen"){l=true}}}if(l){s.fullscreenBtn.appendTo(e)}var r=function(e){if(a.isFullScreen){if(screenfull.enabled){screenfull.exit()}else{a.container.removeClass("apbp-fakefullscreen")}a.container.removeClass("apbp-fullscreen");a.isFullScreen=false}else{if(screenfull.enabled){screenfull.request(a.container[0])}else{a.container.addClass("apbp-fakefullscreen")}a.container.addClass("apbp-fullscreen");a.isFullScreen=true}a.calculatePlayerHeight(a.layers)};s.fullscreenBtn.on("click",r)},buildprogressbar:function(o,e,r){var a=this,p=e.find(".apbp-progress"),t=e.find(".apbp-progress-loaded"),i=e.find(".apbp-progress-current"),d=e.find(".apbp-time-float"),u=e.find(".apbp-time-float-current");var s=function(e){var a=p.offset(),t=p.width(),i=0,s=0,n=0,l;if(e.originalEvent&&e.originalEvent.changedTouches){l=e.originalEvent.changedTouches[0].pageX}else if(e.changedTouches){l=e.changedTouches[0].pageX}else{l=e.pageX}if(r.duration){if(l<a.left){l=a.left}else if(l>t+a.left){l=t+a.left}n=l-a.left;i=n/t;s=i<=.02?0:i*r.duration;if(c&&s!==r.currentTime){r.setCurrentTime(s)}if(!mejs.MediaFeatures.hasTouch){console.log("Width: ",d.width());d.css("left",n-d.width()/2);u.html(mejs.Utility.secondsToTimeCode(s,o.options));d.show()}}},c=false,n=false,l=0,f=false,m=o.options.autoRewind;p.bind("mousedown touchstart",function(e){if(e.which===1||e.which===0){c=true;s(e);a.globalBind("mousemove.dur touchmove.dur",function(e){s(e)});a.globalBind("mouseup.dur touchend.dur",function(e){c=false;d.hide();a.globalUnbind(".dur")})}}).bind("mouseenter",function(e){n=true;a.globalBind("mousemove.dur",function(e){s(e)});if(!mejs.MediaFeatures.hasTouch){d.show()}}).bind("mouseleave",function(e){n=false;if(!c){a.globalUnbind(".dur");d.hide()}})},modcontrollayer:function(e,a){var t=this;a.css("opacity",0);var i=function i(e){t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a)};var s="mousemove";var n="click touchend";if(t.options.handleFastclick){s="mousemove click";n="click"}a.find(".apbp-control-overlay-left").on(s,i);a.find(".apbp-control-overlay-right").on(s,i);a.find(".apbp-control-overlay-center").on(s,i);a.find(".apbp-control-overlay-left span").on(n,function l(e){if(t.controlsLayerVisible){t.playPrevTrack()}else{t.controlsLayerVisible=true}t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a);e.preventDefault()});a.find(".apbp-control-overlay-right span").on(n,function l(e){if(t.controlsLayerVisible){t.playNextTrack()}else{t.controlsLayerVisible=true}t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a);e.preventDefault()});a.find(".apbp-control-overlay-center span").on(n,function l(e){if(t.controlsLayerVisible){if(t.media.paused){t.media.play()}else{t.media.pause()}}else{t.controlsLayerVisible=true}t.resetControlsTimeout(t.controls);t.resetControlLayerTimeout(a);e.preventDefault()})},resetControlLayerTimeout:function(e){if(typeof this.controlsLayerTimeout==="number"){window.clearTimeout(this.controlsLayerTimeout);delete this.controlsLayerTimeout;this.controlsLayerTimeout=null}e.css("opacity",1);var a=this;a.controlsLayerVisible=true;this.controlsLayerTimeout=window.setTimeout(function(e){return function(){e.css("opacity",0);a.controlsLayerVisible=false}}(e),2e3)},resetControlsTimeout:function(e){var a=this;if(typeof this.controlsTimeout==="number"){window.clearTimeout(this.controlsTimeout);delete this.controlsTimeout;this.controlsTimeout=null}e.addClass("apbp-vanishing-visible");a.controlsAreVisible=true;var t=function t(){a.controls.removeClass("apbp-vanishing-visible");a.controlsAreVisible=false};this.controlsTimeout=window.setTimeout(t,2e3)}};(function(){var n=/^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;function s(e,i){var s={d:[],w:[]};h.each((e||"").split(" "),function(e,a){var t=a+"."+i;if(t.indexOf(".")===0){s.d.push(t);s.w.push(t)}else{s[n.test(a)?"w":"d"].push(t)}});s.d=s.d.join(" ");s.w=s.w.join(" ");return s}apbp.audioPicturebookPlayer.prototype.globalBind=function(e,a,t){var i=this;e=s(e,i.id);if(e.d)h(document).bind(e.d,a,t);if(e.w)h(window).bind(e.w,a,t)};apbp.audioPicturebookPlayer.prototype.globalUnbind=function(e,a){var t=this;e=s(e,t.id);if(e.d)h(document).unbind(e.d,a);if(e.w)h(window).unbind(e.w,a)}})();if(typeof h!="undefined"){h.fn.audiopicturebookplayer=function(e){if(e===false){this.each(function(){var e=h(this).data("audiopicturebookplayer");if(e){e.remove()}h(this).removeData("audiopicturebookplayer")})}else{this.each(function(){h(this).data("audiopicturebookplayer",new apbp.audioPicturebookPlayer(this,e))})}return this};h(document).ready(function(){h(".apbp-player").audiopicturebookplayer()})}window.MediaElementPlayer=mejs.MediaElementPlayer})(jQuery);