const v={page:'splash',floor:1,tab:'m',cart:{},name:'',phone:'',type:'dine-in',notes:'',exp:0,lastAmt:0,rate:0,rtext:''};
let my=null;try{my=+localStorage.getItem(KM)||null}catch(e){}
const qty=()=>Object.values(v.cart).reduce((a,b)=>a+b,0);
const sub=()=>MENU.reduce((a,m)=>a+(v.cart[m.id]||0)*m.p,0);
const left=m=>S.menuStock[m.id]||0;
const myOrder=()=>S.orders.find(o=>o.id===my);
function go(p){v.page=p;draw();scrollTo(0,0)}
function renderBuyer(){if(!['qris','checkout'].includes(v.page))draw()}
function draw(){$('app').innerHTML=`<a class="seller-fab" href="seller.html" title="Masuk sebagai Pedagang">👨‍🍳</a>`+page()}
function chg(id,d){const m=MENU.find(x=>x.id===id),n=Math.max(0,Math.min(left(m),(v.cart[id]||0)+d));if(n)v.cart[id]=n;else delete v.cart[id];draw()}
function shopBadge(){const s=S.shop;return s==='open'?'<span class="badge b-open">● Buka</span>':s==='pause'?'<span class="badge b-pause">⏸ Sibuk (Pause)</span>':'<span class="badge b-close">● Tutup</span>'}
function hdr(t,back){return `<div class="top">${back?`<button class="ic" onclick="go('${back}')">‹</button>`:'<span class="ic g"></span>'}<b>${t}</b><span class="ic g"></span></div>`}
function page(){
const p=v.page,o=myOrder();
if(p==='splash')return `<section class="hero"><div class="logo">🥟</div><h1>Canteen<span>Pass</span></h1><p class="k">KANTIN M UNJ</p><p class="tg">Pesan dari kursi, ambil tanpa antre.</p></section>
<div class="pad">${o&&o.st==='proses'?`<div class="card" style="border-color:var(--y);cursor:pointer" onclick="go('track')"><b>🔔 Pesanan aktif ${o.no}</b><br><small class="mute">Ketuk untuk melihat status</small></div>`:''}
<button class="btn" onclick="go('floor')">Pesan Sekarang →</button>
<div class="how"><div><b>🍽️</b>Pilih menu</div><div><b>📲</b>Bayar QRIS</div><div><b>🎫</b>Ambil pakai nomor</div></div>
<p class="mute" style="text-align:center;font-size:12px;margin-top:22px">Tanpa antre · Tanpa unduh aplikasi · Bayar 1 menit</p></div>`;
if(p==='floor')return hdr('Pilih Lantai','splash')+`<div class="pad" style="padding-top:0">${[1,2,3].map(f=>`<div class="card floor" onclick="v.floor=${f};go('merch')"><div class="n">${f}</div><div><b>Lantai ${f}</b><br><small>${FL[f].length} merchant${f===1?' · Baoy tersedia':''}</small></div><span class="go">›</span></div>`).join('')}</div>`;
if(p==='merch')return hdr('Merchant Lantai '+v.floor,'floor')+`<div class="pad" style="padding-top:0"><div class="grid">${FL[v.floor].map(m=>m[3]?`<div class="m" onclick="go('menu')"><div class="e">${m[1]}</div><b>${m[0]}</b><small>${m[2]}</small><br>${shopBadge()}</div>`:`<div class="m off"><div class="e">${m[1]}</div><b>${m[0]}</b><small>${m[2]}</small><br><span class="badge b-soon">Segera hadir</span></div>`).join('')}</div></div>`;
if(p==='menu'){const ok=S.shop==='open',n=qty();
return hdr('Baoy 🥟','merch')+(ok?'':`<div class="warn ${S.shop==='pause'?'':'red'}">${S.shop==='pause'?'⏸ Dapur lagi penuh, pesanan dijeda sebentar. Coba lagi beberapa menit lagi ya!':'Baoy sedang tutup untuk hari ini.'}</div>`)+
`<div class="tabs"><button class="tab ${v.tab==='m'?'on':''}" onclick="v.tab='m';draw()">🥟 Makanan</button><button class="tab ${v.tab==='n'?'on':''}" onclick="v.tab='n';draw()">🧋 Minuman</button></div><div class="pad" style="padding-top:8px">
${MENU.filter(m=>m.c===v.tab).map(m=>{const l=left(m),c=v.cart[m.id]||0,off=!ok||l<=0||c>=l;
return `<div class="row"><div class="e">${m.e}</div><div class="i"><b>${m.n}</b><small>${m.d}</small><div class="p">${rp(m.p)}</div>${l<=0?'<span class="badge b-close">Habis</span>':`<span class="badge ${l<=3?'b-pause':'b-open'}">Sisa ${l} porsi</span>`}</div><div class="q">${c?`<button class="mn" onclick="chg(${m.id},-1)">−</button><span>${c}</span>`:''}<button ${off?'disabled style="opacity:.4"':''} onclick="chg(${m.id},1)">+</button></div></div>`}).join('')}</div>
${n?`<div class="bar"><button class="btn" ${ok?'':'disabled'} onclick="go('checkout')"><span>🛒 ${n} item</span><span>Pesan · ${rp(sub())}</span></button></div>`:''}`}
if(p==='checkout'){const it=MENU.filter(m=>v.cart[m.id]);
return hdr('Konfirmasi Pesanan','menu')+`<div class="pad" style="padding-top:0"><div class="card"><b>Ringkasan</b>${it.map(m=>`<div class="sum"><span>${v.cart[m.id]}× ${m.n}</span><span>${rp(v.cart[m.id]*m.p)}</span></div>`).join('')}
<div class="sum"><span>Subtotal</span><span>${rp(sub())}</span></div><div class="sum"><span>Biaya layanan</span><span>${rp(ADMIN_FEE)}</span></div><div class="sum t"><span>Total</span><span>${rp(sub()+ADMIN_FEE)}</span></div></div>
<div class="card"><b>Tipe layanan</b><div class="seg" style="grid-template-columns:1fr 1fr"><button class="${v.type==='dine-in'?'on':''}" onclick="v.type='dine-in';draw()">🍽️ Makan di Tempat</button><button class="${v.type==='takeaway'?'on':''}" onclick="v.type='takeaway';draw()">🛍️ Dibungkus</button></div></div>
<div class="card"><label style="margin-top:0">Nama pemesan</label><input value="${esc(v.name)}" oninput="v.name=this.value" placeholder="Nama kamu" autocomplete="name"><label>Nomor telepon</label><input value="${esc(v.phone)}" oninput="v.phone=this.value" type="tel" inputmode="numeric" placeholder="08xxxxxxxxxx">
<label>Catatan khusus (opsional)</label><textarea rows="2" maxlength="120" oninput="v.notes=this.value" placeholder="cth: Jangan pakai pedas">${esc(v.notes)}</textarea></div>
<div class="warn" style="margin:0 0 12px">🎫 Ambil sendiri di Baoy: sebutkan <b>nomor pesanan</b> dan <b>nama</b> kamu.</div></div>
<div class="bar"><button class="btn" onclick="toQris()">Bayar dengan QRIS · ${rp(sub()+ADMIN_FEE)}</button></div>`}
if(p==='qris')return hdr('Pembayaran QRIS','checkout')+`<div class="pad" style="text-align:center;padding-top:0"><p class="mute" style="margin:0">Scan dengan m-banking / e-wallet</p><h2 style="margin:4px 0 14px">${rp(v.lastAmt)}</h2>
<div class="qrbox">${qr(v.exp)}<span class="tag">SCAN ME</span></div><div class="tm" id="tm">05:00</div><small class="mute">Selesaikan sebelum waktu habis</small>
<div style="margin-top:22px"><button class="btn ghost" onclick="pay()">🧪 Simulasi: pembayaran terverifikasi</button><small class="mute" style="display:block;margin-top:8px">Di versi produksi, status ini otomatis dari webhook payment gateway.</small></div></div>`;
if(p==='track'){if(!o)return hdr('Pesanan','splash')+`<div class="empty"><div>🧾</div>Belum ada pesanan.</div>`;
const d=o.st==='selesai';
return hdr('Pembayaran Berhasil','splash')+`<div class="pad" style="padding-top:0"><div style="text-align:center"><div style="font-size:56px;animation:pop .5s">✅</div><small class="mute">Nomor pesananmu</small></div><div class="no">${o.no}</div>
<p style="text-align:center;margin:0"><span class="badge ${typeCls(o.type)}">${typeLbl(o.type)}</span></p>
<p style="text-align:center;margin:6px 0 0" class="mute">a.n. <b style="color:var(--ink)">${esc(o.name)}</b> · ${tm(o.t)}</p>
<div class="steps"><div class="st dn"><i>✓</i>Dibayar</div><div class="st ${d?'dn':'on'}"><i>${d?'✓':'🍳'}</i>Diproses</div><div class="st ${d?'on':''}"><i>${d?'🎉':'🛍️'}</i>Selesai</div></div>
${d?`<div class="done"><b>Pesananmu siap! 🎉</b>Sebutkan <b>${o.no}</b> dan nama <b>${esc(o.name)}</b> ke Baoy.</div>
${o.rating?`<div class="card" style="text-align:center;margin-top:12px"><b>Terima kasih atas ulasanmu 💛</b><div class="stars" style="pointer-events:none">${[1,2,3,4,5].map(n=>`<span class="star ${o.rating>=n?'on':''}">★</span>`).join('')}</div></div>`
:`<div class="card" style="margin-top:12px"><b>Bagaimana pesananmu?</b><div class="stars">${[1,2,3,4,5].map(n=>`<button class="star ${v.rate>=n?'on':''}" onclick="v.rate=${n};draw()">★</button>`).join('')}</div><textarea rows="2" maxlength="160" oninput="v.rtext=this.value" placeholder="Tulis ulasan (opsional)">${esc(v.rtext)}</textarea><button class="btn" style="margin-top:12px" onclick="submitReview()">Kirim Ulasan</button></div>`}`
:`<div class="est">⏳ Estimasi Siap: ~${estMin(o)} Menit</div><div class="card" style="text-align:center;margin-top:12px"><b>Baoy sedang menyiapkan pesananmu 🍳</b><br><small class="mute">Halaman ini terbarui otomatis. Santai dulu, nggak perlu antre.</small></div>`}
<div class="card" style="margin-top:12px"><b>Detail</b>${o.items.map(i=>`<div class="sum"><span>${i.q}× ${esc(i.n)}</span><span>${rp(i.q*i.p)}</span></div>`).join('')}
${o.notes?`<div class="warn" style="margin:8px 0">📝 ${esc(o.notes)}</div>`:''}
<div class="sum"><span>Subtotal</span><span>${rp(o.subtotal)}</span></div><div class="sum"><span>Biaya layanan</span><span>${rp(o.adminFee)}</span></div><div class="sum t"><span>Total</span><span>${rp(o.total)}</span></div></div>
<button class="btn" onclick="v.cart={};go('merch')">Pesan Lagi</button></div>`}
return ''}
function toQris(){const n=v.name.trim(),ph=v.phone.replace(/\D/g,'');if(!n)return toast('Isi nama dulu ya 🙂');if(ph.length<9)return toast('Nomor telepon belum valid');v.lastAmt=sub()+ADMIN_FEE;v.exp=Date.now()+300000;go('qris')}
function pay(){S=loadStore();if(S.shop!=='open'){toast('Baoy baru saja menjeda pesanan');return go('menu')}
const it=MENU.filter(m=>v.cart[m.id]),bad=it.find(m=>left(m)<v.cart[m.id]);
if(bad){toast('Stok '+bad.n+' tidak cukup');return go('menu')}
it.forEach(m=>S.menuStock[m.id]-=v.cart[m.id]);
const no='A-'+String(++S.seq).padStart(3,'0'),s=sub(),ahead=S.orders.filter(x=>x.st==='proses').length;
const o={id:Date.now(),no,name:v.name.trim(),phone:v.phone,type:v.type,notes:v.notes.trim(),items:it.map(m=>({id:m.id,n:m.n,q:v.cart[m.id],p:m.p})),subtotal:s,adminFee:ADMIN_FEE,total:s+ADMIN_FEE,st:'proses',estMinutes:ahead*3+5,t:Date.now(),rating:null,reviewText:''};
S.orders.unshift(o);saveStore();my=o.id;try{localStorage.setItem(KM,o.id)}catch(e){}v.cart={};v.notes='';go('track')}
function submitReview(){if(!v.rate)return toast('Pilih bintang dulu ⭐');S=loadStore();const o=myOrder();if(!o||o.rating)return;
o.rating=v.rate;o.reviewText=v.rtext.trim();S.reviews.unshift({orderId:o.id,name:o.name,rating:o.rating,comment:o.reviewText,t:Date.now()});saveStore();v.rate=0;v.rtext='';toast('Terima kasih atas ulasanmu 💛');draw()}
function qr(seed){let s=seed%2147483647||7;const r=()=>(s=s*48271%2147483647)/2147483647,N=25;let g='<rect width="25" height="25" fill="#fff"/>';
const f=(x,y)=>g+=`<rect x="${x}" y="${y}" width="7" height="7" fill="#000"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#000"/>`;
for(let y=0;y<N;y++)for(let x=0;x<N;x++){if((x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16))continue;if(r()>.52)g+=`<rect x="${x}" y="${y}" width="1" height="1" fill="#000"/>`}
f(0,0);f(18,0);f(0,18);return `<svg viewBox="0 0 25 25" shape-rendering="crispEdges">${g}</svg>`}
setInterval(()=>{if(v.page==='qris'){const l=v.exp-Date.now();if(l<=0){toast('Waktu pembayaran habis ⏰');go('menu');return}const t=$('tm');if(t)t.textContent=String(Math.floor(l/60000)).padStart(2,'0')+':'+String(Math.floor(l%60000/1000)).padStart(2,'0')}},500);
draw();
