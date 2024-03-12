"use strict";(self.webpackChunkgin_ai_server_web=self.webpackChunkgin_ai_server_web||[]).push([[739],{7739:function(e,o,t){t.d(o,{A:function(){return B}});var r=t(8587),n=t(8168),p=t(5043),a=t(8387),i=t(1140),l=t(2205),s=t(8606),c=t(7266),u=t(4535),m=t(6240),d=t(2876),h=t(6803),g=t(6328),f=t(5622),A=t(3319),v=t(5849),b=t(5879),w=t(2191),y=t(4516),T=t(7056),x=t(2400);function R(e){return(0,x.Ay)("MuiTooltip",e)}var P=(0,T.A)("MuiTooltip",["popper","popperInteractive","popperArrow","popperClose","tooltip","tooltipArrow","touch","tooltipPlacementLeft","tooltipPlacementRight","tooltipPlacementTop","tooltipPlacementBottom","arrow"]),M=t(579);const C=["arrow","children","classes","components","componentsProps","describeChild","disableFocusListener","disableHoverListener","disableInteractive","disableTouchListener","enterDelay","enterNextDelay","enterTouchDelay","followCursor","id","leaveDelay","leaveTouchDelay","onClose","onOpen","open","placement","PopperComponent","PopperProps","slotProps","slots","title","TransitionComponent","TransitionProps"];const L=(0,u.Ay)(f.A,{name:"MuiTooltip",slot:"Popper",overridesResolver:(e,o)=>{const{ownerState:t}=e;return[o.popper,!t.disableInteractive&&o.popperInteractive,t.arrow&&o.popperArrow,!t.open&&o.popperClose]}})((e=>{let{theme:o,ownerState:t,open:r}=e;return(0,n.A)({zIndex:(o.vars||o).zIndex.tooltip,pointerEvents:"none"},!t.disableInteractive&&{pointerEvents:"auto"},!r&&{pointerEvents:"none"},t.arrow&&{[`&[data-popper-placement*="bottom"] .${P.arrow}`]:{top:0,marginTop:"-0.71em","&::before":{transformOrigin:"0 100%"}},[`&[data-popper-placement*="top"] .${P.arrow}`]:{bottom:0,marginBottom:"-0.71em","&::before":{transformOrigin:"100% 0"}},[`&[data-popper-placement*="right"] .${P.arrow}`]:(0,n.A)({},t.isRtl?{right:0,marginRight:"-0.71em"}:{left:0,marginLeft:"-0.71em"},{height:"1em",width:"0.71em","&::before":{transformOrigin:"100% 100%"}}),[`&[data-popper-placement*="left"] .${P.arrow}`]:(0,n.A)({},t.isRtl?{left:0,marginLeft:"-0.71em"}:{right:0,marginRight:"-0.71em"},{height:"1em",width:"0.71em","&::before":{transformOrigin:"0 0"}})})})),S=(0,u.Ay)("div",{name:"MuiTooltip",slot:"Tooltip",overridesResolver:(e,o)=>{const{ownerState:t}=e;return[o.tooltip,t.touch&&o.touch,t.arrow&&o.tooltipArrow,o[`tooltipPlacement${(0,h.A)(t.placement.split("-")[0])}`]]}})((e=>{let{theme:o,ownerState:t}=e;return(0,n.A)({backgroundColor:o.vars?o.vars.palette.Tooltip.bg:(0,c.X4)(o.palette.grey[700],.92),borderRadius:(o.vars||o).shape.borderRadius,color:(o.vars||o).palette.common.white,fontFamily:o.typography.fontFamily,padding:"4px 8px",fontSize:o.typography.pxToRem(11),maxWidth:300,margin:2,wordWrap:"break-word",fontWeight:o.typography.fontWeightMedium},t.arrow&&{position:"relative",margin:0},t.touch&&{padding:"8px 16px",fontSize:o.typography.pxToRem(14),lineHeight:(r=16/14,Math.round(1e5*r)/1e5)+"em",fontWeight:o.typography.fontWeightRegular},{[`.${P.popper}[data-popper-placement*="left"] &`]:(0,n.A)({transformOrigin:"right center"},t.isRtl?(0,n.A)({marginLeft:"14px"},t.touch&&{marginLeft:"24px"}):(0,n.A)({marginRight:"14px"},t.touch&&{marginRight:"24px"})),[`.${P.popper}[data-popper-placement*="right"] &`]:(0,n.A)({transformOrigin:"left center"},t.isRtl?(0,n.A)({marginRight:"14px"},t.touch&&{marginRight:"24px"}):(0,n.A)({marginLeft:"14px"},t.touch&&{marginLeft:"24px"})),[`.${P.popper}[data-popper-placement*="top"] &`]:(0,n.A)({transformOrigin:"center bottom",marginBottom:"14px"},t.touch&&{marginBottom:"24px"}),[`.${P.popper}[data-popper-placement*="bottom"] &`]:(0,n.A)({transformOrigin:"center top",marginTop:"14px"},t.touch&&{marginTop:"24px"})});var r})),O=(0,u.Ay)("span",{name:"MuiTooltip",slot:"Arrow",overridesResolver:(e,o)=>o.arrow})((e=>{let{theme:o}=e;return{overflow:"hidden",position:"absolute",width:"1em",height:"0.71em",boxSizing:"border-box",color:o.vars?o.vars.palette.Tooltip.bg:(0,c.X4)(o.palette.grey[700],.9),"&::before":{content:'""',margin:"auto",display:"block",width:"100%",height:"100%",backgroundColor:"currentColor",transform:"rotate(45deg)"}}}));let k=!1;const E=new i.E;let N={x:0,y:0};function I(e,o){return t=>{o&&o(t),e(t)}}var B=p.forwardRef((function(e,o){var t,c,u,T,x,P,B,D,F,W,$,X,j,_,z,U,H,V,Y;const q=(0,d.A)({props:e,name:"MuiTooltip"}),{arrow:G=!1,children:J,components:K={},componentsProps:Q={},describeChild:Z=!1,disableFocusListener:ee=!1,disableHoverListener:oe=!1,disableInteractive:te=!1,disableTouchListener:re=!1,enterDelay:ne=100,enterNextDelay:pe=0,enterTouchDelay:ae=700,followCursor:ie=!1,id:le,leaveDelay:se=0,leaveTouchDelay:ce=1500,onClose:ue,onOpen:me,open:de,placement:he="bottom",PopperComponent:ge,PopperProps:fe={},slotProps:Ae={},slots:ve={},title:be,TransitionComponent:we=g.A,TransitionProps:ye}=q,Te=(0,r.A)(q,C),xe=p.isValidElement(J)?J:(0,M.jsx)("span",{children:J}),Re=(0,m.A)(),Pe="rtl"===Re.direction,[Me,Ce]=p.useState(),[Le,Se]=p.useState(null),Oe=p.useRef(!1),ke=te||ie,Ee=(0,i.A)(),Ne=(0,i.A)(),Ie=(0,i.A)(),Be=(0,i.A)(),[De,Fe]=(0,y.A)({controlled:de,default:!1,name:"Tooltip",state:"open"});let We=De;const $e=(0,b.A)(le),Xe=p.useRef(),je=(0,A.A)((()=>{void 0!==Xe.current&&(document.body.style.WebkitUserSelect=Xe.current,Xe.current=void 0),Be.clear()}));p.useEffect((()=>je),[je]);const _e=e=>{E.clear(),k=!0,Fe(!0),me&&!We&&me(e)},ze=(0,A.A)((e=>{E.start(800+se,(()=>{k=!1})),Fe(!1),ue&&We&&ue(e),Ee.start(Re.transitions.duration.shortest,(()=>{Oe.current=!1}))})),Ue=e=>{Oe.current&&"touchstart"!==e.type||(Me&&Me.removeAttribute("title"),Ne.clear(),Ie.clear(),ne||k&&pe?Ne.start(k?pe:ne,(()=>{_e(e)})):_e(e))},He=e=>{Ne.clear(),Ie.start(se,(()=>{ze(e)}))},{isFocusVisibleRef:Ve,onBlur:Ye,onFocus:qe,ref:Ge}=(0,w.A)(),[,Je]=p.useState(!1),Ke=e=>{Ye(e),!1===Ve.current&&(Je(!1),He(e))},Qe=e=>{Me||Ce(e.currentTarget),qe(e),!0===Ve.current&&(Je(!0),Ue(e))},Ze=e=>{Oe.current=!0;const o=xe.props;o.onTouchStart&&o.onTouchStart(e)},eo=e=>{Ze(e),Ie.clear(),Ee.clear(),je(),Xe.current=document.body.style.WebkitUserSelect,document.body.style.WebkitUserSelect="none",Be.start(ae,(()=>{document.body.style.WebkitUserSelect=Xe.current,Ue(e)}))},oo=e=>{xe.props.onTouchEnd&&xe.props.onTouchEnd(e),je(),Ie.start(ce,(()=>{ze(e)}))};p.useEffect((()=>{if(We)return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)};function e(e){"Escape"!==e.key&&"Esc"!==e.key||ze(e)}}),[ze,We]);const to=(0,v.A)(xe.ref,Ge,Ce,o);be||0===be||(We=!1);const ro=p.useRef(),no={},po="string"===typeof be;Z?(no.title=We||!po||oe?null:be,no["aria-describedby"]=We?$e:null):(no["aria-label"]=po?be:null,no["aria-labelledby"]=We&&!po?$e:null);const ao=(0,n.A)({},no,Te,xe.props,{className:(0,a.A)(Te.className,xe.props.className),onTouchStart:Ze,ref:to},ie?{onMouseMove:e=>{const o=xe.props;o.onMouseMove&&o.onMouseMove(e),N={x:e.clientX,y:e.clientY},ro.current&&ro.current.update()}}:{});const io={};re||(ao.onTouchStart=eo,ao.onTouchEnd=oo),oe||(ao.onMouseOver=I(Ue,ao.onMouseOver),ao.onMouseLeave=I(He,ao.onMouseLeave),ke||(io.onMouseOver=Ue,io.onMouseLeave=He)),ee||(ao.onFocus=I(Qe,ao.onFocus),ao.onBlur=I(Ke,ao.onBlur),ke||(io.onFocus=Qe,io.onBlur=Ke));const lo=p.useMemo((()=>{var e;let o=[{name:"arrow",enabled:Boolean(Le),options:{element:Le,padding:4}}];return null!=(e=fe.popperOptions)&&e.modifiers&&(o=o.concat(fe.popperOptions.modifiers)),(0,n.A)({},fe.popperOptions,{modifiers:o})}),[Le,fe]),so=(0,n.A)({},q,{isRtl:Pe,arrow:G,disableInteractive:ke,placement:he,PopperComponentProp:ge,touch:Oe.current}),co=(e=>{const{classes:o,disableInteractive:t,arrow:r,touch:n,placement:p}=e,a={popper:["popper",!t&&"popperInteractive",r&&"popperArrow"],tooltip:["tooltip",r&&"tooltipArrow",n&&"touch",`tooltipPlacement${(0,h.A)(p.split("-")[0])}`],arrow:["arrow"]};return(0,s.A)(a,R,o)})(so),uo=null!=(t=null!=(c=ve.popper)?c:K.Popper)?t:L,mo=null!=(u=null!=(T=null!=(x=ve.transition)?x:K.Transition)?T:we)?u:g.A,ho=null!=(P=null!=(B=ve.tooltip)?B:K.Tooltip)?P:S,go=null!=(D=null!=(F=ve.arrow)?F:K.Arrow)?D:O,fo=(0,l.X)(uo,(0,n.A)({},fe,null!=(W=Ae.popper)?W:Q.popper,{className:(0,a.A)(co.popper,null==fe?void 0:fe.className,null==($=null!=(X=Ae.popper)?X:Q.popper)?void 0:$.className)}),so),Ao=(0,l.X)(mo,(0,n.A)({},ye,null!=(j=Ae.transition)?j:Q.transition),so),vo=(0,l.X)(ho,(0,n.A)({},null!=(_=Ae.tooltip)?_:Q.tooltip,{className:(0,a.A)(co.tooltip,null==(z=null!=(U=Ae.tooltip)?U:Q.tooltip)?void 0:z.className)}),so),bo=(0,l.X)(go,(0,n.A)({},null!=(H=Ae.arrow)?H:Q.arrow,{className:(0,a.A)(co.arrow,null==(V=null!=(Y=Ae.arrow)?Y:Q.arrow)?void 0:V.className)}),so);return(0,M.jsxs)(p.Fragment,{children:[p.cloneElement(xe,ao),(0,M.jsx)(uo,(0,n.A)({as:null!=ge?ge:f.A,placement:he,anchorEl:ie?{getBoundingClientRect:()=>({top:N.y,left:N.x,right:N.x,bottom:N.y,width:0,height:0})}:Me,popperRef:ro,open:!!Me&&We,id:$e,transition:!0},io,fo,{popperOptions:lo,children:e=>{let{TransitionProps:o}=e;return(0,M.jsx)(mo,(0,n.A)({timeout:Re.transitions.duration.shorter},o,Ao,{children:(0,M.jsxs)(ho,(0,n.A)({},vo,{children:[be,G?(0,M.jsx)(go,(0,n.A)({},bo,{ref:Se})):null]}))}))}}))]})}))}}]);
//# sourceMappingURL=739.83cdf0bd.chunk.js.map