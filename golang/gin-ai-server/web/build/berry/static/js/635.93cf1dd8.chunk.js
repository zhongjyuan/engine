"use strict";(self.webpackChunkgin_ai_server_web=self.webpackChunkgin_ai_server_web||[]).push([[635],{2021:function(e,t,n){var r=n(6446),o=n(2330),i=n(579);t.A=e=>{let{children:t,...n}=e;return(0,i.jsx)(o.A,{sx:{maxWidth:{xs:400,lg:475},margin:{xs:2.5,md:3},"& > *":{flexGrow:1,flexBasis:"50%"}},content:!1,...n,children:(0,i.jsx)(r.A,{sx:{p:{xs:2,sm:3,xl:5}},children:t})})}},7743:function(e,t,n){var r=n(4535),o=n(9456),i=n(6971),a=n(5043),s=n(4107),l=n(579);const c=(0,r.Ay)("div")((e=>{let{theme:t}=e;return{backgroundColor:t.palette.primary.light}}));t.A=e=>{let{children:t}=e;const n=(0,o.d4)((e=>e.account)),{isUserLoaded:r}=(0,a.useContext)(s.R),d=(0,i.Zp)();return(0,a.useEffect)((()=>{r&&n.user&&d("/panel")}),[n,d,r]),(0,l.jsxs)(c,{children:[" ",t," "]})}},7444:function(e,t,n){n.r(t),n.d(t,{default:function(){return y}});var r=n(1318),o=n(6240),i=n(344),a=n(8903),s=n(8911),l=n(5865),c=n(9336),d=n(7743),u=n(2021),p=n(5043),m=n(7254),h=n(2518),x=n(9985),g=n(3862),A=n(579);var v=()=>{const[e]=(0,r.ok)(),[t,n]=(0,p.useState)({email:"",token:""}),[o,i]=(0,p.useState)("");return(0,p.useEffect)((()=>{let t=e.get("email"),r=e.get("token");n({token:r,email:t})}),[]),(0,A.jsx)(s.A,{spacing:3,padding:"24px",justifyContent:"center",alignItems:"center",children:t.email&&t.token?o?(0,A.jsxs)(m.A,{severity:"error",children:["\u4f60\u7684\u65b0\u5bc6\u7801\u662f: ",(0,A.jsx)("b",{children:o})," ",(0,A.jsx)("br",{}),"\u8bf7\u767b\u5f55\u540e\u53ca\u65f6\u4fee\u6539\u5bc6\u7801"]}):(0,A.jsx)(h.A,{fullWidth:!0,onClick:async()=>{const e=await g.n.post("/api/user/reset",t),{success:n,message:r}=e.data;if(n){let t=e.data.data;i(t),navigator.clipboard.writeText(t),(0,x.cf)(`\u65b0\u5bc6\u7801\u5df2\u590d\u5236\u5230\u526a\u8d34\u677f\uff1a${t}`)}else(0,x.Qg)(r)},size:"large",type:"submit",variant:"contained",color:"primary",children:"\u70b9\u51fb\u91cd\u7f6e\u5bc6\u7801"}):(0,A.jsx)(l.A,{variant:"h3",sx:{textDecoration:"none"},children:"\u65e0\u6548\u7684\u94fe\u63a5"})})},f=n(3866);var y=()=>{const e=(0,o.A)(),t=(0,i.A)(e.breakpoints.down("md"));return(0,A.jsx)(d.A,{children:(0,A.jsx)(a.Ay,{container:!0,direction:"column",justifyContent:"flex-end",children:(0,A.jsx)(a.Ay,{item:!0,xs:12,children:(0,A.jsx)(a.Ay,{container:!0,justifyContent:"center",alignItems:"center",sx:{minHeight:"calc(100vh - 136px)"},children:(0,A.jsx)(a.Ay,{item:!0,sx:{m:{xs:1,sm:3},mb:0},children:(0,A.jsx)(u.A,{children:(0,A.jsxs)(a.Ay,{container:!0,spacing:2,alignItems:"center",justifyContent:"center",children:[(0,A.jsx)(a.Ay,{item:!0,sx:{mb:3},children:(0,A.jsx)(r.N_,{to:"#",children:(0,A.jsx)(f.A,{})})}),(0,A.jsx)(a.Ay,{item:!0,xs:12,children:(0,A.jsx)(a.Ay,{container:!0,direction:t?"column-reverse":"row",alignItems:"center",justifyContent:"center",children:(0,A.jsx)(a.Ay,{item:!0,children:(0,A.jsx)(s.A,{alignItems:"center",justifyContent:"center",spacing:1,children:(0,A.jsx)(l.A,{color:e.palette.primary.main,gutterBottom:!0,variant:t?"h3":"h2",children:"\u5bc6\u7801\u91cd\u7f6e\u786e\u8ba4"})})})})}),(0,A.jsx)(a.Ay,{item:!0,xs:12,children:(0,A.jsx)(v,{})}),(0,A.jsx)(a.Ay,{item:!0,xs:12,children:(0,A.jsx)(c.A,{})}),(0,A.jsx)(a.Ay,{item:!0,xs:12,children:(0,A.jsx)(a.Ay,{item:!0,container:!0,direction:"column",alignItems:"center",xs:12,children:(0,A.jsx)(l.A,{component:r.N_,to:"/login",variant:"subtitle1",sx:{textDecoration:"none"},children:"\u767b\u5f55"})})})]})})})})})})})}},7392:function(e,t,n){n.d(t,{A:function(){return y}});var r=n(8587),o=n(8168),i=n(5043),a=n(8387),s=n(8606),l=n(7266),c=n(4535),d=n(2876),u=n(5429),p=n(6803),m=n(7056),h=n(2400);function x(e){return(0,h.Ay)("MuiIconButton",e)}var g=(0,m.A)("MuiIconButton",["root","disabled","colorInherit","colorPrimary","colorSecondary","colorError","colorInfo","colorSuccess","colorWarning","edgeStart","edgeEnd","sizeSmall","sizeMedium","sizeLarge"]),A=n(579);const v=["edge","children","className","color","disabled","disableFocusRipple","size"],f=(0,c.Ay)(u.A,{name:"MuiIconButton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,"default"!==n.color&&t[`color${(0,p.A)(n.color)}`],n.edge&&t[`edge${(0,p.A)(n.edge)}`],t[`size${(0,p.A)(n.size)}`]]}})((e=>{let{theme:t,ownerState:n}=e;return(0,o.A)({textAlign:"center",flex:"0 0 auto",fontSize:t.typography.pxToRem(24),padding:8,borderRadius:"50%",overflow:"visible",color:(t.vars||t).palette.action.active,transition:t.transitions.create("background-color",{duration:t.transitions.duration.shortest})},!n.disableRipple&&{"&:hover":{backgroundColor:t.vars?`rgba(${t.vars.palette.action.activeChannel} / ${t.vars.palette.action.hoverOpacity})`:(0,l.X4)(t.palette.action.active,t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"start"===n.edge&&{marginLeft:"small"===n.size?-3:-12},"end"===n.edge&&{marginRight:"small"===n.size?-3:-12})}),(e=>{let{theme:t,ownerState:n}=e;var r;const i=null==(r=(t.vars||t).palette)?void 0:r[n.color];return(0,o.A)({},"inherit"===n.color&&{color:"inherit"},"inherit"!==n.color&&"default"!==n.color&&(0,o.A)({color:null==i?void 0:i.main},!n.disableRipple&&{"&:hover":(0,o.A)({},i&&{backgroundColor:t.vars?`rgba(${i.mainChannel} / ${t.vars.palette.action.hoverOpacity})`:(0,l.X4)(i.main,t.palette.action.hoverOpacity)},{"@media (hover: none)":{backgroundColor:"transparent"}})}),"small"===n.size&&{padding:5,fontSize:t.typography.pxToRem(18)},"large"===n.size&&{padding:12,fontSize:t.typography.pxToRem(28)},{[`&.${g.disabled}`]:{backgroundColor:"transparent",color:(t.vars||t).palette.action.disabled}})}));var y=i.forwardRef((function(e,t){const n=(0,d.A)({props:e,name:"MuiIconButton"}),{edge:i=!1,children:l,className:c,color:u="default",disabled:m=!1,disableFocusRipple:h=!1,size:g="medium"}=n,y=(0,r.A)(n,v),j=(0,o.A)({},n,{edge:i,color:u,disabled:m,disableFocusRipple:h,size:g}),b=(e=>{const{classes:t,disabled:n,color:r,edge:o,size:i}=e,a={root:["root",n&&"disabled","default"!==r&&`color${(0,p.A)(r)}`,o&&`edge${(0,p.A)(o)}`,`size${(0,p.A)(i)}`]};return(0,s.A)(a,x,t)})(j);return(0,A.jsx)(f,(0,o.A)({className:(0,a.A)(b.root,c),centerRipple:!0,focusRipple:!h,disabled:m,ref:t},y,{ownerState:j,children:l}))}))}}]);
//# sourceMappingURL=635.93cf1dd8.chunk.js.map