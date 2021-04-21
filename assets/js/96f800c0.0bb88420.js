(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{104:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return u}));var r=n(3),i=n(7),a=(n(0),n(152)),o={id:"release_instructions",title:"Release Instructions",sidebar_label:"Release Instructions"},c={unversionedId:"dev/release_instructions",id:"dev/release_instructions",isDocsHomePage:!1,title:"Release Instructions",description:"Note: this doc is relevant to ricos team only",source:"@site/docs/dev/release.md",sourceDirName:"dev",slug:"/dev/release_instructions",permalink:"/docs/dev/release_instructions",editUrl:"https://github.com/wix/ricos/edit/master/website/docs/dev/release.md",version:"current",sidebar_label:"Release Instructions",frontMatter:{id:"release_instructions",title:"Release Instructions",sidebar_label:"Release Instructions"},sidebar:"dev",previous:{title:"Plugin Theming",permalink:"/docs/dev/theming"},next:{title:"Testing",permalink:"/docs/dev/testing"}},l=[{value:"Normal version:",id:"normal-version",children:[]},{value:"Alpha version:",id:"alpha-version",children:[]},{value:"Semantic Versioning",id:"semantic-versioning",children:[]},{value:"Hotfix version:",id:"hotfix-version",children:[]}],s={toc:l};function u(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Note"),": this doc is relevant to ricos team only"),Object(a.b)("p",null,Object(a.b)("em",{parentName:"p"},"In both cases make sure your starting point is on latest master")),Object(a.b)("h2",{id:"normal-version"},"Normal version:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"update the changelog - add a new version with the unreleased"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"npm run createVersion")," and follow script instruction (this should push to github, double check by running ",Object(a.b)("inlineCode",{parentName:"li"},"git push")," after this command)"),Object(a.b)("li",{parentName:"ul"},"The release will start automatically. Go to ",Object(a.b)("a",{parentName:"li",href:"https://github.com/wix/ricos/actions?query=workflow%3Arelease"},"Github actions")," to see that it passed without errors."),Object(a.b)("li",{parentName:"ul"},"post to #rich-content-dev and #rich-content slack channels"),Object(a.b)("li",{parentName:"ul"},"Move asana tickets from merged to complete")),Object(a.b)("h2",{id:"alpha-version"},"Alpha version:"),Object(a.b)("p",null,"Same as normal version, except changes should not be merged to ",Object(a.b)("inlineCode",{parentName:"p"},"master")," but to a ",Object(a.b)("inlineCode",{parentName:"p"},"release-v<current major>.<current minor>.<current patch>-alpha")," branch."),Object(a.b)("h2",{id:"semantic-versioning"},"Semantic Versioning"),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},"Choose the right version number:"),Object(a.b)("ul",{parentName:"blockquote"},Object(a.b)("li",{parentName:"ul"},"MAJOR version when you make incompatible API changes, "),Object(a.b)("li",{parentName:"ul"},"MINOR version when you add functionality in a backwards compatible manner, and "),Object(a.b)("li",{parentName:"ul"},"PATCH version when you make backwards compatible bug fixes. "))),Object(a.b)("h2",{id:"hotfix-version"},"Hotfix version:"),Object(a.b)("ol",null,Object(a.b)("li",{parentName:"ol"},"After updating master w/ changelog (including hotfix changelog in the right version), checkout ",Object(a.b)("inlineCode",{parentName:"li"},"version-7")),Object(a.b)("li",{parentName:"ol"},Object(a.b)("inlineCode",{parentName:"li"},"git cherry-pick {md5-of-hotfix-from-master}")),Object(a.b)("li",{parentName:"ol"},"update the changelog with the new version and commit"),Object(a.b)("li",{parentName:"ol"},Object(a.b)("inlineCode",{parentName:"li"},"npm run createVersion")," and follow script instruction (this should push to github)"),Object(a.b)("li",{parentName:"ol"},"The release will start automatically. Go to ",Object(a.b)("a",{parentName:"li",href:"https://github.com/wix/ricos/actions?query=workflow%3Arelease"},"Github actions")," to see that it passed without errors."),Object(a.b)("li",{parentName:"ol"},Object(a.b)("inlineCode",{parentName:"li"},"git checkout master")),Object(a.b)("li",{parentName:"ol"},"update the changelog in the master. (either git cherry-pick {md5-of-commit-from-step-3}  or update manually)"),Object(a.b)("li",{parentName:"ol"},"post to #rich-content-dev and #rich-content slack channels")))}u.isMDXComponent=!0},152:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return d}));var r=n(0),i=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=i.a.createContext({}),u=function(e){var t=i.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},b=function(e){var t=u(e.components);return i.a.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},m=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,o=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),b=u(n),m=r,d=b["".concat(o,".").concat(m)]||b[m]||p[m]||a;return n?i.a.createElement(d,c(c({ref:t},s),{},{components:n})):i.a.createElement(d,c({ref:t},s))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var s=2;s<a;s++)o[s]=n[s];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);