"use strict";(self.webpackChunkone_api_web=self.webpackChunkone_api_web||[]).push([[814],{6853:function(e,n,t){var a=t(5043),i=t(6240),l=t(2110),s=t(9958),r=t(5865),o=t(9336),d=t(6494),c=t(579);const h=(0,a.forwardRef)(((e,n)=>{let{children:t,content:a,contentClass:h,darkTitle:u,secondary:x,sx:m={},contentSX:A={},title:j,subTitle:b,...C}=e;const p=(0,i.A)();return(0,c.jsxs)(l.A,{ref:n,sx:{border:"1px solid",borderColor:p.palette.primary.light,":hover":{boxShadow:"0 2px 14px 0 rgb(32 40 45 / 8%)"},...m},...C,children:[!u&&j&&(0,c.jsx)(s.A,{sx:{p:2.5},title:(0,c.jsx)(r.A,{variant:"h5",children:j}),action:x,subheader:b}),u&&j&&(0,c.jsx)(s.A,{sx:{p:2.5},title:(0,c.jsx)(r.A,{variant:"h4",children:j}),action:x,subheader:b}),j&&(0,c.jsx)(o.A,{sx:{opacity:1,borderColor:p.palette.primary.light}}),a&&(0,c.jsx)(d.A,{sx:{p:2.5,...A},className:h||"",children:t}),!a&&t]})}));h.defaultProps={content:!0},n.A=h},9814:function(e,n,t){t.r(n),t.d(n,{default:function(){return $}});var a=t(5043),i=t(6446),l=t(2110),s=t(1776),r=t(4056),o=t(2687),d=t(3699),c=t(5157),h=t(6853),u=t(8911),x=t(3193),m=t(9190),A=t(4050),j=t(4605),b=t(1962),C=t(2518),p=t(7784),g=t(9985),S=t(3862),T=t(9302),v=t(8390),y=t(4061),P=t(446),k=t.n(P),f=t(579);t(6484);var w=()=>{let e=new Date,[n,t]=(0,a.useState)({QuotaForNewUser:0,QuotaForInviter:0,QuotaForInvitee:0,QuotaRemindThreshold:0,PreConsumedQuota:0,ModelRatio:"",CompletionRatio:"",GroupRatio:"",TopUpLink:"",ChatLink:"",QuotaPerUnit:0,AutomaticDisableChannelEnabled:"",AutomaticEnableChannelEnabled:"",ChannelDisableThreshold:0,LogConsumeEnabled:"",DisplayInCurrencyEnabled:"",DisplayTokenStatEnabled:"",ApproximateTokenEnabled:"",RetryTimes:0});const[i,l]=(0,a.useState)({});let[s,r]=(0,a.useState)(!1),[o,d]=(0,a.useState)(e.getTime()/1e3-2592e3);(0,a.useEffect)((()=>{(async()=>{const e=await S.n.get("/api/option/"),{success:n,message:a,data:i}=e.data;if(n){let e={};i.forEach((n=>{"ModelRatio"!==n.key&&"GroupRatio"!==n.key&&"CompletionRatio"!==n.key||(n.value=JSON.stringify(JSON.parse(n.value),null,2)),"{}"===n.value&&(n.value=""),e[n.key]=n.value})),t(e),l(e)}else(0,g.Qg)(a)})().then()}),[]);const c=async(e,a)=>{r(!0),e.endsWith("Enabled")&&(a="true"===n[e]?"false":"true");const i=await S.n.put("/api/option/",{key:e,value:a}),{success:l,message:s}=i.data;l?t((n=>({...n,[e]:a}))):(0,g.Qg)(s),r(!1)},P=async e=>{let{name:n,value:a}=e.target;n.endsWith("Enabled")?(await c(n,a),(0,g.Te)("\u8bbe\u7f6e\u6210\u529f\uff01")):t((e=>({...e,[n]:a})))},w=async e=>{switch(e){case"monitor":i.ChannelDisableThreshold!==n.ChannelDisableThreshold&&await c("ChannelDisableThreshold",n.ChannelDisableThreshold),i.QuotaRemindThreshold!==n.QuotaRemindThreshold&&await c("QuotaRemindThreshold",n.QuotaRemindThreshold);break;case"ratio":if(i.ModelRatio!==n.ModelRatio){if(!(0,g.oM)(n.ModelRatio))return void(0,g.Qg)("\u6a21\u578b\u500d\u7387\u4e0d\u662f\u5408\u6cd5\u7684 JSON \u5b57\u7b26\u4e32");await c("ModelRatio",n.ModelRatio)}if(i.GroupRatio!==n.GroupRatio){if(!(0,g.oM)(n.GroupRatio))return void(0,g.Qg)("\u5206\u7ec4\u500d\u7387\u4e0d\u662f\u5408\u6cd5\u7684 JSON \u5b57\u7b26\u4e32");await c("GroupRatio",n.GroupRatio)}if(i.CompletionRatio!==n.CompletionRatio){if(!(0,g.oM)(n.CompletionRatio))return void(0,g.Qg)("\u8865\u5168\u500d\u7387\u4e0d\u662f\u5408\u6cd5\u7684 JSON \u5b57\u7b26\u4e32");await c("CompletionRatio",n.CompletionRatio)}break;case"quota":i.QuotaForNewUser!==n.QuotaForNewUser&&await c("QuotaForNewUser",n.QuotaForNewUser),i.QuotaForInvitee!==n.QuotaForInvitee&&await c("QuotaForInvitee",n.QuotaForInvitee),i.QuotaForInviter!==n.QuotaForInviter&&await c("QuotaForInviter",n.QuotaForInviter),i.PreConsumedQuota!==n.PreConsumedQuota&&await c("PreConsumedQuota",n.PreConsumedQuota);break;case"general":i.TopUpLink!==n.TopUpLink&&await c("TopUpLink",n.TopUpLink),i.ChatLink!==n.ChatLink&&await c("ChatLink",n.ChatLink),i.QuotaPerUnit!==n.QuotaPerUnit&&await c("QuotaPerUnit",n.QuotaPerUnit),i.RetryTimes!==n.RetryTimes&&await c("RetryTimes",n.RetryTimes)}(0,g.Te)("\u4fdd\u5b58\u6210\u529f\uff01")};return(0,f.jsxs)(u.A,{spacing:2,children:[(0,f.jsx)(h.A,{title:"\u901a\u7528\u8bbe\u7f6e",children:(0,f.jsxs)(u.A,{justifyContent:"flex-start",alignItems:"flex-start",spacing:2,children:[(0,f.jsxs)(u.A,{direction:{sm:"column",md:"row"},spacing:{xs:3,sm:2,md:4},children:[(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"TopUpLink",children:"\u5145\u503c\u94fe\u63a5"}),(0,f.jsx)(A.A,{id:"TopUpLink",name:"TopUpLink",value:n.TopUpLink,onChange:P,label:"\u5145\u503c\u94fe\u63a5",placeholder:"\u4f8b\u5982\u53d1\u5361\u7f51\u7ad9\u7684\u8d2d\u4e70\u94fe\u63a5",disabled:s})]}),(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"ChatLink",children:"\u804a\u5929\u94fe\u63a5"}),(0,f.jsx)(A.A,{id:"ChatLink",name:"ChatLink",value:n.ChatLink,onChange:P,label:"\u804a\u5929\u94fe\u63a5",placeholder:"\u4f8b\u5982 ChatGPT Next Web \u7684\u90e8\u7f72\u5730\u5740",disabled:s})]}),(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"QuotaPerUnit",children:"\u5355\u4f4d\u989d\u5ea6"}),(0,f.jsx)(A.A,{id:"QuotaPerUnit",name:"QuotaPerUnit",value:n.QuotaPerUnit,onChange:P,label:"\u5355\u4f4d\u989d\u5ea6",placeholder:"\u4e00\u5355\u4f4d\u8d27\u5e01\u80fd\u5151\u6362\u7684\u989d\u5ea6",disabled:s})]}),(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"RetryTimes",children:"\u91cd\u8bd5\u6b21\u6570"}),(0,f.jsx)(A.A,{id:"RetryTimes",name:"RetryTimes",value:n.RetryTimes,onChange:P,label:"\u91cd\u8bd5\u6b21\u6570",placeholder:"\u91cd\u8bd5\u6b21\u6570",disabled:s})]})]}),(0,f.jsxs)(u.A,{direction:{sm:"column",md:"row"},spacing:{xs:3,sm:2,md:4},justifyContent:"flex-start",alignItems:"flex-start",children:[(0,f.jsx)(j.A,{sx:{marginLeft:"0px"},label:"\u4ee5\u8d27\u5e01\u5f62\u5f0f\u663e\u793a\u989d\u5ea6",control:(0,f.jsx)(b.A,{checked:"true"===n.DisplayInCurrencyEnabled,onChange:P,name:"DisplayInCurrencyEnabled"})}),(0,f.jsx)(j.A,{label:"Billing \u76f8\u5173 API \u663e\u793a\u4ee4\u724c\u989d\u5ea6\u800c\u975e\u7528\u6237\u989d\u5ea6",control:(0,f.jsx)(b.A,{checked:"true"===n.DisplayTokenStatEnabled,onChange:P,name:"DisplayTokenStatEnabled"})}),(0,f.jsx)(j.A,{label:"\u4f7f\u7528\u8fd1\u4f3c\u7684\u65b9\u5f0f\u4f30\u7b97 token \u6570\u4ee5\u51cf\u5c11\u8ba1\u7b97\u91cf",control:(0,f.jsx)(b.A,{checked:"true"===n.ApproximateTokenEnabled,onChange:P,name:"ApproximateTokenEnabled"})})]}),(0,f.jsx)(C.A,{variant:"contained",onClick:()=>{w("general").then()},children:"\u4fdd\u5b58\u901a\u7528\u8bbe\u7f6e"})]})}),(0,f.jsx)(h.A,{title:"\u65e5\u5fd7\u8bbe\u7f6e",children:(0,f.jsxs)(u.A,{direction:"column",justifyContent:"flex-start",alignItems:"flex-start",spacing:2,children:[(0,f.jsx)(j.A,{label:"\u542f\u7528\u65e5\u5fd7\u6d88\u8d39",control:(0,f.jsx)(b.A,{checked:"true"===n.LogConsumeEnabled,onChange:P,name:"LogConsumeEnabled"})}),(0,f.jsx)(x.A,{children:(0,f.jsx)(v.$,{dateAdapter:T.R,adapterLocale:"zh-cn",children:(0,f.jsx)(y.K,{label:"\u65e5\u5fd7\u6e05\u7406\u65f6\u95f4",placeholder:"\u65e5\u5fd7\u6e05\u7406\u65f6\u95f4",ampm:!1,name:"historyTimestamp",value:null===o?null:k().unix(o),disabled:s,onChange:e=>{d(null===e?null:e.unix())},slotProps:{actionBar:{actions:["today","clear","accept"]}}})})}),(0,f.jsx)(C.A,{variant:"contained",onClick:()=>{(async()=>{const e=await S.n.delete(`/api/log/?targetTimestamp=${Math.floor(o)}`),{success:n,message:t,data:a}=e.data;n?(0,g.Te)(`${a} \u6761\u65e5\u5fd7\u5df2\u6e05\u7406\uff01`):(0,g.Qg)("\u65e5\u5fd7\u6e05\u7406\u5931\u8d25\uff1a"+t)})().then()},children:"\u6e05\u7406\u5386\u53f2\u65e5\u5fd7"})]})}),(0,f.jsx)(h.A,{title:"\u76d1\u63a7\u8bbe\u7f6e",children:(0,f.jsxs)(u.A,{justifyContent:"flex-start",alignItems:"flex-start",spacing:2,children:[(0,f.jsxs)(u.A,{direction:{sm:"column",md:"row"},spacing:{xs:3,sm:2,md:4},children:[(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"ChannelDisableThreshold",children:"\u6700\u957f\u54cd\u5e94\u65f6\u95f4"}),(0,f.jsx)(A.A,{id:"ChannelDisableThreshold",name:"ChannelDisableThreshold",type:"number",value:n.ChannelDisableThreshold,onChange:P,label:"\u6700\u957f\u54cd\u5e94\u65f6\u95f4",placeholder:"\u5355\u4f4d\u79d2\uff0c\u5f53\u8fd0\u884c\u901a\u9053\u5168\u90e8\u6d4b\u8bd5\u65f6\uff0c\u8d85\u8fc7\u6b64\u65f6\u95f4\u5c06\u81ea\u52a8\u7981\u7528\u901a\u9053",disabled:s})]}),(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"QuotaRemindThreshold",children:"\u989d\u5ea6\u63d0\u9192\u9608\u503c"}),(0,f.jsx)(A.A,{id:"QuotaRemindThreshold",name:"QuotaRemindThreshold",type:"number",value:n.QuotaRemindThreshold,onChange:P,label:"\u989d\u5ea6\u63d0\u9192\u9608\u503c",placeholder:"\u4f4e\u4e8e\u6b64\u989d\u5ea6\u65f6\u5c06\u53d1\u9001\u90ae\u4ef6\u63d0\u9192\u7528\u6237",disabled:s})]})]}),(0,f.jsx)(j.A,{label:"\u5931\u8d25\u65f6\u81ea\u52a8\u7981\u7528\u901a\u9053",control:(0,f.jsx)(b.A,{checked:"true"===n.AutomaticDisableChannelEnabled,onChange:P,name:"AutomaticDisableChannelEnabled"})}),(0,f.jsx)(j.A,{label:"\u6210\u529f\u65f6\u81ea\u52a8\u542f\u7528\u901a\u9053",control:(0,f.jsx)(b.A,{checked:"true"===n.AutomaticEnableChannelEnabled,onChange:P,name:"AutomaticEnableChannelEnabled"})}),(0,f.jsx)(C.A,{variant:"contained",onClick:()=>{w("monitor").then()},children:"\u4fdd\u5b58\u76d1\u63a7\u8bbe\u7f6e"})]})}),(0,f.jsx)(h.A,{title:"\u989d\u5ea6\u8bbe\u7f6e",children:(0,f.jsxs)(u.A,{justifyContent:"flex-start",alignItems:"flex-start",spacing:2,children:[(0,f.jsxs)(u.A,{direction:{sm:"column",md:"row"},spacing:{xs:3,sm:2,md:4},children:[(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"QuotaForNewUser",children:"\u65b0\u7528\u6237\u521d\u59cb\u989d\u5ea6"}),(0,f.jsx)(A.A,{id:"QuotaForNewUser",name:"QuotaForNewUser",type:"number",value:n.QuotaForNewUser,onChange:P,label:"\u65b0\u7528\u6237\u521d\u59cb\u989d\u5ea6",placeholder:"\u4f8b\u5982\uff1a100",disabled:s})]}),(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"PreConsumedQuota",children:"\u8bf7\u6c42\u9884\u6263\u8d39\u989d\u5ea6"}),(0,f.jsx)(A.A,{id:"PreConsumedQuota",name:"PreConsumedQuota",type:"number",value:n.PreConsumedQuota,onChange:P,label:"\u8bf7\u6c42\u9884\u6263\u8d39\u989d\u5ea6",placeholder:"\u8bf7\u6c42\u7ed3\u675f\u540e\u591a\u9000\u5c11\u8865",disabled:s})]}),(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"QuotaForInviter",children:"\u9080\u8bf7\u65b0\u7528\u6237\u5956\u52b1\u989d\u5ea6"}),(0,f.jsx)(A.A,{id:"QuotaForInviter",name:"QuotaForInviter",type:"number",label:"\u9080\u8bf7\u65b0\u7528\u6237\u5956\u52b1\u989d\u5ea6",value:n.QuotaForInviter,onChange:P,placeholder:"\u4f8b\u5982\uff1a2000",disabled:s})]}),(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"QuotaForInvitee",children:"\u65b0\u7528\u6237\u4f7f\u7528\u9080\u8bf7\u7801\u5956\u52b1\u989d\u5ea6"}),(0,f.jsx)(A.A,{id:"QuotaForInvitee",name:"QuotaForInvitee",type:"number",label:"\u65b0\u7528\u6237\u4f7f\u7528\u9080\u8bf7\u7801\u5956\u52b1\u989d\u5ea6",value:n.QuotaForInvitee,onChange:P,autoComplete:"new-password",placeholder:"\u4f8b\u5982\uff1a1000",disabled:s})]})]}),(0,f.jsx)(C.A,{variant:"contained",onClick:()=>{w("quota").then()},children:"\u4fdd\u5b58\u989d\u5ea6\u8bbe\u7f6e"})]})}),(0,f.jsx)(h.A,{title:"\u500d\u7387\u8bbe\u7f6e",children:(0,f.jsxs)(u.A,{justifyContent:"flex-start",alignItems:"flex-start",spacing:2,children:[(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(p.A,{multiline:!0,maxRows:15,id:"channel-ModelRatio-label",label:"\u6a21\u578b\u500d\u7387",value:n.ModelRatio,name:"ModelRatio",onChange:P,"aria-describedby":"helper-text-channel-ModelRatio-label",minRows:5,placeholder:"\u4e3a\u4e00\u4e2a JSON \u6587\u672c\uff0c\u952e\u4e3a\u6a21\u578b\u540d\u79f0\uff0c\u503c\u4e3a\u500d\u7387"})}),(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(p.A,{multiline:!0,maxRows:15,id:"channel-CompletionRatio-label",label:"\u8865\u5168\u500d\u7387",value:n.CompletionRatio,name:"CompletionRatio",onChange:P,"aria-describedby":"helper-text-channel-CompletionRatio-label",minRows:5,placeholder:"\u4e3a\u4e00\u4e2a JSON \u6587\u672c\uff0c\u952e\u4e3a\u6a21\u578b\u540d\u79f0\uff0c\u503c\u4e3a\u500d\u7387\uff0c\u6b64\u5904\u7684\u500d\u7387\u8bbe\u7f6e\u662f\u6a21\u578b\u8865\u5168\u500d\u7387\u76f8\u8f83\u4e8e\u63d0\u793a\u500d\u7387\u7684\u6bd4\u4f8b\uff0c\u4f7f\u7528\u8be5\u8bbe\u7f6e\u53ef\u5f3a\u5236\u8986\u76d6 One API \u7684\u5185\u90e8\u6bd4\u4f8b"})}),(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(p.A,{multiline:!0,maxRows:15,id:"channel-GroupRatio-label",label:"\u5206\u7ec4\u500d\u7387",value:n.GroupRatio,name:"GroupRatio",onChange:P,"aria-describedby":"helper-text-channel-GroupRatio-label",minRows:5,placeholder:"\u4e3a\u4e00\u4e2a JSON \u6587\u672c\uff0c\u952e\u4e3a\u5206\u7ec4\u540d\u79f0\uff0c\u503c\u4e3a\u500d\u7387"})}),(0,f.jsx)(C.A,{variant:"contained",onClick:()=>{w("ratio").then()},children:"\u4fdd\u5b58\u500d\u7387\u8bbe\u7f6e"})]})})]})},R=t(8624),W=t(7254),E=t(3462),M=t(6600),F=t(9336),Q=t(5316),L=t(9347),I=t(2075);const H=(0,t(3057).Z)();var G=()=>{let[e,n]=(0,a.useState)({PasswordLoginEnabled:"",PasswordRegisterEnabled:"",EmailVerificationEnabled:"",GitHubOAuthEnabled:"",GitHubClientId:"",GitHubClientSecret:"",Notice:"",SMTPServer:"",SMTPPort:"",SMTPAccount:"",SMTPFrom:"",SMTPToken:"",ServerAddress:"",Footer:"",WeChatAuthEnabled:"",WeChatServerAddress:"",WeChatServerToken:"",WeChatAccountQRCodeImageURL:"",TurnstileCheckEnabled:"",TurnstileSiteKey:"",TurnstileSecretKey:"",RegisterEnabled:"",EmailDomainRestrictionEnabled:"",EmailDomainWhitelist:[]});const[t,i]=(0,a.useState)({});let[l,s]=(0,a.useState)(!1);const[r,o]=(0,a.useState)([]),[d,c]=(0,a.useState)(!1);(0,a.useEffect)((()=>{(async()=>{const e=await S.n.get("/api/option/"),{success:t,message:a,data:l}=e.data;if(t){let e={};l.forEach((n=>{e[n.key]=n.value})),n({...e,EmailDomainWhitelist:e.EmailDomainWhitelist.split(",")}),i(e),o(e.EmailDomainWhitelist.split(","))}else(0,g.Qg)(a)})().then()}),[]);const T=async(t,a)=>{switch(s(!0),t){case"PasswordLoginEnabled":case"PasswordRegisterEnabled":case"EmailVerificationEnabled":case"GitHubOAuthEnabled":case"WeChatAuthEnabled":case"TurnstileCheckEnabled":case"EmailDomainRestrictionEnabled":case"RegisterEnabled":a="true"===e[t]?"false":"true"}const i=await S.n.put("/api/option/",{key:t,value:a}),{success:l,message:r}=i.data;l?("EmailDomainWhitelist"===t&&(a=a.split(",")),n((e=>({...e,[t]:a}))),(0,g.Te)("\u8bbe\u7f6e\u6210\u529f\uff01")):(0,g.Qg)(r),s(!1)},v=async t=>{let{name:a,value:i}=t.target;"PasswordLoginEnabled"!==a||"true"!==e[a]?"Notice"===a||a.startsWith("SMTP")||"ServerAddress"===a||"GitHubClientId"===a||"GitHubClientSecret"===a||"WeChatServerAddress"===a||"WeChatServerToken"===a||"WeChatAccountQRCodeImageURL"===a||"TurnstileSiteKey"===a||"TurnstileSecretKey"===a||"EmailDomainWhitelist"===a?n((e=>({...e,[a]:i}))):await T(a,i):c(!0)};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(u.A,{spacing:2,children:[(0,f.jsx)(h.A,{title:"\u901a\u7528\u8bbe\u7f6e",children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"ServerAddress",children:"\u670d\u52a1\u5668\u5730\u5740"}),(0,f.jsx)(A.A,{id:"ServerAddress",name:"ServerAddress",value:e.ServerAddress||"",onChange:v,label:"\u670d\u52a1\u5668\u5730\u5740",placeholder:"\u4f8b\u5982\uff1ahttps://yourdomain.com",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{let n=(0,g.UC)(e.ServerAddress);await T("ServerAddress",n)},children:"\u66f4\u65b0\u670d\u52a1\u5668\u5730\u5740"})})]})}),(0,f.jsx)(h.A,{title:"\u914d\u7f6e\u767b\u5f55\u6ce8\u518c",children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,md:3,children:(0,f.jsx)(j.A,{label:"\u5141\u8bb8\u901a\u8fc7\u5bc6\u7801\u8fdb\u884c\u767b\u5f55",control:(0,f.jsx)(b.A,{checked:"true"===e.PasswordLoginEnabled,onChange:v,name:"PasswordLoginEnabled"})})}),(0,f.jsx)(I.A,{xs:12,md:3,children:(0,f.jsx)(j.A,{label:"\u5141\u8bb8\u901a\u8fc7\u5bc6\u7801\u8fdb\u884c\u6ce8\u518c",control:(0,f.jsx)(b.A,{checked:"true"===e.PasswordRegisterEnabled,onChange:v,name:"PasswordRegisterEnabled"})})}),(0,f.jsx)(I.A,{xs:12,md:3,children:(0,f.jsx)(j.A,{label:"\u901a\u8fc7\u5bc6\u7801\u6ce8\u518c\u65f6\u9700\u8981\u8fdb\u884c\u90ae\u7bb1\u9a8c\u8bc1",control:(0,f.jsx)(b.A,{checked:"true"===e.EmailVerificationEnabled,onChange:v,name:"EmailVerificationEnabled"})})}),(0,f.jsx)(I.A,{xs:12,md:3,children:(0,f.jsx)(j.A,{label:"\u5141\u8bb8\u901a\u8fc7 GitHub \u8d26\u6237\u767b\u5f55 & \u6ce8\u518c",control:(0,f.jsx)(b.A,{checked:"true"===e.GitHubOAuthEnabled,onChange:v,name:"GitHubOAuthEnabled"})})}),(0,f.jsx)(I.A,{xs:12,md:3,children:(0,f.jsx)(j.A,{label:"\u5141\u8bb8\u901a\u8fc7\u5fae\u4fe1\u767b\u5f55 & \u6ce8\u518c",control:(0,f.jsx)(b.A,{checked:"true"===e.WeChatAuthEnabled,onChange:v,name:"WeChatAuthEnabled"})})}),(0,f.jsx)(I.A,{xs:12,md:3,children:(0,f.jsx)(j.A,{label:"\u5141\u8bb8\u65b0\u7528\u6237\u6ce8\u518c\uff08\u6b64\u9879\u4e3a\u5426\u65f6\uff0c\u65b0\u7528\u6237\u5c06\u65e0\u6cd5\u4ee5\u4efb\u4f55\u65b9\u5f0f\u8fdb\u884c\u6ce8\u518c\uff09",control:(0,f.jsx)(b.A,{checked:"true"===e.RegisterEnabled,onChange:v,name:"RegisterEnabled"})})}),(0,f.jsx)(I.A,{xs:12,md:3,children:(0,f.jsx)(j.A,{label:"\u542f\u7528 Turnstile \u7528\u6237\u6821\u9a8c",control:(0,f.jsx)(b.A,{checked:"true"===e.TurnstileCheckEnabled,onChange:v,name:"TurnstileCheckEnabled"})})})]})}),(0,f.jsx)(h.A,{title:"\u914d\u7f6e\u90ae\u7bb1\u57df\u540d\u767d\u540d\u5355",subTitle:"\u7528\u4ee5\u9632\u6b62\u6076\u610f\u7528\u6237\u5229\u7528\u4e34\u65f6\u90ae\u7bb1\u6279\u91cf\u6ce8\u518c",children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(j.A,{label:"\u542f\u7528\u90ae\u7bb1\u57df\u540d\u767d\u540d\u5355",control:(0,f.jsx)(b.A,{checked:"true"===e.EmailDomainRestrictionEnabled,onChange:v,name:"EmailDomainRestrictionEnabled"})})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(R.A,{multiple:!0,freeSolo:!0,id:"EmailDomainWhitelist",options:r,value:e.EmailDomainWhitelist,onChange:(e,n)=>{v({target:{name:"EmailDomainWhitelist",value:n}})},filterSelectedOptions:!0,renderInput:e=>(0,f.jsx)(p.A,{...e,name:"EmailDomainWhitelist",label:"\u5141\u8bb8\u7684\u90ae\u7bb1\u57df\u540d"}),filterOptions:(e,n)=>{const t=H(e,n),{inputValue:a}=n,i=e.some((e=>a===e));return""===a||i||t.push(a),t}})})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{await T("EmailDomainWhitelist",e.EmailDomainWhitelist.join(","))},children:"\u4fdd\u5b58\u90ae\u7bb1\u57df\u540d\u767d\u540d\u5355\u8bbe\u7f6e"})})]})}),(0,f.jsx)(h.A,{title:"\u914d\u7f6e SMTP",subTitle:"\u7528\u4ee5\u652f\u6301\u7cfb\u7edf\u7684\u90ae\u4ef6\u53d1\u9001",children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"SMTPServer",children:"SMTP \u670d\u52a1\u5668\u5730\u5740"}),(0,f.jsx)(A.A,{id:"SMTPServer",name:"SMTPServer",value:e.SMTPServer||"",onChange:v,label:"SMTP \u670d\u52a1\u5668\u5730\u5740",placeholder:"\u4f8b\u5982\uff1asmtp.qq.com",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"SMTPPort",children:"SMTP \u7aef\u53e3"}),(0,f.jsx)(A.A,{id:"SMTPPort",name:"SMTPPort",value:e.SMTPPort||"",onChange:v,label:"SMTP \u7aef\u53e3",placeholder:"\u9ed8\u8ba4: 587",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"SMTPAccount",children:"SMTP \u8d26\u6237"}),(0,f.jsx)(A.A,{id:"SMTPAccount",name:"SMTPAccount",value:e.SMTPAccount||"",onChange:v,label:"SMTP \u8d26\u6237",placeholder:"\u901a\u5e38\u662f\u90ae\u7bb1\u5730\u5740",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"SMTPFrom",children:"SMTP \u53d1\u9001\u8005\u90ae\u7bb1"}),(0,f.jsx)(A.A,{id:"SMTPFrom",name:"SMTPFrom",value:e.SMTPFrom||"",onChange:v,label:"SMTP \u53d1\u9001\u8005\u90ae\u7bb1",placeholder:"\u901a\u5e38\u548c\u90ae\u7bb1\u5730\u5740\u4fdd\u6301\u4e00\u81f4",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"SMTPToken",children:"SMTP \u8bbf\u95ee\u51ed\u8bc1"}),(0,f.jsx)(A.A,{id:"SMTPToken",name:"SMTPToken",value:e.SMTPToken||"",onChange:v,label:"SMTP \u8bbf\u95ee\u51ed\u8bc1",placeholder:"\u654f\u611f\u4fe1\u606f\u4e0d\u4f1a\u53d1\u9001\u5230\u524d\u7aef\u663e\u793a",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{t.SMTPServer!==e.SMTPServer&&await T("SMTPServer",e.SMTPServer),t.SMTPAccount!==e.SMTPAccount&&await T("SMTPAccount",e.SMTPAccount),t.SMTPFrom!==e.SMTPFrom&&await T("SMTPFrom",e.SMTPFrom),t.SMTPPort!==e.SMTPPort&&""!==e.SMTPPort&&await T("SMTPPort",e.SMTPPort),t.SMTPToken!==e.SMTPToken&&""!==e.SMTPToken&&await T("SMTPToken",e.SMTPToken)},children:"\u4fdd\u5b58 SMTP \u8bbe\u7f6e"})})]})}),(0,f.jsx)(h.A,{title:"\u914d\u7f6e GitHub OAuth App",subTitle:(0,f.jsxs)("span",{children:[" ","\u7528\u4ee5\u652f\u6301\u901a\u8fc7 GitHub \u8fdb\u884c\u767b\u5f55\u6ce8\u518c\uff0c",(0,f.jsx)("a",{href:"https://github.com/settings/developers",target:"_blank",rel:"noopener noreferrer",children:"\u70b9\u51fb\u6b64\u5904"}),"\u7ba1\u7406\u4f60\u7684 GitHub OAuth App"]}),children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,children:(0,f.jsxs)(W.A,{severity:"info",sx:{wordWrap:"break-word"},children:["Homepage URL \u586b ",(0,f.jsx)("b",{children:e.ServerAddress}),"\uff0cAuthorization callback URL \u586b ",(0,f.jsx)("b",{children:`${e.ServerAddress}/oauth/github`})]})}),(0,f.jsx)(I.A,{xs:12,md:6,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"GitHubClientId",children:"GitHub Client ID"}),(0,f.jsx)(A.A,{id:"GitHubClientId",name:"GitHubClientId",value:e.GitHubClientId||"",onChange:v,label:"GitHub Client ID",placeholder:"\u8f93\u5165\u4f60\u6ce8\u518c\u7684 GitHub OAuth APP \u7684 ID",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:6,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"GitHubClientSecret",children:"GitHub Client Secret"}),(0,f.jsx)(A.A,{id:"GitHubClientSecret",name:"GitHubClientSecret",value:e.GitHubClientSecret||"",onChange:v,label:"GitHub Client Secret",placeholder:"\u654f\u611f\u4fe1\u606f\u4e0d\u4f1a\u53d1\u9001\u5230\u524d\u7aef\u663e\u793a",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{t.GitHubClientId!==e.GitHubClientId&&await T("GitHubClientId",e.GitHubClientId),t.GitHubClientSecret!==e.GitHubClientSecret&&""!==e.GitHubClientSecret&&await T("GitHubClientSecret",e.GitHubClientSecret)},children:"\u4fdd\u5b58 GitHub OAuth \u8bbe\u7f6e"})})]})}),(0,f.jsx)(h.A,{title:"\u914d\u7f6e WeChat Server",subTitle:(0,f.jsxs)("span",{children:["\u7528\u4ee5\u652f\u6301\u901a\u8fc7\u5fae\u4fe1\u8fdb\u884c\u767b\u5f55\u6ce8\u518c\uff0c",(0,f.jsx)("a",{href:"https://github.com/songquanpeng/wechat-server",target:"_blank",rel:"noopener noreferrer",children:"\u70b9\u51fb\u6b64\u5904"}),"\u4e86\u89e3 WeChat Server"]}),children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"WeChatServerAddress",children:"WeChat Server \u670d\u52a1\u5668\u5730\u5740"}),(0,f.jsx)(A.A,{id:"WeChatServerAddress",name:"WeChatServerAddress",value:e.WeChatServerAddress||"",onChange:v,label:"WeChat Server \u670d\u52a1\u5668\u5730\u5740",placeholder:"\u4f8b\u5982\uff1ahttps://yourdomain.com",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"WeChatServerToken",children:"WeChat Server \u8bbf\u95ee\u51ed\u8bc1"}),(0,f.jsx)(A.A,{id:"WeChatServerToken",name:"WeChatServerToken",value:e.WeChatServerToken||"",onChange:v,label:"WeChat Server \u8bbf\u95ee\u51ed\u8bc1",placeholder:"\u654f\u611f\u4fe1\u606f\u4e0d\u4f1a\u53d1\u9001\u5230\u524d\u7aef\u663e\u793a",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:4,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"WeChatAccountQRCodeImageURL",children:"\u5fae\u4fe1\u516c\u4f17\u53f7\u4e8c\u7ef4\u7801\u56fe\u7247\u94fe\u63a5"}),(0,f.jsx)(A.A,{id:"WeChatAccountQRCodeImageURL",name:"WeChatAccountQRCodeImageURL",value:e.WeChatAccountQRCodeImageURL||"",onChange:v,label:"\u5fae\u4fe1\u516c\u4f17\u53f7\u4e8c\u7ef4\u7801\u56fe\u7247\u94fe\u63a5",placeholder:"\u8f93\u5165\u4e00\u4e2a\u56fe\u7247\u94fe\u63a5",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{t.WeChatServerAddress!==e.WeChatServerAddress&&await T("WeChatServerAddress",(0,g.UC)(e.WeChatServerAddress)),t.WeChatAccountQRCodeImageURL!==e.WeChatAccountQRCodeImageURL&&await T("WeChatAccountQRCodeImageURL",e.WeChatAccountQRCodeImageURL),t.WeChatServerToken!==e.WeChatServerToken&&""!==e.WeChatServerToken&&await T("WeChatServerToken",e.WeChatServerToken)},children:"\u4fdd\u5b58 WeChat Server \u8bbe\u7f6e"})})]})}),(0,f.jsx)(h.A,{title:"\u914d\u7f6e Turnstile",subTitle:(0,f.jsxs)("span",{children:["\u7528\u4ee5\u652f\u6301\u7528\u6237\u6821\u9a8c\uff0c",(0,f.jsx)("a",{href:"https://dash.cloudflare.com/",target:"_blank",rel:"noopener noreferrer",children:"\u70b9\u51fb\u6b64\u5904"}),"\u7ba1\u7406\u4f60\u7684 Turnstile Sites\uff0c\u63a8\u8350\u9009\u62e9 Invisible Widget Type"]}),children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,md:6,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"TurnstileSiteKey",children:"Turnstile Site Key"}),(0,f.jsx)(A.A,{id:"TurnstileSiteKey",name:"TurnstileSiteKey",value:e.TurnstileSiteKey||"",onChange:v,label:"Turnstile Site Key",placeholder:"\u8f93\u5165\u4f60\u6ce8\u518c\u7684 Turnstile Site Key",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,md:6,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"TurnstileSecretKey",children:"Turnstile Secret Key"}),(0,f.jsx)(A.A,{id:"TurnstileSecretKey",name:"TurnstileSecretKey",type:"password",value:e.TurnstileSecretKey||"",onChange:v,label:"Turnstile Secret Key",placeholder:"\u654f\u611f\u4fe1\u606f\u4e0d\u4f1a\u53d1\u9001\u5230\u524d\u7aef\u663e\u793a",disabled:l})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{t.TurnstileSiteKey!==e.TurnstileSiteKey&&await T("TurnstileSiteKey",e.TurnstileSiteKey),t.TurnstileSecretKey!==e.TurnstileSecretKey&&""!==e.TurnstileSecretKey&&await T("TurnstileSecretKey",e.TurnstileSecretKey)},children:"\u4fdd\u5b58 Turnstile \u8bbe\u7f6e"})})]})})]}),(0,f.jsxs)(E.A,{open:d,onClose:()=>c(!1),maxWidth:"md",children:[(0,f.jsx)(M.A,{sx:{margin:"0px",fontWeight:700,lineHeight:"1.55556",padding:"24px",fontSize:"1.125rem"},children:"\u8b66\u544a"}),(0,f.jsx)(F.A,{}),(0,f.jsx)(Q.A,{children:"\u53d6\u6d88\u5bc6\u7801\u767b\u5f55\u5c06\u5bfc\u81f4\u6240\u6709\u672a\u7ed1\u5b9a\u5176\u4ed6\u767b\u5f55\u65b9\u5f0f\u7684\u7528\u6237\uff08\u5305\u62ec\u7ba1\u7406\u5458\uff09\u65e0\u6cd5\u901a\u8fc7\u5bc6\u7801\u767b\u5f55\uff0c\u786e\u8ba4\u53d6\u6d88\uff1f"}),(0,f.jsxs)(L.A,{children:[(0,f.jsx)(C.A,{onClick:()=>c(!1),children:"\u53d6\u6d88"}),(0,f.jsx)(C.A,{sx:{color:"error.main"},onClick:async()=>{c(!1),await T("PasswordLoginEnabled","false")},children:"\u786e\u5b9a"})]})]})]})},U=t(96);var D=()=>{let[e,n]=(0,a.useState)({Footer:"",Notice:"",About:"",SystemName:"",Logo:"",HomePageContent:"",Theme:""}),[t,i]=(0,a.useState)(!1);const[l,s]=(0,a.useState)(!1),[r,o]=(0,a.useState)({tag_name:"",content:""});(0,a.useEffect)((()=>{(async()=>{const t=await S.n.get("/api/option/"),{success:a,message:i,data:l}=t.data;if(a){let t={};l.forEach((n=>{n.key in e&&(t[n.key]=n.value)})),n(t)}else(0,g.Qg)(i)})().then()}),[]);const d=async(e,t)=>{i(!0);const a=await S.n.put("/api/option/",{key:e,value:t}),{success:l,message:s}=a.data;l?(n((n=>({...n,[e]:t}))),(0,g.Te)("\u4fdd\u5b58\u6210\u529f")):(0,g.Qg)(s),i(!1)},c=async e=>{let{name:t,value:a}=e.target;n((e=>({...e,[t]:a})))};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(u.A,{spacing:2,children:[(0,f.jsx)(h.A,{title:"\u901a\u7528\u8bbe\u7f6e",children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{const e=await S.n.get("https://api.github.com/repos/songquanpeng/one-api/releases/latest"),{tag_name:n,body:t}=e.data;n==={NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}.REACT_APP_VERSION?(0,g.Te)(`\u5df2\u662f\u6700\u65b0\u7248\u672c\uff1a${n}`):(o({tag_name:n,content:U.xI.parse(t)}),s(!0))},children:"\u68c0\u67e5\u66f4\u65b0"})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(p.A,{multiline:!0,maxRows:15,id:"Notice",label:"\u516c\u544a",value:e.Notice,name:"Notice",onChange:c,minRows:10,placeholder:"\u5728\u6b64\u8f93\u5165\u65b0\u7684\u516c\u544a\u5185\u5bb9\uff0c\u652f\u6301 Markdown & HTML \u4ee3\u7801"})})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{await d("Notice",e.Notice)},children:"\u4fdd\u5b58\u516c\u544a"})})]})}),(0,f.jsx)(h.A,{title:"\u4e2a\u6027\u5316\u8bbe\u7f6e",children:(0,f.jsxs)(I.A,{container:!0,spacing:{xs:3,sm:2,md:4},children:[(0,f.jsx)(I.A,{xs:12,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"SystemName",children:"\u7cfb\u7edf\u540d\u79f0"}),(0,f.jsx)(A.A,{id:"SystemName",name:"SystemName",value:e.SystemName||"",onChange:c,label:"\u7cfb\u7edf\u540d\u79f0",placeholder:"\u5728\u6b64\u8f93\u5165\u7cfb\u7edf\u540d\u79f0",disabled:t})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{await d("SystemName",e.SystemName)},children:"\u8bbe\u7f6e\u7cfb\u7edf\u540d\u79f0"})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"Theme",children:"\u4e3b\u9898\u540d\u79f0"}),(0,f.jsx)(A.A,{id:"Theme",name:"Theme",value:e.Theme||"",onChange:c,label:"\u4e3b\u9898\u540d\u79f0",placeholder:"\u8bf7\u8f93\u5165\u4e3b\u9898\u540d\u79f0",disabled:t})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{await d("Theme",e.Theme)},children:"\u8bbe\u7f6e\u4e3b\u9898\uff08\u91cd\u542f\u751f\u6548\uff09"})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsxs)(x.A,{fullWidth:!0,children:[(0,f.jsx)(m.A,{htmlFor:"Logo",children:"Logo \u56fe\u7247\u5730\u5740"}),(0,f.jsx)(A.A,{id:"Logo",name:"Logo",value:e.Logo||"",onChange:c,label:"Logo \u56fe\u7247\u5730\u5740",placeholder:"\u5728\u6b64\u8f93\u5165Logo \u56fe\u7247\u5730\u5740",disabled:t})]})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{await d("Logo",e.Logo)},children:"\u8bbe\u7f6e Logo"})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(p.A,{multiline:!0,maxRows:15,id:"HomePageContent",label:"\u9996\u9875\u5185\u5bb9",value:e.HomePageContent,name:"HomePageContent",onChange:c,minRows:10,placeholder:"\u5728\u6b64\u8f93\u5165\u9996\u9875\u5185\u5bb9\uff0c\u652f\u6301 Markdown & HTML \u4ee3\u7801\uff0c\u8bbe\u7f6e\u540e\u9996\u9875\u7684\u72b6\u6001\u4fe1\u606f\u5c06\u4e0d\u518d\u663e\u793a\u3002\u5982\u679c\u8f93\u5165\u7684\u662f\u4e00\u4e2a\u94fe\u63a5\uff0c\u5219\u4f1a\u4f7f\u7528\u8be5\u94fe\u63a5\u4f5c\u4e3a iframe \u7684 src \u5c5e\u6027\uff0c\u8fd9\u5141\u8bb8\u4f60\u8bbe\u7f6e\u4efb\u610f\u7f51\u9875\u4f5c\u4e3a\u9996\u9875\u3002"})})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:()=>(async n=>{await d(n,e[n])})("HomePageContent"),children:"\u4fdd\u5b58\u9996\u9875\u5185\u5bb9"})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(p.A,{multiline:!0,maxRows:15,id:"About",label:"\u5173\u4e8e",value:e.About,name:"About",onChange:c,minRows:10,placeholder:"\u5728\u6b64\u8f93\u5165\u65b0\u7684\u5173\u4e8e\u5185\u5bb9\uff0c\u652f\u6301 Markdown & HTML \u4ee3\u7801\u3002\u5982\u679c\u8f93\u5165\u7684\u662f\u4e00\u4e2a\u94fe\u63a5\uff0c\u5219\u4f1a\u4f7f\u7528\u8be5\u94fe\u63a5\u4f5c\u4e3a iframe \u7684 src \u5c5e\u6027\uff0c\u8fd9\u5141\u8bb8\u4f60\u8bbe\u7f6e\u4efb\u610f\u7f51\u9875\u4f5c\u4e3a\u5173\u4e8e\u9875\u9762\u3002"})})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{await d("About",e.About)},children:"\u4fdd\u5b58\u5173\u4e8e"})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(W.A,{severity:"warning",children:"\u79fb\u9664 One API \u7684\u7248\u6743\u6807\u8bc6\u5fc5\u987b\u9996\u5148\u83b7\u5f97\u6388\u6743\uff0c\u9879\u76ee\u7ef4\u62a4\u9700\u8981\u82b1\u8d39\u5927\u91cf\u7cbe\u529b\uff0c\u5982\u679c\u672c\u9879\u76ee\u5bf9\u4f60\u6709\u610f\u4e49\uff0c\u8bf7\u4e3b\u52a8\u652f\u6301\u672c\u9879\u76ee\u3002"})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(x.A,{fullWidth:!0,children:(0,f.jsx)(p.A,{multiline:!0,maxRows:15,id:"Footer",label:"\u516c\u544a",value:e.Footer,name:"Footer",onChange:c,minRows:10,placeholder:"\u5728\u6b64\u8f93\u5165\u65b0\u7684\u9875\u811a\uff0c\u7559\u7a7a\u5219\u4f7f\u7528\u9ed8\u8ba4\u9875\u811a\uff0c\u652f\u6301 HTML \u4ee3\u7801"})})}),(0,f.jsx)(I.A,{xs:12,children:(0,f.jsx)(C.A,{variant:"contained",onClick:async()=>{await d("Footer",e.Footer)},children:"\u8bbe\u7f6e\u9875\u811a"})})]})})]}),(0,f.jsxs)(E.A,{open:l,onClose:()=>s(!1),fullWidth:!0,maxWidth:"md",children:[(0,f.jsxs)(M.A,{sx:{margin:"0px",fontWeight:700,lineHeight:"1.55556",padding:"24px",fontSize:"1.125rem"},children:["\u65b0\u7248\u672c\uff1a",r.tag_name]}),(0,f.jsx)(F.A,{}),(0,f.jsxs)(Q.A,{children:[" ",(0,f.jsx)("div",{dangerouslySetInnerHTML:{__html:r.content}})]}),(0,f.jsxs)(L.A,{children:[(0,f.jsx)(C.A,{onClick:()=>s(!1),children:"\u5173\u95ed"}),(0,f.jsx)(C.A,{onClick:async()=>{s(!1),window.location="https://github.com/songquanpeng/one-api/releases/latest"},children:"\u53bbGitHub\u67e5\u770b"})]})]})]})},N=t(2223),K=t(6971);function O(e){const{children:n,value:t,index:a,...l}=e;return(0,f.jsx)("div",{role:"tabpanel",hidden:t!==a,id:`setting-tabpanel-${a}`,"aria-labelledby":`setting-tab-${a}`,...l,children:t===a&&(0,f.jsx)(i.A,{sx:{p:3},children:n})})}function _(e){return{id:`setting-tab-${e}`,"aria-controls":`setting-tabpanel-${e}`}}var $=()=>{const e=(0,K.zy)(),n=(0,K.Zp)(),t=e.hash.replace("#",""),h={operation:0,system:1,other:2},[u,x]=(0,a.useState)(h[t]||0);return(0,a.useEffect)((()=>{const n=()=>{const n=e.hash.replace("#","");x(h[n]||0)};return window.addEventListener("hashchange",n),()=>{window.removeEventListener("hashchange",n)}}),[e,h]),(0,f.jsx)(f.Fragment,{children:(0,f.jsx)(l.A,{children:(0,f.jsx)(N.A,{children:(0,f.jsxs)(i.A,{sx:{width:"100%"},children:[(0,f.jsx)(i.A,{sx:{borderBottom:1,borderColor:"divider"},children:(0,f.jsxs)(s.A,{value:u,onChange:(e,t)=>{x(t);const a=Object.keys(h);n(`#${a[t]}`)},variant:"scrollable",scrollButtons:"auto",children:[(0,f.jsx)(r.A,{label:"\u8fd0\u8425\u8bbe\u7f6e",..._(0),icon:(0,f.jsx)(o.A,{}),iconPosition:"start"}),(0,f.jsx)(r.A,{label:"\u7cfb\u7edf\u8bbe\u7f6e",..._(1),icon:(0,f.jsx)(d.A,{}),iconPosition:"start"}),(0,f.jsx)(r.A,{label:"\u5176\u4ed6\u8bbe\u7f6e",..._(2),icon:(0,f.jsx)(c.A,{}),iconPosition:"start"})]})}),(0,f.jsx)(O,{value:u,index:0,children:(0,f.jsx)(w,{})}),(0,f.jsx)(O,{value:u,index:1,children:(0,f.jsx)(G,{})}),(0,f.jsx)(O,{value:u,index:2,children:(0,f.jsx)(D,{})})]})})})})}}}]);
//# sourceMappingURL=814.490005c3.chunk.js.map