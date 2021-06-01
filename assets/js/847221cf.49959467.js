(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{101:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return m})),n.d(t,"metadata",(function(){return p})),n.d(t,"toc",(function(){return g})),n.d(t,"default",(function(){return h}));var s=n(3),i=n(7),a=(n(0),n(155)),o=n(384),r=n(782),c=n(438),d=(n(57),n(58),n(60),n(309)),l=n(783),m={id:"adding-a-viewer",title:"Introducing the rich content viewer",sidebar_label:"Add a viewer"},p={unversionedId:"ricos/adding-a-viewer",id:"ricos/adding-a-viewer",isDocsHomePage:!1,title:"Introducing the rich content viewer",description:"Now that you have an editor enabled, let's add a viewer to display the content you create with it.",source:"@site/docs/ricos/adding-a-viewer.mdx",slug:"/ricos/adding-a-viewer",permalink:"/docs/ricos/adding-a-viewer",editUrl:"https://github.com/wix/ricos/edit/master/website/docs/ricos/adding-a-viewer.mdx",version:"current",sidebar_label:"Add a viewer",sidebar:"ricos",previous:{title:"Quick Start",permalink:"/docs/ricos/quick-start"},next:{title:"Theming",permalink:"/docs/ricos/theming"}},g=[],u={toc:g};function h(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(a.b)("wrapper",Object(s.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Now that you have an editor enabled, let's add a viewer to display the content you create with it."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-bash"},"npm i ricos-viewer\n")),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-jsx"},"import { RicosViewer } from 'ricos-viewer';\nimport 'ricos-viewer/dist/styles.min.css';\n\nconst content = {\n  blocks: [\n    {\n      key: 'd79aa',\n      text: \"Hi there! I'm Ricos, your rich content framework. \ud83d\udc7e\",\n      type: 'header-two',\n      depth: 0,\n      inlineStyleRanges: [],\n      entityRanges: [],\n      data: {},\n    },\n  ],\n  entityMap: {},\n  VERSION: '7.5.0',\n};\n\n<RicosViewer content={content} />;\n")),Object(a.b)("div",{className:"card"},Object(a.b)(o.a,{content:d,mdxType:"RicosViewer"})),Object(a.b)("p",null,"Now let's add some plugins to Ricos and display the new content:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-bash"},"npm i wix-rich-content-plugin-video wix-rich-content-plugin-divider\n")),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-jsx"},"import { RicosViewer } from 'ricos-viewer';\nimport 'ricos-viewer/dist/styles.min.css';\n\nimport { pluginVideo } from 'wix-rich-content-plugin-video/viewer';\nimport 'wix-rich-content-plugin-video/dist/styles.min.css';\n\nimport { pluginDivider } from 'wix-rich-content-plugin-divider/viewer';\nimport 'wix-rich-content-plugin-divider/dist/styles.min.css';\n\n<RicosViewer content={contentWithPlugins} plugins={[pluginDivider(), pluginVideo()]} />;\n")),Object(a.b)("div",{className:"card"},Object(a.b)(o.a,{content:l,plugins:[Object(r.a)(),Object(c.a)()],mdxType:"RicosViewer"})))}h.isMDXComponent=!0},171:function(e,t,n){var s={"./messages_ar.json":[181,79],"./messages_bg.json":[182,80],"./messages_ca.json":[183,81],"./messages_cs.json":[184,82],"./messages_da.json":[185,83],"./messages_de.json":[186,84],"./messages_el.json":[187,85],"./messages_en.json":[175,2],"./messages_es.json":[188,86],"./messages_fi.json":[189,87],"./messages_fr.json":[190,88],"./messages_he.json":[191,89],"./messages_hi.json":[192,90],"./messages_hu.json":[193,91],"./messages_id.json":[194,92],"./messages_it.json":[195,93],"./messages_ja.json":[196,94],"./messages_ko.json":[197,95],"./messages_lt.json":[198,96],"./messages_ms.json":[199,97],"./messages_nl.json":[200,98],"./messages_no.json":[201,99],"./messages_pl.json":[202,100],"./messages_pt.json":[203,101],"./messages_ro.json":[204,102],"./messages_ru.json":[205,103],"./messages_sk.json":[206,104],"./messages_sl.json":[207,105],"./messages_sv.json":[208,106],"./messages_th.json":[209,107],"./messages_tl.json":[210,108],"./messages_tr.json":[211,109],"./messages_uk.json":[212,110],"./messages_vi.json":[213,111],"./messages_zh.json":[214,112]};function i(e){if(!n.o(s,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=s[e],i=t[0];return n.e(t[1]).then((function(){return n.t(i,3)}))}i.keys=function(){return Object.keys(s)},i.id=171,e.exports=i},309:function(e){e.exports=JSON.parse('{"blocks":[{"key":"d79aa","text":"Hi there! I\'m Ricos, your rich content framework. \ud83d\udc7e","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{},"VERSION":"7.5.0"}')},783:function(e){e.exports=JSON.parse('{"blocks":[{"key":"d79aa","text":"Hi there! I\'m Ricos, your rich content framework. \ud83d\udc7e","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"fnevk","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":0}],"data":{}},{"key":"8o7bs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"6dc41","text":" ","type":"atomic","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":1,"key":1}],"data":{}},{"key":"2ke8","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{"0":{"type":"wix-draft-plugin-divider","mutability":"IMMUTABLE","data":{"type":"single","config":{"size":"large","alignment":"center","textWrap":"nowrap"}}},"1":{"type":"wix-draft-plugin-video","mutability":"IMMUTABLE","data":{"config":{"size":"content","alignment":"center"},"tempData":false,"src":"https://youtu.be/oCBpJkG6ngE","metadata":{"version":"1.0","thumbnail_url":"https://i.ytimg.com/vi/jhXlnvYZZQs/hqdefault.jpg","provider_url":"https://www.youtube.com/","thumbnail_height":360,"provider_name":"YouTube","width":480,"title":"Wix.com Official 2018 Big Game Ad with Rhett & Link \u2014 Extended Version","author_url":"https://www.youtube.com/user/Wix","html":"<iframe width=\\"480\\" height=\\"270\\" src=\\"https://www.youtube.com/embed/jhXlnvYZZQs?feature=oembed\\" frameborder=\\"0\\" allow=\\"autoplay; encrypted-media\\" allowfullscreen></iframe>","height":270,"author_name":"Wix.com","thumbnail_width":480,"type":"video","video_url":"https://youtu.be/jhXlnvYZZQs"}}}},"VERSION":"7.5.0"}')}}]);