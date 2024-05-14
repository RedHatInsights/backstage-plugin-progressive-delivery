(self.webpackChunkplugin_progressive_delivery=self.webpackChunkplugin_progressive_delivery||[]).push([[3912],{58511:(e,t,s)=>{"use strict";s.r(t),s.d(t,{TopologyComponent:()=>d});var r=s(74848),o=s(28437),n=s.n(o),i=s(39839),a=s(78092),c=s(21717),l=s(22097);const d=()=>{const[e,t]=(0,o.useState)("{}"),s=(0,l.useApi)(l.configApiRef).getString("backend.baseUrl");(0,o.useEffect)((()=>{fetch(s+"/api/plugin-progressive-delivery-backend/topo").then((e=>e.text())).then((e=>t(e)))}),[]);const n=(0,a.u)().entity.metadata.name.toLowerCase();if("{}"!==e){try{var c=JSON.parse(e)}catch{return(0,r.jsx)(i.nO,{title:"Progressive Delivery Topology",children:"Error parsing json"})}let t=c.edges.filter((([e,t])=>{const s=JSON.parse(e),r=JSON.parse(t);return s.app.toLowerCase()===n.toLowerCase()||r.app.toLowerCase()===n.toLowerCase()}));t=function(e){let t={};for(const[s,r]of e)r in t||(t[r]=new Set),t[r].add(s);let s={};for(const[e,r]of Object.entries(t)){const t=JSON.stringify(Array.from(r));t in s||(s[t]=new Set),s[t].add(e)}let r={};for(const[e,s]of Object.entries(t))if(s.size>1){const e=JSON.stringify(Array.from(s));e in r||(r[e]=0),r[e]+=1}let o=0;for(const[t,n]of Object.entries(r))if(n>1){const r="soak-"+o++,n=JSON.parse(t),i=s[t];for(const t of n)for(const s of Array.from(i))(e=e.filter((e=>!(e[0]===t&&e[1]===s)))).some((e=>e[0]===t&&e[1]===r))||e.push([t,r]),e.some((e=>e[0]===r&&e[1]===s))||e.push([r,s])}return e}(t);const s=new Set;t.forEach((([e,t])=>{s.add(e),s.add(t)})),c.nodes.map((e=>JSON.parse(e))).filter((e=>e.app.toLowerCase()==n.toLowerCase())).forEach((e=>s.add(JSON.stringify(e))));const o=Array.from(s).map((e=>({id:e}))),a=t.map((([e,t])=>({from:e,to:t})));return(0,r.jsx)(i.nO,{title:"Progressive Delivery Topology",children:(0,r.jsx)(i.wB,{nodes:o,edges:a,showArrowHeads:!0,renderNode:f,direction:i.DT.Direction.LEFT_RIGHT})})}return(0,r.jsx)(i.nO,{title:"Progressive Delivery Topology",children:"Processing ..."})};function f({node:{id:e}}){const[t,s]=n().useState(0),[o,i]=n().useState(0),a=n().useRef(null);n().useLayoutEffect((()=>{if(a.current){let{height:e,width:r}=a.current.getBBox();e=Math.round(e),r=Math.round(r),e===o&&r===t||(s(r),i(e))}}),[t,o]);const c=t+20,l=o+20;let d;try{d=JSON.parse(e)}catch{console.warn("Parse error: ",e),console.warn("Assuming this is soak...");const t=p({isTest:!1});return(0,r.jsxs)("g",{children:[(0,r.jsx)("rect",{className:t.node,width:c,height:l,rx:10}),(0,r.jsx)("text",{ref:a,className:t.text,y:l/2,x:c/2,textAnchor:"middle",alignmentBaseline:"middle",children:e})]})}console.log("PostParse: ",d);let f="none";var h;d.commit_sha&&(f=d.commit_sha.length>=32?null===(h=d.commit_sha)||void 0===h?void 0:h.substring(0,7):d.commit_sha);let u="success"==d.deployment_state?"✅":"❌",g=[`${d.resourceTemplate}/${d.target}`,`on ${d.cluster}/${d.namespace} (${d.saas})`,`${f} ${u}`].map(((e,t)=>(0,r.jsx)("tspan",{x:c/2,y:2*(t+1)*10,fontWeight:t<1?"bold":"normal",children:e})));const m=p({isTest:d.isTest});return(0,r.jsxs)("g",{children:[(0,r.jsx)("rect",{className:m.node,width:c,height:l,rx:10}),(0,r.jsx)("text",{ref:a,className:m.text,y:l/2,x:2*c,textAnchor:"middle",alignmentBaseline:"middle",children:g}),")"]})}const p=(0,c.makeStyles)((e=>({node:{fill:e=>h(e)?"#FFF3D1":"#DCE8FA",stroke:e=>h(e)?"#FFE59E":"#9BB3D6"},edge:{strokeWidth:2},path:{strokeWidth:2},text:{fill:()=>"light"===e.palette.type?"black":e.palette.primary.contrastText}})),{name:"BackstageDependencyGraphDefaultNode"});function h(e){return!!e.isTest}},42634:()=>{}}]);
//# sourceMappingURL=3912.1e3333c2.chunk.js.map