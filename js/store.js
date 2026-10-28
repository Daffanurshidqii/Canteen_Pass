const K='cp_state',KM='cp_my';
const $=id=>document.getElementById(id);
const rp=n=>'Rp'+n.toLocaleString('id-ID');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const tm=t=>new Date(t).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const typeLbl=t=>t==='takeaway'?'🛍️ Takeaway':'🍽️ Dine-in';
const typeCls=t=>t==='takeaway'?'b-take':'b-dine';
const init=()=>({shop:'open',seq:14,menuStock:{...STOCK0},orders:[],reviews:[]});
function loadStore(){try{const s=localStorage.getItem(K);if(s){const d=JSON.parse(s);d.menuStock=d.menuStock||{...STOCK0};d.reviews=d.reviews||[];return d}}catch(e){}return init()}
function saveStore(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
let S=loadStore();
const avgRating=()=>S.reviews.length?S.reviews.reduce((a,x)=>a+x.rating,0)/S.reviews.length:0;
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('s');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('s'),2600)}
function beep(){try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;g.gain.value=.1;o.start();o.stop(c.currentTime+.2)}catch(e){}}
function triggerOrderAlert(){toast('🔔 Pesanan baru masuk!');beep();try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}}
// Sinkronisasi antar tab/window
addEventListener('storage',e=>{if(e.key!==K)return;const n=S.orders.length;S=loadStore();
if(typeof renderSeller==='function'){if(S.orders.length>n)triggerOrderAlert();renderSeller()}
if(typeof renderBuyer==='function')renderBuyer()});
