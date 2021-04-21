(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{152:function(e,t,r){"use strict";r.d(t,"a",(function(){return b})),r.d(t,"b",(function(){return m}));var n=r(0),i=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=i.a.createContext({}),p=function(e){var t=i.a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},b=function(e){var t=p(e.components);return i.a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},u=i.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,a=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),b=p(r),u=n,m=b["".concat(a,".").concat(u)]||b[u]||d[u]||o;return r?i.a.createElement(m,l(l({ref:t},c),{},{components:r})):i.a.createElement(m,l({ref:t},c))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,a=new Array(o);a[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,a[1]=l;for(var c=2;c<o;c++)a[c]=r[c];return i.a.createElement.apply(null,a)}return i.a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},98:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return a})),r.d(t,"metadata",(function(){return l})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return p}));var n=r(3),i=r(7),o=(r(0),r(152)),a={id:"mobile_support",title:"Mobile support",sidebar_label:"Mobile support"},l={unversionedId:"ricos/mobile_support",id:"ricos/mobile_support",isDocsHomePage:!1,title:"Mobile support",description:"Originally, the rich-content-editor was based on draft-js. It inherited its strengths and limitations as well. The most significant limitation was the lack of mobile support.",source:"@site/docs/ricos/mobile_support.md",sourceDirName:"ricos",slug:"/ricos/mobile_support",permalink:"/docs/ricos/mobile_support",editUrl:"https://github.com/wix/ricos/edit/master/website/docs/ricos/mobile_support.md",version:"current",sidebar_label:"Mobile support",frontMatter:{id:"mobile_support",title:"Mobile support",sidebar_label:"Mobile support"},sidebar:"ricos",previous:{title:"Adsense Support",permalink:"/docs/ricos/adsense"},next:{title:"Media handling",permalink:"/docs/ricos/media_handling"}},s=[{value:"Editing with Gboard",id:"editing-with-gboard",children:[]}],c={toc:s};function p(e){var t=e.components,r=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},c,r,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Originally, the ",Object(o.b)("inlineCode",{parentName:"p"},"rich-content-editor")," was based on ",Object(o.b)("a",{parentName:"p",href:"https://github.com/facebook/draft-js"},"draft-js"),". It inherited its strengths and limitations as well. The most significant limitation was the lack of mobile support. "),Object(o.b)("p",null,"In order to overcome this, today the ",Object(o.b)("inlineCode",{parentName:"p"},"rich-content-editor")," relies on ",Object(o.b)("a",{parentName:"p",href:"https://github.com/wix/draft-js"},"wix/draft-js")," -- a fork of the original ",Object(o.b)("inlineCode",{parentName:"p"},"draft-js"),". The forking allowed to fix lots of issues, however there are still issues exist. "),Object(o.b)("h3",{id:"editing-with-gboard"},"Editing with Gboard"),Object(o.b)("p",null,"The Android phones feature the ",Object(o.b)("a",{parentName:"p",href:"https://play.google.com/store/apps/details?id=com.google.android.inputmethod.latin"},"Gboard")," keyboard. The ",Object(o.b)("inlineCode",{parentName:"p"},"rich-content-editor")," has the following compatibility issues with it:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("strong",{parentName:"li"},"inline style toggling is not supported")," -- whie typing with Gboard, the inline style (e.g. ",Object(o.b)("inlineCode",{parentName:"li"},"Bold"),", ",Object(o.b)("inlineCode",{parentName:"li"},"Italic"),", ",Object(o.b)("inlineCode",{parentName:"li"},"Underline"),") toggle has no effect (however, inline styles could be applied on selected text)")))}p.isMDXComponent=!0}}]);