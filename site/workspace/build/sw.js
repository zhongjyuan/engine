if(!self.define){let i,c={};const e=(e,n)=>(e=new URL(e+".js",n).href,c[e]||new Promise((c=>{if("document"in self){const i=document.createElement("script");i.src=e,i.onload=c,document.head.appendChild(i)}else i=e,importScripts(e),c()})).then((()=>{let i=c[e];if(!i)throw new Error(`Module ${e} didn’t register its module`);return i})));self.define=(n,a)=>{const r=i||("document"in self?document.currentScript.src:"")||location.href;if(c[r])return;let s={};const o=i=>e(i,r),d={module:{uri:r},exports:s,require:o};c[r]=Promise.all(n.map((i=>d[i]||o(i)))).then((i=>(a(...i),s)))}}define(["./workbox-f407626e"],(function(i){"use strict";self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"assets/index-Cz3fpdAZ.css",revision:null},{url:"assets/index-DYXiNQxc.js",revision:null},{url:"favicon.ico",revision:"0a56b8828762227ab9f3e4cd48d0065a"},{url:"favicon.svg",revision:"c7a0663a65382dd9fc459f7388c50a74"},{url:"index.html",revision:"34f7ddb120ec2c86ebe15435952109ad"},{url:"lib/dyCalendarJS-1.2.1/css/dycalendar.css",revision:"9e979583ad2847c7d8e6c0844120aca6"},{url:"lib/dyCalendarJS-1.2.1/css/dycalendar.min.css",revision:"a7f2c46c5f9e7961bf4fc64910ae94c2"},{url:"lib/dyCalendarJS-1.2.1/Gruntfile.js",revision:"f53b1deeeb35f0068644f8441fa4ca8e"},{url:"lib/dyCalendarJS-1.2.1/index-using-jquery.html",revision:"f0e4333459e73e11b70333a54969c935"},{url:"lib/dyCalendarJS-1.2.1/index.html",revision:"fe9e83158eebc8e82423617fbb3912ab"},{url:"lib/dyCalendarJS-1.2.1/js/default.js",revision:"3a8752a693376c2db2342ae8b1acfa95"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar-jquery.js",revision:"b916a616effe8f517abd9155ac66a1cf"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar-jquery.min.js",revision:"424f5f7a01506e3329fe6cd3586259d4"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar.js",revision:"a66d45dda556bd32e0becf94acea5970"},{url:"lib/dyCalendarJS-1.2.1/js/dycalendar.min.js",revision:"93b0efd6cf242fccbd20956568235baf"},{url:"lib/dyCalendarJS-1.2.1/js/jquery.min.js",revision:"c07f2267a050732b752cc3e7a06850ac"},{url:"pwa-128x128.png",revision:"000f4ed923802a868923b09e273c1f23"},{url:"pwa-192x192.png",revision:"a83de451fac4c9c90ddfd0edd0e65914"},{url:"pwa-512x512.png",revision:"49eabff7b1c6efbe72a4e67dc7124a99"},{url:"pwa-650x650.png",revision:"3583c34124eea63570d5a4527acbbc04"},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"static/icon/alarm.png",revision:"b84e5739fb82cc4e2f8b1fa120c19067"},{url:"static/icon/bin0.png",revision:"7c8abb11aeb62c8c7c6fa53efaaa45c3"},{url:"static/icon/bin1.png",revision:"1a6a8f0b78732655b7ace5e05af762e6"},{url:"static/icon/board.png",revision:"e9a46b26bebf67028196283f7756d69a"},{url:"static/icon/calculator.png",revision:"0f54383ee7ce52ab6ebb4d3ceac6b791"},{url:"static/icon/calendar.png",revision:"4d542ef4ba0a7366dd58653548793da5"},{url:"static/icon/camera.png",revision:"1aab059811ad6881e6a0635d3325293a"},{url:"static/icon/code.png",revision:"45cb89de79d5acfba34411cd7583979a"},{url:"static/icon/cortana.png",revision:"32edecfb97a6e2a9b296d57637c04ab8"},{url:"static/icon/defender.png",revision:"fd2518b890e35e3d9af2796c0f3b42da"},{url:"static/icon/discord.png",revision:"c78e7da7f919ae20c46a3d1240d10ae0"},{url:"static/icon/edge.png",revision:"f1f9fa0c787f48946d4b2a66ae953ee0"},{url:"static/icon/excel.png",revision:"c945e145828ebacb17c41a12c36a408d"},{url:"static/icon/explorer.png",revision:"0daaf987d83755ace67dba7da3436b06"},{url:"static/icon/feedback.png",revision:"d74d3809ba1311cbad94ec1e7737ccd0"},{url:"static/icon/getstarted.png",revision:"b7bd1d32074ffb207f49e12e92999ce6"},{url:"static/icon/github.png",revision:"a532236c49d426381fb7fdb28260e417"},{url:"static/icon/groove.png",revision:"00f24b75f8ffd86ea214997965451d39"},{url:"static/icon/help.png",revision:"cb62be8c776aa1de216e12b6a4a69e76"},{url:"static/icon/home.png",revision:"e661850ecdf94ee4ca85666449b62266"},{url:"static/icon/mail.png",revision:"f4b6454c2821b3d9ba0d9cc453b14c4e"},{url:"static/icon/maps.png",revision:"bda391e9fc68c9c9ec3835963d267885"},{url:"static/icon/movies.png",revision:"7a039784fd75f82a62a50b51a29097e4"},{url:"static/icon/msoffice.png",revision:"ae21cfd62c2f38437e28320b17c6911a"},{url:"static/icon/narrator.png",revision:"82ab624dda0b2ef30458bd0f7a0e5deb"},{url:"static/icon/news.png",revision:"1f3097f8d10bf7869e1e90c238449c03"},{url:"static/icon/notepad.png",revision:"3e73bd9769c6e1f2c5149e03d892cab3"},{url:"static/icon/notes.png",revision:"5ea9fec83a25d621a80776495bdd45e3"},{url:"static/icon/oneDrive.png",revision:"2c2b5e12ee291451472036dccd01a625"},{url:"static/icon/onenote.png",revision:"1435ac8220f903a9f4e97ef08c140b90"},{url:"static/icon/outlook.png",revision:"e67bd2c2f0d31f31af9705573a41f203"},{url:"static/icon/paint.png",revision:"fe7d103fe5dc3da9c23c40e0371ae417"},{url:"static/icon/people.png",revision:"4415a7398c9b268ee2aafccc8299464e"},{url:"static/icon/photos.png",revision:"430bf529ab8a200e827f517cfdba81a3"},{url:"static/icon/pinterest.png",revision:"a2ea3e4001dcc6d474f5d0e813eab281"},{url:"static/icon/powerpoint.png",revision:"aa6d2e047ab7b9799effefff4482f2a8"},{url:"static/icon/search.png",revision:"1e779ae99e99f68d840509ecbfaf0b28"},{url:"static/icon/security.png",revision:"2fac382031183437f1ab5ed7b1ea6722"},{url:"static/icon/settings.png",revision:"9c50914c137a22cbf36b25bb3e9d6213"},{url:"static/icon/share.png",revision:"485e566fd1edfc708093b8d9b6d80429"},{url:"static/icon/skype.png",revision:"f4950a769665e4ee50974be43b165f33"},{url:"static/icon/snip.png",revision:"61c65cc8ebe35b10d0b55d22ff765dc4"},{url:"static/icon/soltaire.png",revision:"f3a95c43a654dd95c0552976bf5b0695"},{url:"static/icon/spotify.png",revision:"4d0ca0daf311202a9415c58ea554b7b4"},{url:"static/icon/store.png",revision:"42173af84275472b6f2f2cf67ccb9983"},{url:"static/icon/taskmanager.png",revision:"cf8ce05900673bbcda936025e7a00b22"},{url:"static/icon/teams.png",revision:"eda40abfde6c7fe49662104ca6546e0c"},{url:"static/icon/terminal.png",revision:"af16e27ce6bec9f28aa18c76dba340f7"},{url:"static/icon/tips.png",revision:"9bf74302d61b5cd72b2e3ac4f055b2b8"},{url:"static/icon/twitter.png",revision:"6fe594182fe3dcbbb227249d4916cf20"},{url:"static/icon/ui/airplane.png",revision:"c8f46160878286e23b7880ab7df8967f"},{url:"static/icon/ui/Apps.png",revision:"60a77c2fa601b45c69b07fc3ef89375c"},{url:"static/icon/ui/audio0.png",revision:"1968d8f66e2cec4fb7f6e6d2f94b919a"},{url:"static/icon/ui/audio1.png",revision:"0156f6441f07adc153926530364193d7"},{url:"static/icon/ui/audio2.png",revision:"ebaf30b57d7287005475bd22bb99af55"},{url:"static/icon/ui/audio3.png",revision:"ae79acd8eb018137ab4f23bd19a3ed01"},{url:"static/icon/ui/avatar.png",revision:"0ef879f004731ba3c4bb6029fecdb470"},{url:"static/icon/ui/battery.png",revision:"28b6d8a2a84fab7d47d8099dc797aed8"},{url:"static/icon/ui/bing.png",revision:"da597791be3b6e732f0bc8b20e38ee62"},{url:"static/icon/ui/bluetooth.png",revision:"7851dd5398046e73dda88ec77854241e"},{url:"static/icon/ui/brightness.png",revision:"ffe12aef6b82ea6d93acaa6c483f8a29"},{url:"static/icon/ui/close.png",revision:"d5d067253444824c88a22a920bebaa5f"},{url:"static/icon/ui/connect.png",revision:"530f8810435b0b776c6e46a6de829af3"},{url:"static/icon/ui/Contact.png",revision:"f1f5afde22d63fdb6e722377cedc0714"},{url:"static/icon/ui/copy.png",revision:"f6cc9de3c4354ee39d14499f4f36c3ec"},{url:"static/icon/ui/cut.png",revision:"a9780c4a1e930d655f25741705587f8c"},{url:"static/icon/ui/dash.png",revision:"6882dbde8a88ac86b195cb7bfe3d02f5"},{url:"static/icon/ui/defAccount.png",revision:"1957e7878496bbd9805853973424ef80"},{url:"static/icon/ui/display.png",revision:"f57d450a077d8dd42a36ab1819051b9f"},{url:"static/icon/ui/downloads.png",revision:"03eee1c4c3afb3ae4f77c1002cd33c38"},{url:"static/icon/ui/dustbin.png",revision:"882d8a351f85d86b40840248ecc3afcd"},{url:"static/icon/ui/google.png",revision:"719a5106d68bf92d5945f9d900814294"},{url:"static/icon/ui/Icon.targetsize-256.png",revision:"d57397ef795c006d49b3f4a9b53627aa"},{url:"static/icon/ui/keyboard.png",revision:"56ae8de455e8d058a896fe6db58cf144"},{url:"static/icon/ui/left.png",revision:"40f6f88817d19ab4c21bf29ff3244bc0"},{url:"static/icon/ui/link.png",revision:"c4a0309d11b01b63a2a2a84a930a4748"},{url:"static/icon/ui/location.png",revision:"a0efb9fb29d239fae042ba9005f50ade"},{url:"static/icon/ui/mail.png",revision:"d420d7f1fe0aa6c2a274e33ef169d6a4"},{url:"static/icon/ui/marker.png",revision:"46980ba4ab6d2484c4a475fdeecf54be"},{url:"static/icon/ui/maximize.png",revision:"a92404a02a73ee9ee8e4ef48b9fdb997"},{url:"static/icon/ui/maxmin.png",revision:"8f3f4c4c1f9f286c230a9b11d92a5b22"},{url:"static/icon/ui/minimize.png",revision:"70d770ab00467619d6c9a18acedae3a4"},{url:"static/icon/ui/moon.png",revision:"63017692706c423b3ccbd8b4171b5eda"},{url:"static/icon/ui/more.png",revision:"f68ee5cf50d9adb2f4dddcf1f59d8ccc"},{url:"static/icon/ui/nearshare.png",revision:"9e5f574df47ba1389e60cab05a8b683a"},{url:"static/icon/ui/network.png",revision:"1952ffea0878e77d8d98b59905a15697"},{url:"static/icon/ui/new.png",revision:"334a98d944d6c0bb1a0b7f8d43cdbd11"},{url:"static/icon/ui/nightlight.png",revision:"9446a61ac59c2ea389938887d58fd97d"},{url:"static/icon/ui/passkey.png",revision:"52188c741c437a8b947ad8b7ef42f43e"},{url:"static/icon/ui/paste.png",revision:"79bd96a39d0efe0f3e5527c45859a195"},{url:"static/icon/ui/personalize.png",revision:"f1d48165e1706f655a4bc43df1047408"},{url:"static/icon/ui/pinlock.png",revision:"45d0363bcbd7e97e01d5bda84452327d"},{url:"static/icon/ui/plug.png",revision:"16ea25b2bfde6d8c4cd7f7d8fdfe7ea1"},{url:"static/icon/ui/power.png",revision:"831c579709f4761e4ab7053fcf4176ec"},{url:"static/icon/ui/prof.png",revision:"9a308be882611f45ba8369a7d0017e1d"},{url:"static/icon/ui/project.png",revision:"573e0dfad712b169e1b7d16e33913eb3"},{url:"static/icon/ui/refresh.png",revision:"31440c5dc19791c74d89e02e03078d36"},{url:"static/icon/ui/rename.png",revision:"9f5f12a7c31cde69f7b3c337ff605b87"},{url:"static/icon/ui/reply.png",revision:"5bb2530a280a3b34b1518549eef88c00"},{url:"static/icon/ui/right.png",revision:"5add42f3fd3557bfb695bae57cee957e"},{url:"static/icon/ui/saver.png",revision:"f3923103c32ad8227df42dd46cfbc906"},{url:"static/icon/ui/search.png",revision:"6742b3bff255a60d0916b9d8765b235c"},{url:"static/icon/ui/settings.png",revision:"a3437673f5766635a8378f67645b81c0"},{url:"static/icon/ui/share.png",revision:"f94633ae2e42841109e0780358ce04a6"},{url:"static/icon/ui/shield.png",revision:"2e0e7e536090686cac5112a7cb5aaa7d"},{url:"static/icon/ui/sidepane.png",revision:"3f379af60849330dc7b5c2163860ae91"},{url:"static/icon/ui/sort.png",revision:"57d57b22f13758182028d0f276472024"},{url:"static/icon/ui/sort0.png",revision:"989c152a19d1e75bc1a6594f095527cc"},{url:"static/icon/ui/sun.png",revision:"2bb71ba5e6c96f5432c21471599c8c8a"},{url:"static/icon/ui/tablet.png",revision:"214adb823277ba580aaf0988a51861aa"},{url:"static/icon/ui/tesla.png",revision:"2e5cc5c928fc402ee35d95e602ea7218"},{url:"static/icon/ui/trouble.png",revision:"d6f8dd9f561b8a67ffac2bad7e989770"},{url:"static/icon/ui/update.png",revision:"63be5db42c3f1ebd351c11e5f646c973"},{url:"static/icon/ui/view.png",revision:"aa77ae7db0a0717e7bf75d82e0552791"},{url:"static/icon/ui/wifi.png",revision:"904643c4169f2e7d340a401a69c36cb9"},{url:"static/icon/voice.png",revision:"4746cdd8f2096100ba12681341455405"},{url:"static/icon/weather.png",revision:"60f11b9b58c30bb2896b7018c5a215ba"},{url:"static/icon/widget.png",revision:"a86732049fd88861196e839a2f0b4381"},{url:"static/icon/win/106.png",revision:"b2d3834ab2c873d6b607fd7d3cae7edf"},{url:"static/icon/win/1077.png",revision:"29f80df3be07f98190e541ded872aac2"},{url:"static/icon/win/1085.png",revision:"bcd0a33db49e2707c4955e3583c2baeb"},{url:"static/icon/win/1093.png",revision:"f28ab6b0beb074e017f9b4da5a7be877"},{url:"static/icon/win/1101.png",revision:"d83c2b7bc078fad6482b8d9c6838b599"},{url:"static/icon/win/114.png",revision:"5a8cb049af2b05ac7e0aed1bd40f9fa3"},{url:"static/icon/win/1154.png",revision:"b209b90526225c84630e8758b6eb45cd"},{url:"static/icon/win/122.png",revision:"6b3230ef30366ec625a884b086702d81"},{url:"static/icon/win/1247.png",revision:"9d5bec59b80afcdb70e4e776a9bc2485"},{url:"static/icon/win/1278.png",revision:"a448c930338eaab12b1206f5f3021ccc"},{url:"static/icon/win/1286.png",revision:"9b3bebb45d84c58a7964d60262a0f4b6"},{url:"static/icon/win/1294.png",revision:"ef8f0686de53b9533816dcfb71f7fe8c"},{url:"static/icon/win/130.png",revision:"2cd951dd082fd422c428032257f94758"},{url:"static/icon/win/1437.png",revision:"ddb8091ac85096cfb7d03a95e5fc5d97"},{url:"static/icon/win/1479.png",revision:"1cb120e688cd2abb988d29d1ed6bb094"},{url:"static/icon/win/1569.png",revision:"e4a9a71292226bec0300644188b4a1f7"},{url:"static/icon/win/1577.png",revision:"1964afa36a1cb1e3d0f6b4a0fd6f4793"},{url:"static/icon/win/1585.png",revision:"86c59ab58dc3a5a0bfafec3b6424acb1"},{url:"static/icon/win/1593.png",revision:"aef88cbf2013275ddd6af74a4d7268e4"},{url:"static/icon/win/1609.png",revision:"e098003f3a3ae7690f90aa6980afb7e8"},{url:"static/icon/win/1669.png",revision:"c76275f9a3bdc242e9ec69edca16f592"},{url:"static/icon/win/1677.png",revision:"614c7929f02a55db2341aac2bc0bf68e"},{url:"static/icon/win/1693.png",revision:"901d60b1dc5bac873537396e347dd951"},{url:"static/icon/win/170.png",revision:"f703afd4b0ce7b816602c499e7b72d3a"},{url:"static/icon/win/1736.png",revision:"6d7ca01102737f30fc7f687ccadca68b"},{url:"static/icon/win/175.png",revision:"2523c50bbde8c2eb8681297c86f9b82c"},{url:"static/icon/win/1780.png",revision:"a66a591d2ce2b3fbc267f3a45f412397"},{url:"static/icon/win/1788.png",revision:"6c1ad6e0c7d3fc3fe293862ad2d375a7"},{url:"static/icon/win/183.png",revision:"24a5ff8478452c628910d6df82b0a2a2"},{url:"static/icon/win/1836.png",revision:"af6eec08d7a19568d41f69e68acea543"},{url:"static/icon/win/199.png",revision:"4497e97e144d5b1040b623f5b57c7b24"},{url:"static/icon/win/2000.png",revision:"b09561a2e800a5baaa33d34d14cc7010"},{url:"static/icon/win/255.png",revision:"09bdae6ccee50f6461853efee7cbbab5"},{url:"static/icon/win/3.png",revision:"cf96d993ec68fb6e26cb40acfa8e9bf6"},{url:"static/icon/win/50.png",revision:"958fa7207c09b55297d6c1e1b845b558"},{url:"static/icon/win/58.png",revision:"d084bbd91b9cd6ada6b13258296231bd"},{url:"static/icon/win/67.png",revision:"342396c73fa6e8005ef8067347a42b01"},{url:"static/icon/win/797.png",revision:"9c9396c0b72da76b3b4568018df774af"},{url:"static/icon/win/805.png",revision:"9823e1db8787637d29c6b78ef541e8a9"},{url:"static/icon/win/837.png",revision:"0b7a4cc035124ff692d2b1f94c9e216b"},{url:"static/icon/win/877.png",revision:"15db72c5bcaa10e66298e00c4b27e451"},{url:"static/icon/win/893.png",revision:"4f2779b4fc23bcf1740d8a786c1605f0"},{url:"static/icon/win/90.png",revision:"97ba41b700f6380743a14c7296f9dd79"},{url:"static/icon/win/98.png",revision:"2d1b8d7091ce7ef873ccaddec5a4370e"},{url:"static/icon/win/bin-em.png",revision:"aab5dbc0b803aa4348c4fb717fb8ce7a"},{url:"static/icon/win/bin.png",revision:"49e0bce168419dc9474a8f7cb358071a"},{url:"static/icon/win/desk-sm.png",revision:"12105c3570c4575d2a9d16d5f795c98f"},{url:"static/icon/win/desk.png",revision:"d2cfe44053ef4154cbb8371912eb1169"},{url:"static/icon/win/disc-sm.png",revision:"282a24135e1f5f4f15daa44b216a13a8"},{url:"static/icon/win/disk-sm.png",revision:"e38fac29e5193eb1eb232fd9379e3070"},{url:"static/icon/win/docs-sm.png",revision:"cb780b19a915d648cc2de050a569c93a"},{url:"static/icon/win/docs.png",revision:"28bb112f1aa29821fc16abd9618f8bb1"},{url:"static/icon/win/down-sm.png",revision:"f6b8b3d83bb3867966505edd9bd6b8f5"},{url:"static/icon/win/down.png",revision:"6addb16d3bd140a6c30dd38fc36af484"},{url:"static/icon/win/folder-sm.png",revision:"b042a77aeb43913196a68154b6075944"},{url:"static/icon/win/folder.png",revision:"5c3eb876f0dc46abd56c84e886e2091f"},{url:"static/icon/win/folder3d-sm.png",revision:"0cb0b70c6022381168d3a453fa59c54b"},{url:"static/icon/win/folder3d.png",revision:"d2edf8f5c85044e7dd92f0ad0b6a37a0"},{url:"static/icon/win/info.png",revision:"6aff9fa88d784d69fafb49b35d974214"},{url:"static/icon/win/music-sm.png",revision:"b671c4a23b4ede32a154d7fe072bfc30"},{url:"static/icon/win/music.png",revision:"cc14ab8ba3f8b67b34a83ef2de636af6"},{url:"static/icon/win/net.png",revision:"f60dfcb985f894568e56f09c2508b4bc"},{url:"static/icon/win/onedrive-sm.png",revision:"dd56b68900cb92c96b91e67d11c6c522"},{url:"static/icon/win/onedrive.png",revision:"d8a02530de998c43cb956959d708f3c9"},{url:"static/icon/win/pics-sm.png",revision:"78c2df0cfa94c881172e57724eee2c6a"},{url:"static/icon/win/pics.png",revision:"1afdd9e7ede61e34c48d5bbfc3fda9c3"},{url:"static/icon/win/pinned.png",revision:"0c08f13c9ab2e153c04e6b29421034a4"},{url:"static/icon/win/shield.png",revision:"9a6690114928212dd4acbe2ed03f4105"},{url:"static/icon/win/star-sm.png",revision:"cf504ca07f00e77904681075f42fb5ab"},{url:"static/icon/win/store.png",revision:"9f9311a6d3bbefd3d2d88dcda90d47a0"},{url:"static/icon/win/themes.png",revision:"cba56b79590b7a2e809c5de914c8f695"},{url:"static/icon/win/thispc-sm.png",revision:"26c9c8fe8eaf5dedf80b3089c0e44e53"},{url:"static/icon/win/thispc.png",revision:"95f81616ca06cf846296198681016a57"},{url:"static/icon/win/user-sm.png",revision:"261f620afc31660c6516361f272a4ebf"},{url:"static/icon/win/user.png",revision:"435b935757fd05c7c308493165a28037"},{url:"static/icon/win/vid-sm.png",revision:"bb5357022a8280a7b0905c177960c801"},{url:"static/icon/win/vid.png",revision:"20e201e388bc3ca822ac061e05455ffb"},{url:"static/icon/win/viewinfo.png",revision:"52363343bfa0f0d6d7b160e7aab1127a"},{url:"static/icon/win/viewlarge.png",revision:"b80db6db6da39ce278923ba7929062d3"},{url:"static/icon/winWord.png",revision:"5c2b9fd604c0995e584b8bbba34b4788"},{url:"static/icon/xbox.png",revision:"7791d32466a66ec88630eb9b2333464a"},{url:"static/icon/yammer.png",revision:"464f1f525be54f0b81a8dd67b0018738"},{url:"static/icon/yphone.png",revision:"82c690f5e27d27e1296b44799abad0cd"},{url:"static/image/404/0.png",revision:"96b91c5c6f56de24ca773e61f15a01a5"},{url:"static/image/404/1.png",revision:"3905721891d3a91c33a3fa5e2f6b0015"},{url:"static/image/avatar.png",revision:"0ef879f004731ba3c4bb6029fecdb470"},{url:"static/image/bootlogo.png",revision:"49eabff7b1c6efbe72a4e67dc7124a99"},{url:"static/image/error/0.png",revision:"ff7d33984f4c3cfaf4adfc7b032321c4"},{url:"favicon.ico",revision:"0a56b8828762227ab9f3e4cd48d0065a"},{url:"pwa-128x128.png",revision:"000f4ed923802a868923b09e273c1f23"},{url:"pwa-192x192.png",revision:"a83de451fac4c9c90ddfd0edd0e65914"},{url:"pwa-512x512.png",revision:"49eabff7b1c6efbe72a4e67dc7124a99"},{url:"pwa-650x650.png",revision:"3583c34124eea63570d5a4527acbbc04"},{url:"manifest.webmanifest",revision:"c22a329e70a7e17c88bf05f7f4cb8527"}],{}),i.cleanupOutdatedCaches(),i.registerRoute(new i.NavigationRoute(i.createHandlerBoundToURL("index.html"))),i.registerRoute(/^https:\/\/jsonplaceholder/,new i.CacheFirst({cacheName:"test-external-api",plugins:[new i.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new i.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
