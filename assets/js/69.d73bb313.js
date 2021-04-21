/*! For license information please see 69.d73bb313.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[69],{1195:function(e,t,n){"use strict";n.r(t),function(e,n){function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var i=void 0!==e&&"[object global]"==={}.toString.call(e);function a(e,t){return 0===e.indexOf(t.toLowerCase())?e:"".concat(t.toLowerCase()).concat(e.substr(0,1).toUpperCase()).concat(e.substr(1))}function u(e){return Boolean(e&&1===e.nodeType&&"nodeName"in e&&e.ownerDocument&&e.ownerDocument.defaultView)}function c(e){return!isNaN(parseFloat(e))&&isFinite(e)&&Math.floor(e)==e}function s(e){return/^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(e)}function l(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.id,n=e.url,r=t||n;if(!r)throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");if(c(r))return"https://vimeo.com/".concat(r);if(s(r))return r.replace("http:","https:");if(t)throw new TypeError("\u201c".concat(t,"\u201d is not a valid video id."));throw new TypeError("\u201c".concat(r,"\u201d is not a vimeo.com url."))}var f=void 0!==Array.prototype.indexOf,d="undefined"!=typeof window&&void 0!==window.postMessage;if(!(i||f&&d))throw new Error("Sorry, the Vimeo Player API is not available in this browser.");var h="undefined"!=typeof window?window:void 0!==e?e:"undefined"!=typeof self?self:{};!function(e){if(!e.WeakMap){var t=Object.prototype.hasOwnProperty,n=function(e,t,n){Object.defineProperty?Object.defineProperty(e,t,{configurable:!0,writable:!0,value:n}):e[t]=n};e.WeakMap=function(){function e(){if(void 0===this)throw new TypeError("Constructor WeakMap requires 'new'");if(n(this,"_id",i("_WeakMap")),arguments.length>0)throw new TypeError("WeakMap iterable is not supported")}function o(e,n){if(!r(e)||!t.call(e,"_id"))throw new TypeError(n+" method called on incompatible receiver "+typeof e)}function i(e){return e+"_"+a()+"."+a()}function a(){return Math.random().toString().substring(2)}return n(e.prototype,"delete",(function(e){if(o(this,"delete"),!r(e))return!1;var t=e[this._id];return!(!t||t[0]!==e)&&(delete e[this._id],!0)})),n(e.prototype,"get",(function(e){if(o(this,"get"),r(e)){var t=e[this._id];return t&&t[0]===e?t[1]:void 0}})),n(e.prototype,"has",(function(e){if(o(this,"has"),!r(e))return!1;var t=e[this._id];return!(!t||t[0]!==e)})),n(e.prototype,"set",(function(e,t){if(o(this,"set"),!r(e))throw new TypeError("Invalid value used as weak map key");var i=e[this._id];return i&&i[0]===e?(i[1]=t,this):(n(e,this._id,[e,t]),this)})),n(e,"_polyfill",!0),e}()}function r(e){return Object(e)===e}}("undefined"!=typeof self?self:"undefined"!=typeof window?window:h);var v=function(e,t){return e(t={exports:{}},t.exports),t.exports}((function(e){var t,r,o;o=function(){var e,t,r,o=Object.prototype.toString,i=void 0!==n?function(e){return n(e)}:setTimeout;try{Object.defineProperty({},"x",{}),e=function(e,t,n,r){return Object.defineProperty(e,t,{value:n,writable:!0,configurable:!1!==r})}}catch(y){e=function(e,t,n){return e[t]=n,e}}function a(e,n){r.add(e,n),t||(t=i(r.drain))}function u(e){var t,n=typeof e;return null==e||"object"!=n&&"function"!=n||(t=e.then),"function"==typeof t&&t}function c(){for(var e=0;e<this.chain.length;e++)s(this,1===this.state?this.chain[e].success:this.chain[e].failure,this.chain[e]);this.chain.length=0}function s(e,t,n){var r,o;try{!1===t?n.reject(e.msg):(r=!0===t?e.msg:t.call(void 0,e.msg))===n.promise?n.reject(TypeError("Promise-chain cycle")):(o=u(r))?o.call(r,n.resolve,n.reject):n.resolve(r)}catch(y){n.reject(y)}}function l(e){var t,n=this;if(!n.triggered){n.triggered=!0,n.def&&(n=n.def);try{(t=u(e))?a((function(){var r=new h(n);try{t.call(e,(function(){l.apply(r,arguments)}),(function(){f.apply(r,arguments)}))}catch(y){f.call(r,y)}})):(n.msg=e,n.state=1,n.chain.length>0&&a(c,n))}catch(y){f.call(new h(n),y)}}}function f(e){var t=this;t.triggered||(t.triggered=!0,t.def&&(t=t.def),t.msg=e,t.state=2,t.chain.length>0&&a(c,t))}function d(e,t,n,r){for(var o=0;o<t.length;o++)!function(o){e.resolve(t[o]).then((function(e){n(o,e)}),r)}(o)}function h(e){this.def=e,this.triggered=!1}function v(e){this.promise=e,this.state=0,this.triggered=!1,this.chain=[],this.msg=void 0}function m(e){if("function"!=typeof e)throw TypeError("Not a function");if(0!==this.__NPO__)throw TypeError("Not a promise");this.__NPO__=1;var t=new v(this);this.then=function(e,n){var r={success:"function"!=typeof e||e,failure:"function"==typeof n&&n};return r.promise=new this.constructor((function(e,t){if("function"!=typeof e||"function"!=typeof t)throw TypeError("Not a function");r.resolve=e,r.reject=t})),t.chain.push(r),0!==t.state&&a(c,t),r.promise},this.catch=function(e){return this.then(void 0,e)};try{e.call(void 0,(function(e){l.call(t,e)}),(function(e){f.call(t,e)}))}catch(y){f.call(t,y)}}r=function(){var e,n,r;function o(e,t){this.fn=e,this.self=t,this.next=void 0}return{add:function(t,i){r=new o(t,i),n?n.next=r:e=r,n=r,r=void 0},drain:function(){var r=e;for(e=n=t=void 0;r;)r.fn.call(r.self),r=r.next}}}();var p=e({},"constructor",m,!1);return m.prototype=p,e(p,"__NPO__",0,!1),e(m,"resolve",(function(e){return e&&"object"==typeof e&&1===e.__NPO__?e:new this((function(t,n){if("function"!=typeof t||"function"!=typeof n)throw TypeError("Not a function");t(e)}))})),e(m,"reject",(function(e){return new this((function(t,n){if("function"!=typeof t||"function"!=typeof n)throw TypeError("Not a function");n(e)}))})),e(m,"all",(function(e){var t=this;return"[object Array]"!=o.call(e)?t.reject(TypeError("Not an array")):0===e.length?t.resolve([]):new t((function(n,r){if("function"!=typeof n||"function"!=typeof r)throw TypeError("Not a function");var o=e.length,i=Array(o),a=0;d(t,e,(function(e,t){i[e]=t,++a===o&&n(i)}),r)}))})),e(m,"race",(function(e){var t=this;return"[object Array]"!=o.call(e)?t.reject(TypeError("Not an array")):new t((function(n,r){if("function"!=typeof n||"function"!=typeof r)throw TypeError("Not a function");d(t,e,(function(e,t){n(t)}),r)}))})),m},(r=h)[t="Promise"]=r[t]||o(),e.exports&&(e.exports=r[t])})),m=new WeakMap;function p(e,t,n){var r=m.get(e.element)||{};t in r||(r[t]=[]),r[t].push(n),m.set(e.element,r)}function y(e,t){return(m.get(e.element)||{})[t]||[]}function g(e,t,n){var r=m.get(e.element)||{};if(!r[t])return!0;if(!n)return r[t]=[],m.set(e.element,r),!0;var o=r[t].indexOf(n);return-1!==o&&r[t].splice(o,1),m.set(e.element,r),r[t]&&0===r[t].length}function w(e,t){var n=m.get(e);m.set(t,n),m.delete(e)}var b=["autopause","autoplay","background","byline","color","dnt","height","id","loop","maxheight","maxwidth","muted","playsinline","portrait","responsive","speed","title","transparent","url","width"];function T(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return b.reduce((function(t,n){var r=e.getAttribute("data-vimeo-".concat(n));return(r||""===r)&&(t[n]=""===r?1:r),t}),t)}function k(e,t){var n=e.html;if(!t)throw new TypeError("An element must be provided");if(null!==t.getAttribute("data-vimeo-initialized"))return t.querySelector("iframe");var r=document.createElement("div");return r.innerHTML=n,t.appendChild(r.firstChild),t.setAttribute("data-vimeo-initialized","true"),t.querySelector("iframe")}function E(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2?arguments[2]:void 0;return new Promise((function(r,o){if(!s(e))throw new TypeError("\u201c".concat(e,"\u201d is not a vimeo.com url."));var i="https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(e),"&domain=").concat(window.location.hostname);for(var a in t)t.hasOwnProperty(a)&&(i+="&".concat(a,"=").concat(encodeURIComponent(t[a])));var u="XDomainRequest"in window?new XDomainRequest:new XMLHttpRequest;u.open("GET",i,!0),u.onload=function(){if(404!==u.status)if(403!==u.status)try{var t=JSON.parse(u.responseText);if(403===t.domain_status_code)return k(t,n),void o(new Error("\u201c".concat(e,"\u201d is not embeddable.")));r(t)}catch(i){o(i)}else o(new Error("\u201c".concat(e,"\u201d is not embeddable.")));else o(new Error("\u201c".concat(e,"\u201d was not found.")))},u.onerror=function(){var e=u.status?" (".concat(u.status,")"):"";o(new Error("There was an error fetching the embed code from Vimeo".concat(e,".")))},u.send()}))}function _(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(t){return console.warn(t),{}}return e}function M(e,t,n){if(e.element.contentWindow&&e.element.contentWindow.postMessage){var r={method:t};void 0!==n&&(r.value=n);var o=parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/,"$1"));o>=8&&o<10&&(r=JSON.stringify(r)),e.element.contentWindow.postMessage(r,e.origin)}}function j(e,t){var n,r=[];if((t=_(t)).event){if("error"===t.event)y(e,t.data.method).forEach((function(n){var r=new Error(t.data.message);r.name=t.data.name,n.reject(r),g(e,t.data.method,n)}));r=y(e,"event:".concat(t.event)),n=t.data}else if(t.method){var o=function(e,t){var n=y(e,t);if(n.length<1)return!1;var r=n.shift();return g(e,t,r),r}(e,t.method);o&&(r.push(o),n=t.value)}r.forEach((function(t){try{if("function"==typeof t)return void t.call(e,n);t.resolve(n)}catch(r){}}))}var I=new WeakMap,P=new WeakMap,A=function(){function e(t){var n=this,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(r(this,e),window.jQuery&&t instanceof jQuery&&(t.length>1&&window.console&&console.warn&&console.warn("A jQuery object with multiple elements was passed, using the first element."),t=t[0]),"undefined"!=typeof document&&"string"==typeof t&&(t=document.getElementById(t)),!u(t))throw new TypeError("You must pass either a valid element or a valid id.");var i=t.ownerDocument.defaultView;if("IFRAME"!==t.nodeName){var a=t.querySelector("iframe");a&&(t=a)}if("IFRAME"===t.nodeName&&!s(t.getAttribute("src")||""))throw new Error("The player element passed isn\u2019t a Vimeo embed.");if(I.has(t))return I.get(t);this.element=t,this.origin="*";var c=new v((function(e,r){var a=function(t){if(s(t.origin)&&n.element.contentWindow===t.source){"*"===n.origin&&(n.origin=t.origin);var o=_(t.data);if(o&&"error"===o.event&&o.data&&"ready"===o.data.method){var i=new Error(o.data.message);return i.name=o.data.name,void r(i)}var a=o&&"ready"===o.event,u=o&&"ping"===o.method;if(a||u)return n.element.setAttribute("data-ready","true"),void e();j(n,o)}};if(i.addEventListener?i.addEventListener("message",a,!1):i.attachEvent&&i.attachEvent("onmessage",a),"IFRAME"!==n.element.nodeName){var u=T(t,o);E(l(u),u,t).then((function(e){var r=k(e,t);return n.element=r,n._originalElement=t,w(t,r),I.set(n.element,n),e})).catch(r)}}));return P.set(this,c),I.set(this.element,this),"IFRAME"===this.element.nodeName&&M(this,"ping"),this}var t,n,i;return t=e,(n=[{key:"callMethod",value:function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return new v((function(r,o){return t.ready().then((function(){p(t,e,{resolve:r,reject:o}),M(t,e,n)})).catch(o)}))}},{key:"get",value:function(e){var t=this;return new v((function(n,r){return e=a(e,"get"),t.ready().then((function(){p(t,e,{resolve:n,reject:r}),M(t,e)})).catch(r)}))}},{key:"set",value:function(e,t){var n=this;return new v((function(r,o){if(e=a(e,"set"),null==t)throw new TypeError("There must be a value to set.");return n.ready().then((function(){p(n,e,{resolve:r,reject:o}),M(n,e,t)})).catch(o)}))}},{key:"on",value:function(e,t){if(!e)throw new TypeError("You must pass an event name.");if(!t)throw new TypeError("You must pass a callback function.");if("function"!=typeof t)throw new TypeError("The callback must be a function.");0===y(this,"event:".concat(e)).length&&this.callMethod("addEventListener",e).catch((function(){})),p(this,"event:".concat(e),t)}},{key:"off",value:function(e,t){if(!e)throw new TypeError("You must pass an event name.");if(t&&"function"!=typeof t)throw new TypeError("The callback must be a function.");g(this,"event:".concat(e),t)&&this.callMethod("removeEventListener",e).catch((function(e){}))}},{key:"loadVideo",value:function(e){return this.callMethod("loadVideo",e)}},{key:"ready",value:function(){var e=P.get(this)||new v((function(e,t){t(new Error("Unknown player. Probably unloaded."))}));return v.resolve(e)}},{key:"addCuePoint",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.callMethod("addCuePoint",{time:e,data:t})}},{key:"removeCuePoint",value:function(e){return this.callMethod("removeCuePoint",e)}},{key:"enableTextTrack",value:function(e,t){if(!e)throw new TypeError("You must pass a language.");return this.callMethod("enableTextTrack",{language:e,kind:t})}},{key:"disableTextTrack",value:function(){return this.callMethod("disableTextTrack")}},{key:"pause",value:function(){return this.callMethod("pause")}},{key:"play",value:function(){return this.callMethod("play")}},{key:"unload",value:function(){return this.callMethod("unload")}},{key:"destroy",value:function(){var e=this;return new v((function(t){P.delete(e),I.delete(e.element),e._originalElement&&(I.delete(e._originalElement),e._originalElement.removeAttribute("data-vimeo-initialized")),e.element&&"IFRAME"===e.element.nodeName&&e.element.parentNode&&e.element.parentNode.removeChild(e.element),t()}))}},{key:"getAutopause",value:function(){return this.get("autopause")}},{key:"setAutopause",value:function(e){return this.set("autopause",e)}},{key:"getBuffered",value:function(){return this.get("buffered")}},{key:"getColor",value:function(){return this.get("color")}},{key:"setColor",value:function(e){return this.set("color",e)}},{key:"getCuePoints",value:function(){return this.get("cuePoints")}},{key:"getCurrentTime",value:function(){return this.get("currentTime")}},{key:"setCurrentTime",value:function(e){return this.set("currentTime",e)}},{key:"getDuration",value:function(){return this.get("duration")}},{key:"getEnded",value:function(){return this.get("ended")}},{key:"getLoop",value:function(){return this.get("loop")}},{key:"setLoop",value:function(e){return this.set("loop",e)}},{key:"getPaused",value:function(){return this.get("paused")}},{key:"getPlaybackRate",value:function(){return this.get("playbackRate")}},{key:"setPlaybackRate",value:function(e){return this.set("playbackRate",e)}},{key:"getPlayed",value:function(){return this.get("played")}},{key:"getSeekable",value:function(){return this.get("seekable")}},{key:"getSeeking",value:function(){return this.get("seeking")}},{key:"getTextTracks",value:function(){return this.get("textTracks")}},{key:"getVideoEmbedCode",value:function(){return this.get("videoEmbedCode")}},{key:"getVideoId",value:function(){return this.get("videoId")}},{key:"getVideoTitle",value:function(){return this.get("videoTitle")}},{key:"getVideoWidth",value:function(){return this.get("videoWidth")}},{key:"getVideoHeight",value:function(){return this.get("videoHeight")}},{key:"getVideoUrl",value:function(){return this.get("videoUrl")}},{key:"getVolume",value:function(){return this.get("volume")}},{key:"setVolume",value:function(e){return this.set("volume",e)}}])&&o(t.prototype,n),i&&o(t,i),e}();i||(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document,t=[].slice.call(e.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")),n=function(e){"console"in window&&console.error&&console.error("There was an error creating an embed: ".concat(e))};t.forEach((function(e){try{if(null!==e.getAttribute("data-vimeo-defer"))return;var t=T(e);E(l(t),t,e).then((function(t){return k(t,e)})).catch(n)}catch(r){n(r)}}))}(),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document;if(!window.VimeoPlayerResizeEmbeds_){window.VimeoPlayerResizeEmbeds_=!0;var t=function(t){if(s(t.origin)&&t.data&&"spacechange"===t.data.event)for(var n=e.querySelectorAll("iframe"),r=0;r<n.length;r++)if(n[r].contentWindow===t.source){n[r].parentElement.style.paddingBottom="".concat(t.data.data[0].bottom,"px");break}};window.addEventListener?window.addEventListener("message",t,!1):window.attachEvent&&window.attachEvent("onmessage",t)}}()),t.default=A}.call(this,n(23),n(1196).setImmediate)},1196:function(e,t,n){(function(e){var r=void 0!==e&&e||"undefined"!=typeof self&&self||window,o=Function.prototype.apply;function i(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new i(o.call(setTimeout,r,arguments),clearTimeout)},t.setInterval=function(){return new i(o.call(setInterval,r,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(r,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout((function(){e._onTimeout&&e._onTimeout()}),t))},n(508),t.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(this,n(23))},255:function(e,t){var n,r,o=e.exports={};function i(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function u(e){if(n===setTimeout)return setTimeout(e,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(e,0);try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(e){n=i}try{r="function"==typeof clearTimeout?clearTimeout:a}catch(e){r=a}}();var c,s=[],l=!1,f=-1;function d(){l&&c&&(l=!1,c.length?s=c.concat(s):f=-1,s.length&&h())}function h(){if(!l){var e=u(d);l=!0;for(var t=s.length;t;){for(c=s,s=[];++f<t;)c&&c[f].run();f=-1,t=s.length}c=null,l=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function v(e,t){this.fun=e,this.array=t}function m(){}o.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];s.push(new v(e,t)),1!==s.length||l||u(h)},v.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=m,o.addListener=m,o.once=m,o.off=m,o.removeListener=m,o.removeAllListeners=m,o.emit=m,o.prependListener=m,o.prependOnceListener=m,o.listeners=function(e){return[]},o.binding=function(e){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(e){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},508:function(e,t,n){(function(e,t){!function(e,n){"use strict";if(!e.setImmediate){var r,o,i,a,u,c=1,s={},l=!1,f=e.document,d=Object.getPrototypeOf&&Object.getPrototypeOf(e);d=d&&d.setTimeout?d:e,"[object process]"==={}.toString.call(e.process)?r=function(e){t.nextTick((function(){v(e)}))}:!function(){if(e.postMessage&&!e.importScripts){var t=!0,n=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=n,t}}()?e.MessageChannel?((i=new MessageChannel).port1.onmessage=function(e){v(e.data)},r=function(e){i.port2.postMessage(e)}):f&&"onreadystatechange"in f.createElement("script")?(o=f.documentElement,r=function(e){var t=f.createElement("script");t.onreadystatechange=function(){v(e),t.onreadystatechange=null,o.removeChild(t),t=null},o.appendChild(t)}):r=function(e){setTimeout(v,0,e)}:(a="setImmediate$"+Math.random()+"$",u=function(t){t.source===e&&"string"==typeof t.data&&0===t.data.indexOf(a)&&v(+t.data.slice(a.length))},e.addEventListener?e.addEventListener("message",u,!1):e.attachEvent("onmessage",u),r=function(t){e.postMessage(a+t,"*")}),d.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),n=0;n<t.length;n++)t[n]=arguments[n+1];var o={callback:e,args:t};return s[c]=o,r(c),c++},d.clearImmediate=h}function h(e){delete s[e]}function v(e){if(l)setTimeout(v,0,e);else{var t=s[e];if(t){l=!0;try{!function(e){var t=e.callback,n=e.args;switch(n.length){case 0:t();break;case 1:t(n[0]);break;case 2:t(n[0],n[1]);break;case 3:t(n[0],n[1],n[2]);break;default:t.apply(void 0,n)}}(t)}finally{h(e),l=!1}}}}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,n(23),n(255))}}]);