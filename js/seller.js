const sv={tab:'proses',err:''};
let logged=null;try{logged=sessionStorage.getItem('cp_seller')}catch(e){}
function doLogin(){const u=($('luser').value||'').trim().toLowerCase(),p=$('lpass').value||'';const a=SELLERS[u];
if(!a||a.pass!==p){sv.err='Username atau password salah.';$('app').innerHTML=loginPage();return}
logged=u;try{sessionStorage.setItem('cp_seller',u)}catch(e){}S=loadStore();sv.err='';renderSeller()}
function doLogout(){logged=null;try{sessionStorage.removeItem('cp_seller')}catch(e){}sv.err='';$('app').innerHTML=loginPage()}
function loginPage(){return `<div class="hero" style="padding:50px 24px 60px"><div class="logo">🔐</div><h1 style="font-size:25px">Login <span>Pedagang</span></h1><p class="tg">Khusus mitra UMKM kantin</p></div>
<div class="pad"><div class="card"><label style="margin-top:0">Username toko</label><input id="luser" placeholder="cth: baoy" autocomplete="username" autocapitalize="off" onkeydown="if(event.key==='Enter')doLogin()">
<label>Password</label><input id="lpass" type="password" placeholder="Password" autocomplete="current-password" onkeydown="if(event.key==='Enter')doLogin()">
${sv.err?`<div class="warn red" style="margin:12px 0 0">${esc(sv.err)}</div>`:''}</div>
<button class="btn" onclick="doLogin()">Masuk sebagai Pedagang</button>
<a class="btn ghost" style="margin-top:10px;text-align:center;text-decoration:none" href="index.html">‹ Kembali jadi pembeli</a>
<small class="mute" style="display:block;text-align:center;margin-top:16px">Demo: <b>baoy</b> / <b>baoy123</b></small></div>`}
function shopBadge(){const s=S.shop;return s==='open'?'<span class="badge b-open">● Buka</span>':s==='pause'?'<span class="badge b-pause">⏸ Sibuk (Pause)</span>':'<span class="badge b-close">● Tutup</span>'}
function renderSeller(){
if(!logged){if(!$('luser'))$('app').innerHTML=loginPage();return}
const P=S.orders.filter(o=>o.st==='proses'),D=S.orders.filter(o=>o.st==='selesai');
const inc=S.orders.reduce((a,o)=>a+(o.subtotal??o.total),0),avg=avgRating();
const notes={open:'Pesanan masuk diterima seperti biasa.',pause:'Pesanan baru dijeda. Selesaikan antrean dulu, lalu buka lagi.',closed:'Toko tutup. Pembeli tidak bisa memesan.'};
const T=sv.tab,list=T==='proses'?P:D;
const ordCard=o=>`<div class="card ord ${o.st==='selesai'?'fin':''} ${Date.now()-o.t<15000&&o.st==='proses'?'new':''}"><div class="h"><b>${o.no}</b><span class="badge b-open">Lunas · ${tm(o.t)}</span></div>
<span class="badge ${typeCls(o.type)}" style="margin:0 0 6px">${typeLbl(o.type)}</span>
<div style="font-weight:600;margin-bottom:6px">👤 ${esc(o.name)} <small class="mute">· ${esc(o.phone)}</small></div>
${o.notes?`<div class="note">📝 ${esc(o.notes)}</div>`:''}
${o.items.map(i=>`<div class="it"><b>${i.q}×</b>${esc(i.n)}</div>`).join('')}
<div class="sum t"><span>Total menu</span><span>${rp(o.subtotal??o.total)}</span></div>
${o.rating?`<div class="mute" style="font-size:13px">⭐ ${o.rating}/5 ${o.reviewText?'· “'+esc(o.reviewText)+'”':''}</div>`:''}
${o.st==='proses'?`<button class="btn ok" style="margin-top:6px" onclick="finish(${o.id})">✓ Tandai Selesai</button>`:''}</div>`;
const revCard=r=>`<div class="card rev"><div style="display:flex;justify-content:space-between"><b>${esc(r.name)}</b><small class="mute">${tm(r.t)}</small></div><div class="s">${stars(r.rating)}</div>${r.comment?`<div>${esc(r.comment)}</div>`:'<small class="mute">Tanpa komentar</small>'}</div>`;
const body=T==='ulasan'?(S.reviews.length?S.reviews.map(revCard).join(''):`<div class="empty"><div>⭐</div>Belum ada ulasan.</div>`)
:(list.length?list.map(ordCard).join(''):`<div class="empty"><div>${T==='proses'?'😴':'📭'}</div>${T==='proses'?'Belum ada pesanan masuk.<br>Tenang, dapur bisa istirahat.':'Belum ada pesanan selesai.'}</div>`);
$('app').innerHTML=`<div class="hero" style="padding:26px 20px 30px;text-align:left;border-radius:0 0 32px 32px"><button class="logout-fab" onclick="doLogout()" title="Keluar">🚪</button><small style="font-weight:600;position:relative;z-index:1">Dashboard Pedagang</small><h1 style="font-size:28px;position:relative;z-index:1">BAOY 🥟</h1><small style="position:relative;z-index:1">Kantin M UNJ · Lantai 1</small><div class="rate">⭐ ${avg?avg.toFixed(1):'–'} / 5.0 <small>(${S.reviews.length} ulasan)</small></div></div>
<div class="pad"><div class="card" style="margin-top:-28px;position:relative;z-index:2;box-shadow:0 10px 24px rgba(120,80,0,.12)"><div style="display:flex;justify-content:space-between;align-items:center"><b>Status toko</b>${shopBadge()}</div>
<div class="seg"><button class="${S.shop==='open'?'on':''}" onclick="setShop('open')">🟢 Buka</button><button class="${S.shop==='pause'?'on p':''}" onclick="setShop('pause')">⏸ Pause</button><button class="${S.shop==='closed'?'on c':''}" onclick="setShop('closed')">🔴 Tutup</button></div><small class="mute" style="display:block;margin-top:8px">${notes[S.shop]}</small></div>
<div class="stat"><div><b>${P.length}</b><small>Diproses</small></div><div><b>${D.length}</b><small>Selesai</small></div><div><b>${rp(inc)}</b><small>Omzet</small></div></div></div>
<div class="tabs" style="top:0"><button class="tab ${T==='proses'?'on':''}" onclick="sv.tab='proses';renderSeller()">Proses (${P.length})</button><button class="tab ${T==='selesai'?'on':''}" onclick="sv.tab='selesai';renderSeller()">Selesai (${D.length})</button><button class="tab ${T==='ulasan'?'on':''}" onclick="sv.tab='ulasan';renderSeller()">Ulasan</button></div>
<div class="pad" style="padding-top:8px">${body}<button class="link" onclick="resetDemo()">Reset data demo</button></div>`}
function setShop(s){S=loadStore();S.shop=s;saveStore();toast(s==='open'?'Toko dibuka 🟢':s==='pause'?'Pesanan dijeda ⏸':'Toko ditutup 🔴');renderSeller()}
function finish(id){S=loadStore();const o=S.orders.find(x=>x.id===id);if(o){o.st='selesai';saveStore();toast(o.no+' ditandai selesai ✓')}renderSeller()}
function resetDemo(){S=init();saveStore();try{localStorage.removeItem(KM)}catch(e){}renderSeller();toast('Data demo direset')}
renderSeller();
