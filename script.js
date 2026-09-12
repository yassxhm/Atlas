const state={color:"white",size:"M",logoSize:18,x:50,y:35};
const choose=document.getElementById("choose"), custom=document.getElementById("custom");
const stage=document.getElementById("stage"), logo=document.getElementById("logo"), shirt=document.getElementById("shirt");
const size=document.getElementById("size"), sizeValue=document.getElementById("sizeValue"), mobileSize=document.getElementById("mobileSize");
const colorName=document.getElementById("colorName"), toast=document.getElementById("toast");

function render(){
  shirt.src=state.color==="white"?"assets/shirt-white.jpg":"assets/shirt-black.jpg";
  shirt.alt="T-shirt "+(state.color==="white"?"blanc":"noir");
  colorName.textContent=state.color==="white"?"BLANC":"NOIR";
  size.value=state.logoSize;
  sizeValue.textContent=state.logoSize+" cm";
  mobileSize.textContent=state.logoSize+" cm";
  // La position est exprimée en pourcentage de la zone d'aperçu.
  logo.style.left=state.x+"%";
  logo.style.top=state.y+"%";
  logo.style.width=Math.max(14,state.logoSize*1.35)+"%";
}

function open(color){
  state.color=color;
  choose.classList.add("hidden");
  custom.classList.remove("hidden");
  render();
  window.scrollTo(0,0);
}
document.querySelectorAll(".product").forEach(b=>b.addEventListener("click",()=>open(b.dataset.color)));

document.getElementById("back").onclick=()=>{
  custom.classList.add("hidden");choose.classList.remove("hidden");window.scrollTo(0,0);
};

document.querySelectorAll("[data-size]").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("[data-size]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  state.size=b.dataset.size;
}));

size.addEventListener("input",()=>{state.logoSize=Number(size.value);render()});
document.getElementById("minus").onclick=()=>{state.logoSize=Math.max(8,state.logoSize-1);render()};
document.getElementById("plus").onclick=()=>{state.logoSize=Math.min(34,state.logoSize+1);render()};
document.getElementById("center").onclick=()=>{state.x=50;state.y=35;render()};

// IMPORTANT : on peut maintenant placer le logo à n'importe quel endroit de l'aperçu.
// - toucher/clicker directement sur le logo = le déplacer
// - toucher/clicker n'importe où sur la zone du T-shirt = placer le centre du logo à cet endroit
let drag=null;
function pointFromEvent(e){
  const r=stage.getBoundingClientRect();
  return {
    x:Math.max(4,Math.min(96,(e.clientX-r.left)/r.width*100)),
    y:Math.max(4,Math.min(92,(e.clientY-r.top)/r.height*100))
  };
}
logo.addEventListener("pointerdown",e=>{
  e.preventDefault();e.stopPropagation();
  const p=pointFromEvent(e);
  drag={mode:"move",id:e.pointerId,sx:e.clientX,sy:e.clientY,x:state.x,y:state.y};
  logo.setPointerCapture(e.pointerId);
});
logo.addEventListener("pointermove",e=>{
  if(!drag)return;
  const r=stage.getBoundingClientRect();
  state.x=Math.max(3,Math.min(97,drag.x+(e.clientX-drag.sx)/r.width*100));
  state.y=Math.max(3,Math.min(93,drag.y+(e.clientY-drag.sy)/r.height*100));
  render();
});
logo.addEventListener("pointerup",()=>drag=null);
logo.addEventListener("pointercancel",()=>drag=null);

stage.addEventListener("pointerdown",e=>{
  if(e.target.closest("#logo"))return;
  const p=pointFromEvent(e);
  state.x=p.x;state.y=p.y;
  render();
});

document.getElementById("reset").onclick=()=>{
  state.logoSize=18;state.x=50;state.y=35;state.size="M";
  document.querySelectorAll("[data-size]").forEach(x=>x.classList.toggle("active",x.dataset.size==="M"));
  render();
};

document.getElementById("save").onclick=()=>{
  const creation={
    brand:"ATLAS",model:"Classic Fit",color:state.color,size:state.size,
    logo:"ATLAS",logoSizeCm:state.logoSize,
    logoPosition:{x:+state.x.toFixed(2),y:+state.y.toFixed(2)},price:25
  };
  localStorage.setItem("atlasCreation",JSON.stringify(creation));
  toast.textContent="Création enregistrée ✓";
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1800);
};

render();
