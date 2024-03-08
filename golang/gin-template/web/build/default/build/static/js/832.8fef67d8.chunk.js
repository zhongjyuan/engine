"use strict";(self.webpackChunkgin_template_web=self.webpackChunkgin_template_web||[]).push([[832],{3832:(e,t,n)=>{n.r(t),n.d(t,{default:()=>P});var r=n(5043),a=n(812),s=n(8146),l=n(4628),c=n(8168),i=n(5540),o=n(3024),d=n(3727),h=n(8214),u=n(1653),m=n(7061),p=n(6565),A=n(2883);function g(e){var t=e.children,n=e.className,a=e.content,s=e.textAlign,l=(0,o.A)((0,d.T9)(s),"description",n),i=(0,h.A)(g,e),p=(0,u.A)(g,e);return r.createElement(p,(0,c.A)({},i,{className:l}),m.gD(t)?a:t)}g.handledProps=["as","children","className","content","textAlign"],g.propTypes={};const x=g;function f(e){var t=e.children,n=e.className,a=e.content,s=e.textAlign,l=(0,o.A)((0,d.T9)(s),"header",n),i=(0,h.A)(f,e),p=(0,u.A)(f,e);return r.createElement(p,(0,c.A)({},i,{className:l}),m.gD(t)?a:t)}f.handledProps=["as","children","className","content","textAlign"],f.propTypes={};const v=f;function j(e){var t=e.children,n=e.className,a=e.content,s=e.textAlign,l=(0,o.A)((0,d.T9)(s),"meta",n),i=(0,h.A)(j,e),p=(0,u.A)(j,e);return r.createElement(p,(0,c.A)({},i,{className:l}),m.gD(t)?a:t)}j.handledProps=["as","children","className","content","textAlign"],j.propTypes={};const k=j;function b(e){var t=e.children,n=e.className,a=e.content,s=e.description,l=e.extra,i=e.header,p=e.meta,g=e.textAlign,f=(0,o.A)((0,d.b5)(l,"extra"),(0,d.T9)(g),"content",n),j=(0,h.A)(b,e),N=(0,u.A)(b,e);return m.gD(t)?m.gD(a)?r.createElement(N,(0,c.A)({},j,{className:f}),(0,A.Qf)(v,(function(e){return{content:e}}),i,{autoGenerateKey:!1}),(0,A.Qf)(k,(function(e){return{content:e}}),p,{autoGenerateKey:!1}),(0,A.Qf)(x,(function(e){return{content:e}}),s,{autoGenerateKey:!1})):r.createElement(N,(0,c.A)({},j,{className:f}),a):r.createElement(N,(0,c.A)({},j,{className:f}),t)}b.handledProps=["as","children","className","content","description","extra","header","meta","textAlign"],b.propTypes={};const N=b;var y=n(8807);function C(e){var t=e.centered,n=e.children,a=e.className,s=e.content,l=e.doubling,i=e.items,p=e.itemsPerRow,A=e.stackable,g=e.textAlign,x=(0,o.A)("ui",(0,d.b5)(t,"centered"),(0,d.b5)(l,"doubling"),(0,d.b5)(A,"stackable"),(0,d.T9)(g),(0,d.T5)(p),"cards",a),f=(0,h.A)(C,e),v=(0,u.A)(C,e);if(!m.gD(n))return r.createElement(v,(0,c.A)({},f,{className:x}),n);if(!m.gD(s))return r.createElement(v,(0,c.A)({},f,{className:x}),s);var j=(0,y.A)(i,(function(e){var t,n=null!=(t=e.key)?t:[e.header,e.description].join("-");return r.createElement(T,(0,c.A)({key:n},e))}));return r.createElement(v,(0,c.A)({},f,{className:x}),j)}C.handledProps=["as","centered","children","className","content","doubling","items","itemsPerRow","stackable","textAlign"],C.propTypes={};const E=C;var T=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(t=e.call.apply(e,[this].concat(r))||this).handleClick=function(e){var n=t.props.onClick;n&&n(e,t.props)},t}return(0,i.A)(t,e),t.prototype.render=function(){var e=this.props,n=e.centered,a=e.children,s=e.className,l=e.color,i=e.content,A=e.description,g=e.extra,x=e.fluid,f=e.header,v=e.href,j=e.image,k=e.link,b=e.meta,y=e.onClick,C=e.raised,E=(0,o.A)("ui",l,(0,d.b5)(n,"centered"),(0,d.b5)(x,"fluid"),(0,d.b5)(k,"link"),(0,d.b5)(C,"raised"),"card",s),T=(0,h.A)(t,this.props),_=(0,u.A)(t,this.props,(function(){if(y)return"a"}));return m.gD(a)?m.gD(i)?r.createElement(_,(0,c.A)({},T,{className:E,href:v,onClick:this.handleClick}),p.A.create(j,{autoGenerateKey:!1,defaultProps:{ui:!1,wrapped:!0}}),(A||f||b)&&r.createElement(N,{description:A,header:f,meta:b}),g&&r.createElement(N,{extra:!0},g)):r.createElement(_,(0,c.A)({},T,{className:E,href:v,onClick:this.handleClick}),i):r.createElement(_,(0,c.A)({},T,{className:E,href:v,onClick:this.handleClick}),a)},t}(r.Component);T.handledProps=["as","centered","children","className","color","content","description","extra","fluid","header","href","image","link","meta","onClick","raised"],T.propTypes={},T.Content=N,T.Description=x,T.Group=E,T.Header=v,T.Meta=k;var _=n(8169),D=n(8332),w=n(579);const P=()=>{var e,t,n,c,i,o;const[d,h]=(0,r.useContext)(D.M),u=localStorage.getItem("home_page_link")||"";return(0,r.useEffect)((()=>{(async()=>{const e=await _.nC.get("/api/notice"),{success:t,message:n,data:r}=e.data;t?r!==localStorage.getItem("notice")&&""!==r&&((0,_.An)(r),localStorage.setItem("notice",r)):(0,_.Qg)(n)})().then()}),[]),(0,w.jsx)(w.Fragment,{children:""!==u?(0,w.jsx)(w.Fragment,{children:(0,w.jsx)("iframe",{src:u,style:{width:"100%",height:"100vh",border:"none"}})}):(0,w.jsx)(w.Fragment,{children:(0,w.jsxs)(a.A,{children:[(0,w.jsx)(s.A,{as:"h3",children:"\u7cfb\u7edf\u72b6\u51b5"}),(0,w.jsxs)(l.A,{columns:2,stackable:!0,children:[(0,w.jsx)(l.A.Column,{children:(0,w.jsx)(T,{fluid:!0,children:(0,w.jsxs)(T.Content,{children:[(0,w.jsx)(T.Header,{children:"\u7cfb\u7edf\u4fe1\u606f"}),(0,w.jsx)(T.Meta,{children:"\u7cfb\u7edf\u4fe1\u606f\u603b\u89c8"}),(0,w.jsxs)(T.Description,{children:[(0,w.jsxs)("p",{children:["\u540d\u79f0\uff1a",null===d||void 0===d||null===(e=d.status)||void 0===e?void 0:e.system_name]}),(0,w.jsxs)("p",{children:["\u7248\u672c\uff1a",null===d||void 0===d||null===(t=d.status)||void 0===t?void 0:t.version]}),(0,w.jsxs)("p",{children:["\u6e90\u7801\uff1a",(0,w.jsx)("a",{href:"https://github.com/zhongjyuan/gin-template",target:"_blank",children:"https://github.com/zhongjyuan/gin-template"})]}),(0,w.jsxs)("p",{children:["\u542f\u52a8\u65f6\u95f4\uff1a",(()=>{var e;const t=null===d||void 0===d||null===(e=d.status)||void 0===e?void 0:e.start_time;return(0,_.gA)(t)})()]})]})]})})}),(0,w.jsx)(l.A.Column,{children:(0,w.jsx)(T,{fluid:!0,children:(0,w.jsxs)(T.Content,{children:[(0,w.jsx)(T.Header,{children:"\u7cfb\u7edf\u914d\u7f6e"}),(0,w.jsx)(T.Meta,{children:"\u7cfb\u7edf\u914d\u7f6e\u603b\u89c8"}),(0,w.jsxs)(T.Description,{children:[(0,w.jsxs)("p",{children:["\u90ae\u7bb1\u9a8c\u8bc1\uff1a",!0===(null===d||void 0===d||null===(n=d.status)||void 0===n?void 0:n.email_verification)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]}),(0,w.jsxs)("p",{children:["GitHub \u8eab\u4efd\u9a8c\u8bc1\uff1a",!0===(null===d||void 0===d||null===(c=d.status)||void 0===c?void 0:c.github_oauth)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]}),(0,w.jsxs)("p",{children:["\u5fae\u4fe1\u8eab\u4efd\u9a8c\u8bc1\uff1a",!0===(null===d||void 0===d||null===(i=d.status)||void 0===i?void 0:i.wechat_login)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]}),(0,w.jsxs)("p",{children:["Turnstile \u7528\u6237\u6821\u9a8c\uff1a",!0===(null===d||void 0===d||null===(o=d.status)||void 0===o?void 0:o.turnstile_check)?"\u5df2\u542f\u7528":"\u672a\u542f\u7528"]})]})]})})})]})]})})})}}}]);
//# sourceMappingURL=832.8fef67d8.chunk.js.map