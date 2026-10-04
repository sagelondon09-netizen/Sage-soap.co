const PRODUCTS=[
{id:1,name:"Cute Bookmark",cat:"bookmark",emoji:"🔖",price:4,desc:"A fun little page marker for your favorite book."},
{id:2,name:"Articulated Axolotl",cat:"animal",emoji:"🦎",price:8,desc:"A bendy, wiggly buddy for your desk or backpack."},
{id:3,name:"Articulated Snake",cat:"animal",emoji:"🐍",price:7,desc:"A flexible little friend that loves to wiggle."},
{id:4,name:"Articulated Frog",cat:"animal",emoji:"🐸",price:8,desc:"A cute bendy frog that fits right in your hand."},
{id:5,name:"Cute Ring",cat:"ring",emoji:"💍",price:5,desc:"A colorful 3D printed ring in a fun design."},
{id:6,name:"Mini Storage Box",cat:"storage",emoji:"📦",price:8,desc:"A tiny organizer for clips, beads and little treasures."},
{id:7,name:"Desk Organizer",cat:"storage",emoji:"🗃️",price:10,desc:"Keep your small supplies neat and easy to grab."},
{id:8,name:"Croc Charm Set",cat:"charm",emoji:"🧸",price:4,desc:"Tiny charms to add some personality to your Crocs."}
];
let cart=JSON.parse(localStorage.getItem("printSistersCart")||"[]");

const money=n=>"$"+n.toFixed(2);
const catLabel=c=>({bookmark:"Bookmarks",animal:"Articulated Animals",ring:"Rings",storage:"Storage",charm:"Croc Charms"}[c]||c);

function renderProducts(filter="all"){
  const list=filter==="all"?PRODUCTS:PRODUCTS.filter(p=>p.cat===filter);
  document.getElementById("products").innerHTML=list.map(p=>`
    <article class="product">
      <div class="product-art">${p.emoji}</div>
      <div class="product-body">
        <div class="tag">${catLabel(p.cat)}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="row"><span class="price">${money(p.price)}</span><button class="add" onclick="addToCart(${p.id})">Add to cart</button></div>
      </div>
    </article>`).join("");
}
function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;else cart.push({id,qty:1});
  save(); updateCount(); renderCart();
}
function changeQty(id,d){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=d;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  save();updateCount();renderCart();
}
function save(){localStorage.setItem("printSistersCart",JSON.stringify(cart))}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0)}
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<div class="cart-row"><span>Your cart is empty. Go pick a print! ✨</span></div>';document.getElementById("cartTotal").textContent="$0.00";return}
  let total=0;
  box.innerHTML=cart.map(x=>{
    const p=PRODUCTS.find(y=>y.id===x.id);total+=p.price*x.qty;
    return `<div class="cart-row"><div><b>${p.emoji} ${p.name}</b><br><small>${money(p.price)} each</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div>`;
  }).join("");
  document.getElementById("cartTotal").textContent=money(total);
}
function toggleCart(show){document.getElementById("cartDrawer").classList.toggle("open",show);if(show)renderCart()}
function outsideCart(e){if(e.target.id==="cartDrawer")toggleCart(false)}
function toggleMenu(){document.getElementById("mobileNav").classList.toggle("open")}
function applyFilter(filter){
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
  renderProducts(filter);
  location.hash="shop";
}
function sendOrder(){
  if(!cart.length){alert("Your cart is empty.");return}
  let total=0, lines=[];
  cart.forEach(x=>{const p=PRODUCTS.find(y=>y.id===x.id);total+=p.price*x.qty;lines.push(`${x.qty} x ${p.name} — ${money(p.price*x.qty)}`)});
  const subject=encodeURIComponent("The Print Sisters Order Request");
  const body=encodeURIComponent("Hi The Print Sisters! I'd like to order:\n\n"+lines.join("\n")+"\n\nEstimated item total: "+money(total)+"\n\nMy name:\nMy preferred color(s):\nPickup or shipping:\nAny other notes:");
  window.location.href="mailto:sagelondon09@gmail.com?subject="+subject+"&body="+body;
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>applyFilter(b.dataset.filter)));
document.querySelectorAll("[data-filter-link]").forEach(a=>a.addEventListener("click",e=>{applyFilter(a.dataset.filterLink)}));
document.querySelectorAll("[data-footer-filter]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();applyFilter(a.dataset.footerFilter)}));
renderProducts();updateCount();