var f=Object.defineProperty;var h=(s,e,t)=>e in s?f(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var n=(s,e,t)=>(h(s,typeof e!="symbol"?e+"":e,t),t);import{r as c,g as l,N as o,j as d,s as T,a as p,d as E,G as R,b as m,c as u}from"./index.39234d90.js";const y=T.div`
  display: grid;
  white-space: nowrap;
  padding: 5px;
  grid-template-columns: repeat(${({columns:s})=>s}, ${p}px);
  grid-template-rows: repeat(${({rows:s})=>s}, ${p}px);
  overflow: auto;
  max-height: ${E*p+R}px;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: #1a1a1a;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #444;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #666;
  }

  &::-webkit-scrollbar-corner {
    background-color: #1a1a1a;
  }
`;class L extends c.exports.Component{constructor(t){super(t);n(this,"currentNode");n(this,"nodesRef");n(this,"defaultStartLocation");n(this,"defaultFinishLocation");n(this,"resetNode",()=>this.currentNode.current=null);n(this,"isCleared",()=>{if(this.nodesRef.current===null)return!0;for(let t of this.nodesRef.current)if(t.state.pathType!==void 0)return!1;return!0});n(this,"clearPath",()=>{var t;(t=this.nodesRef.current)==null||t.forEach(r=>{r.setPathType(void 0,!1)}),this.props.setGridCleared(!0)});n(this,"clear",()=>{var t;(t=this.nodesRef.current)==null||t.forEach(r=>{r.clear()}),this.props.setGridCleared(!0)});n(this,"reset",()=>{var t;(t=this.nodesRef.current)==null||t.forEach(r=>{r.reset(),r.props.id===this.defaultStartLocation?r.setType(o.START):r.props.id===this.defaultFinishLocation&&r.setType(o.FINISH)}),this.props.setGridCleared(!0)});this.currentNode=c.exports.createRef(),this.nodesRef=c.exports.createRef(),this.nodesRef.current=[],this.defaultStartLocation=l(Math.floor(this.props.rows/2),1,this.props.rows,this.props.columns),this.defaultFinishLocation=l(Math.floor(this.props.rows/2),this.props.columns-2,this.props.rows,this.props.columns),this.props.setGridCleared(!0)}componentDidMount(){document.addEventListener("mouseup",this.resetNode)}componentWillUnmount(){document.removeEventListener("mouseup",this.resetNode)}render(){const t=Array(this.props.rows*this.props.columns).fill(null).map((r,a)=>N(a,this,this.props.selectedRef));return d(y,{onDragStart:r=>r.preventDefault(),rows:this.props.rows,columns:this.props.columns,children:t})}}const N=(s,e,t)=>d(m,{id:s,nodeType:s==e.defaultStartLocation?o.START:s==e.defaultFinishLocation?o.FINISH:o.EMPTY,ref:r=>e.nodesRef.current===null?e.nodesRef.current=[r]:e.nodesRef.current=[...e.nodesRef.current,r],onMouseDown:()=>{if(e.nodesRef.current===null||!e.isCleared())return;const r=e.nodesRef.current[s],a=r.state.nodeType;a.variation===u.REPLACEABLE?r.setType(o.EMPTY):a===o.EMPTY&&r.setType(t.current.node),e.currentNode.current=r},onMouseEnter:()=>{if(e.nodesRef.current===null||e.currentNode.current===null||!e.isCleared())return;const r=e.nodesRef.current[s],a=r.state.nodeType,i=e.currentNode.current.state.nodeType;if(i.variation===u.MOVABLE&&a===o.EMPTY)r.setType(i),e.currentNode.current.setType(o.EMPTY);else if(i===o.EMPTY&&a.variation===u.REPLACEABLE)r.setType(o.EMPTY);else if(i.variation===u.REPLACEABLE&&a===o.EMPTY)r.setType(t.current.node);else return;e.currentNode.current=r}},s);export{L as default};
