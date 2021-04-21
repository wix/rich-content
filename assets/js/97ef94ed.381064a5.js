(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{136:function(t,e,n){"use strict";n.r(e),n.d(e,"frontMatter",(function(){return m})),n.d(e,"metadata",(function(){return v})),n.d(e,"toc",(function(){return g})),n.d(e,"default",(function(){return b}));var r=n(3),o=n(7),i=n(0),s=n.n(i),a=n(152);function c(t,e,n,r,o,i,s){try{var a=t[i](s),c=a.value}catch(u){return void n(u)}a.done?e(c):Promise.resolve(c).then(r,o)}var u=n(989),l=n.n(u),h=n(383),f=n(181),p=n(366),d=(n(56),Object(h.b)((function(t){var e=t.editorEvents,n=function(){var t,n=(t=l.a.mark((function t(){var n;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.publish();case 2:n=t.sent,alert("Content:\n\n"+JSON.stringify(n));case 4:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function s(t){c(i,r,o,s,a,"next",t)}function a(t){c(i,r,o,s,a,"throw",t)}s(void 0)}))});return function(){return n.apply(this,arguments)}}();return s.a.createElement(s.a.Fragment,null,s.a.createElement(f.a,{content:p}),s.a.createElement("br",null),s.a.createElement("br",null),s.a.createElement("input",{type:"button",onClick:n,value:"publish",style:{maxWidth:"100px"}}))}))),m={id:"editor-events-context",title:"EditorEventsContext",sidebar_label:"EditorEvents Context"},v={unversionedId:"ricos/editor-events-context",id:"ricos/editor-events-context",isDocsHomePage:!1,title:"EditorEventsContext",description:"withEditorContext",source:"@site/docs/ricos/editor-events-context.mdx",sourceDirName:"ricos",slug:"/ricos/editor-events-context",permalink:"/docs/ricos/editor-events-context",editUrl:"https://github.com/wix/ricos/edit/master/website/docs/ricos/editor-events-context.mdx",version:"current",sidebar_label:"EditorEvents Context",frontMatter:{id:"editor-events-context",title:"EditorEventsContext",sidebar_label:"EditorEvents Context"},sidebar:"api",previous:{title:"Ricos API",permalink:"/docs/ricos/ricos-api"},next:{title:"Plugin Customization",permalink:"/docs/plugins_api/PluginCustomization"}},g=[{value:"<code>withEditorContext</code>",id:"witheditorcontext",children:[{value:"Usage Example",id:"usage-example",children:[]}]}],y={toc:g};function b(t){var e=t.components,n=Object(o.a)(t,["components"]);return Object(a.b)("wrapper",Object(r.a)({},y,n,{components:e,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"witheditorcontext"},Object(a.b)("inlineCode",{parentName:"h2"},"withEditorContext")),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"withEditorContext")," is a High-Order component, allowing to trigger ",Object(a.b)("inlineCode",{parentName:"p"},"publish")," event when content editing is done."),Object(a.b)("p",null,"Return value is a promise with finalized content."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-ts"},"editorEvents: {\n  publish: () => Promise<DraftContent>\n}\n")),Object(a.b)("h3",{id:"usage-example"},"Usage Example"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-jsx",metastring:"{5}","{5}":!0},'import { withEditorContext } from \'wix-rich-content-editor-common/libs/EditorEventsContext\';\n\nconst YourComponent = ({ editorEvents }) => {\n  const onPublish = async () => {\n    const content = await editorEvents.publish();\n    alert(JSON.stringify(content));\n  };\n  return (\n    <>\n      <RicosEditor content={content} />\n      <input type="button" onClick={onPublish} value="publish" />\n    </>\n  );\n};\n\nexport default withEditorContext(YourComponent);\n')),Object(a.b)("div",{className:"card"},Object(a.b)(d,{mdxType:"EditorContextExample"})))}b.isMDXComponent=!0},182:function(t,e,n){var r={"./messages_ar.json":[187,81],"./messages_bg.json":[188,82],"./messages_cs.json":[189,83],"./messages_da.json":[190,84],"./messages_de.json":[191,85],"./messages_el.json":[192,86],"./messages_en.json":[178,2],"./messages_es.json":[193,87],"./messages_fi.json":[194,88],"./messages_fr.json":[195,89],"./messages_he.json":[196,90],"./messages_hi.json":[197,91],"./messages_hu.json":[198,92],"./messages_id.json":[199,93],"./messages_it.json":[200,94],"./messages_ja.json":[201,95],"./messages_ko.json":[202,96],"./messages_lt.json":[203,97],"./messages_ms.json":[204,98],"./messages_nl.json":[205,99],"./messages_no.json":[206,100],"./messages_pl.json":[207,101],"./messages_pt.json":[208,102],"./messages_ro.json":[209,103],"./messages_ru.json":[210,104],"./messages_sv.json":[211,105],"./messages_th.json":[212,106],"./messages_tl.json":[213,107],"./messages_tr.json":[214,108],"./messages_uk.json":[215,109],"./messages_vi.json":[216,110],"./messages_zh.json":[217,111]};function o(t){if(!n.o(r,t))return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}));var e=r[t],o=e[0];return n.e(e[1]).then((function(){return n.t(o,3)}))}o.keys=function(){return Object.keys(r)},o.id=182,t.exports=o},366:function(t){t.exports=JSON.parse('{"blocks":[{"key":"d79aa","text":"Hi there! I\'m Ricos, your rich content framework. \ud83d\udc7e","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{},"VERSION":"7.5.0"}')},989:function(t,e,n){t.exports=n(990)},990:function(t,e,n){var r=function(t){"use strict";var e,n=Object.prototype,r=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",a=o.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(S){c=function(t,e,n){return t[e]=n}}function u(t,e,n,r){var o=e&&e.prototype instanceof v?e:v,i=Object.create(o.prototype),s=new k(r||[]);return i._invoke=function(t,e,n){var r=h;return function(o,i){if(r===p)throw new Error("Generator is already running");if(r===d){if("throw"===o)throw i;return P()}for(n.method=o,n.arg=i;;){var s=n.delegate;if(s){var a=O(s,n);if(a){if(a===m)continue;return a}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===h)throw r=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=p;var c=l(t,e,n);if("normal"===c.type){if(r=n.done?d:f,c.arg===m)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r=d,n.method="throw",n.arg=c.arg)}}}(t,n,s),i}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(S){return{type:"throw",arg:S}}}t.wrap=u;var h="suspendedStart",f="suspendedYield",p="executing",d="completed",m={};function v(){}function g(){}function y(){}var b={};b[i]=function(){return this};var w=Object.getPrototypeOf,x=w&&w(w(N([])));x&&x!==n&&r.call(x,i)&&(b=x);var j=y.prototype=v.prototype=Object.create(b);function E(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function _(t,e){function n(o,i,s,a){var c=l(t[o],t,i);if("throw"!==c.type){var u=c.arg,h=u.value;return h&&"object"==typeof h&&r.call(h,"__await")?e.resolve(h.__await).then((function(t){n("next",t,s,a)}),(function(t){n("throw",t,s,a)})):e.resolve(h).then((function(t){u.value=t,s(u)}),(function(t){return n("throw",t,s,a)}))}a(c.arg)}var o;this._invoke=function(t,r){function i(){return new e((function(e,o){n(t,r,e,o)}))}return o=o?o.then(i,i):i()}}function O(t,n){var r=t.iterator[n.method];if(r===e){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=e,O(t,n),"throw"===n.method))return m;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return m}var o=l(r,t.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,m;var i=o.arg;return i?i.done?(n[t.resultName]=i.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,m):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,m)}function L(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function C(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(L,this),this.reset(!0)}function N(t){if(t){var n=t[i];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,s=function n(){for(;++o<t.length;)if(r.call(t,o))return n.value=t[o],n.done=!1,n;return n.value=e,n.done=!0,n};return s.next=s}}return{next:P}}function P(){return{value:e,done:!0}}return g.prototype=j.constructor=y,y.constructor=g,g.displayName=c(y,a,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,c(t,a,"GeneratorFunction")),t.prototype=Object.create(j),t},t.awrap=function(t){return{__await:t}},E(_.prototype),_.prototype[s]=function(){return this},t.AsyncIterator=_,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var s=new _(u(e,n,r,o),i);return t.isGeneratorFunction(n)?s:s.next().then((function(t){return t.done?t.value:s.next()}))},E(j),c(j,a,"Generator"),j[i]=function(){return this},j.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=N,k.prototype={constructor:k,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(C),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function o(r,o){return a.type="throw",a.arg=t,n.next=r,o&&(n.method="next",n.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var s=this.tryEntries[i],a=s.completion;if("root"===s.tryLoc)return o("end");if(s.tryLoc<=this.prev){var c=r.call(s,"catchLoc"),u=r.call(s,"finallyLoc");if(c&&u){if(this.prev<s.catchLoc)return o(s.catchLoc,!0);if(this.prev<s.finallyLoc)return o(s.finallyLoc)}else if(c){if(this.prev<s.catchLoc)return o(s.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<s.finallyLoc)return o(s.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var s=i?i.completion:{};return s.type=t,s.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(s)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),C(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;C(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:N(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),m}},t}(t.exports);try{regeneratorRuntime=r}catch(o){Function("r","regeneratorRuntime = r")(r)}}}]);