(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{110:function(e,n,r){"use strict";r.r(n),r.d(n,"frontMatter",(function(){return i})),r.d(n,"metadata",(function(){return u})),r.d(n,"toc",(function(){return c})),r.d(n,"default",(function(){return p}));var t=r(3),a=r(7),l=(r(0),r(152)),i={id:"bundle_analyzer",title:"Bundle analyzer",sidebar_label:"Bundle analyzer"},u={unversionedId:"dev/bundle_analyzer",id:"dev/bundle_analyzer",isDocsHomePage:!1,title:"Bundle analyzer",description:"Measure all plugin size:",source:"@site/docs/dev/bundle_analyzer.md",sourceDirName:"dev",slug:"/dev/bundle_analyzer",permalink:"/docs/dev/bundle_analyzer",editUrl:"https://github.com/wix/ricos/edit/master/website/docs/dev/bundle_analyzer.md",version:"current",sidebar_label:"Bundle analyzer",frontMatter:{id:"bundle_analyzer",title:"Bundle analyzer",sidebar_label:"Bundle analyzer"},sidebar:"dev",next:{title:"Plugin Structure",permalink:"/docs/dev/plugin_structure"}},c=[{value:"Measure all plugin size:",id:"measure-all-plugin-size",children:[]},{value:"Analyze specific plugin bundle:",id:"analyze-specific-plugin-bundle",children:[]}],o={toc:c};function p(e){var n=e.components,r=Object(a.a)(e,["components"]);return Object(l.b)("wrapper",Object(t.a)({},o,r,{components:n,mdxType:"MDXLayout"}),Object(l.b)("h2",{id:"measure-all-plugin-size"},"Measure all plugin size:"),Object(l.b)("p",null,Object(l.b)("inlineCode",{parentName:"p"},"npm run analyzeBundles")),Object(l.b)("h2",{id:"analyze-specific-plugin-bundle"},"Analyze specific plugin bundle:"),Object(l.b)("p",null,Object(l.b)("inlineCode",{parentName:"p"},"npm run analyze <plugin-name>")),Object(l.b)("p",null,"(for example npm ",Object(l.b)("inlineCode",{parentName:"p"},"run analyze wix-rich-content-plugin-gallery"),")"))}p.isMDXComponent=!0},152:function(e,n,r){"use strict";r.d(n,"a",(function(){return d})),r.d(n,"b",(function(){return y}));var t=r(0),a=r.n(t);function l(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function u(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){l(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function c(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},l=Object.keys(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)r=l[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var o=a.a.createContext({}),p=function(e){var n=a.a.useContext(o),r=n;return e&&(r="function"==typeof e?e(n):u(u({},n),e)),r},d=function(e){var n=p(e.components);return a.a.createElement(o.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},b=a.a.forwardRef((function(e,n){var r=e.components,t=e.mdxType,l=e.originalType,i=e.parentName,o=c(e,["components","mdxType","originalType","parentName"]),d=p(r),b=t,y=d["".concat(i,".").concat(b)]||d[b]||s[b]||l;return r?a.a.createElement(y,u(u({ref:n},o),{},{components:r})):a.a.createElement(y,u({ref:n},o))}));function y(e,n){var r=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var l=r.length,i=new Array(l);i[0]=b;var u={};for(var c in n)hasOwnProperty.call(n,c)&&(u[c]=n[c]);u.originalType=e,u.mdxType="string"==typeof e?e:t,i[1]=u;for(var o=2;o<l;o++)i[o]=r[o];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"}}]);