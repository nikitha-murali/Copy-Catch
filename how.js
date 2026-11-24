// The How it works cover keeps its own function and traveling marker.
const functionPlot=document.getElementById("functionPlot"),functionCurve=document.getElementById("functionCurve"),functionDot=document.getElementById("functionDot");
const reducedMotion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(functionPlot&&functionCurve&&functionDot){
  const model={a:.67,b:2,c:1.27,d:.31};
  const sample=t=>{const x=-6+12*t,y=model.a*Math.sin(model.b*x+model.c)+model.d;return[32+t*748,160-y*95];};
  const points=Array.from({length:181},(_,i)=>sample(i/180));
  functionCurve.setAttribute("d",points.map(([x,y],i)=>`${i?"L":"M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" "));
  document.querySelectorAll(".plot-points circle").forEach((point,i)=>{const[x,y]=sample((i+1)/6);point.setAttribute("cx",x);point.setAttribute("cy",y);});
  const[x0,y0]=sample(0);functionDot.setAttribute("cx",x0);functionDot.setAttribute("cy",y0);
  if(!reducedMotion&&typeof requestAnimationFrame==="function"){
    const length=functionCurve.getTotalLength();let start=null;
    const animate=time=>{if(start===null)start=time;const phase=((time-start)%9000)/9000,progress=phase<.5?phase*2:2-phase*2,point=functionCurve.getPointAtLength(progress*length);functionDot.setAttribute("cx",point.x);functionDot.setAttribute("cy",point.y);requestAnimationFrame(animate);};requestAnimationFrame(animate);
  }
}
// The cover types values supplied by How's real input analysis.
const algoLines=[...document.querySelectorAll("#algoStream .algo-line")],algoStages=[...document.querySelectorAll("#algoStages > *")];
let coverVersion=0,coverTimer=0;
window.setCopyCatchCoverLines=function(values){
  if(!algoLines.length||!Array.isArray(values))return;
  const version=++coverVersion;clearTimeout(coverTimer);
  algoLines.forEach((line,i)=>{line.classList.remove("done","active");const code=line.querySelector("code");code.dataset.code=values[i]||"";code.textContent="";});algoStages.forEach(stage=>stage.classList.remove("on"));
  if(reducedMotion){algoLines.forEach((line,i)=>{line.querySelector("code").textContent=values[i]||"";line.classList.add("done");algoStages[i]?.classList.add("on")});return;}
  let li=0,ci=0;const type=()=>{if(version!==coverVersion)return;const line=algoLines[li],code=line.querySelector("code"),full=values[li]||"";line.classList.add("active");algoStages.forEach((stage,i)=>stage.classList.toggle("on",i===li));code.textContent=full.slice(0,ci+1);if(++ci>=full.length){line.classList.remove("active");line.classList.add("done");li++;ci=0;if(li>=algoLines.length){coverTimer=setTimeout(()=>{if(version===coverVersion)window.setCopyCatchCoverLines(values)},1700);return;}coverTimer=setTimeout(type,260);return;}coverTimer=setTimeout(type,18);};type();
};
window.setCopyCatchCoverLines(window.copyCatchCoverLines||["// Add files to trace the real analysis","const files = [];","const tokens = [];","const fingerprints = [];","// Waiting for uploaded source code"]);
// Hydrate the complete Detector batch into the lab's existing analysis pipeline.
(async()=>{
  const status=document.getElementById("labSourceStatus");
  let batch=[];
  try{const raw=sessionStorage.getItem("copycatch-lab-files-v1");if(raw)batch=JSON.parse(raw)}catch{}
  if(!Array.isArray(batch)||!batch.length){try{if(window.name.startsWith("copycatch-lab:"))batch=JSON.parse(window.name.slice(14))}catch{}}
  if(!Array.isArray(batch)||!batch.length){if(status)status.textContent="Using built-in sample files.";return}
  const input=document.getElementById("files");
  if(!input||!window.DataTransfer){if(status)status.textContent=`${batch.length} uploaded files saved.`;return}
  try{const dt=new DataTransfer();for(const f of batch)dt.items.add(new File([String(f.text||"")],String(f.name||"source.txt"),{type:"text/plain"}));input.files=dt.files;await input.onchange({target:input});if(status)status.textContent=`Using ${batch.length} uploaded file${batch.length===1?"":"s"}.`}
  catch{if(status)status.textContent=`Could not load uploaded files; using the sample batch.`}
})();
