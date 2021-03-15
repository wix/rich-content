(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{123:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return s}));var r=n(3),i=n(7),a=(n(0),n(149)),o={id:"intro",title:"Introduction",sidebar_label:"Introduction"},c={unversionedId:"intro",id:"intro",isDocsHomePage:!1,title:"Introduction",description:"Installation",source:"@site/docs/intro.mdx",slug:"/intro",permalink:"/ricos/docs/intro",version:"current",sidebar_label:"Introduction",sidebar:"sidebar"},l=[{value:"Installation",id:"installation",children:[]},{value:"Getting Started",id:"getting-started",children:[{value:"1. Basic Editor",id:"1-basic-editor",children:[]},{value:"2. Add Plugins",id:"2-add-plugins",children:[]}]}],p={toc:l};function s(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"installation"},"Installation"),Object(a.b)("p",null,"To install this package as editor, use the following command"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"npm install --save wix-rich-content-editor\n")),Object(a.b)("p",null,"To install this package as viewer, use the following command:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"npm install --save wix-rich-content-viewer\n")),Object(a.b)("h2",{id:"getting-started"},"Getting Started"),Object(a.b)("h3",{id:"1-basic-editor"},"1. Basic Editor"),Object(a.b)("p",null,"To get started with the editor, create a simple ",Object(a.b)("inlineCode",{parentName:"p"},"React.Component"),", and import the editor component:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"import { EditorState, RichContentEditor } from 'wix-rich-content-editor';\n")),Object(a.b)("p",null,"Then, create an empty ",Object(a.b)("inlineCode",{parentName:"p"},"editorState")," in your state:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"export class MyApp extends React.Component {\n  state = {\n    editorState: EditorState.createEmpty(),\n  };\n}\n")),Object(a.b)("p",null,"Use the ",Object(a.b)("inlineCode",{parentName:"p"},"RichContentEditor")," component in your ",Object(a.b)("inlineCode",{parentName:"p"},"render")," function, and implement ",Object(a.b)("inlineCode",{parentName:"p"},"onChange")," function:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"import React from 'react';\nimport { EditorState, RichContentEditor } from 'wix-rich-content-editor';\n\nexport class MyApp extends React.Component {\n  constructor(props) {\n    this.state = {\n      editorState: EditorState.createEmpty(),\n    };\n  }\n\n  onChange = editorState => {\n    this.setState({\n      editorState,\n    });\n  };\n\n  render() {\n    return (\n      <div>\n        <RichConentEditor onChange={this.onChange} editorState={this.state.editorState} />\n      </div>\n    );\n  }\n}\n")),Object(a.b)("p",null,"Now, to make sure you are getting the most of the rich-content editor, include the compiled CSS files in your app's main file:"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"app.js")),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"import 'wix-rich-content-editor-common/dist/styles.min.css';\nimport 'wix-rich-content-editor/dist/styles.min.css';\nimport 'wix-rich-content-plugin-...'/dist/styles.min.css';\n")),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},"You can also import the CSS files using ",Object(a.b)("inlineCode",{parentName:"p"},"@import '~..."),";` from a SCSS file.")),Object(a.b)("h3",{id:"2-add-plugins"},"2. Add Plugins"),Object(a.b)("p",null,"To add plugins to your editor, choose one of the implemented plugins from ",Object(a.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/wix/ricos/tree/master/packages"}),"the list of available plugins"),"."),Object(a.b)("p",null,"Install the plugin you wish use from NPM:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-bash"}),"npm install wix-rich-content-plugin-divider\n")),Object(a.b)("p",null,"Import the plugin's stylesheet file in your main app's file:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"import 'wix-rich-content-plugin-divider/dist/styles.min.css';\n")),Object(a.b)("p",null,"Then, add ",Object(a.b)("inlineCode",{parentName:"p"},"plugins")," prop with the plugin's creation method:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),"import React from 'react';\nimport { EditorState, RichContentEditor } from 'wix-rich-content-editor';\nimport { createDividerPlugin } from 'wix-rich-content-plugin-divider';\n\nconst PLUGINS = [createDividerPlugin];\n\nexport class MyApp extends React.Component {\n  state = {\n    editorState: EditorState.createEmpty(),\n  };\n\n  onChange = editorState => {\n    this.setState({\n      editorState,\n    });\n  };\n\n  render() {\n    return (\n      <div>\n        <RichContentEditor\n          plugins={PLUGINS}\n          onChange={this.onChange}\n          editorState={this.state.editorState}\n        />\n      </div>\n    );\n  }\n}\n")))}s.isMDXComponent=!0},149:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));var r=n(0),i=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=i.a.createContext({}),s=function(e){var t=i.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},d=function(e){var t=s(e.components);return i.a.createElement(p.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},u=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,o=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(n),u=r,m=d["".concat(o,".").concat(u)]||d[u]||b[u]||a;return n?i.a.createElement(m,c(c({ref:t},p),{},{components:n})):i.a.createElement(m,c({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=u;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var p=2;p<a;p++)o[p]=n[p];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);