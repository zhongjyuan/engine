"use strict";(self.webpackChunkgin_message_server_web=self.webpackChunkgin_message_server_web||[]).push([[585],{5585:(e,s,t)=>{t.r(s),t.d(s,{default:()=>i});var a=t(5043),n=t(812),r=t(8146),g=t(3273),c=t(2910),h=t(579);const i=()=>{const[e,s]=(0,a.useState)(""),[t,i]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{(async()=>{s(localStorage.getItem("about")||"");const e=await g.nC.get("/api/about"),{success:t,message:a,data:n}=e.data;if(t){let e=c.xI.parse(n);s(e),localStorage.setItem("about",e)}else(0,g.Qg)(a),s("\u52a0\u8f7d\u5173\u4e8e\u5185\u5bb9\u5931\u8d25...");i(!0)})().then()}),[]),(0,h.jsx)(h.Fragment,{children:(0,h.jsx)(n.A,{children:t&&""===e?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(r.A,{as:"h3",children:"\u5173\u4e8e"}),(0,h.jsx)("p",{children:"\u53ef\u5728\u8bbe\u7f6e\u9875\u9762\u8bbe\u7f6e\u5173\u4e8e\u5185\u5bb9\uff0c\u652f\u6301 HTML & Markdown"}),"\u9879\u76ee\u4ed3\u5e93\u5730\u5740\uff1a",(0,h.jsx)("a",{href:"https://github.com/zhongjyuan/gin-message-server",children:"https://github.com/zhongjyuan/gin-message-server"})]}):(0,h.jsx)(h.Fragment,{children:(0,h.jsx)("div",{dangerouslySetInnerHTML:{__html:e}})})})})}}}]);
//# sourceMappingURL=585.73243a36.chunk.js.map