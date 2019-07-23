/**
 */


apbp = {};

apbp.version = "0.1";

apbp.playerIndex = 0;

(function($) {

    /*
     * Some code modified from mediaElementPlayer
     * https://github.com/johndyer/mediaelement
     */

    apbp.legacy = {
        testForFlexbox: function() {
            var d = document.documentElement.style
            if (('flexWrap' in d) || ('WebkitFlexWrap' in d) || ('msFlexWrap' in d)){
                return true;
            }
            return false;

        },
        testForSvg: function() {
            var svgSupport = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
            if ( svgSupport ) {
                return true;
            }
            return false;
        }
    };

    apbp.apbpDefaults = {
        // url to poster (to fix iOS 3.x)
        poster: '',
        // When the audio is ended, we can show the poster.
        showPosterWhenEnded: false,
        // default if the <audio width> is not specified
        defaultWidth: 480,
        // default if the <audio height> is not specified
        defaultHeight: 270,
        // if set, overrides <audio width>
        width: -1,
        // if set, overrides <audio height>
        height: -1,

        aspectRatio: "12:9",

        // default amount to move back when back key is pressed
        defaultSeekBackwardInterval: function(media) {
            return (media.duration * 0.05);
        },
        // default amount to move forward when forward key is pressed
        defaultSeekForwardInterval: function(media) {
            return (media.duration * 0.05);
        },

        // set dimensions via JS instead of CSS
        setDimensions: true,

        // initial volume when the player starts (overrided by user cookie)
        startVolume: 0.8,
        // useful for <audio> player loops
        loop: false,
        // rewind to beginning when media ends
        autoRewind: true,
        // resize to media dimensions
        enableAutosize: true,

        /*
         * Time format to use. Default: 'mm:ss'
         * Supported units:
         *   h: hour
         *   m: minute
         *   s: second
         *   f: frame count
         * When using 'hh', 'mm', 'ss' or 'ff' we always display 2 digits.
         * If you use 'h', 'm', 's' or 'f' we display 1 digit if possible.
         *
         * Example to display 75 seconds:
         * Format 'mm:ss': 01:15
         * Format 'm:ss': 1:15
         * Format 'm:s': 1:15
         */
        timeFormat: '',
        // forces the hour marker (##:00:00)
        alwaysShowHours: false,
        // show framecount in timecode (##:00:00:00)
        showTimecodeFrameCount: false,
        // used when showTimecodeFrameCount is set to true
        framesPerSecond: 25,

        // automatically calculate the width of the progress bar based on the sizes of other elements
        autosizeProgress : true,
        // Hide controls when playing and mouse is not over the video
        alwaysShowControls: false,
        // Enable click image element to toggle play/pause
        clickToPlayPause: true,
        // features to show
        features: ['playpause','current','progress','duration','tracks','volume','fullscreen'],
        // only for dynamic
        hidableControls: true,

        // turns keyboard support on and off for this instance
        enableKeyboard: true,

        // whenthis player starts, it will pause other players
        pauseOtherPlayers: true,

        hideVolumeOnTouchDevices: true,

        loopPlaylist: false,

        audioVolume: 'horizontal',
        muteText: mejs.i18n.t('Mute Toggle'),
        allyVolumeControlText: mejs.i18n.t('Use Up/Down Arrow keys to increase or decrease volume.'),
        playText: mejs.i18n.t('Play'),
        pauseText: mejs.i18n.t('Pause'),
        nextText: "Next Track",
        prevText: "Previous Track",
        fullscreenText: "Fullscreen",

        // Don't hide the previous image when showing the next one
        stacking: false,

        // Do behaviours assuming fastclick is present.
        handleFastclick: false,

        // array of keyboard actions such as play pause
        keyActions: [
            {
                keys: [
                    32, // SPACE
                    179 // GOOGLE play/pause button
                ],
                action: function(player, media) {
                    if (media.paused || media.ended) {
                        media.play();
                    } else {
                        media.pause();
                    }
                }
            },
            {
                keys: [38], // UP
                action: function(player, media) {
                    player.container.find('.apbp-volume-slider').css('display','block');
                    if (player.hidableControls) {
                        player.startControlsTimer();
                    }

                    var newVolume = Math.min(media.volume + 0.1, 1);
                    media.setVolume(newVolume);
                }
            },
            {
                keys: [40], // DOWN
                action: function(player, media) {
                    player.container.find('.apbp-volume-slider').css('display','block');
                    if (player.hidableControls) {
                        player.startControlsTimer();
                    }

                    var newVolume = Math.max(media.volume - 0.1, 0);
                    media.setVolume(newVolume);
                }
            },
            {
                keys: [
                    37, // LEFT
                    227 // Google TV rewind
                ],
                action: function(player, media) {
                    if (!isNaN(media.duration) && media.duration > 0) {
                        if (player.hidableControls) {
                            player.startControlsTimer();
                        }

                        // 5%
                        var newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
                        media.setCurrentTime(newTime);
                    }
                }
            },
            {
                keys: [
                    39, // RIGHT
                    228 // Google TV forward
                ],
                action: function(player, media) {
                    if (!isNaN(media.duration) && media.duration > 0) {
                        if (player.hidableControls) {
                            player.startControlsTimer();
                        }

                        // 5%
                        var newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);
                        media.setCurrentTime(newTime);
                    }
                }
            },
            {
                keys: [70], // F
                action: function(player, media) {
                    if (typeof player.enterFullScreen != 'undefined') {
                        if (player.isFullScreen) {
                            player.exitFullScreen();
                        } else {
                            player.enterFullScreen();
                        }
                    }
                }
            },
            {
                keys: [77], // M
                action: function(player, media) {
                    player.container.find('.apbp-volume-slider').css('display','block');
                    if (player.hidableControls) {
                        player.startControlsTimer();
                    }
                    if (player.media.muted) {
                        player.setMuted(false);
                    } else {
                        player.setMuted(true);
                    }
                }
            }
        ]
    };

    apbp.playerIndex = 0;

    apbp.players = {};

    apbp.audioPicturebookPlayer = function(node, o) {
        if( !(this instanceof apbp.audioPicturebookPlayer) ) {
            return new apbp.audioPicturebookPlayer(node, o);
        }

        if(!apbp.legacy.testForSvg())
        {
            return;
        }

        var t = this;

        // these will be reset after the MediaElement.success fires
        t.$media = t.$node = $(node);
        t.node = t.media = t.$media[0];


        if(!t.node) {
            return;
        }

        // check for existing player
        if (typeof t.node.player != 'undefined') {
            return t.node.player;
        }


        // try to get options from data-mejsoptions
        if (typeof o == 'undefined') {
            o = t.$node.data('mejsoptions');
        }

        // extend default options
        t.options = $.extend({},apbp.apbpDefaults,o);

        if (!t.options.timeFormat) {
            // Generate the time format according to options
            t.options.timeFormat = 'mm:ss';
            if (t.options.alwaysShowHours) {
                t.options.timeFormat = 'hh:mm:ss';
            }
            if (t.options.showTimecodeFrameCount) {
                t.options.timeFormat += ':ff';
            }
        }

        mejs.Utility.calculateTimeFormat(0, t.options, t.options.framesPerSecond || 25);

        // unique ID
        t.id = 'apbp_' + apbp.playerIndex++;

        // add to player array (for focus events)
        apbp.players[t.id] = t;

        // start up
        t.init();

        return t;
    };

    apbp.audioPicturebookPlayer.prototype = {
        hasFocus: false,

        controlsAreVisible: true,
        playpausesvg: '<svg xmlns="http://www.w3.org/2000/svg" class="needsclick" viewBox="0 0 512 512"><circle style="fill:#fff;fill-opacity:1;stroke:none;" id="bg" class="needsclick" cx="256" cy="256" r="240" /><path class="play needsclick" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z"/><path class="pause needsclick" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-16 328c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160zm112 0c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16v160z"/></svg>',

        init: function() {
            var
                t = this,
                mf = mejs.MediaFeatures
                // options for MediaElement (shim)
                meOptions = $.extend(true, {}, t.options, {
                    success: function(media, domNode) { t.apbpReady(media, domNode); },
                    error: function(e) { t.handleError(e);}
                }),
                tagName = t.media.tagName.toLowerCase();

            t.isVideo = false;

            // remove native controls
            t.$media.removeAttr('controls');
            var videoPlayerTitle = mejs.i18n.t('Audio Player');
            // insert description for screen readers
            $('<span class="apbp-offscreen">' + videoPlayerTitle + '</span>').insertBefore(t.$media);
            // build container
            t.container =
                $('<div id="' + t.id + '" class="apbp-container ' + (mejs.MediaFeatures.svgAsImg ? 'svg' : 'no-svg') +
                    (apbp.legacy.testForFlexbox() ? ' flex ' : ' noFlex ') + 
                    ' mep-paused'+
                    '" tabindex="0" role="application" aria-label="' + videoPlayerTitle + '">'+
                    '<div class="apbp-clear"></div>'+
                    '<div class="apbp-inner">'+
                    '<div class="apbp-mediaelement"></div>'+
                    '<div class="apbp-layers">'+
                    '<div class="apbp-poster apbp-layer"></div>'+
                    '<div class="apbp-images apbp-layer"></div>'+
                    '<div class="apbp-paused-overlay apbp-layer">'+
                    '<span class="apbp-overlay-image-button">' + this.playpausesvg + '</span>'+
                    '</div>'+
                    '<div class="apbp-control-overlay apbp-layer">'+
                    '<div class="apbp-control-overlay-left"><span class="apbp-overlay-image-button"></span></div>'+
                    '<div class="apbp-control-overlay-center"><span class="apbp-overlay-image-button">' + this.playpausesvg + '</span></div>'+
                    '<div class="apbp-control-overlay-right"><span class="apbp-overlay-image-button"></span></div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="apbp-controls"></div>'+
                    '</div>' +
                    '</div>')
                    .addClass(t.$media[0].className)
                    .insertBefore(t.$media)
                    .focus(function ( e ) {
                        if( !t.controlsAreVisible ) {
                            var playButton = t.container.find('.apbp-playpause-button > button');
                            playButton.focus();
                        }
                    });

            // add classes for user and content
            t.container.addClass(
                (mf.isAndroid ? 'apbp-android ' : '') +
                (mf.isiOS ? 'apbp-ios ' : '') +
                (mf.isiPad ? 'apbp-ipad ' : '') +
                (mf.isiPhone ? 'apbp-iphone ' : '')
            );


            // move the <video/video> tag into the right spot
            if (mf.isiOS) {

                // sadly, you can't move nodes in iOS, so we have to destroy and recreate it!
                var $newMedia = t.$media.clone();

                $(t.container.find('.apbp-mediaelement')).append($newMedia);

                t.$media.remove();
                t.$node = t.$media = $newMedia;
                t.node = t.media = $newMedia[0];

            } else {

                // normal way of moving it into place (doesn't work on iOS)
                $(t.container.find('.apbp-mediaelement')).append(t.$media);
            }

            // needs to be assigned here, after iOS remap
            t.node.player = t;

            // find parts
            t.controls = t.container.find('.apbp-controls');
            t.layers = t.container.find('.apbp-layers');

            // determine the size

            /* size priority:
             (1) videoWidth (forced),
             (2) style="width;height;"
             (3) width attribute,
             (4) defaultVideoWidth (for unspecified cases)
             */

            // create MediaElementShim
            meOptions.pluginWidth = t.width;
            meOptions.pluginHeight = t.height;

            t.media = mejs.MediaElement(t.$media[0], meOptions);

            t.calculatePlayerHeight(t.layers);
            addEvent("resize", window, function() { t.calculatePlayerHeight(t.layers) }, true);

            // set the size, while we wait for the plugins to load below
            //t.setPlayerSize(t.width, t.height);
            t.modcontrollayer(t, t.container.find(".apbp-control-overlay"));
            var stuffHappened = function  stuffHappened(e) {
                t.resetControlsTimeout(t.controls);
            };
            $(t.controls).on("mousemove", stuffHappened);
            $(t.controls).on("mousedown", stuffHappened);

            // Add controls
            if(t.options.features.includes("progress")) {
                t.controls.append('<div class="apbp-progress">' +
                    '<div class="apbp-progress-loaded" />' +
                    '<div class="apbp-progress-current" />' +
                    '<span class="apbp-time-float" style="display: none;">' +
                    '<span class="apbp-time-float-current">00:00</span>' +
                    '<span class="apbp-time-float-corner"></span>' +
                    '</span>' +
                    '</div>');
            }
            var allButtons = $('<div class="apbp-control-buttons" />');
            t.controls.append(allButtons);
            //allButtons.append('<span class="apbp-button apbp-previous"><button><i class="fa fa-step-backward"></i></button></span>');
            this.buildprevtrack(this, allButtons, this.layers, this.media);
            //allButtons.append('<span class="apbp-button apbp-playpause apbp-playpause-play"><button><i class="fa fa-play"></i></button></span>');
            this.buildplaypause(this.player, allButtons, this.layers, this.media);
            //allButtons.append('<span class="apbp-button apbp-next"><button><i class="fa fa-step-forward"></i></button></span>');
            this.buildnexttrack(this, allButtons, this.layers, this.media);
            allButtons.append('<span class="apbp-controls-timestamp"><span class="apbp-timestamp-current">00:00</span> / <span class="apbp-timestamp-total"></span></span>')
            allButtons.append('<span class="apbp-controls-spacer"></span>');

            // Build playlist button
            //t.buildplaylist(t, allButtons, t.layers, t.$media[0]);

            t.buildvolume(t, allButtons, t.layers, t.$media[0]);
            t.buildprogressbar(this, t.controls, t.media);

            //allButtons.append('<span class="apbp-fullscreen apbp-fullscreen-expand"><button><span /></button></span>');
            this.buildaudiofullscreen(this, allButtons, this.layers, this.media);

            t.genPlaylist(t, allButtons, t.layers, t.$media[0]);

            t.loaded = t.controls.find(".apbp-progress-loaded");
            t.total = t.controls.find(".apbp-progress-current");

            //loading
            $(t.media).on('progress', function (e) {
                this.player.updateCurrent();
                this.player.updateTotal();
            });

            // current time
            $(t.media).on('timeupdate', function(e) {
                t.updateSlides(t.media, t.layers.find(".apbp-images"), e.currentTime);
                
                // Start next track preloading.
                if((t.media.duration - t.media.currentTime) < 20 && t.media.readyState == 4 && t.media.nearEnd != true) {
                    t.media.nearEnd = true;
                    var targetTrack = t.preload.querySelector('[src="' + e.currentTarget.src + '"]').nextSibling;
                    while (targetTrack && 1 != targetTrack.nodeType) {
                        targetTrack = targetTrack.nextSibling;
                    }
                    targetTrack.preload = "auto";

                    console.log("Preload next track" + targetTrack.src);
                }
                else if(t.media.currentTime < 1 && t.media.nearEnd == true)
                {
                    t.media.nearEnd = false;
                }
            });


            var mediaContainer = t.media.parentElement;
            t.preload = document.createElement("div");
            t.preload.classList = "apbp-preload";
            $(mediaContainer).append(t.preload);
            $(t.media).find("source").each(function(s, el) {
                var newAudio = document.createElement("audio")
                if(t.media.children[s].src != undefined) {
                    newAudio.src = t.media.children[s].src;
                    newAudio.controls = false;
                    newAudio.autoplay = false;
                    newAudio.preload = "none";
                    t.preload.appendChild(newAudio);
                }
            });
        },

        calculatePlayerHeight: function(layers) {
            var ratio = this.options.aspectRatio.split(":");
            var ratioMultiplier = ratio[1] / ratio[0];
            var targetHeight = layers.width() * ratioMultiplier;

            this.controls.removeClass("apbp-vanishing");
            this.controls.removeClass("apbp-vanishing-visible");
            this.controlsAreVisible = true;

            layers.removeClass('hide-apbp-layers')
            if(targetHeight == 0)
            {
                // No height, audio only.
                layers.addClass('hide-apbp-layers')
            }
            else if (this.isFullScreen) {
                layers.height("");
                if ((window.innerHeight - this.controls.height()) > targetHeight) {
                    layers.height(window.innerHeight - this.controls.height());
                }
                else {
                    layers.height("100%");
                    this.controls.addClass("apbp-vanishing");
                    this.resetControlsTimeout(this.controls);

                }
            }
            else {
                layers.height(layers.width() * ratioMultiplier);
            }

            if (layers.parent().width() < 320) {
                layers.parent().removeClass("apbp-small");
                layers.parent().addClass("apbp-tiny");
            }
            else if (layers.parent().width() < 500) {
                layers.parent().removeClass("apbp-tiny");
                layers.parent().addClass("apbp-small")
            }
            else {
                layers.parent().removeClass("apbp-tiny");
                layers.parent().removeClass("apbp-small");
            }
        },

        setPlayerHeight: function(player, height) {
            if(!this.options.setDimensions) {
                return false;
            }

            if (typeof height != 'undefined') {
                player.height = height;
            }
        },
        buildvolume: function(player, controls, layers, media) {

            // Android and iOS don't support volume controls
            if ((mejs.MediaFeatures.isAndroid || mejs.MediaFeatures.isiOS) && this.options.hideVolumeOnTouchDevices)
                return;

            var t = this,
                mode = t.options.audioVolume,
                mute = (mode == 'horizontal') ?

                    // horizontal version
                    $('<span class="apbp-button apbp-volume-button apbp-mute">' +
                        '<button type="button" aria-controls="' + t.id +
                        '" title="' + t.options.muteText +
                        '" aria-label="' + t.options.muteText +
                        '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971z"/><path class="sound-waves" d="M438.056 10.141C422.982.92 403.283 5.668 394.061 20.745c-9.221 15.077-4.473 34.774 10.604 43.995C468.967 104.063 512 174.983 512 256c0 73.431-36.077 142.292-96.507 184.206-14.522 10.072-18.129 30.01-8.057 44.532 10.076 14.528 30.016 18.126 44.531 8.057C529.633 438.927 576 350.406 576 256c0-103.244-54.579-194.877-137.944-245.859zM480 256c0-68.547-36.15-129.777-91.957-163.901-15.076-9.22-34.774-4.471-43.994 10.607-9.22 15.078-4.471 34.774 10.607 43.994C393.067 170.188 416 211.048 416 256c0 41.964-20.62 81.319-55.158 105.276-14.521 10.073-18.128 30.01-8.056 44.532 6.216 8.96 16.185 13.765 26.322 13.765a31.862 31.862 0 0 0 18.21-5.709C449.091 377.953 480 318.938 480 256zm-96 0c0-33.717-17.186-64.35-45.972-81.944-15.079-9.214-34.775-4.463-43.992 10.616s-4.464 34.775 10.615 43.992C314.263 234.538 320 244.757 320 256a32.056 32.056 0 0 1-13.802 26.332c-14.524 10.069-18.136 30.006-8.067 44.53 10.07 14.525 30.008 18.136 44.53 8.067C368.546 316.983 384 287.478 384 256z"/></svg></button>'+
                        '</span>' +
                        '<span class="apbp-horizontal-volume-slider" tabindex="0">' + // outer background
                        '<span class="apbp-offscreen">' + t.options.allyVolumeControlText + '</span>' +
                        '<div class="apbp-horizontal-volume-total"></div>'+ // line background
                        '<div class="apbp-horizontal-volume-current"></div>'+ // current volume
                        '<div class="apbp-horizontal-volume-handle"></div>'+ // handle
                        '</span>'
                    )
                        .appendTo(controls) :

                    // vertical version
                    $('<span class="apbp-button apbp-volume-button apbp-mute">'+
                        '<button type="button" aria-controls="' + t.id +
                        '" title="' + t.options.muteText +
                        '" aria-label="' + t.options.muteText +
                        '"></button>'+
                        '<span class="apbp-volume-slider" tabindex="0">'+ // outer background
                        '<span class="apbp-offscreen">' + t.options.allyVolumeControlText + '</span>' +
                        '<div class="apbp-volume-total"></div>'+ // line background
                        '<div class="apbp-volume-current"></div>'+ // current volume
                        '<div class="apbp-volume-handle"></div>'+ // handle
                        '</span>'+
                        '</span>')
                        .appendTo(controls),
                volumeSlider = t.container.find('.apbp-volume-slider, .apbp-horizontal-volume-slider'),
                volumeTotal = t.container.find('.apbp-volume-total, .apbp-horizontal-volume-total'),
                volumeCurrent = t.container.find('.apbp-volume-current, .apbp-horizontal-volume-current'),
                volumeHandle = t.container.find('.apbp-volume-handle, .apbp-horizontal-volume-handle'),

                positionVolumeHandle = function(volume, secondTry) {

                    if (!volumeSlider.is(':visible') && typeof secondTry == 'undefined') {
                        volumeSlider.show();
                        positionVolumeHandle(volume, true);
                        volumeSlider.hide();
                        return;
                    }

                    // correct to 0-1
                    volume = Math.max(0,volume);
                    volume = Math.min(volume,1);

                    // ajust mute button style
                    if (volume === 0) {
                        mute.removeClass('apbp-mute').addClass('apbp-unmute');
                        mute.children('button').attr('title', mejs.i18n.t('Unmute')).attr('aria-label', mejs.i18n.t('Unmute'));
                    } else {
                        mute.removeClass('apbp-unmute').addClass('apbp-mute');
                        mute.children('button').attr('title', mejs.i18n.t('Mute')).attr('aria-label', mejs.i18n.t('Mute'));
                    }

                    // top/left of full size volume slider background
                    var totalPosition = volumeTotal.position();
                    // position slider
                    if (mode == 'vertical') {
                        var
                            // height of the full size volume slider background
                            totalHeight = volumeTotal.height(),

                            // the new top position based on the current volume
                            // 70% volume on 100px height == top:30px
                            newTop = totalHeight - (totalHeight * volume);

                        // handle
                        volumeHandle.css('top', Math.round(totalPosition.top + newTop - (volumeHandle.height() / 2)));

                        // show the current visibility
                        volumeCurrent.height(totalHeight - newTop );
                        volumeCurrent.css('top', totalPosition.top + newTop);
                    } else {
                        var
                            // height of the full size volume slider background
                            totalWidth = volumeTotal.width(),

                            // the new left position based on the current volume
                            newLeft = totalWidth * volume;

                        // handle
                        volumeHandle.css('left', Math.round(totalPosition.left + newLeft - (volumeHandle.width() / 2)));

                        // rezize the current part of the volume bar
                        volumeCurrent.width( Math.round(newLeft) );
                    }
                },
                handleVolumeMove = function(e) {

                    var volume = null,
                        totalOffset = volumeTotal.offset();

                    // calculate the new volume based on the mouse position
                    if (mode === 'vertical') {

                        var
                            railHeight = volumeTotal.height(),
                            newY = e.pageY - totalOffset.top;

                        volume = (railHeight - newY) / railHeight;

                        // the controls just hide themselves (usually when mouse moves too far up)
                        if (totalOffset.top === 0 || totalOffset.left === 0) {
                            return;
                        }

                    } else {
                        var
                            railWidth = volumeTotal.width(),
                            newX = e.pageX - totalOffset.left;

                        volume = newX / railWidth;
                    }

                    // ensure the volume isn't outside 0-1
                    volume = Math.max(0,volume);
                    volume = Math.min(volume,1);

                    // position the slider and handle
                    positionVolumeHandle(volume);

                    // set the media object (this will trigger the volumechanged event)
                    if (volume === 0) {
                        media.setMuted(true);
                    } else {
                        media.setMuted(false);
                    }
                    media.setVolume(volume);
                },
                mouseIsDown = false,
                mouseIsOver = false;

            // SLIDER

            mute
                .hover(function() {
                    volumeSlider.show();
                    mouseIsOver = true;
                }, function() {
                    mouseIsOver = false;

                    if (!mouseIsDown && mode == 'vertical')	{
                        volumeSlider.hide();
                    }
                });

            var updateVolumeSlider = function (e) {

                var volume = Math.floor(media.volume*100);

                volumeSlider.attr({
                    'aria-label': mejs.i18n.t('volumeSlider'),
                    'aria-valuemin': 0,
                    'aria-valuemax': 100,
                    'aria-valuenow': volume,
                    'aria-valuetext': volume+'%',
                    'role': 'slider',
                    'tabindex': 0
                });

            };

            volumeSlider
                .bind('mouseover', function() {
                    mouseIsOver = true;
                })
                .bind('mousedown', function (e) {
                    handleVolumeMove(e);
                    t.globalBind('mousemove.vol', function(e) {
                        handleVolumeMove(e);
                    });
                    t.globalBind('mouseup.vol', function () {
                        mouseIsDown = false;
                        t.globalUnbind('.vol');

                        if (!mouseIsOver && mode == 'vertical') {
                            volumeSlider.hide();
                        }
                    });
                    mouseIsDown = true;

                    return false;
                })
                .bind('keydown', function (e) {
                    var keyCode = e.keyCode;
                    var volume = media.volume;
                    switch (keyCode) {
                        case 38: // Up
                            volume += 0.1;
                            break;
                        case 40: // Down
                            volume = volume - 0.1;
                            break;
                        default:
                            return true;
                    }

                    mouseIsDown = false;
                    positionVolumeHandle(volume);
                    media.setVolume(volume);
                    return false;
                })
                .bind('blur', function () {
                    volumeSlider.hide();
                });

            // MUTE button
            mute.find('button').click(function() {
                media.setMuted( !media.muted );
            });

            //Keyboard input
            mute.find('button').bind('focus', function () {
                volumeSlider.show();
            });

            // listen for volume change events from other sources
            $(media).on('volumechange', function(e) {
                if (!mouseIsDown) {
                    if (media.muted) {
                        positionVolumeHandle(0);
                        mute.removeClass('apbp-mute').addClass('apbp-unmute');
                    } else {
                        positionVolumeHandle(media.volume);
                        mute.removeClass('apbp-unmute').addClass('apbp-mute');
                    }
                }
                updateVolumeSlider(e);
            });

            // mutes the media and sets the volume icon muted if the initial volume is set to 0
            if (player.options.startVolume === 0) {
                media.setMuted(true);
            }

            // shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
            if (media.pluginType === 'native') {
                media.setVolume(player.options.startVolume);
            }

            $(t.container).on('controlsresize', function() {
                positionVolumeHandle(media.volume);
            });
        },
        changePoster: function(posterUrl) {
            var t = this;
            t.layers.find(".apbp-poster").css("background-image", 'url("' + posterUrl + '")');
            //t.setPoster(posterUrl);
            t.layers.find(".apbp-poster").show();
        },
        changeSlides: function(slideUrl, slideInline, slideLang, poster) {
            this.layers.find(".apbp-images").empty();
            if (slideInline) {
                var slidesList = [];
                var slideStarts = [];

                for (var key = 0; key < slideInline.length; key++) {
                    var slideArr = slideInline[key];
                    if(slideArr.length == 2) {
                        var seconds = $.trim(mejs.Utility.convertSMPTEtoSeconds(slideArr[0]));
                        if (!seconds) {
                            continue;
                        }
                        slidesList[slidesList.length] = $('<div class="apbp-slide-image" style="background-image: url(\'' + slideArr[1] + '\');" data-start="' + seconds + '" />');
                        slideStarts[slideStarts.length] = seconds;
                    }
                }
                if(!this.options.stacking) {
                    for(var i = 1; i < slideStarts.length; i++) {
                        slidesList[i-1].attr("data-end", slideStarts[i]);
                    }
                }
                this.layers.find(".apbp-images").append(slidesList)

            }
        },
        updateCurrent: function() {
            if (this.media.duration > 0 && this.media.currentTime >= 0) {
                this.controls.find(".apbp-timestamp-current").text(mejs.Utility.secondsToTimeCode(this.media.currentTime, this.options));
                var percentCompleted = (this.media.currentTime / this.media.duration) * 100;
                var percentLoaded = this.getLoadedPercent();
                this.controls.find(".apbp-progress-current").css("width", percentCompleted + "%");
                this.controls.find(".apbp-progress-loaded").css("width", percentLoaded + "%");
            }
        },
        updateSlides: function(media, slides, current) {
            var currentTime = media.currentTime
            if(currentTime > 0.1) {
                slides.addClass("apbp-blackout")
            }
            else {
                slides.removeClass("apbp-blackout")
            }
          var allChildren = slides.children();
          allChildren.css("opacity", 0);
          var previousChildren = allChildren.filter(function(i, e) {
              return ($(e).data("start") <= media.currentTime) && (currentTime > 0) && (!$(e).data("end") || $(e).data("end") > media.currentTime);
          });
            previousChildren.css("opacity", 1);
        
          //$(previousChildren[previousChildren.length - 1]).css("opacity", 1);
        },
        getLoadedPercent: function(e) {

            var
                t = this,
                target = (e !== undefined) ? e.target : t.media,
                percent = null;

            // newest HTML5 spec has buffered array (FF4, Webkit)
            if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && target.duration) {
                // account for a real array with multiple values - always read the end of the last buffer
                percent = target.buffered.end(target.buffered.length - 1) / target.duration;
            }
            // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
            // to be anything other than 0. If the byte count is available we use this instead.
            // Browsers that support the else if do not seem to have the bufferedBytes value and
            // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
            else if (target && target.bytesTotal !== undefined && target.bytesTotal > 0 && target.bufferedBytes !== undefined) {
                percent = target.bufferedBytes / target.bytesTotal;
            }
            // Firefox 3 with an Ogg file seems to go this way
            else if (e && e.lengthComputable && e.total !== 0) {
                percent = e.loaded / e.total;
            }

            return percent * 100;
        },
        updateTotal: function() {
            if (this.media.duration >= 0) {
                this.controls.find(".apbp-timestamp-total").text(mejs.Utility.secondsToTimeCode(this.media.duration, this.options));
            }
        },
        buildplaylist: function(player, controls, layers, media) {
            var t = this;
            var playlistToggle = $('<div class="apbp-button apbp-playlist-plugin-button apbp-playlist-button ' + (player.options.playlist ? "apbp-hide-playlist" : "apbp-show-playlist") + '">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.playlistText + '"><i class="fa fa-list"></i></button>' + "</div>");
            playlistToggle.appendTo(controls).click(function() {
                t.togglePlaylistDisplay(player, layers, media);
            });
            t.playlistToggle = t.controls.find(".apbp-playlist-button");
        },
        togglePlaylistDisplay: function(player, layers, media, showHide) {
            var t = this;
            if (!!showHide) {
                player.options.playlist = showHide === "show" ? true : false;
            } else {
                player.options.playlist = !player.options.playlist;
            }
            $(media).trigger("mep-playlisttoggle", [ player.options.playlist ]);
            if (player.options.playlist) {
                layers.children(".apbp-playlist").fadeIn();
                t.playlistToggle.removeClass("apbp-show-playlist").addClass("apbp-hide-playlist");
            } else {
                layers.children(".apbp-playlist").fadeOut();
                t.playlistToggle.removeClass("apbp-hide-playlist").addClass("apbp-show-playlist");
            }
        },
        genPlaylist: function(player, controls, layers, media) {
            var t = this, playlist = $('<div class="apbp-playlist apbp-layer">' + '<ul class="apbp"></ul>' + "</div>").appendTo(layers);
            if (!!$(media).data("showplaylist")) {
                player.options.playlist = true;
                $("#" + player.id).find(".apbp-overlay-play").hide();
            }
            if (!player.options.playlist) {
                playlist.hide();
            }
            var getTrackName = function(trackUrl) {
                var trackUrlParts = trackUrl.split("/");
                if (trackUrlParts.length > 0) {
                    return decodeURIComponent(trackUrlParts[trackUrlParts.length - 1]);
                } else {
                    return "";
                }
            };
            //TODO: FIX for separate audio elements
            var tracks = [], sourceIsPlayable, foundMatchingType = "";
            $("#" + player.id).find(".apbp-mediaelement source").each(function() {
                if ($(this).parent()[0] && $(this).parent()[0].canPlayType) {
                    sourceIsPlayable = $(this).parent()[0].canPlayType(this.type);
                } else if ($(this).parent()[0] && $(this).parent()[0].player && $(this).parent()[0].player.media && $(this).parent()[0].player.media.canPlayType) {
                    sourceIsPlayable = $(this).parent()[0].player.media.canPlayType(this.type);
                } else {
                    console.error("Cannot determine if we can play this media (no canPlayType()) on" + $(this).toString());
                }
                if (!foundMatchingType && (sourceIsPlayable === "maybe" || sourceIsPlayable === "probably")) {
                    foundMatchingType = this.type;
                }
                if (!!foundMatchingType && this.type === foundMatchingType) {
                    if ($.trim(this.src) !== "") {
                        var track = {};
                        track.source = $.trim(this.src);
                        if ($.trim(this.title) !== "") {
                            track.name = $.trim(this.title);
                        } else {
                            track.name = getTrackName(track.source);
                        }
                        track.poster = $(this).data("poster");
                        track.slides = $(this).data("slides");
                        track.slidesinline = $(this).data("slides-inline");
                        track.slideslang = $(this).data("slides-lang");
                        tracks.push(track);
                    }
                }
            });
            for (var track in tracks) {
                var $thisLi = $('<li data-url="' + tracks[track].source + '" data-poster="' + tracks[track].poster + (!tracks[track].slides ? "" : '" data-slides="' + tracks[track].slides) + (!tracks[track].slideslang ? "" : '" data-slides-lang="' + tracks[track].slideslang) + '" title="' + tracks[track].name + '"><span>' + tracks[track].name + "</span></li>");
                $thisLi.data("slides-inline", tracks[track].slidesinline);
                layers.find(".apbp-playlist > ul").append($thisLi);
                if ($(player.media).hasClass("mep-slider")) {
                    $thisLi.css({
                        "background-image": 'url("' + $thisLi.data("poster") + '")'
                    });
                }
            }
            layers.find("li:first").addClass("current played");
            var firstTrack = layers.find("li:first").first();
            player.changePoster(firstTrack.data("poster"));
            player.changeSlides(firstTrack.data("slides"), firstTrack.data("slides-inline"), firstTrack.data("slides-lang"), firstTrack.data("poster"));

            player.container.trigger("trackUpdate", [0, tracks.length]);

            layers.find(".apbp-playlist > ul li").click(function() {
                if (!$(this).hasClass("current")) {
                    $(this).addClass("played");
                    player.playTrack($(this));
                } else {
                    if (!player.media.paused) {
                        player.pause();
                    } else {
                        player.play();
                    }
                }
            });
            $(media).on("ended", function() {
                player.playNextTrack();
            });
            $(media).on("playing", function() {
                player.container.removeClass("mep-paused").addClass("mep-playing");
                if (player.isVideo) {
                    t.togglePlaylistDisplay(player, layers, media, "hide");
                }
            });
            $(media).on("play", function() {
                if (!player.isVideo) {
                    layers.find(".apbp-poster").show();
                }
            }, false);
            $(media).on("pause", function() {
                player.container.removeClass("mep-playing").addClass("mep-paused");
            });


        },
        buildplaypause: function(player, controls, layers, media) {
            var
                t = this,
                op = t.options,
                play =
                    $('<span class="apbp-button apbp-playpause apbp-playpause-play" >' +
                        '<button type="button" aria-controls="' + t.id + '" title="' + op.playText + '" aria-label="' + op.playText + '">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path class="play" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/><path class="pause" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"/>' +
                        '</button>' +
                        '</span>')
                        .appendTo(controls)
                        .click(function(e) {
                            e.preventDefault();

                            if (media.paused) {
                                media.play();
                            } else {
                                media.pause();
                            }

                            return false;
                        }),
                play_btn = play.find('button');


            function togglePlayPause(which) {
                if ('play' === which) {
                    play.removeClass('apbp-playpause-play').addClass('apbp-playpause-pause');
                    play_btn.attr({
                        'title': op.pauseText,
                        'aria-label': op.pauseText
                    });
                } else {
                    play.removeClass('apbp-playpause-pause').addClass('apbp-playpause-play');
                    play_btn.attr({
                        'title': op.playText,
                        'aria-label': op.playText
                    });
                }
            };
            togglePlayPause('pse');


            $(media).on('play',function() {
                togglePlayPause('play');
            });
            $(media).on('playing',function() {
                togglePlayPause('play');
            });


            $(media).on('pause',function() {
                togglePlayPause('pse');
            });
            $(media).on('paused',function() {
                togglePlayPause('pse');
            });
        },
        nexttracksvg: function(dummy, flipped) {
            var transform = '';
             if(flipped) {
                transform = 'transform="rotate(180,224,256)"';
             }
                 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path ' + transform + ' d="M 41.14804,498.27885 V 13.721154 c 0,-7.5426429 6.171254,-13.71389652 13.713897,-13.71389652 h 54.855583 c 7.54265,0 13.7139,6.17125362 13.7139,13.71389652 V 215.31544 L 346.85366,8.4641606 c 23.54219,-19.5423036 59.9983,-3.1999093 59.9983,28.1134884 V 475.42235 c 0,31.3134 -36.45611,47.65579 -59.9983,28.11349 L 123.43142,297.94167 v 200.33718 c 0,7.54264 -6.17125,13.71389 -13.7139,13.71389 H 54.861937 c -7.542643,0 -13.713897,-6.17125 -13.713897,-13.71389 z"/></svg>';
             },
        buildprevtrack: function(player, controls, layers, media) {
            var t = this;
            var prevTrack = $('<span class="apbp-button apbp-previous">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.prevText + '">' + player.nexttracksvg(false) + '</button>' + "</span>");
            prevTrack.appendTo(controls).click(function() {
                $(media).trigger("apbp-playprevtrack");
                player.playPrevTrack();
            });
            $(player.container).on("trackUpdate", function(e, current, total) {
                if((current <= 0) && !player.loopPlaylist) {
                    prevTrack.addClass("apbp-disabled");
                    prevTrack.find("button").prop("disabled", true);
                }
                else {
                    prevTrack.removeClass("apbp-disabled");
                    prevTrack.find("button").prop("disabled", false);
                }
            });
            t.prevTrack = t.controls.find(".apbp-prevtrack-button");
        },
        prevTrackClick: function() {
            var t = this;
            t.prevTrack.trigger("click");
        },
        buildnexttrack: function(player, controls, layers, media) {
            var t = this;
            var nextTrack = $('<div class="apbp-button apbp-next">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.nextText + '">' + player.nexttracksvg(true, true) + '</button>' + "</div>");
            nextTrack.appendTo(controls).click(function() {
                $(media).trigger("apbp-playnexttrack");
                player.playNextTrack();
            });
            player.container.on("trackUpdate", function(e, current, total) {
                if((current >= total - 1) && !player.loopPlaylist) {
                    nextTrack.addClass("apbp-disabled");
                    nextTrack.find("button").prop("disabled", true);
                }
                else {
                    nextTrack.removeClass("apbp-disabled");
                    nextTrack.find("button").prop("disabled", false);
                }
            });
            t.nextTrack = t.controls.find(".apbp-nexttrack-button");
        },
        nextTrackClick: function() {
            var t = this;
            t.nextTrack.trigger("click");
        },
        playNextTrack: function() {
            var t = this, nxt;
            var tracks = t.layers.find(".apbp-playlist > ul > li");
            var current = tracks.filter(".current");
            var notplayed = tracks.not(".played");
            if (notplayed.length < 1) {
                current.removeClass("played").siblings().removeClass("played");
                notplayed = tracks.not(".current");
            }
            var atEnd = false;
            nxt = current.next();
            if (nxt.length < 1 && t.options.loopPlaylist) {
                nxt = current.siblings().first();
                atEnd = true;
            }
            t.options.loop = false;
            if (nxt.length == 1) {
                nxt.addClass("played");
                t.playTrack(nxt);
            }
        },
        playPrevTrack: function() {
            var t = this, prev;
            var tracks = t.layers.find(".apbp-playlist > ul > li");
            var current = tracks.filter(".current");
            var played = tracks.filter(".played").not(".current");
            if (played.length < 1) {
                current.removeClass("played");
                played = tracks.not(".current");
            }
            prev = current.prev();
            if (prev.length < 1 && t.options.loopPlaylist) {
                prev = current.siblings().last();
            }
            if (prev.length == 1) {
                current.removeClass("played");
                this.playTrack(prev);
            }
        },
        playTrack: function(track) {
            var t = this;
            try { t.media.pause(); } catch(e){}
            t.media.setSrc(track.data("url"));
            if (!t.media.isLoaded) {
                t.media.load()
            }
            t.changePoster(track.data("poster"));
            //t.resetSlides();
            t.changeSlides(track.data("slides"), track.data("slides-inline"), track.data("slides-lang"), track.data("poster"));
            t.media.play();
            track.addClass("current").siblings().removeClass("current");

            var totalTracks = track.parent().children().length,
                currentTrack = track.index();
            t.container.trigger("trackUpdate", [currentTrack, totalTracks]);
        },
        apbpReady: function(media, domNode) {
            var t = this,
                mf = mejs.MediaFeatures,
                autoplayAttr = domNode.getAttribute('autoplay'),
                autoplay = !(typeof autoplayAttr == 'undefined' || autoplayAttr === null || autoplayAttr === 'false'),
                featureIndex,
                feature;

            // make sure it can't create itself again if a plugin reloads
            if (t.created) {
                return;
            } else {
                t.created = true;
            }

            t.media = media;
            t.domNode = domNode;

            t.updateCurrent();
            t.updateTotal();
            t.updateSlides(t.media, t.layers.find(".apbp-images"), 0);

            // resize on the first play
            $(t.media).on('loadedmetadata', function(e) {
                if (t.updateCurrent) {
                    t.updateCurrent();
                }
                if (t.updateTotal) {
                    t.updateTotal();
                }
                t.updateSlides(t.media, t.layers.find(".apbp-images"), e.currentTime);
            });
            $(t.media).on('loadeddata', function(e) {
                if (t.updateCurrent) {
                    t.updateCurrent();
                }
                if (t.updateTotal) {
                    t.updateTotal();
                }
            });

            // Only change the time format when necessary
            var duration = null;
            $(t.media).on('timeupdate',function() {
                if (duration !== this.duration) {
                    this.player.updateCurrent();
                }
            });


        },
        buildaudiofullscreen: function(player, controls, layers, media) {
            var t = this;
            if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
                var func = function(e) {
                    if(screenfull.isFullscreen) {
                        player.container.addClass("apbp-fullscreen");
                        player.isFullScreen = true;
                    }
                    else {
                        player.container.removeClass("apbp-fullscreen");
                        player.isFullScreen = false;
                    }
                    player.calculatePlayerHeight(player.layers)
                };
                player.globalBind(mejs.MediaFeatures.fullScreenEventName, func);
                $(window.document).on('fullscreenchange', func);
            }
            else {
                var func = function(e) {
                    if(screenfull.isFullscreen) {
                        if(screenfull.enabled) {
                            //screenfull.request(player.container[0]);
                        }
                        else {
                            player.container.addClass("apbp-fakefullscreen");
                        }
                        player.container.addClass("apbp-fullscreen");
                        player.isFullScreen = true;
                    }
                    else {
                        if(screenfull.enabled) {
                            //screenfull.exit();
                        }
                        else {
                            player.container.removeClass("apbp-fakefullscreen");
                        }
                        player.container.removeClass("apbp-fullscreen");
                        player.isFullScreen = false;
                    }
                    player.calculatePlayerHeight(player.layers)
                };
                player.globalBind(mejs.MediaFeatures.fullScreenEventName, func);
            }
            t.fullscreenBtn = $('<span class="apbp-button apbp-fullscreen-expandcontract">' + '<button type="button" aria-controls="' + t.id + '" title="' + t.options.fullscreenText + '" aria-label="' + t.options.fullscreenText + '">'
                    + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 32 448 448"><path class="compress" d="M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z"/><path class="expand" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"/></svg>'
                    + '</button>' + "</span>");
            var hasFullscreenFeature = false;
            console.log(player.options);
            console.log(player.options.features);
            if(player.options && player.options.features)
            {
                for(var i = 0; i < player.options.features.length; i++)
                {
                    console.log(player.options.features[i]);
                    if(player.options.features[i] == 'fullscreen')
                    {
                        hasFullscreenFeature = true;
                    }
                }
            }
            if(hasFullscreenFeature)
            {
                t.fullscreenBtn.appendTo(controls);
            }

            var fullscreenClick = function(e) {
                if(player.isFullScreen) {
                    if(screenfull.enabled) {
                        screenfull.exit();
                    }
                    else {
                        player.container.removeClass("apbp-fakefullscreen");
                    }
                    player.container.removeClass("apbp-fullscreen");
                    player.isFullScreen = false;
                }
                else {
                    if(screenfull.enabled) {
                        screenfull.request(player.container[0]);
                    }
                    else {
                        player.container.addClass("apbp-fakefullscreen");
                    }
                    player.container.addClass("apbp-fullscreen");
                    player.isFullScreen = true;
                }
                player.calculatePlayerHeight(player.layers);
            };
            t.fullscreenBtn.on('click', fullscreenClick);
        },
        buildprogressbar: function(player, controls, media){
            var
                t = this,
                total = controls.find('.apbp-progress'),
                loaded  = controls.find('.apbp-progress-loaded'),
                current  = controls.find('.apbp-progress-current'),
                timefloat  = controls.find('.apbp-time-float'),
                timefloatcurrent  = controls.find('.apbp-time-float-current');

            var handleMouseMove = function (e) {


                var offset = total.offset(),
                    width = total.width(),
                    percentage = 0,
                    newTime = 0,
                    pos = 0,
                    x;

                // mouse or touch position relative to the object
                if (e.originalEvent && e.originalEvent.changedTouches) {
                    x = e.originalEvent.changedTouches[0].pageX;
                } else if (e.changedTouches) { // for Zepto
                    x = e.changedTouches[0].pageX;
                } else {
                    x = e.pageX;
                }

                if (media.duration) {
                    if (x < offset.left) {
                        x = offset.left;
                    } else if (x > width + offset.left) {
                        x = width + offset.left;
                    }

                    pos = x - offset.left;
                    percentage = (pos / width);
                    newTime = (percentage <= 0.02) ? 0 : percentage * media.duration;

                    // seek to where the mouse is
                    if (mouseIsDown && newTime !== media.currentTime) {
                        media.setCurrentTime(newTime);
                    }

                    // position floating time box
                    if (!mejs.MediaFeatures.hasTouch) {
                        console.log("Width: ", timefloat.width());
                        timefloat.css('left', pos - (timefloat.width() / 2));
                        timefloatcurrent.html( mejs.Utility.secondsToTimeCode(newTime, player.options) );
                        timefloat.show();
                    }
                }
            },
            mouseIsDown = false,
            mouseIsOver = false,
            lastKeyPressTime = 0,
            startedPaused = false,
            autoRewindInitial = player.options.autoRewind;

            total
                .bind('mousedown touchstart', function (e) {
                    // only handle left clicks or touch
                    if (e.which === 1 || e.which === 0) {
                        mouseIsDown = true;
                        handleMouseMove(e);
                        t.globalBind('mousemove.dur touchmove.dur', function(e) {
                            handleMouseMove(e);
                        });
                        t.globalBind('mouseup.dur touchend.dur', function (e) {
                            mouseIsDown = false;
                            timefloat.hide();
                            t.globalUnbind('.dur');
                        });
                    }
                })
                .bind('mouseenter', function(e) {
                    mouseIsOver = true;
                    t.globalBind('mousemove.dur', function(e) {
                        handleMouseMove(e);
                    });
                    if (!mejs.MediaFeatures.hasTouch) {
                        timefloat.show();
                    }
                })
                .bind('mouseleave',function(e) {
                    mouseIsOver = false;
                    if (!mouseIsDown) {
                        t.globalUnbind('.dur');
                        timefloat.hide();
                    }
                });




        },
        modcontrollayer: function(player, controlLayer) {
            var t = this;
            controlLayer.css("opacity", 0);

            var stuffHappened = function  stuffHappened(e) {
                t.resetControlsTimeout(t.controls);
                t.resetControlLayerTimeout(controlLayer);
            };

            var overlayEvents = "mousemove";
            var buttonEvents = "click touchend";
            if(t.options.handleFastclick)
            {
                overlayEvents = "mousemove click";
                buttonEvents = "click";
            }

            controlLayer.find(".apbp-control-overlay-left").on(overlayEvents, stuffHappened);
            controlLayer.find(".apbp-control-overlay-right").on(overlayEvents, stuffHappened);
            controlLayer.find(".apbp-control-overlay-center").on(overlayEvents, stuffHappened);
            controlLayer.find(".apbp-control-overlay-left span").on(buttonEvents, function clickedStuff(e) {
                if (t.controlsLayerVisible) {
                    t.playPrevTrack();
                }
                else {
                    t.controlsLayerVisible = true
                }
                t.resetControlsTimeout(t.controls);
                t.resetControlLayerTimeout(controlLayer);

                e.preventDefault();
            });
            controlLayer.find(".apbp-control-overlay-right span").on(buttonEvents, function clickedStuff(e) {
                if (t.controlsLayerVisible) {
                    t.playNextTrack();
                }
                else {
                    t.controlsLayerVisible = true
                }
                t.resetControlsTimeout(t.controls);
                t.resetControlLayerTimeout(controlLayer);

                e.preventDefault();
            });
            controlLayer.find(".apbp-control-overlay-center span").on(buttonEvents, function clickedStuff(e) {
                if (t.controlsLayerVisible) {
                    if (t.media.paused) {
                        t.media.play();
                    }
                    else {
                        t.media.pause();
                    }
                }
                else {
                    t.controlsLayerVisible = true
                }
                t.resetControlsTimeout(t.controls);
                t.resetControlLayerTimeout(controlLayer);

                e.preventDefault();
            });

        },
        resetControlLayerTimeout: function(controls) {
            if (typeof this.controlsLayerTimeout === "number") {
                window.clearTimeout(this.controlsLayerTimeout);
                delete this.controlsLayerTimeout;
                this.controlsLayerTimeout = null;
            }
            controls.css("opacity", 1);
            var t = this;
            t.controlsLayerVisible = true;

            this.controlsLayerTimeout = window.setTimeout(function(elm) { return function() {
                elm.css("opacity", 0);
                t.controlsLayerVisible = false;
            }}(controls), 2000)
        },
        resetControlsTimeout: function(controls) {
            var t = this;
            if (typeof this.controlsTimeout === "number") {
                window.clearTimeout(this.controlsTimeout);
                delete this.controlsTimeout;
                this.controlsTimeout = null;
            }
            controls.addClass("apbp-vanishing-visible");
            t.controlsAreVisible = true;

            var vanishControls = function vanishControls() {
                t.controls.removeClass("apbp-vanishing-visible");
                t.controlsAreVisible = false;
            };

            this.controlsTimeout = window.setTimeout(vanishControls, 2000);
        }
    };

    (function(){
        var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;

        function splitEvents(events, id) {
            // add player ID as an event namespace so it's easier to unbind them all later
            var ret = {d: [], w: []};
            $.each((events || '').split(' '), function(k, v){
                var eventname = v + '.' + id;
                if (eventname.indexOf('.') === 0) {
                    ret.d.push(eventname);
                    ret.w.push(eventname);
                }
                else {
                    ret[rwindow.test(v) ? 'w' : 'd'].push(eventname);
                }
            });
            ret.d = ret.d.join(' ');
            ret.w = ret.w.join(' ');
            return ret;
        }

        apbp.audioPicturebookPlayer.prototype.globalBind = function(events, data, callback) {
            var t = this;
            events = splitEvents(events, t.id);
            if (events.d) $(document).bind(events.d, data, callback);
            if (events.w) $(window).bind(events.w, data, callback);
        };

        apbp.audioPicturebookPlayer.prototype.globalUnbind = function(events, callback) {
            var t = this;
            events = splitEvents(events, t.id);
            if (events.d) $(document).unbind(events.d, callback);
            if (events.w) $(window).unbind(events.w, callback);
        };
    })();


    // turn into jQuery plugin
    if (typeof $ != 'undefined') {
        $.fn.audiopicturebookplayer = function (options) {
            if (options === false) {
                this.each(function () {
                    var player = $(this).data('audiopicturebookplayer');
                    if (player) {
                        player.remove();
                    }
                    $(this).removeData('audiopicturebookplayer');
                });
            }
            else {
                this.each(function () {
                    $(this).data('audiopicturebookplayer', new apbp.audioPicturebookPlayer(this, options));
                });
            }
            return this;
        };


        $(document).ready(function() {
            // auto enable using JSON attribute
            //var audioObs = getElementsByClassName('apbp-player', 'audio');
            //for (var audioOb in audioObs) {
            //    audioOb.data = new apbp.audioPicturebookPlayer(this, apbp.apbpDefaults);
            //}
            $('.apbp-player').audiopicturebookplayer();
        });
    }

    // push out to window
    window.MediaElementPlayer = mejs.MediaElementPlayer;

})(jQuery);
