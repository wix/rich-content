(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{112:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return p}));var r=n(3),i=n(7),o=(n(0),n(152)),a={id:"testing",title:"Testing",sidebar_label:"Testing"},c={unversionedId:"dev/testing",id:"dev/testing",isDocsHomePage:!1,title:"Testing",description:"Test Environment",source:"@site/docs/dev/testing.md",sourceDirName:"dev",slug:"/dev/testing",permalink:"/docs/dev/testing",editUrl:"https://github.com/wix/ricos/edit/master/website/docs/dev/testing.md",version:"current",sidebar_label:"Testing",frontMatter:{id:"testing",title:"Testing",sidebar_label:"Testing"},sidebar:"dev",previous:{title:"Release Instructions",permalink:"/docs/dev/release_instructions"},next:{title:"Maintenance",permalink:"/docs/dev/maintenance"}},s=[{value:"Test Environment",id:"test-environment",children:[]},{value:"Cypress",id:"cypress",children:[]}],l={toc:s};function p(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"test-environment"},"Test Environment"),Object(o.b)("p",null,"Start with:"),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"npm run e2e:app:dev")),Object(o.b)("p",null,"and open ",Object(o.b)("inlineCode",{parentName:"p"},"http://localhost:3002/rce/")," for empty content state"),Object(o.b)("p",null,"or ",Object(o.b)("inlineCode",{parentName:"p"},"http://localhost:3002/rce/<FIXTURE_NAME>")," for initial fixture (e.g. ",Object(o.b)("inlineCode",{parentName:"p"},"http://localhost:3002/rce/gallery")),Object(o.b)("h2",{id:"cypress"},"Cypress"),Object(o.b)("p",null,"TBD"))}p.isMDXComponent=!0},152:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),i=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=i.a.createContext({}),p=function(e){var t=i.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=p(e.components);return i.a.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},b=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,a=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(n),b=r,f=u["".concat(a,".").concat(b)]||u[b]||d[b]||o;return n?i.a.createElement(f,c(c({ref:t},l),{},{components:n})):i.a.createElement(f,c({ref:t},l))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,a=new Array(o);a[0]=b;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var l=2;l<o;l++)a[l]=n[l];return i.a.createElement.apply(null,a)}return i.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);