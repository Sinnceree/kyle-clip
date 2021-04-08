(this["webpackJsonpkyle-site-v2"]=this["webpackJsonpkyle-site-v2"]||[]).push([[0],{113:function(e,t,a){},114:function(e,t,a){"use strict";a.r(t);var n={};a.r(n),a.d(n,"isAuthenticated",(function(){return g})),a.d(n,"loading",(function(){return E})),a.d(n,"user",(function(){return y})),a.d(n,"playerVolume",(function(){return C})),a.d(n,"autoPlayClip",(function(){return w}));var r={};a.r(r),a.d(r,"login",(function(){return N})),a.d(r,"checkAuthentication",(function(){return S})),a.d(r,"logout",(function(){return A}));var c=a(0),l=a.n(c),s=a(46),i=a.n(s),u=a(4),o=a.n(u),p=a(7),m=a(8),f=a(47),d=a.n(f),b=a(13),h=a(5),v=new(a.n(h).a)({framework:l.a}),g=v.State(!1),E=v.State(!0),y=v.State(null),C=v.State(.1).persist("player_volume"),w=v.State(!0).persist("auto_play_clip"),O=a(48),j=a(49),k=(a(104),j.a.initializeApp({apiKey:"AIzaSyA5PVO7p1qPr_nVrzsuXwFqySVBmSgAxqU",authDomain:"vulture-84cb9.firebaseapp.com",projectId:"vulture-84cb9",storageBucket:"vulture-84cb9.appspot.com",messagingSenderId:"738247494836",appId:"1:738247494836:web:cdd28678f03fd3f6d05be1"})),N=function(){var e=Object(p.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,k.auth().signInWithEmailAndPassword("kyle@clips.com",t);case 3:return e.abrupt("return",{error:!1,message:null});case 6:return e.prev=6,e.t0=e.catch(0),e.abrupt("return",{error:!0,message:e.t0.message});case 9:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(t){return e.apply(this,arguments)}}(),S=function(){var e=Object(p.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t&&(x.state.isAuthenticated.set(!0),x.state.user.set(t)),x.state.loading.set(!1);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),A=function(){var e=Object(p.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return x.state.isAuthenticated.set(!1),x.state.user.set(null),e.next=4,k.auth().signOut();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),P=v.API({baseURL:"/v1",options:{}}),x={state:Object(b.a)({},n),actions:Object(b.a)({},r),routes:Object(b.a)({},O),API:P},I=a(50),q=a.n(I),V=function(e){return l.a.createElement("div",{className:"clip-box"},l.a.createElement("div",{className:"clip-img"},l.a.createElement("div",{className:"clip-hover"},l.a.createElement("button",{onClick:e.playClip},"Play"),l.a.createElement("button",{onClick:e.removeClip},"Remove")),l.a.createElement("img",{src:e.thumbnail,alt:"thumb"})),l.a.createElement("div",{className:"title"},e.title))},_=(a(113),function(){var e=Object(h.usePulse)(x.state.autoPlayClip);return l.a.createElement("div",{className:"autoplay"},l.a.createElement("p",null,"Autoplay"),l.a.createElement("label",{className:"switch"},l.a.createElement("input",{type:"checkbox",onChange:function(e){return x.state.autoPlayClip.set(e.target.checked)},checked:e}),l.a.createElement("span",{className:"slider"})))}),B=d()("https://kyle-twitchbot.herokuapp.com"),L=function(){var e=Object(h.usePulse)(x.state.isAuthenticated),t=Object(h.usePulse)(x.state.autoPlayClip),a=Object(h.usePulse)(x.state.playerVolume),n=Object(h.usePulse)(x.state.loading),r=Object(c.useState)([]),s=Object(m.a)(r,2),i=s[0],u=s[1],f=Object(c.useState)(""),d=Object(m.a)(f,2),b=d[0],v=d[1],g=Object(c.useState)(null),E=Object(m.a)(g,2),y=E[0],C=E[1],w=Object(c.useState)(!1),O=Object(m.a)(w,2),j=O[0],N=O[1],S=Object(c.createRef)();Object(c.useEffect)((function(){B.on("message",(function(e){switch(console.log(e),e.type){case"enableClips":return N(!0);case"disableClips":return N(!1);case"newClip":return function(e){if(e){if(j||N(!0),404===e.status)return B.emit("message",{type:"nextClip",lastClip:e});C(e),console.log(e)}}(e.clip);case"clipQueue":return function(e){return u(e)}(e.clips);case"clipsEmpty":return C(null);case"clipsEnabledStaus":return N(e.status);default:return}})),k.auth().onAuthStateChanged((function(e){return x.actions.checkAuthentication(e)}))}),[]);var A=Object(c.useState)(null),P=Object(m.a)(A,2),I=P[0],L=P[1],z=function(){var e=Object(p.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x.actions.login(b);case 2:(t=e.sent).error&&L(t.message);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(c.useEffect)((function(){if(!n){var e=document.querySelector("video");e&&e.addEventListener("volumechange",(function(t){x.state.playerVolume.set(e.volume)}))}}),[n,y]),l.a.createElement("div",{className:"container"},n||e?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"main"},l.a.createElement(q.a,{ref:S,className:"clip-player",url:null!==y?y.video_url:"",playing:t,controls:!0,volume:a,onEnded:function(){var e;(e=y)&&B.emit("message",{type:"nextClip",lastClip:e.id})}}),l.a.createElement("div",{className:"clip-info"},l.a.createElement("h1",{className:"clip-title"},y&&y.title," "))),l.a.createElement("div",{className:"right-block"},j?l.a.createElement("button",{className:"btn red",onClick:function(){return B.emit("message",{type:"requestDisableClips"})}},"Disable Clips"):l.a.createElement("button",{className:"btn",onClick:function(){return B.emit("message",{type:"requestEnableClips"})}},"Enable Clips"),l.a.createElement(_,null),l.a.createElement("h1",{className:"queued"},"Queued Clips (",i.length,")"),l.a.createElement("div",{className:"clips-list"},i&&i.map((function(e){return l.a.createElement(V,{removeClip:function(){return function(e){return B.emit("message",{type:"removeClip",clip:e})}(e.id)},playClip:function(){return function(e){return B.emit("message",{type:"playClip",clip:e})}(e.id)},slug:e.id,thumbnail:e.thumbnail_url,title:e.title})}))))):l.a.createElement("div",{className:"login"},l.a.createElement("label",null,"Login To View"),l.a.createElement("input",{type:"password",value:b,onChange:function(e){return v(e.target.value)}}),l.a.createElement("button",{onClick:z},"Login"),I&&l.a.createElement("p",{className:"error"},I)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(L,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},48:function(e,t){},52:function(e,t,a){e.exports=a(114)},85:function(e,t){}},[[52,12,13]]]);
//# sourceMappingURL=main.4ca99404.chunk.js.map