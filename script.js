const HEADBANDS=["Bear headband","Cat headband","Unicorn headband","Shrek headband","Dog headband"];
const PRODUCTS=[
{id:1,name:"Cute Bookmark",cat:"bookmark",emoji:"🔖",price:2,desc:"A fun little page marker for your favorite book."},
{id:2,name:"Articulated Snake",cat:"animal",emoji:"🐍",price:6,desc:"A flexible little friend that loves to wiggle."},
{id:3,name:"Cute Ring",cat:"ring",emoji:"💍",price:1,desc:"A cute 3D printed ring — just $1 each."},
{id:4,name:"Mini Storage Box",cat:"storage",emoji:"📦",price:8,desc:"A tiny organizer for clips, beads and little treasures."},
{id:5,name:"Desk Organizer",cat:"storage",emoji:"🗃️",price:10,desc:"Keep your small supplies neat and easy to grab."},
{id:6,name:"Croc Charm",cat:"charm",emoji:"🧸",price:0.25,desc:"25¢ per charm, or get 6 for $1.50."},
{id:7,name:"Headband",cat:"headband",emoji:"🎀",price:4,desc:"Pick your favorite headband style below."}
];
let cart=JSON.parse(localStorage.getItem("printSistersCart")||"[]");
const money=n=>"$"+n.toFixed(2);
const catLabel=c=>({bookmark:"Bookmarks",animal:"Articulated Animals",ring:"Rings",storage:"Storage",charm:"Croc Charms",headband:"Headbands"}[c]||c);
function productExtras(p){
  if(p.cat==="headband"){
    return '<label class="choice-label">Choose a headband</label><select id="headband-'+p.id+'" class="choice"><option value="">Select a style</option>'+HEADBANDS.map(x=>"<option>"+x+"</option>").join("")+"</select>";
  }
  if(p.cat==="charm"){
    return '<label class="choice-label">Choose a pack</label><select id="charm-'+p.id+'" class="choice"><option value="1" data-price="0.25">1 charm — $0.25</option><option value="6" data-price="1.50">6 charms — $1.50</option></select>";
  }
  return "";
}
function renderProducts(filter="all"){
  const list=filter==="all"?PRODUCTS:PRODUCTS.filter(p=>p.cat===filter);
  document.getElementById("products").innerHTML=list.map(p=>
    "<article class=\"product\"><div class=\"product-art\">"+p.emoji+"</div><div class=\"product-body\"><div class=\"tag\">"+catLabel(p.cat)+"</div><h3>"+p.name+"</h3><p>"+p.desc+"</p>"+productExtras(p)+"<div class=\"row\"><span class=\"price\" id=\"price-"+p.id+"\">"+(p.cat==="charm"?"$0.25":money(p.price))+"</span><button class=\"add\" onclick=\"addToCart("+p.id+")\">Add to cart</button></div></div></article>"
  ).join("");
  const charmSelect=document.getElementById("charm-6");
  if(charmSelect) charmSelect.addEventListener("change",()=>{
    const selected=charmSelect.options[charmSelect.selectedIndex];
    document.getElementById("price-6").textContent=money(Number(selected.dataset.price));
  });
}
function addToCart(id){
  const p=PRODUCTS.find(x=>x.id===id);let variant="";let unitPrice=p.price;let units=1;
  if(p.cat==="headband"){const el=document.getElementById("headband-"+id);variant=el?.value||"";if(!variant){alert("Please choose a headband style first.");return}}
  if(p.cat==="charm"){const el=document.getElementById("charm-"+id);units=Number(el?.value||1);unitPrice=units===6?1.50:0.25;variant=units===6?"6 charms":"1 charm"}
  const item=cart.find(x=>x.id===id&&x.variant===variant&&x.unitPrice===unitPrice);
  if(item)item.qty++;else cart.push({id,qty:1,variant,unitPrice,units});
  save();updateCount();renderCart();
}
function changeQty(index,d){const item=cart[index];if(!item)return;item.qty+=d;if(item.qty<=0)cart.splice(index,1);save();updateCount();renderCart()}
function save(){localStorage.setItem("printSistersCart",JSON.stringify(cart))}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0)}
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<div class="cart-row"><span>Your cart is empty. Go pick a print! ✨</span></div>';document.getElementById("cartTotal").textContent="$0.00";return}
  let total=0;
  box.innerHTML=cart.map((x,i)=>{const p=PRODUCTS.find(y=>y.id===x.id);total+=x.unitPrice*x.qty;const variant=x.variant?"<br><small>"+x.variant+"</small>":"";return "<div class=\"cart-row\"><div><b>"+p.emoji+" "+p.name+"</b>"+variant+"<br><small>"+money(x.unitPrice)+" each</small></div><div class=\"qty\"><button onclick=\"changeQty("+i+",-1)\">−</button><b>"+x.qty+"</b><button onclick=\"changeQty("+i+",1)\">+</button></div></div>"}).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function toggleCart(show){document.getElementById("cartDrawer").classList.toggle("open",show);if(show)renderCart()}
function outsideCart(e){if(e.target.id==="cartDrawer")toggleCart(false)}
function toggleMenu(){document.getElementById("mobileNav").classList.toggle("open")}
function applyFilter(filter){document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));renderProducts(filter);location.hash="shop"}
function sendOrder(){
  if(!cart.length){alert("Your cart is empty.");return}
  let total=0,lines=[];
  cart.forEach(x=>{const p=PRODUCTS.find(y=>y.id===x.id);const variant=x.variant?" ["+x.variant+"]":"";total+=x.unitPrice*x.qty;lines.push(x.qty+" x "+p.name+variant+" — "+money(x.unitPrice*x.qty))});
  const subject=encodeURIComponent("The Print Sisters Order Request");
  const body=encodeURIComponent("Hi The Print Sisters! I'd like to order:\n\n"+lines.join("\n")+"\n\nEstimated item total: "+money(total)+"\n\nMy name:\nMy preferred color(s):\nPickup or shipping:\nAny other notes:");
  window.location.href="mailto:sagelondon09@gmail.com?subject="+subject+"&body="+body;
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>applyFilter(b.dataset.filter)));
document.querySelectorAll("[data-filter-link]").forEach(a=>a.addEventListener("click",()=>applyFilter(a.dataset.filterLink)));
document.querySelectorAll("[data-footer-filter]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();applyFilter(a.dataset.footerFilter)}));
renderProducts();updateCount();