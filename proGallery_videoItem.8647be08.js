(window.webpackJsonp=window.webpackJsonp||[]).push([[89],{958:function(e,t,i){"use strict";i.r(t);var o=i(158),s=i(0),a=i.n(s),r=i(612),p=i(347),d=i(947),n=function(e){function t(t){var i=e.call(this,t)||this;return i.pause=i.pause.bind(i),i.play=i.play.bind(i),i.playVideoIfNeeded=i.playVideoIfNeeded.bind(i),i.state={playedOnce:!1,loadVideo:t.loadVideo||t.playing,playing:!1,reactPlayerLoaded:!1,vimeoPlayerLoaded:!1,hlsPlayerLoaded:!1},i}return Object(o.c)(t,e),t.prototype.componentDidMount=function(){this.dynamiclyImportVideoPlayers()},t.prototype.dynamiclyImportVideoPlayers=function(){var e=this;r.a&&r.a.ReactPlayer||i.e(93).then(i.t.bind(null,927,7)).then((function(t){r.a.ReactPlayer=t.default,e.setState({reactPlayerLoaded:!0}),e.playVideoIfNeeded()})),r.a&&r.a.Vimeo||!this.props.videoUrl||!this.props.videoUrl.includes("vimeo.com")||i.e(96).then(i.bind(null,944)).then((function(t){r.a.Vimeo={Player:t.default},e.setState({vimeoPlayerLoaded:!0}),e.playVideoIfNeeded()})),r.a&&r.a.Hls||!this.isHLSVideo()||i.e(103).then(i.t.bind(null,946,7)).then((function(t){r.a.Hls=t.default,e.setState({hlsPlayerLoaded:!0}),e.playVideoIfNeeded()}))},t.prototype.isHLSVideo=function(){return this.props.videoUrl&&(this.props.videoUrl.includes("/hls")||this.props.videoUrl.includes(".m3u8"))},t.prototype.shouldUseHlsPlayer=function(){return this.isHLSVideo()&&!p.a.isiOS()},t.prototype.shouldForceVideoForHLS=function(){return this.isHLSVideo()&&p.a.isiOS()},t.prototype.UNSAFE_componentWillReceiveProps=function(e){(e.playing||e.firstUserInteractionExecuted)&&this.setState({loadVideo:!0}),this.playVideoIfNeeded(e)},t.prototype.componentDidUpdate=function(e){e.currentIdx!==this.props.currentIdx&&this.fixIFrameTabIndexIfNeeded(),"image"===e.type&&"video"===this.props.type&&this.dynamiclyImportVideoPlayers(),this.playVideoIfNeeded()},t.prototype.play=function(){this.props.playVideo(this.props.idx)},t.prototype.pause=function(){this.props.pauseVideo()},t.prototype.playVideoIfNeeded=function(e){void 0===e&&(e=this.props);try{e.playingVideoIdx!==this.props.idx||this.isPlaying||(this.videoElement=this.videoElement||r.a.document.querySelector("#video-"+this.props.id+" video"),this.videoElement&&(this.isPlaying=!0,this.videoElement.play(),p.a.isVerbose()&&console.log("[VIDEO] Playing video #"+this.props.idx,this.videoElement)))}catch(t){console.error("[VIDEO] Could not play video #"+this.props.idx,this.videoElement,t)}},t.prototype.createPlayerElement=function(){var e,t=this;if(!r.a||!r.a.ReactPlayer||!this.state.loadVideo&&!this.props.playing)return null;var i=r.a.ReactPlayer,s=this.props.style.ratio>=this.props.cubeRatio,p={width:s?"calc(100% + 1px)":"auto",height:s?"auto":"calc(100% + 1px)"};this.props.styleParams.cubeImages&&"fill"===this.props.styleParams.cubeType&&(e=[p.height,p.width],p.width=e[0],p.height=e[1],p.position="absolute",p.margin="auto",p.minHeight="100%",p.minWidth="100%",p.left="-100%",p.right="-100%",p.top="-100%",p.bottom="-100%");var n=this.props.videoUrl?this.props.videoUrl:this.props.createUrl(d.a.urlSizes.RESIZED,d.a.urlTypes.VIDEO);return a.a.createElement(i,{className:"gallery-item-visible video gallery-item",id:"video-"+this.props.id,width:"100%",height:"100%",url:n,alt:this.props.alt?this.props.alt:"untitled video",loop:!!this.props.styleParams.videoLoop,ref:function(e){return t.video=e},volume:this.props.styleParams.videoSound?.8:0,playing:this.props.playing,onEnded:function(){t.setState({playing:!1}),t.props.actions.eventsListener(d.a.events.VIDEO_ENDED,t.props)},onPause:function(){t.setState({playing:!1})},onError:function(e){t.props.actions.eventsListener(d.a.events.VIDEO_ERROR,Object(o.a)(Object(o.a)({},t.props),{videoError:e}))},playbackRate:Number(this.props.styleParams.videoSpeed)||1,onProgress:function(){t.state.playedOnce||t.setState({playedOnce:!0})},onPlay:function(){t.props.actions.eventsListener(d.a.events.VIDEO_PLAYED,t.props),t.setState({playing:!0})},onReady:function(){t.playVideoIfNeeded(),t.fixIFrameTabIndexIfNeeded(),t.props.actions.setItemLoaded(),t.setState({ready:!0})},config:{file:{attributes:{muted:!this.props.styleParams.videoSound,preload:"metadata",poster:this.props.createUrl(d.a.urlSizes.SCALED,d.a.urlTypes.HIGH_RES),style:p,type:"video/mp4"},forceHLS:this.shouldUseHlsPlayer(),forceVideo:this.shouldForceVideoForHLS()}},key:"video-"+this.props.id})},t.prototype.fixIFrameTabIndexIfNeeded=function(){if(this.props.isExternalVideo){var e=r.a.document&&r.a.document.getElementById("video-"+this.props.id),t=e&&e.getElementsByTagName("iframe"),i=t&&t[0];i&&(this.props.currentIdx===this.props.idx?i.setAttribute("tabIndex","0"):i.setAttribute("tabIndex","-1"))}},t.prototype.render=function(){var e=this.props,t=e.videoPlaceholder,i=e.hover,s="gallery-item-content gallery-item-visible gallery-item-preloaded gallery-item-video gallery-item video-item"+(p.a.isiPhone()?" ios":"");this.state.playing&&(s+=" playing"),this.state.playedOnce&&this.state.ready&&(s+=" playedOnce");var r=this.props.imageDimensions||{},n=(r.marginLeft,r.marginTop,Object(o.e)(r,["marginLeft","marginTop"])),l=a.a.createElement("div",{className:s,"data-hook":"video_container-video-player-element",key:"video_container-"+this.props.id,style:p.a.deviceHasMemoryIssues()||this.state.ready?{backgroundColor:"black"}:Object(o.a)({backgroundImage:"url("+this.props.createUrl(d.a.urlSizes.RESIZED,d.a.urlTypes.HIGH_RES)+")"},n)},this.createPlayerElement(),this.props.videoControls);return a.a.createElement("div",{key:"video-and-hover-container"+this.props.idx},[l,t,i])},t}(i(240).a);t.default=n}}]);