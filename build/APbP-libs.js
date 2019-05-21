(function(){"use strict";var e=typeof module!=="undefined"&&module.exports;var l=typeof Element!=="undefined"&&"ALLOW_KEYBOARD_INPUT"in Element;var t=function(){var e;var n;var l=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]];var t=0;var r=l.length;var u={};for(;t<r;t++){e=l[t];if(e&&e[1]in document){for(t=0,n=e.length;t<n;t++){u[l[0][t]]=e[t]}return u}}return false}();var n={request:function(e){var n=t.requestFullscreen;e=e||document.documentElement;if(/5\.1[\.\d]* Safari/.test(navigator.userAgent)){e[n]()}else{e[n](l&&Element.ALLOW_KEYBOARD_INPUT)}},exit:function(){document[t.exitFullscreen]()},toggle:function(e){if(this.isFullscreen){this.exit()}else{this.request(e)}},raw:t};if(!t){if(e){module.exports=false}else{window.screenfull=false}return}Object.defineProperties(n,{isFullscreen:{get:function(){return Boolean(document[t.fullscreenElement])}},element:{enumerable:true,get:function(){return document[t.fullscreenElement]}},enabled:{enumerable:true,get:function(){return Boolean(document[t.fullscreenEnabled])}}});if(e){module.exports=n}else{window.screenfull=n}})();var getElementsByClassName=function(e,n,l){if(document.getElementsByClassName){getElementsByClassName=function(e,n,l){l=l||document;var t=l.getElementsByClassName(e),r=n?new RegExp("\\b"+n+"\\b","i"):null,u=[],s;for(var a=0,c=t.length;a<c;a+=1){s=t[a];if(!r||r.test(s.nodeName)){u.push(s)}}return u}}else if(document.evaluate){getElementsByClassName=function(e,n,l){n=n||"*";l=l||document;var t=e.split(" "),r="",u="http://www.w3.org/1999/xhtml",s=document.documentElement.namespaceURI===u?u:null,a=[],c,i;for(var o=0,f=t.length;o<f;o+=1){r+="[contains(concat(' ', @class, ' '), ' "+t[o]+" ')]"}try{c=document.evaluate(".//"+n+r,l,s,0,null)}catch(m){c=document.evaluate(".//"+n+r,l,null,0,null)}while(i=c.iterateNext()){a.push(i)}return a}}else{getElementsByClassName=function(e,n,l){n=n||"*";l=l||document;var t=e.split(" "),r=[],u=n==="*"&&l.all?l.all:l.getElementsByTagName(n),s,a=[],c;for(var i=0,o=t.length;i<o;i+=1){r.push(new RegExp("(^|\\s)"+t[i]+"(\\s|$)"))}for(var f=0,m=u.length;f<m;f+=1){s=u[f];c=false;for(var d=0,E=r.length;d<E;d+=1){c=r[d].test(s.className);if(!c){break}}if(c){a.push(s)}}return a}}return getElementsByClassName(e,n,l)};function addEvent(e,n,l){if(n.addEventListener)n.addEventListener(e,l,false);else if(n.attachEvent){n.attachEvent("on"+e,l)}else{n[e]=l}}if(!Array.prototype.includes){Array.prototype.includes=function(e){"use strict";if(this==null){throw new TypeError("Array.prototype.includes called on null or undefined")}var n=Object(this);var l=parseInt(n.length,10)||0;if(l===0){return false}var t=parseInt(arguments[1],10)||0;var r;if(t>=0){r=t}else{r=l+t;if(r<0){r=0}}var u;while(r<l){u=n[r];if(e===u||e!==e&&u!==u){return true}r++}return false}}