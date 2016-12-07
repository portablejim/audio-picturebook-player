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

        aspectRatio: "16:9",

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
                        player.showControls();
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
                        player.showControls();
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
                            player.showControls();
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
                            player.showControls();
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
                        player.showControls();
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
                    '" tabindex="0" role="application" aria-label="' + videoPlayerTitle + '">'+
                    '<div class="apbp-clear"></div>'+
                    '<div class="apbp-inner">'+
                    '<div class="apbp-mediaelement"></div>'+
                    '<div class="apbp-layers">'+
                    '<div class="apbp-poster apbp-layer"></div>'+
                    '<div class="apbp-images apbp-layer"></div>'+
                    '<div class="apbp-control-overlay apbp-layer"></div>'+
                    '</div>'+
                    '<div class="apbp-controls"></div>'+
                    '</div>' +
                    '</div>')
                    .addClass(t.$media[0].className)
                    .insertBefore(t.$media)
                    .focus(function ( e ) {
                        if( !t.controlsAreVisible ) {
                            t.showControls(true);
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

                t.container.find('.apbp-mediaelement').append($newMedia);

                t.$media.remove();
                t.$node = t.$media = $newMedia;
                t.node = t.media = $newMedia[0];

            } else {

                // normal way of moving it into place (doesn't work on iOS)
                t.container.find('.apbp-mediaelement').append(t.$media);
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

            t.calculatePlayerHeight(t.layers);
            addEvent("resize", window, function() { t.calculatePlayerHeight(t.layers) }, true);

            // set the size, while we wait for the plugins to load below
            //t.setPlayerSize(t.width, t.height);


            // Add controls
            if(t.options.features.includes("progress")) {
                t.controls.append('<div class="apbp-progress">' +
                    '<div class="apbp-progress-loaded" />' +
                    '<div class="apbp-progress-current" />' +
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

            //allButtons.append('<span class="apbp-fullscreen apbp-fullscreen-expand"><button><i class="fa fa-expand"></i></button></span>');
            this.buildaudiofullscreen(this, allButtons, this.layers, this.media);

            t.genPlaylist(t, allButtons, t.layers, t.$media[0]);

            t.loaded = t.controls.find(".apbp-progress-loaded");
            t.total = t.controls.find(".apbp-progress-current");


            // create MediaElementShim
            meOptions.pluginWidth = t.width;
            meOptions.pluginHeight = t.height;

            mejs.MediaElement(t.$media[0], meOptions);

            //loading
            t.media.addEventListener('progress', function (e) {
                this.player.updateCurrent();
                this.player.updateTotal();
            }, false);

            // current time
            t.media.addEventListener('timeupdate', function(e) {
                this.player.updateSlides(t.media, t.layers.find(".apbp-images"), e.currentTime);
            }, false);


        },

        calculatePlayerHeight: function(player) {
            var ratio = this.options.aspectRatio.split(":");
            var ratioMultiplier = ratio[1] / ratio[0];
            var targetHeight = player.width() * ratioMultiplier;

            this.controls.removeClass("apbp-vanishing");
            this.controls.removeClass("apbp-vanishing-visible");
            this.controlsAreVisible = true;
            if (this.isFullScreen) {
                player.height("");
                if ((window.innerHeight - this.controls.height()) > targetHeight) {
                    player.height(window.innerHeight - this.controls.height());
                }
                else {
                    player.height("100%");
                    this.controls.addClass("apbp-vanishing");
                    this.resetControlsTimeout(this.controls);

                }
            }
            else {
                player.height(player.width() * ratioMultiplier);
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
                        '"><i class="fa "></i></button>'+
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
            media.addEventListener('volumechange', function(e) {
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
            }, false);

            // mutes the media and sets the volume icon muted if the initial volume is set to 0
            if (player.options.startVolume === 0) {
                media.setMuted(true);
            }

            // shim gets the startvolume as a parameter, but we have to set it on the native <video> and <audio> elements
            if (media.pluginType === 'native') {
                media.setVolume(player.options.startVolume);
            }

            t.container.on('controlsresize', function() {
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

                for (var key in slideInline) {
                    var slideArr = slideInline[key];
                    if(slideArr.length == 2) {
                        var seconds = $.trim(mejs.Utility.convertSMPTEtoSeconds(slideArr[0]));
                        if (!seconds) {
                            continue;
                        }
                        slidesList[slidesList.length] = $('<div class="apbp-slide-image" style="background-image: url(\'' + slideArr[1] + '\');" data-start="' + seconds + '" />');
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
              return ($(e).data("start") <= media.currentTime) && (currentTime > 0);
          });
          $(previousChildren[previousChildren.length - 1]).css("opacity", 1);
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
            media.addEventListener("ended", function() {
                player.playNextTrack();
            }, false);
            media.addEventListener("playing", function() {
                player.container.removeClass("mep-paused").addClass("mep-playing");
                if (player.isVideo) {
                    t.togglePlaylistDisplay(player, layers, media, "hide");
                }
            }, false);
            media.addEventListener("play", function() {
                if (!player.isVideo) {
                    layers.find(".apbp-poster").show();
                }
            }, false);
            media.addEventListener("pause", function() {
                player.container.removeClass("mep-playing").addClass("mep-paused");
            }, false);


        },
        buildplaypause: function(player, controls, layers, media) {
            var
                t = this,
                op = t.options,
                play =
                    $('<span class="apbp-button apbp-playpause apbp-playpause-play" >' +
                        '<button type="button" aria-controls="' + t.id + '" title="' + op.playText + '" aria-label="' + op.playText + '">' +
                        '<i class="fa"></i>' +
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


            media.addEventListener('play',function() {
                togglePlayPause('play');
            }, false);
            media.addEventListener('playing',function() {
                togglePlayPause('play');
            }, false);


            media.addEventListener('pause',function() {
                togglePlayPause('pse');
            }, false);
            media.addEventListener('paused',function() {
                togglePlayPause('pse');
            }, false);
        },
        buildprevtrack: function(player, controls, layers, media) {
            var t = this;
            var prevTrack = $('<span class="apbp-button apbp-previous">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.prevText + '"><i class="fa fa-step-backward"></i></button>' + "</span>");
            prevTrack.appendTo(controls).click(function() {
                $(media).trigger("apbp-playprevtrack");
                player.playPrevTrack();
            });
            player.container.on("trackUpdate", function(e, current, total) {
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
            var nextTrack = $('<div class="apbp-button apbp-next">' + '<button type="button" aria-controls="' + player.id + '" title="' + player.options.nextText + '"><i class="fa fa-step-forward"></i></button>' + "</div>");
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
            t.media.addEventListener('loadedmetadata', function(e) {
                if (t.updateCurrent) {
                    t.updateCurrent();
                }
                if (t.updateTotal) {
                    t.updateTotal();
                }
                this.player.updateSlides(t.media, t.layers.find(".apbp-images"), e.currentTime);
            }, false);
            t.media.addEventListener('loadeddata', function(e) {
                if (t.updateCurrent) {
                    t.updateCurrent();
                }
                if (t.updateTotal) {
                    t.updateTotal();
                }
            }, false);

            // Only change the time format when necessary
            var duration = null;
            t.media.addEventListener('timeupdate',function() {
                if (duration !== this.duration) {
                    this.player.updateCurrent();
                }
            }, false);


        },
        buildaudiofullscreen: function(player, controls, layers, media) {
            var t = this;
            if (mejs.MediaFeatures.hasTrueNativeFullScreen) {
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
            t.fullscreenBtn = $('<div class="apbp-button apbp-fullscreen-expandcontract">' + '<button type="button" aria-controls="' + t.id + '" title="' + t.options.fullscreenText + '" aria-label="' + t.options.fullscreenText + '"><i class="fa"></i></button>' + "</div>");
            t.fullscreenBtn.appendTo(controls);

            t.fullscreenBtn.on('click', function(e) {
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
            });
        },
        resetControlsTimeout: function(controls) {
            if (typeof this.controlsTimeout === "number") {
                window.clearTimeout(this.controlsTimeout);
            }
            controls.addClass("apbp-vanishing-visible");

            this.controlsTimeout = window.setTimeout(function(elm) { return function() {
                elm.removeClass("apbp-vanishing-visible");
            }}(controls), 5000)
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
