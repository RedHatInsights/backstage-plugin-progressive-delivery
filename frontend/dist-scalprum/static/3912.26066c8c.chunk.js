(self.webpackChunkplugin_progressive_delivery=self.webpackChunkplugin_progressive_delivery||[]).push([[3912],{58511:(e,t,s)=>{"use strict";s.r(t),s.d(t,{TopologyComponent:()=>p});var r=s(74848),o=s(28437),n=s.n(o),i=s(39839),a=s(78092),l=s(21717),c=s(22097);const p=()=>{const[e,t]=(0,o.useState)("{}"),s=(0,c.useApi)(c.configApiRef).getString("backend.baseUrl");(0,o.useEffect)((()=>{fetch(s+"/api/plugin-progressive-delivery-backend/topo").then((e=>e.text())).then((e=>t(e)))}),[]);const n=(0,a.u)().entity.metadata.name.toLowerCase();if("{}"!==e){try{var l=JSON.parse(e)}catch{return(0,r.jsx)(i.nO,{title:"Progressive Delivery Topology",children:"Error parsing json"})}const t=l.edges.map((([e,t])=>({from:JSON.parse(e),to:JSON.parse(t)}))).filter((({from:e,to:t})=>e.app.toLowerCase()===n.toLowerCase()||t.app.toLowerCase()===n.toLowerCase())).map((({from:e,to:t})=>({from:JSON.stringify(e),to:JSON.stringify(t)})));let s=l.nodes.map((e=>JSON.parse(e))).filter((e=>e.app.toLowerCase()==n.toLowerCase())).map((e=>({id:JSON.stringify(e)})));return t.forEach((e=>{s.push({id:e.from}),s.push({id:e.to})})),(0,r.jsx)(i.nO,{title:"Progressive Delivery Topology",children:(0,r.jsx)(i.wB,{nodes:s,edges:t,showArrowHeads:!0,renderNode:d,direction:i.DT.Direction.LEFT_RIGHT})})}return(0,r.jsx)(i.nO,{title:"Progressive Delivery Topology",children:"Processing ..."})};function d({node:{id:e}}){const[t,s]=n().useState(0),[o,i]=n().useState(0),a=n().useRef(null);n().useLayoutEffect((()=>{if(a.current){let{height:e,width:r}=a.current.getBBox();e=Math.round(e),r=Math.round(r),e===o&&r===t||(s(r),i(e))}}),[t,o]);const l=t+20,c=o+20;let p=JSON.parse(e),d="none";var u;p.commit_sha&&(d=p.commit_sha.length>=32?null===(u=p.commit_sha)||void 0===u?void 0:u.substring(0,7):p.commit_sha);let g="success"==p.deployment_state?"✅":"❌",m=[`${p.resourceTemplate}/${p.target}`,`on ${p.cluster}/${p.namespace} (${p.saas})`,`${d} ${g}`].map(((e,t)=>(0,r.jsx)("tspan",{x:l/2,y:2*(t+1)*10,fontWeight:t<1?"bold":"normal",children:e})));const f=h({isTest:p.isTest});return(0,r.jsxs)("g",{children:[(0,r.jsx)("rect",{className:f.node,width:l,height:c,rx:10}),(0,r.jsx)("text",{ref:a,className:f.text,y:c/2,x:2*l,textAnchor:"middle",alignmentBaseline:"middle",children:m}),")"]})}const h=(0,l.makeStyles)((e=>({node:{fill:e=>u(e)?"#FFF3D1":"#DCE8FA",stroke:e=>u(e)?"#FFE59E":"#9BB3D6"},edge:{strokeWidth:2},path:{strokeWidth:2},text:{fill:()=>"light"===e.palette.type?"black":e.palette.primary.contrastText}})),{name:"BackstageDependencyGraphDefaultNode"});function u(e){return!!e.isTest}},42634:()=>{}}]);
//# sourceMappingURL=3912.26066c8c.chunk.js.map