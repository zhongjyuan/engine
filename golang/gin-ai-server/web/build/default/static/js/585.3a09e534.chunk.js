"use strict";(self.webpackChunkgin_ai_server_web=self.webpackChunkgin_ai_server_web||[]).push([[585],{5585:(e,t,s)=>{s.r(t),s.d(t,{default:()=>l});var a=s(5043),n=s(812),r=s(8146),h=s(2910),i=s(8169),c=s(579);const l=()=>{const[e,t]=(0,a.useState)(""),[s,l]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{(async()=>{t(localStorage.getItem("about")||"");const e=await i.nC.get("/api/about"),{success:s,message:a,data:n}=e.data;if(s){let e=n;n.startsWith("https://")||(e=h.xI.parse(n)),t(e),localStorage.setItem("about",e)}else(0,i.Qg)(a),t("\u52a0\u8f7d\u5173\u4e8e\u5185\u5bb9\u5931\u8d25...");l(!0)})().then()}),[]),(0,c.jsx)(c.Fragment,{children:s&&""===e?(0,c.jsx)(c.Fragment,{children:(0,c.jsxs)(n.A,{children:[(0,c.jsx)(r.A,{as:"h3",children:"\u5173\u4e8e"}),(0,c.jsx)("p",{children:"\u53ef\u5728\u8bbe\u7f6e\u9875\u9762\u8bbe\u7f6e\u5173\u4e8e\u5185\u5bb9\uff0c\u652f\u6301 HTML & Markdown"}),"\u9879\u76ee\u4ed3\u5e93\u5730\u5740\uff1a",(0,c.jsx)("a",{href:"https://gitee.com/zhongjyuan/one-api",children:"https://gitee.com/zhongjyuan/one-api"})]})}):(0,c.jsx)(c.Fragment,{children:e.startsWith("https://")?(0,c.jsx)("iframe",{src:e,style:{width:"100%",height:"100vh",border:"none"}}):(0,c.jsx)("div",{style:{fontSize:"larger"},dangerouslySetInnerHTML:{__html:e}})})})}}}]);
//# sourceMappingURL=585.3a09e534.chunk.js.map