(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{128:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return o})),t.d(n,"metadata",(function(){return c})),t.d(n,"toc",(function(){return u})),t.d(n,"default",(function(){return s}));var r=t(3),a=t(7),i=(t(0),t(152)),o={id:"maintenance",title:"Maintenance",sidebar_label:"Maintenance"},c={unversionedId:"dev/maintenance",id:"dev/maintenance",isDocsHomePage:!1,title:"Maintenance",description:"Documentation Maintenance",source:"@site/docs/dev/maintain.md",sourceDirName:"dev",slug:"/dev/maintenance",permalink:"/docs/dev/maintenance",editUrl:"https://github.com/wix/ricos/edit/master/website/docs/dev/maintain.md",version:"current",sidebar_label:"Maintenance",frontMatter:{id:"maintenance",title:"Maintenance",sidebar_label:"Maintenance"},sidebar:"dev",previous:{title:"Testing",permalink:"/docs/dev/testing"}},u=[{value:"Documentation Maintenance",id:"documentation-maintenance",children:[{value:"Search",id:"search",children:[]}]}],l={toc:u};function s(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,t,{components:n,mdxType:"MDXLayout"}),Object(i.b)("h2",{id:"documentation-maintenance"},"Documentation Maintenance"),Object(i.b)("h3",{id:"search"},"Search"),Object(i.b)("p",null,"If the docs are moved to another URL, the Algolia search won't work until the config is not updated. The config file for these docs is ",Object(i.b)("a",{parentName:"p",href:"https://github.com/algolia/docsearch-configs/blob/master/configs/rich-content.json"},"here")," (update by submitting a PR)."))}s.isMDXComponent=!0},152:function(e,n,t){"use strict";t.d(n,"a",(function(){return d})),t.d(n,"b",(function(){return m}));var r=t(0),a=t.n(r);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function u(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=a.a.createContext({}),s=function(e){var n=a.a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},d=function(e){var n=s(e.components);return a.a.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},f=a.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),d=s(t),f=r,m=d["".concat(o,".").concat(f)]||d[f]||p[f]||i;return t?a.a.createElement(m,c(c({ref:n},l),{},{components:t})):a.a.createElement(m,c({ref:n},l))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=t.length,o=new Array(i);o[0]=f;var c={};for(var u in n)hasOwnProperty.call(n,u)&&(c[u]=n[u]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var l=2;l<i;l++)o[l]=t[l];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,t)}f.displayName="MDXCreateElement"}}]);