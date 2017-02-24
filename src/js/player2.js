/**
 * Created by james on 16/12/16.
 */
apbp = {
    version: "0.1",
    nextPlayerIndex: 0,
    optionsDefaults: {
        aspectRatio: "16:9",
        // set dimensions via JS instead of CSS
        setDimensions: true,
        // initial volume when the player starts (overrided by user cookie)
        startVolume: 0.8,
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
        // Hide controls when playing and mouse is not over the video
        alwaysShowControls: false,
        // Enable click image element to toggle play/pause
        clickToPlayPause: true,
        // turns keyboard support on and off for this instance
        enableKeyboard: true,
        // whenthis player starts, it will pause other players
        pauseOtherPlayers: true,
        hideVolumeOnTouchDevices: true,
        loopPlaylist: true
    }
};

(function applyJquery(jq) {
    apbp.generatePlayer = function generatePlayer(target, options) {
        if(options === false) {
            options = {};
        }

        options.prototype = apbp.apbpDefaults;

        var container = document.createElement('div');

        container.id = "apbp_" + apbp.nextPlayerIndex;
        apbp.nextPlayerIndex += 1;

        if(container.classList) {
            container.classList.add("apbp-container")
        }
        else {
            container.className += " apbp-container";
        }

        container.insertAdjacentHTML('beforeend', '<div class="apbp-clear" />');

        var inner = document.createElement('div');
        inner.className = "apbp-inner";

        //var poster = document.createElement('div');
        //poster.className = "apbp-poster apbp-layer";
        //inner.insertAdjacentHTML('beforeend', poster);

        //var images = document.createElement('div');
        //images.className = "apbp-images apbp-layer";
        //inner.insertAdjacentHTML('beforeend', images);

        container.appendChild(inner);

        if(target.parentNode) {
            target.parentNode.insertBefore(container, target);
        }

        container.apbpPlayer = {
            status: {
                fullscreen: false,
                controlsVisible: true,
                playing: false,
            },
            elements: {
                inner: inner,
                mediaelement: null,
                layers: null,
                controls: null
            }
        };
        container.apbpPlayer.prototype = apbp.apbpPlayer;

        container.apbpPlayer.elements.mediaelement
    };

    apbp.apbpPlayer = {
        genMediaElement: function genMediaElement() {

        },
    }
})(jQuery);
