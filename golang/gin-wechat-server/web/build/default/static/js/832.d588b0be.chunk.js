"use strict";(self.webpackChunkgin_wechat_web=self.webpackChunkgin_wechat_web||[]).push([[832],{3832:(e,t,n)=>{n.r(t),n.d(t,{default:()=>S});var s=n(5043),a=n(812),r=n(8146),l=n(4628),c=n(8168),i=n(5540),o=n(3024),d=n(3727),h=n(8214),u=n(1653),p=n(7061),m=n(6565),g=n(2883);function A(e){var t=e.children,n=e.className,a=e.content,r=e.textAlign,l=(0,o.A)((0,d.T9)(r),"description",n),i=(0,h.A)(A,e),m=(0,u.A)(A,e);return s.createElement(m,(0,c.A)({},i,{className:l}),p.gD(t)?a:t)}A.handledProps=["as","children","className","content","textAlign"],A.propTypes={};const x=A;function f(e){var t=e.children,n=e.className,a=e.content,r=e.textAlign,l=(0,o.A)((0,d.T9)(r),"header",n),i=(0,h.A)(f,e),m=(0,u.A)(f,e);return s.createElement(m,(0,c.A)({},i,{className:l}),p.gD(t)?a:t)}f.handledProps=["as","children","className","content","textAlign"],f.propTypes={};const v=f;function j(e){var t=e.children,n=e.className,a=e.content,r=e.textAlign,l=(0,o.A)((0,d.T9)(r),"meta",n),i=(0,h.A)(j,e),m=(0,u.A)(j,e);return s.createElement(m,(0,c.A)({},i,{className:l}),p.gD(t)?a:t)}j.handledProps=["as","children","className","content","textAlign"],j.propTypes={};const k=j;function N(e){var t=e.children,n=e.className,a=e.content,r=e.description,l=e.extra,i=e.header,m=e.meta,A=e.textAlign,f=(0,o.A)((0,d.b5)(l,"extra"),(0,d.T9)(A),"content",n),j=(0,h.A)(N,e),b=(0,u.A)(N,e);return p.gD(t)?p.gD(a)?s.createElement(b,(0,c.A)({},j,{className:f}),(0,g.Qf)(v,(function(e){return{content:e}}),i,{autoGenerateKey:!1}),(0,g.Qf)(k,(function(e){return{content:e}}),m,{autoGenerateKey:!1}),(0,g.Qf)(x,(function(e){return{content:e}}),r,{autoGenerateKey:!1})):s.createElement(b,(0,c.A)({},j,{className:f}),a):s.createElement(b,(0,c.A)({},j,{className:f}),t)}N.handledProps=["as","children","className","content","description","extra","header","meta","textAlign"],N.propTypes={};const b=N;var y=n(8807);function C(e){var t=e.centered,n=e.children,a=e.className,r=e.content,l=e.doubling,i=e.items,m=e.itemsPerRow,g=e.stackable,A=e.textAlign,x=(0,o.A)("ui",(0,d.b5)(t,"centered"),(0,d.b5)(l,"doubling"),(0,d.b5)(g,"stackable"),(0,d.T9)(A),(0,d.T5)(m),"cards",a),f=(0,h.A)(C,e),v=(0,u.A)(C,e);if(!p.gD(n))return s.createElement(v,(0,c.A)({},f,{className:x}),n);if(!p.gD(r))return s.createElement(v,(0,c.A)({},f,{className:x}),r);var j=(0,y.A)(i,(function(e){var t,n=null!=(t=e.key)?t:[e.header,e.description].join("-");return s.createElement(E,(0,c.A)({key:n},e))}));return s.createElement(v,(0,c.A)({},f,{className:x}),j)}C.handledProps=["as","centered","children","className","content","doubling","items","itemsPerRow","stackable","textAlign"],C.propTypes={};const _=C;var E=function(e){function t(){for(var t,n=arguments.length,s=new Array(n),a=0;a<n;a++)s[a]=arguments[a];return(t=e.call.apply(e,[this].concat(s))||this).handleClick=function(e){var n=t.props.onClick;n&&n(e,t.props)},t}return(0,i.A)(t,e),t.prototype.render=function(){var e=this.props,n=e.centered,a=e.children,r=e.className,l=e.color,i=e.content,g=e.description,A=e.extra,x=e.fluid,f=e.header,v=e.href,j=e.image,k=e.link,N=e.meta,y=e.onClick,C=e.raised,_=(0,o.A)("ui",l,(0,d.b5)(n,"centered"),(0,d.b5)(x,"fluid"),(0,d.b5)(k,"link"),(0,d.b5)(C,"raised"),"card",r),E=(0,h.A)(t,this.props),w=(0,u.A)(t,this.props,(function(){if(y)return"a"}));return p.gD(a)?p.gD(i)?s.createElement(w,(0,c.A)({},E,{className:_,href:v,onClick:this.handleClick}),m.A.create(j,{autoGenerateKey:!1,defaultProps:{ui:!1,wrapped:!0}}),(g||f||N)&&s.createElement(b,{description:g,header:f,meta:N}),A&&s.createElement(b,{extra:!0},A)):s.createElement(w,(0,c.A)({},E,{className:_,href:v,onClick:this.handleClick}),i):s.createElement(w,(0,c.A)({},E,{className:_,href:v,onClick:this.handleClick}),a)},t}(s.Component);E.handledProps=["as","centered","children","className","color","content","description","extra","fluid","header","href","image","link","meta","onClick","raised"],E.propTypes={},E.Content=b,E.Description=x,E.Group=_,E.Header=v,E.Meta=k;var w=n(2910),T=n(8169),D=n(8332),P=n(579);const S=()=>{var e,t,n,c,i,o,d;const[h,u]=(0,s.useState)(""),[p,m]=(0,s.useState)(!1),[g,A]=(0,s.useContext)(D.M);return(0,s.useEffect)((()=>{(async()=>{const e=await T.nC.get("/api/notice"),{success:t,message:n,data:s}=e.data;if(t){if(s!==localStorage.getItem("notice")&&""!==s){const e=(0,w.xI)(s);(0,T.An)(e,!0),localStorage.setItem("notice",s)}}else(0,T.Qg)(n)})().then(),(async()=>{u(localStorage.getItem("home_page_content")||"");const e=await T.nC.get("/api/home_page_content"),{success:t,message:n,data:s}=e.data;if(t){let e=s;s.startsWith("https://")||(e=w.xI.parse(s)),u(e),localStorage.setItem("home_page_content",e)}else(0,T.Qg)(n),u("\u52a0\u8f7d\u9996\u9875\u5185\u5bb9\u5931\u8d25...");m(!0)})().then()}),[]),(0,P.jsx)(P.Fragment,{children:p&&""===h?(0,P.jsx)(P.Fragment,{children:(0,P.jsxs)(a.A,{children:[(0,P.jsx)(r.A,{as:"h3",children:"\u7cfb\u7edf\u72b6\u51b5"}),(0,P.jsxs)(l.A,{columns:2,stackable:!0,children:[(0,P.jsx)(l.A.Column,{children:(0,P.jsx)(E,{fluid:!0,children:(0,P.jsxs)(E.Content,{children:[(0,P.jsx)(E.Header,{children:"\u7cfb\u7edf\u4fe1\u606f"}),(0,P.jsx)(E.Meta,{children:"\u7cfb\u7edf\u4fe1\u606f\u603b\u89c8"}),(0,P.jsxs)(E.Description,{children:[(0,P.jsxs)("p",{children:["\u540d\u79f0\uff1a",null===g||void 0===g||null===(e=g.status)||void 0===e?void 0:e.system_name]}),(0,P.jsxs)("p",{children:["\u7248\u672c\uff1a",null!==g&&void 0!==g&&null!==(t=g.status)&&void 0!==t&&t.version?null===g||void 0===g||null===(n=g.status)||void 0===n?void 0:n.version:"unknown"]}),(0,P.jsxs)("p",{children:["\u6e90\u7801\uff1a",(0,P.jsx)("a",{href:"https://gitee.com/zhongjyuan/one-api",target:"_blank",children:"https://gitee.com/zhongjyuan/one-api"})]}),(0,P.jsxs)("p",{children:["\u542f\u52a8\u65f6\u95f4\uff1a",(()=>{var e;const t=null===g||void 0===g||null===(e=g.status)||void 0===e?void 0:e.start_time;return(0,T.gA)(t)})()]})]})]})})}),(0,P.jsx)(l.A.Column,{children:(0,P.jsx)(E,{fluid:!0,children:(0,P.jsxs)(E.Content,{children:[(0,P.jsx)(E.Header,{children:"\u7cfb\u7edf\u914d\u7f6e"}),(0,P.jsx)(E.Meta,{children:"\u7cfb\u7edf\u914d\u7f6e\u603b\u89c8"}),(0,P.jsxs)(E.Description,{children:[(0,P.jsxs)("p",{children:["\u90ae\u7bb1\u9a8c\u8bc1\uff1a",!0===(null===g||void 0===g||null===(c=g.status)||void 0===c?void 0:c.email_verification)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]}),(0,P.jsxs)("p",{children:["GitHub \u8eab\u4efd\u9a8c\u8bc1\uff1a",!0===(null===g||void 0===g||null===(i=g.status)||void 0===i?void 0:i.github_oauth)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]}),(0,P.jsxs)("p",{children:["\u5fae\u4fe1\u8eab\u4efd\u9a8c\u8bc1\uff1a",!0===(null===g||void 0===g||null===(o=g.status)||void 0===o?void 0:o.wechat_login)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]}),(0,P.jsxs)("p",{children:["Turnstile \u7528\u6237\u6821\u9a8c\uff1a",!0===(null===g||void 0===g||null===(d=g.status)||void 0===d?void 0:d.turnstile_check)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]})]})]})})})]})]})}):(0,P.jsx)(P.Fragment,{children:h.startsWith("https://")?(0,P.jsx)("iframe",{src:h,style:{width:"100%",height:"100vh",border:"none"}}):(0,P.jsx)("div",{style:{fontSize:"larger"},dangerouslySetInnerHTML:{__html:h}})})})}}}]);
//# sourceMappingURL=832.d588b0be.chunk.js.map