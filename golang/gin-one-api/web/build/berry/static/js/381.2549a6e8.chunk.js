"use strict";(self.webpackChunkone_api_web=self.webpackChunkone_api_web||[]).push([[381],{4617:function(e,t,i){var n=i(3862),s=i(6971),a=i(9985);t.A=()=>{const e=(0,s.Zp)();return{register:async(t,i)=>{try{let s=localStorage.getItem("aff");s&&(t={...t,aff_code:s});const r=await n.n.post(`/api/user/register?turnstile=${i}`,t),{success:o,message:l}=r.data;return o&&((0,a.Te)("\u6ce8\u518c\u6210\u529f\uff01"),e("/login")),{success:o,message:l}}catch(s){return{success:!1,message:""}}},sendVerificationCode:async(e,t)=>{try{const i=await n.n.get(`/api/verification?email=${e}&turnstile=${t}`),{success:s,message:r}=i.data;return s&&(0,a.Te)("\u9a8c\u8bc1\u7801\u53d1\u9001\u6210\u529f\uff0c\u8bf7\u68c0\u67e5\u4f60\u7684\u90ae\u7bb1\uff01"),{success:s,message:r}}catch(i){return{success:!1,message:""}}}}}},1675:function(e,t,i){var n=i(5043),s=i(6446),a=i(6240),r=i(4535),o=i(310),l=i(579);const c=(0,n.forwardRef)(((e,t)=>{let{children:i,color:n="default",variant:r="soft",startIcon:o,endIcon:c,sx:h,...u}=e;const x=(0,a.A)(),p={width:16,height:16,"& svg, img":{width:1,height:1,objectFit:"cover"}};return(0,l.jsxs)(d,{ref:t,component:"span",ownerState:{color:n,variant:r},sx:{...o&&{pl:.75},...c&&{pr:.75},...h},theme:x,...u,children:[o&&(0,l.jsxs)(s.A,{sx:{mr:.75,...p},children:[" ",o," "]}),i,c&&(0,l.jsxs)(s.A,{sx:{ml:.75,...p},children:[" ",c," "]})]})}));t.A=c;const d=(0,r.Ay)(s.A)((e=>{var t,i,n,s,a;let{theme:r,ownerState:l}=e;const c="filled"===l.variant,d="outlined"===l.variant,h="soft"===l.variant,u="ghost"===l.variant,x={..."default"===l.color&&{...c&&{color:r.palette.grey[300],backgroundColor:r.palette.text.primary},...d&&{color:r.palette.grey[500],border:`2px solid ${r.palette.grey[500]}`},...h&&{color:r.palette.text.secondary,backgroundColor:(0,o.X4)(r.palette.grey[500],.16)}}},p={..."default"!==l.color&&{...c&&{color:r.palette.background.paper,backgroundColor:null===(t=r.palette[l.color])||void 0===t?void 0:t.main},...d&&{backgroundColor:"transparent",color:null===(i=r.palette[l.color])||void 0===i?void 0:i.main,border:`2px solid ${null===(n=r.palette[l.color])||void 0===n?void 0:n.main}`},...h&&{color:r.palette[l.color].dark,backgroundColor:(0,o.X4)(null===(s=r.palette[l.color])||void 0===s?void 0:s.main,.16)},...u&&{color:null===(a=r.palette[l.color])||void 0===a?void 0:a.main}}};return{height:24,minWidth:24,lineHeight:0,borderRadius:6,cursor:"default",alignItems:"center",whiteSpace:"nowrap",display:"inline-flex",justifyContent:"center",padding:r.spacing(0,.75),fontSize:r.typography.pxToRem(12),fontWeight:r.typography.fontWeightBold,transition:r.transitions.create("all",{duration:r.transitions.duration.shorter}),...x,...p}}))},6853:function(e,t,i){var n=i(5043),s=i(6240),a=i(2110),r=i(9958),o=i(5865),l=i(9336),c=i(6494),d=i(579);const h=(0,n.forwardRef)(((e,t)=>{let{children:i,content:n,contentClass:h,darkTitle:u,secondary:x,sx:p={},contentSX:m={},title:g,subTitle:j,...A}=e;const f=(0,s.A)();return(0,d.jsxs)(a.A,{ref:t,sx:{border:"1px solid",borderColor:f.palette.primary.light,":hover":{boxShadow:"0 2px 14px 0 rgb(32 40 45 / 8%)"},...p},...A,children:[!u&&g&&(0,d.jsx)(r.A,{sx:{p:2.5},title:(0,d.jsx)(o.A,{variant:"h5",children:g}),action:x,subheader:j}),u&&g&&(0,d.jsx)(r.A,{sx:{p:2.5},title:(0,d.jsx)(o.A,{variant:"h4",children:g}),action:x,subheader:j}),g&&(0,d.jsx)(l.A,{sx:{opacity:1,borderColor:f.palette.primary.light}}),n&&(0,d.jsx)(c.A,{sx:{p:2.5,...m},className:h||"",children:i}),!n&&i]})}));h.defaultProps={content:!0},t.A=h},7473:function(e,t,i){i.d(t,{A:function(){return g}});var n=i(1045),s=i(6446),a=i(310),r=i(2110),o=i(5043);var l=i.p+"static/media/shape-avatar.096ea8015d2d14ba4ce707d949a97823.svg",c=i.p+"static/media/cover.ce8466cd4be184bb082b.jpg",d=i(163),h=i(5173),u=i.n(h),x=i(579);const p=(0,o.forwardRef)(((e,t)=>{let{src:i,sx:n,...a}=e;return(0,x.jsx)(s.A,{component:"span",className:"svg-color",ref:t,sx:{width:24,height:24,display:"inline-block",bgcolor:"currentColor",mask:`url(${i}) no-repeat center / contain`,WebkitMask:`url(${i}) no-repeat center / contain`,...n},...a})}));p.propTypes={src:u().string,sx:u().object};var m=p;function g(e){let{children:t}=e;const i=(0,x.jsx)(m,{color:"paper",src:l,sx:{width:"100%",height:62,zIndex:10,bottom:-26,position:"absolute",color:"background.paper"}}),o=(0,x.jsx)(n.A,{src:d.A,sx:{zIndex:11,width:64,height:64,position:"absolute",alignItems:"center",marginLeft:"auto",marginRight:"auto",left:0,right:0,bottom:e=>e.spacing(-4)}}),h=(0,x.jsx)(s.A,{component:"img",src:c,sx:{top:0,width:1,height:1,objectFit:"cover",position:"absolute"}});return(0,x.jsxs)(r.A,{children:[(0,x.jsxs)(s.A,{sx:{position:"relative","&:after":{top:0,content:"''",width:"100%",height:"100%",position:"absolute",bgcolor:e=>(0,a.X4)(e.palette.primary.main,.42)},pt:{xs:"calc(100% / 3)",sm:"calc(100% / 4.66)"}},children:[i,o,h]}),(0,x.jsx)(s.A,{sx:{p:e=>e.spacing(4,3,3,3)},children:t})]})}},2511:function(e,t,i){i(5043);var n=i(3462),s=i(6600),a=i(5316),r=i(8903),o=i(5865),l=i(7784),c=i(2518),d=i(3516),h=i(9985),u=i(3033),x=i(579);const p=u.Ik().shape({code:u.Yj().required("\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a")});t.A=e=>{let{open:t,handleClose:i,wechatLogin:u,qrCode:m}=e;return(0,x.jsxs)(n.A,{open:t,onClose:i,children:[(0,x.jsx)(s.A,{children:"\u5fae\u4fe1\u9a8c\u8bc1\u7801\u767b\u5f55"}),(0,x.jsx)(a.A,{children:(0,x.jsxs)(r.Ay,{container:!0,direction:"column",alignItems:"center",children:[(0,x.jsx)("img",{src:m,alt:"\u4e8c\u7ef4\u7801",style:{maxWidth:"300px",maxHeight:"300px",width:"auto",height:"auto"}}),(0,x.jsx)(o.A,{variant:"body2",color:"text.secondary",style:{marginTop:"10px",textAlign:"center",wordWrap:"break-word",maxWidth:"300px"},children:"\u8bf7\u4f7f\u7528\u5fae\u4fe1\u626b\u63cf\u4e8c\u7ef4\u7801\u5173\u6ce8\u516c\u4f17\u53f7\uff0c\u8f93\u5165\u300c\u9a8c\u8bc1\u7801\u300d\u83b7\u53d6\u9a8c\u8bc1\u7801\uff08\u4e09\u5206\u949f\u5185\u6709\u6548\uff09"}),(0,x.jsx)(d.l1,{initialValues:{code:""},validationSchema:p,onSubmit:e=>{const{success:t,message:n}=u(e.code);t?i():(0,h.Qg)(n||"\u672a\u77e5\u9519\u8bef")},children:e=>{let{errors:t,touched:i}=e;return(0,x.jsxs)(d.lV,{style:{width:"100%"},children:[(0,x.jsx)(r.Ay,{item:!0,xs:12,children:(0,x.jsx)(d.D0,{as:l.A,name:"code",label:"\u9a8c\u8bc1\u7801",error:i.code&&Boolean(t.code),helperText:i.code&&t.code,fullWidth:!0})}),(0,x.jsx)(r.Ay,{item:!0,xs:12,children:(0,x.jsx)(c.A,{type:"submit",fullWidth:!0,children:"\u63d0\u4ea4"})})]})}})]})})]})}},5086:function(e,t,i){i.r(t),i.d(t,{default:function(){return E}});var n=i(5043),s=i(7473),a=i(2110),r=i(8911),o=i(3193),l=i(9190),c=i(4050),d=i(2518),h=i(7254),u=i(3462),x=i(6600),p=i(9336),m=i(5316),g=i(9347),j=i(2075),A=i(6853),f=i(9775),v=i(5698),y=i(7413),b=i(1675),_=i(3862),w=i(9985),k=i(3033),C=i(2511),S=i(9456),I=i(8903),T=i(1787),W=i(1673),$=i(3516),F=i(6240),Q=i(4617),B=i(579);const q=k.Ik().shape({email:k.Yj().email("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u90ae\u7bb1\u5730\u5740").required("\u90ae\u7bb1\u4e0d\u80fd\u4e3a\u7a7a"),email_verification_code:k.Yj().required("\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a")});var R=e=>{let{open:t,handleClose:i,turnstileToken:s}=e;const a=(0,F.A)(),[r,h]=(0,n.useState)(30),[p,j]=(0,n.useState)(!1),{sendVerificationCode:A}=(0,Q.A)(),[f,v]=(0,n.useState)(!1);(0,n.useEffect)((()=>{let e=null;return p&&r>0?e=setInterval((()=>{h(r-1)}),1e3):0===r&&(j(!1),h(30)),()=>clearInterval(e)}),[p,r]);return(0,B.jsxs)(u.A,{open:t,onClose:i,children:[(0,B.jsx)(x.A,{children:"\u7ed1\u5b9a\u90ae\u7bb1"}),(0,B.jsx)(m.A,{children:(0,B.jsx)(I.Ay,{container:!0,direction:"column",alignItems:"center",children:(0,B.jsx)($.l1,{initialValues:{email:"",email_verification_code:""},enableReinitialize:!0,validationSchema:q,onSubmit:async(e,t)=>{let{setErrors:n,setStatus:s,setSubmitting:a}=t;v(!0),a(!0);const r=await _.n.get(`/api/oauth/email/bind?email=${e.email}&code=${e.email_verification_code}`),{success:o,message:l}=r.data;o?((0,w.Te)("\u90ae\u7bb1\u8d26\u6237\u7ed1\u5b9a\u6210\u529f\uff01"),a(!1),s({success:!0}),i()):((0,w.Qg)(l),n({submit:l})),v(!1)},children:e=>{let{errors:t,touched:n,handleBlur:h,handleChange:u,handleSubmit:x,values:m}=e;return(0,B.jsxs)("form",{noValidate:!0,onSubmit:x,children:[(0,B.jsxs)(o.A,{fullWidth:!0,error:Boolean(n.email&&t.email),sx:{...a.typography.customInput},children:[(0,B.jsx)(l.A,{htmlFor:"email",children:"Email"}),(0,B.jsx)(c.A,{id:"email",type:"text",value:m.email,name:"email",onBlur:h,onChange:u,endAdornment:(0,B.jsx)(T.A,{position:"end",children:(0,B.jsx)(d.A,{variant:"contained",color:"primary",onClick:()=>(async e=>{if(j(!0),""===e)return void(0,w.Qg)("\u8bf7\u8f93\u5165\u90ae\u7bb1");if(""===s)return void(0,w.Qg)("\u8bf7\u7a0d\u540e\u51e0\u79d2\u91cd\u8bd5\uff0cTurnstile \u6b63\u5728\u68c0\u67e5\u7528\u6237\u73af\u5883\uff01");v(!0);const{success:t,message:i}=await A(e,s);v(!1),t||(0,w.Qg)(i)})(m.email),disabled:p||f,children:p?`\u91cd\u65b0\u53d1\u9001(${r})`:"\u83b7\u53d6\u9a8c\u8bc1\u7801"})}),inputProps:{}}),n.email&&t.email&&(0,B.jsx)(W.A,{error:!0,id:"helper-email",children:t.email})]}),(0,B.jsxs)(o.A,{fullWidth:!0,error:Boolean(n.email_verification_code&&t.email_verification_code),sx:{...a.typography.customInput},children:[(0,B.jsx)(l.A,{htmlFor:"email_verification_code",children:"\u9a8c\u8bc1\u7801"}),(0,B.jsx)(c.A,{id:"email_verification_code",type:"text",value:m.email_verification_code,name:"email_verification_code",onBlur:h,onChange:u,inputProps:{}}),n.email_verification_code&&t.email_verification_code&&(0,B.jsx)(W.A,{error:!0,id:"helper-email_verification_code",children:t.email_verification_code})]}),(0,B.jsxs)(g.A,{children:[(0,B.jsx)(d.A,{onClick:i,children:"\u53d6\u6d88"}),(0,B.jsx)(d.A,{disableElevation:!0,disabled:f,type:"submit",variant:"contained",color:"primary",children:"\u63d0\u4ea4"})]})]})}})})})]})},V=i(6215),Y=i.n(V);const z=k.Ik().shape({username:k.Yj().required("\u7528\u6237\u540d \u4e0d\u80fd\u4e3a\u7a7a").min(3,"\u7528\u6237\u540d \u4e0d\u80fd\u5c0f\u4e8e 3 \u4e2a\u5b57\u7b26"),display_name:k.Yj(),password:k.Yj().test("password","\u5bc6\u7801\u4e0d\u80fd\u5c0f\u4e8e 8 \u4e2a\u5b57\u7b26",(e=>!e||e.length>=8))});function E(){const[e,t]=(0,n.useState)([]),[i,k]=(0,n.useState)(!1),[I,T]=(0,n.useState)(!1),[W,$]=(0,n.useState)(""),[F,Q]=(0,n.useState)(""),[q,V]=(0,n.useState)(!1),[E,H]=(0,n.useState)(!1),X=(0,S.d4)((e=>e.siteInfo)),L=e=>{let{name:i,value:n}=e.target;t((e=>({...e,[i]:n})))};return(0,n.useEffect)((()=>{X&&X.turnstile_check&&(T(!0),$(X.turnstile_site_key)),(async()=>{let e=await _.n.get("/api/user/self");const{success:i,message:n,data:s}=e.data;i?t(s):(0,w.Qg)(n)})().then()}),[X]),(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(s.A,{children:(0,B.jsx)(a.A,{sx:{paddingTop:"20px"},children:(0,B.jsxs)(r.A,{spacing:2,children:[(0,B.jsxs)(r.A,{direction:"row",alignItems:"center",justifyContent:"center",spacing:2,sx:{paddingBottom:"20px"},children:[(0,B.jsxs)(b.A,{variant:"ghost",color:e.wechat_id?"primary":"default",children:[(0,B.jsx)(f.A,{})," ",e.wechat_id||"\u672a\u7ed1\u5b9a"]}),(0,B.jsxs)(b.A,{variant:"ghost",color:e.github_id?"primary":"default",children:[(0,B.jsx)(v.A,{})," ",e.github_id||"\u672a\u7ed1\u5b9a"]}),(0,B.jsxs)(b.A,{variant:"ghost",color:e.email?"primary":"default",children:[(0,B.jsx)(y.A,{})," ",e.email||"\u672a\u7ed1\u5b9a"]})]}),(0,B.jsx)(A.A,{title:"\u4e2a\u4eba\u4fe1\u606f",children:(0,B.jsxs)(j.A,{container:!0,spacing:2,children:[(0,B.jsx)(j.A,{xs:12,children:(0,B.jsxs)(o.A,{fullWidth:!0,variant:"outlined",children:[(0,B.jsx)(l.A,{htmlFor:"username",children:"\u7528\u6237\u540d"}),(0,B.jsx)(c.A,{id:"username",label:"\u7528\u6237\u540d",type:"text",value:e.username||"",onChange:L,name:"username",placeholder:"\u8bf7\u8f93\u5165\u7528\u6237\u540d"})]})}),(0,B.jsx)(j.A,{xs:12,children:(0,B.jsxs)(o.A,{fullWidth:!0,variant:"outlined",children:[(0,B.jsx)(l.A,{htmlFor:"password",children:"\u5bc6\u7801"}),(0,B.jsx)(c.A,{id:"password",label:"\u5bc6\u7801",type:"password",value:e.password||"",onChange:L,name:"password",placeholder:"\u8bf7\u8f93\u5165\u5bc6\u7801"})]})}),(0,B.jsx)(j.A,{xs:12,children:(0,B.jsxs)(o.A,{fullWidth:!0,variant:"outlined",children:[(0,B.jsx)(l.A,{htmlFor:"display_name",children:"\u663e\u793a\u540d\u79f0"}),(0,B.jsx)(c.A,{id:"display_name",label:"\u663e\u793a\u540d\u79f0",type:"text",value:e.display_name||"",onChange:L,name:"display_name",placeholder:"\u8bf7\u8f93\u5165\u663e\u793a\u540d\u79f0"})]})}),(0,B.jsx)(j.A,{xs:12,children:(0,B.jsx)(d.A,{variant:"contained",color:"primary",onClick:async()=>{try{await z.validate(e);const t=await _.n.put("/api/user/self",e),{success:i,message:n}=t.data;i?(0,w.Te)("\u7528\u6237\u4fe1\u606f\u66f4\u65b0\u6210\u529f\uff01"):(0,w.Qg)(n)}catch(t){(0,w.Qg)(t.message)}},children:"\u63d0\u4ea4"})})]})}),(0,B.jsx)(A.A,{title:"\u8d26\u53f7\u7ed1\u5b9a",children:(0,B.jsxs)(j.A,{container:!0,spacing:2,children:[X.wechat_login&&!e.wechat_id&&(0,B.jsx)(j.A,{xs:12,md:4,children:(0,B.jsx)(d.A,{variant:"contained",onClick:()=>{V(!0)},children:"\u7ed1\u5b9a\u5fae\u4fe1\u8d26\u53f7"})}),X.github_oauth&&!e.github_id&&(0,B.jsx)(j.A,{xs:12,md:4,children:(0,B.jsx)(d.A,{variant:"contained",onClick:()=>(0,w.fu)(X.github_client_id,!0),children:"\u7ed1\u5b9a GitHub \u8d26\u53f7"})}),(0,B.jsxs)(j.A,{xs:12,md:4,children:[(0,B.jsx)(d.A,{variant:"contained",onClick:()=>{H(!0)},children:e.email?"\u66f4\u6362\u90ae\u7bb1":"\u7ed1\u5b9a\u90ae\u7bb1"}),I?(0,B.jsx)(Y(),{sitekey:W,onVerify:e=>{Q(e)}}):(0,B.jsx)(B.Fragment,{})]})]})}),(0,B.jsx)(A.A,{title:"\u5176\u4ed6",children:(0,B.jsxs)(j.A,{container:!0,spacing:2,children:[(0,B.jsx)(j.A,{xs:12,children:(0,B.jsx)(h.A,{severity:"info",children:"\u6ce8\u610f\uff0c\u6b64\u5904\u751f\u6210\u7684\u4ee4\u724c\u7528\u4e8e\u7cfb\u7edf\u7ba1\u7406\uff0c\u800c\u975e\u7528\u4e8e\u8bf7\u6c42 OpenAI \u76f8\u5173\u7684\u670d\u52a1\uff0c\u8bf7\u77e5\u6089\u3002"})}),e.access_token&&(0,B.jsx)(j.A,{xs:12,children:(0,B.jsxs)(h.A,{severity:"error",children:["\u4f60\u7684\u8bbf\u95ee\u4ee4\u724c\u662f: ",(0,B.jsx)("b",{children:e.access_token})," ",(0,B.jsx)("br",{}),"\u8bf7\u59a5\u5584\u4fdd\u7ba1\u3002\u5982\u6709\u6cc4\u6f0f\uff0c\u8bf7\u7acb\u5373\u91cd\u7f6e\u3002"]})}),(0,B.jsx)(j.A,{xs:12,children:(0,B.jsx)(d.A,{variant:"contained",onClick:async()=>{const e=await _.n.get("/api/user/token"),{success:i,message:n,data:s}=e.data;i?(t((e=>({...e,access_token:s}))),navigator.clipboard.writeText(s),(0,w.Te)("\u4ee4\u724c\u5df2\u91cd\u7f6e\u5e76\u5df2\u590d\u5236\u5230\u526a\u8d34\u677f")):(0,w.Qg)(n),console.log(I,W,X)},children:e.access_token?"\u91cd\u7f6e\u8bbf\u95ee\u4ee4\u724c":"\u751f\u6210\u8bbf\u95ee\u4ee4\u724c"})}),(0,B.jsx)(j.A,{xs:12,children:(0,B.jsx)(d.A,{variant:"contained",color:"error",onClick:()=>{k(!0)},children:"\u5220\u9664\u5e10\u53f7"})})]})})]})})}),(0,B.jsxs)(u.A,{open:i,onClose:()=>k(!1),maxWidth:"md",children:[(0,B.jsx)(x.A,{sx:{margin:"0px",fontWeight:500,lineHeight:"1.55556",padding:"24px",fontSize:"1.125rem"},children:"\u5371\u9669\u64cd\u4f5c"}),(0,B.jsx)(p.A,{}),(0,B.jsx)(m.A,{children:"\u60a8\u6b63\u5728\u5220\u9664\u81ea\u5df1\u7684\u5e10\u6237\uff0c\u5c06\u6e05\u7a7a\u6240\u6709\u6570\u636e\u4e14\u4e0d\u53ef\u6062\u590d"}),(0,B.jsxs)(g.A,{children:[(0,B.jsx)(d.A,{onClick:()=>k(!1),children:"\u53d6\u6d88"}),(0,B.jsx)(d.A,{sx:{color:"error.main"},onClick:async()=>{k(!1)},children:"\u786e\u5b9a"})]})]}),(0,B.jsx)(C.A,{open:q,handleClose:()=>{V(!1)},wechatLogin:async e=>{if(""!==e)try{const t=await _.n.get(`/api/oauth/wechat/bind?code=${e}`),{success:i,message:n}=t.data;return i&&(0,w.Te)("\u5fae\u4fe1\u8d26\u6237\u7ed1\u5b9a\u6210\u529f\uff01"),{success:i,message:n}}catch(t){return{success:!1,message:""}}},qrCode:X.wechat_qrcode}),(0,B.jsx)(R,{open:E,turnstileToken:F,handleClose:()=>{H(!1)}})]})}}}]);
//# sourceMappingURL=381.2549a6e8.chunk.js.map