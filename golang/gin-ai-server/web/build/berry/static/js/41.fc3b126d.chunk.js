"use strict";(self.webpackChunkgin_ai_server_web=self.webpackChunkgin_ai_server_web||[]).push([[41],{6041:function(e,n,t){t.r(n),t.d(n,{default:function(){return h}});var r=t(5043),i=t(9985),a=t(3862),o=t(96),l=t(6446),c=t(9252),s=t(8911),u=t(5865),p=t(2518),d=t(2075),f=t(9662),g=t(579),m=(0,f.A)((0,g.jsx)("path",{d:"M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"}),"GitHub");var v=()=>(0,g.jsx)(l.A,{sx:{minHeight:"calc(100vh - 136px)",backgroundImage:"linear-gradient(to right, #ff9966, #ff5e62)",color:"white",p:4},children:(0,g.jsx)(c.A,{maxWidth:"lg",children:(0,g.jsx)(d.A,{container:!0,columns:12,wrap:"nowrap",alignItems:"center",sx:{minHeight:"calc(100vh - 230px)"},children:(0,g.jsx)(d.A,{md:7,lg:6,children:(0,g.jsxs)(s.A,{spacing:3,children:[(0,g.jsx)(u.A,{variant:"h1",sx:{fontSize:"4rem",color:"#fff",lineHeight:1.5},children:"One API"}),(0,g.jsxs)(u.A,{variant:"h4",sx:{fontSize:"1.5rem",color:"#fff",lineHeight:1.5},children:["All in one \u7684 OpenAI \u63a5\u53e3 ",(0,g.jsx)("br",{}),"\u6574\u5408\u5404\u79cd API \u8bbf\u95ee\u65b9\u5f0f ",(0,g.jsx)("br",{}),"\u4e00\u952e\u90e8\u7f72\uff0c\u5f00\u7bb1\u5373\u7528"]}),(0,g.jsx)(p.A,{variant:"contained",startIcon:(0,g.jsx)(m,{}),href:"https://gitee.com/zhongjyuan/one-api",target:"_blank",sx:{backgroundColor:"#24292e",color:"#fff",width:"fit-content",boxShadow:"0 3px 5px 2px rgba(255, 105, 135, .3)"},children:"GitHub"})]})})})})});var h=()=>{const[e,n]=(0,r.useState)(!1),[t,s]=(0,r.useState)("");return(0,r.useEffect)((()=>{(async()=>{const e=await a.n.get("/api/notice"),{success:n,message:t,data:r}=e.data;if(n){if(r!==localStorage.getItem("notice")&&""!==r){const e=(0,o.xI)(r);(0,i.An)(e,!0),localStorage.setItem("notice",r)}}else(0,i.Qg)(t)})().then(),(async()=>{s(localStorage.getItem("home_page_content")||"");const e=await a.n.get("/api/home_page_content"),{success:t,message:r,data:l}=e.data;if(t){let e=l;l.startsWith("https://")||(e=o.xI.parse(l)),s(e),localStorage.setItem("home_page_content",e)}else(0,i.Qg)(r),s("\u52a0\u8f7d\u9996\u9875\u5185\u5bb9\u5931\u8d25...");n(!0)})().then()}),[]),(0,g.jsx)(g.Fragment,{children:e&&""===t?(0,g.jsx)(v,{}):(0,g.jsx)(g.Fragment,{children:(0,g.jsx)(l.A,{children:t.startsWith("https://")?(0,g.jsx)("iframe",{title:"home_page_content",src:t,style:{width:"100%",height:"100vh",border:"none"}}):(0,g.jsx)(g.Fragment,{children:(0,g.jsx)(c.A,{children:(0,g.jsx)("div",{style:{fontSize:"larger"},dangerouslySetInnerHTML:{__html:t}})})})})})})}},2075:function(e,n,t){t.d(n,{A:function(){return P}});var r=t(8168),i=t(8587),a=t(5043),o=t(8387),l=t(6912),c=t(2400),s=t(8606),u=t(6060),p=t(2900),d=t(5527),f=t(8698),g=t(8280);const m=(e,n,t)=>{const r=e.keys[0];if(Array.isArray(n))n.forEach(((n,r)=>{t(((n,t)=>{r<=e.keys.length-1&&(0===r?Object.assign(n,t):n[e.up(e.keys[r])]=t)}),n)}));else if(n&&"object"===typeof n){(Object.keys(n).length>e.keys.length?e.keys:(i=e.keys,a=Object.keys(n),i.filter((e=>a.includes(e))))).forEach((i=>{if(-1!==e.keys.indexOf(i)){const a=n[i];void 0!==a&&t(((n,t)=>{r===i?Object.assign(n,t):n[e.up(i)]=t}),a)}}))}else"number"!==typeof n&&"string"!==typeof n||t(((e,n)=>{Object.assign(e,n)}),n);var i,a};function v(e){return e?`Level${e}`:""}function h(e){return e.unstable_level>0&&e.container}function b(e){return function(n){return`var(--Grid-${n}Spacing${v(e.unstable_level)})`}}function x(e){return function(n){return 0===e.unstable_level?`var(--Grid-${n}Spacing)`:`var(--Grid-${n}Spacing${v(e.unstable_level-1)})`}}function w(e){return 0===e.unstable_level?"var(--Grid-columns)":`var(--Grid-columns${v(e.unstable_level-1)})`}const S=e=>{let{theme:n,ownerState:t}=e;const r=b(t),i={};return m(n.breakpoints,t.gridSize,((e,n)=>{let a={};!0===n&&(a={flexBasis:0,flexGrow:1,maxWidth:"100%"}),"auto"===n&&(a={flexBasis:"auto",flexGrow:0,flexShrink:0,maxWidth:"none",width:"auto"}),"number"===typeof n&&(a={flexGrow:0,flexBasis:"auto",width:`calc(100% * ${n} / ${w(t)}${h(t)?` + ${r("column")}`:""})`}),e(i,a)})),i},A=e=>{let{theme:n,ownerState:t}=e;const r={};return m(n.breakpoints,t.gridOffset,((e,n)=>{let i={};"auto"===n&&(i={marginLeft:"auto"}),"number"===typeof n&&(i={marginLeft:0===n?"0px":`calc(100% * ${n} / ${w(t)})`}),e(r,i)})),r},$=e=>{let{theme:n,ownerState:t}=e;if(!t.container)return{};const r=h(t)?{[`--Grid-columns${v(t.unstable_level)}`]:w(t)}:{"--Grid-columns":12};return m(n.breakpoints,t.columns,((e,n)=>{e(r,{[`--Grid-columns${v(t.unstable_level)}`]:n})})),r},y=e=>{let{theme:n,ownerState:t}=e;if(!t.container)return{};const r=x(t),i=h(t)?{[`--Grid-rowSpacing${v(t.unstable_level)}`]:r("row")}:{};return m(n.breakpoints,t.rowSpacing,((e,r)=>{var a;e(i,{[`--Grid-rowSpacing${v(t.unstable_level)}`]:"string"===typeof r?r:null==(a=n.spacing)?void 0:a.call(n,r)})})),i},j=e=>{let{theme:n,ownerState:t}=e;if(!t.container)return{};const r=x(t),i=h(t)?{[`--Grid-columnSpacing${v(t.unstable_level)}`]:r("column")}:{};return m(n.breakpoints,t.columnSpacing,((e,r)=>{var a;e(i,{[`--Grid-columnSpacing${v(t.unstable_level)}`]:"string"===typeof r?r:null==(a=n.spacing)?void 0:a.call(n,r)})})),i},_=e=>{let{theme:n,ownerState:t}=e;if(!t.container)return{};const r={};return m(n.breakpoints,t.direction,((e,n)=>{e(r,{flexDirection:n})})),r},k=e=>{let{ownerState:n}=e;const t=b(n),i=x(n);return(0,r.A)({minWidth:0,boxSizing:"border-box"},n.container&&(0,r.A)({display:"flex",flexWrap:"wrap"},n.wrap&&"wrap"!==n.wrap&&{flexWrap:n.wrap},{margin:`calc(${t("row")} / -2) calc(${t("column")} / -2)`},n.disableEqualOverflow&&{margin:`calc(${t("row")} * -1) 0px 0px calc(${t("column")} * -1)`}),(!n.container||h(n))&&(0,r.A)({padding:`calc(${i("row")} / 2) calc(${i("column")} / 2)`},(n.disableEqualOverflow||n.parentDisableEqualOverflow)&&{padding:`${i("row")} 0px 0px ${i("column")}`}))},G=e=>{const n=[];return Object.entries(e).forEach((e=>{let[t,r]=e;!1!==r&&void 0!==r&&n.push(`grid-${t}-${String(r)}`)})),n},O=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"xs";function t(e){return void 0!==e&&("string"===typeof e&&!Number.isNaN(Number(e))||"number"===typeof e&&e>0)}if(t(e))return[`spacing-${n}-${String(e)}`];if("object"===typeof e&&!Array.isArray(e)){const n=[];return Object.entries(e).forEach((e=>{let[r,i]=e;t(i)&&n.push(`spacing-${r}-${String(i)}`)})),n}return[]},E=e=>void 0===e?[]:"object"===typeof e?Object.entries(e).map((e=>{let[n,t]=e;return`direction-${n}-${t}`})):[`direction-xs-${String(e)}`];var I=t(579);const N=["className","children","columns","container","component","direction","wrap","spacing","rowSpacing","columnSpacing","disableEqualOverflow","unstable_level"],q=(0,g.A)(),z=(0,u.A)("div",{name:"MuiGrid",slot:"Root",overridesResolver:(e,n)=>n.root});function C(e){return(0,p.A)({props:e,name:"MuiGrid",defaultTheme:q})}var M=t(4535),W=t(2876);const H=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const{createStyledComponent:n=z,useThemeProps:t=C,componentName:u="MuiGrid"}=e,p=a.createContext(void 0),g=n($,j,y,S,_,k,A),m=a.forwardRef((function(e,n){var m,v,h,b,x,w,S,A;const $=(0,d.A)(),y=t(e),j=(0,f.A)(y),_=a.useContext(p),{className:k,children:q,columns:z=12,container:C=!1,component:M="div",direction:W="row",wrap:H="wrap",spacing:P=0,rowSpacing:R=P,columnSpacing:L=P,disableEqualOverflow:T,unstable_level:B=0}=j,D=(0,i.A)(j,N);let F=T;B&&void 0!==T&&(F=e.disableEqualOverflow);const Q={},V={},J={};Object.entries(D).forEach((e=>{let[n,t]=e;void 0!==$.breakpoints.values[n]?Q[n]=t:void 0!==$.breakpoints.values[n.replace("Offset","")]?V[n.replace("Offset","")]=t:J[n]=t}));const K=null!=(m=e.columns)?m:B?void 0:z,U=null!=(v=e.spacing)?v:B?void 0:P,X=null!=(h=null!=(b=e.rowSpacing)?b:e.spacing)?h:B?void 0:R,Y=null!=(x=null!=(w=e.columnSpacing)?w:e.spacing)?x:B?void 0:L,Z=(0,r.A)({},j,{level:B,columns:K,container:C,direction:W,wrap:H,spacing:U,rowSpacing:X,columnSpacing:Y,gridSize:Q,gridOffset:V,disableEqualOverflow:null!=(S=null!=(A=F)?A:_)&&S,parentDisableEqualOverflow:_}),ee=((e,n)=>{const{container:t,direction:r,spacing:i,wrap:a,gridSize:o}=e,l={root:["root",t&&"container","wrap"!==a&&`wrap-xs-${String(a)}`,...E(r),...G(o),...t?O(i,n.breakpoints.keys[0]):[]]};return(0,s.A)(l,(e=>(0,c.Ay)(u,e)),{})})(Z,$);let ne=(0,I.jsx)(g,(0,r.A)({ref:n,as:M,ownerState:Z,className:(0,o.A)(ee.root,k)},J,{children:a.Children.map(q,(e=>{var n;return a.isValidElement(e)&&(0,l.A)(e,["Grid"])?a.cloneElement(e,{unstable_level:null!=(n=e.props.unstable_level)?n:B+1}):e}))}));return void 0!==F&&F!==(null!=_&&_)&&(ne=(0,I.jsx)(p.Provider,{value:F,children:ne})),ne}));return m.muiName="Grid",m}({createStyledComponent:(0,M.Ay)("div",{name:"MuiGrid2",slot:"Root",overridesResolver:(e,n)=>n.root}),componentName:"MuiGrid2",useThemeProps:e=>(0,W.A)({props:e,name:"MuiGrid2"})});var P=H}}]);
//# sourceMappingURL=41.fc3b126d.chunk.js.map