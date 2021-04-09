(this["webpackJsonpkyle-site-v2"]=this["webpackJsonpkyle-site-v2"]||[]).push([[0],{113:function(e,t,a){},114:function(e,t,a){"use strict";a.r(t);var n={};a.r(n),a.d(n,"isAuthenticated",(function(){return g})),a.d(n,"loading",(function(){return y})),a.d(n,"user",(function(){return E})),a.d(n,"playerVolume",(function(){return C})),a.d(n,"autoPlayClip",(function(){return w}));var r={};a.r(r),a.d(r,"login",(function(){return N})),a.d(r,"checkAuthentication",(function(){return S})),a.d(r,"logout",(function(){return x}));var c=a(0),s=a.n(c),l=a(46),u=a.n(l),i=a(4),o=a.n(i),m=a(7),p=a(8),d=a(47),f=a.n(d),b=a(13),h=a(5),v=new(a.n(h).a)({framework:s.a}),g=v.State(!1),y=v.State(!0),E=v.State(null),C=v.State(.1).persist("player_volume"),w=v.State(!0).persist("auto_play_clip"),O=a(48),j=a(49),k=(a(104),j.a.initializeApp({apiKey:"AIzaSyA5PVO7p1qPr_nVrzsuXwFqySVBmSgAxqU",authDomain:"vulture-84cb9.firebaseapp.com",projectId:"vulture-84cb9",storageBucket:"vulture-84cb9.appspot.com",messagingSenderId:"738247494836",appId:"1:738247494836:web:cdd28678f03fd3f6d05be1"})),N=function(){var e=Object(m.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,k.auth().signInWithEmailAndPassword("kyle@clips.com",t);case 3:return e.abrupt("return",{error:!1,message:null});case 6:return e.prev=6,e.t0=e.catch(0),e.abrupt("return",{error:!0,message:e.t0.message});case 9:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(t){return e.apply(this,arguments)}}(),S=function(){var e=Object(m.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t&&(P.state.isAuthenticated.set(!0),P.state.user.set(t)),P.state.loading.set(!1);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),x=function(){var e=Object(m.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return P.state.isAuthenticated.set(!1),P.state.user.set(null),e.next=4,k.auth().signOut();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),A=v.API({baseURL:"/v1",options:{}}),P={state:Object(b.a)({},n),actions:Object(b.a)({},r),routes:Object(b.a)({},O),API:A},I=a(50),V=a.n(I),q=function(e){return s.a.createElement("div",{className:"clip-box"},s.a.createElement("div",{className:"clip-img"},s.a.createElement("div",{className:"clip-hover"},s.a.createElement("button",{onClick:e.playClip},"Play"),s.a.createElement("button",{onClick:e.removeClip},"Remove")),s.a.createElement("img",{src:e.thumbnail,alt:"thumb"})),s.a.createElement("div",{className:"title"},e.title))},_=(a(113),function(){var e=Object(h.usePulse)(P.state.autoPlayClip);return s.a.createElement("div",{className:"autoplay"},s.a.createElement("p",null,"Autoplay"),s.a.createElement("label",{className:"switch"},s.a.createElement("input",{type:"checkbox",onChange:function(e){return P.state.autoPlayClip.set(e.target.checked)},checked:e}),s.a.createElement("span",{className:"slider"})))}),B=f()("https://kyle-twitchbot.herokuapp.com"),L=function(){var e=Object(h.usePulse)(P.state.isAuthenticated),t=Object(h.usePulse)(P.state.autoPlayClip),a=Object(h.usePulse)(P.state.playerVolume),n=Object(h.usePulse)(P.state.loading),r=Object(c.useState)([]),l=Object(p.a)(r,2),u=l[0],i=l[1],d=Object(c.useState)(""),f=Object(p.a)(d,2),b=f[0],v=f[1],g=Object(c.useState)(null),y=Object(p.a)(g,2),E=y[0],C=y[1],w=Object(c.useState)(!1),O=Object(p.a)(w,2),j=O[0],N=O[1],S=Object(c.createRef)();Object(c.useEffect)((function(){B.on("message",(function(e){switch(console.log(e),e.type){case"enableClips":return N(!0);case"disableClips":return N(!1);case"newClip":return function(e){if(e){if(j||N(!0),404===e.status)return B.emit("message",{type:"nextClip",lastClip:e});C(e),console.log(e)}}(e.clip);case"clipQueue":return function(e){return i(e)}(e.clips);case"clipsEmpty":return C(null);case"clipsEnabledStaus":return N(e.status);default:return}})),k.auth().onAuthStateChanged((function(e){return P.actions.checkAuthentication(e)}))}),[]);var x=Object(c.useState)(null),A=Object(p.a)(x,2),I=A[0],L=A[1],z=function(){var e=Object(m.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,P.actions.login(b);case 2:(t=e.sent).error&&L(t.message);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(c.useEffect)((function(){if(!n){var e=document.querySelector("video");e&&e.addEventListener("volumechange",(function(t){P.state.playerVolume.set(e.volume)}))}}),[n,E]),s.a.createElement("div",{className:"container"},n||e?s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"main"},s.a.createElement(V.a,{ref:S,className:"clip-player",url:null!==E?E.video_url:"",playing:t,controls:!0,volume:a,onEnded:function(){var e;(e=E)&&B.emit("message",{type:"nextClip",lastClip:e.id})}})),s.a.createElement("div",{className:"bottom-block"},s.a.createElement("h1",{className:"header-text",style:{marginBottom:"1rem"}},"Controls"),s.a.createElement("section",{className:"controls"},s.a.createElement(_,null),j?s.a.createElement("button",{className:"btn red",onClick:function(){return B.emit("message",{type:"requestDisableClips"})}},"Disable Clips"):s.a.createElement("button",{className:"btn",onClick:function(){return B.emit("message",{type:"requestEnableClips"})}},"Enable Clips")),s.a.createElement("h1",{className:"header-text",style:{marginTop:"2rem"}},"Queued Clips (",u.length,")"),s.a.createElement("div",{className:"clips-list"},u&&u.map((function(e){return s.a.createElement(q,{removeClip:function(){return function(e){return B.emit("message",{type:"removeClip",clip:e})}(e.id)},playClip:function(){return function(e){return B.emit("message",{type:"playClip",clip:e})}(e.id)},slug:e.id,thumbnail:e.thumbnail_url,title:e.title})}))))):s.a.createElement("div",{className:"login"},s.a.createElement("label",null,"Login To View"),s.a.createElement("input",{type:"password",value:b,onChange:function(e){return v(e.target.value)}}),s.a.createElement("button",{onClick:z},"Login"),I&&s.a.createElement("p",{className:"error"},I)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(L,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},48:function(e,t){},52:function(e,t,a){e.exports=a(114)},85:function(e,t){}},[[52,12,13]]]);
//# sourceMappingURL=main.e4321e4d.chunk.js.map