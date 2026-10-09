import React, { useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Heart, Instagram, Mail, Menu, Minus, Plus, RotateCcw, Search, ShoppingBag, SlidersHorizontal, Sparkles, Trash2, X } from 'lucide-react';
import BottleStage from './Bottle3D.jsx';
import { fragrances, formatMoney, getProduct } from './data.js';

gsap.registerPlugin(ScrollTrigger);

function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try { const saved = window.localStorage.getItem(key); return saved ? JSON.parse(saved) : initial; } catch { return initial; }
  });
  useEffect(() => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage not available */ } }, [key, value]);
  return [value, setValue];
}
const ensureSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
function BottleArtwork({ fragrance, large = false }) {
  return <div className={'bottle-art ' + (large ? 'bottle-art-large' : '')} style={{ '--bottle-liquid': fragrance.liquid, '--bottle-accent': fragrance.accent }}>
    <div className="art-halo" /><div className="art-shadow" />
    <div className="art-bottle"><div className="art-neck"/><div className="art-cap"/><div className="art-glass">
      <div className="art-liquid"/><div className="art-shine"/><div className="art-label">
        <span>ESSENCE</span><i/><strong>{fragrance.name}</strong><small>EAU DE PARFUM</small><small>100 ML · PARIS</small>
      </div>
    </div></div>
  </div>;
}
function ProductCard({ fragrance, favorite, onFavorite, onView, onAdd }) {
  return <article className="product-card">
    <button className="product-visual" style={{ '--tone': fragrance.surface, '--accent': fragrance.accent }} onClick={() => onView(fragrance)} aria-label={'Explore ' + fragrance.name}>
      <span className="product-counter">{fragrance.number} / 04</span>
      <BottleArtwork fragrance={fragrance}/>
      <span className="visual-explore">DISCOVER FRAGRANCE <ArrowUpRight size={13}/></span>
    </button>
    <div className="product-info">
      <div><div className="product-family">{fragrance.family}</div><button className="product-name" onClick={() => onView(fragrance)}>{fragrance.name}</button><p>{fragrance.subtitle}</p></div>
      <button className="favorite" onClick={() => onFavorite(fragrance.id)} aria-label={favorite ? 'Remove from wishlist' : 'Add to wishlist'}><Heart size={19} fill={favorite ? 'currentColor' : 'none'}/></button>
    </div>
    <div className="product-purchase"><span>{formatMoney(fragrance.price)} CAD</span><button onClick={() => onAdd(fragrance)} aria-label={'Add ' + fragrance.name + ' to bag'}>ADD TO BAG <Plus size={15}/></button></div>
  </article>;
}
const quizzes = [
  { question: 'What feeling are you chasing?', kicker: '01 / YOUR MOOD', choices: [{ title: 'Mysterious & magnetic', value: 'nocturne' }, { title: 'Passionate & fearless', value: 'rouge' }, { title: 'Soft & effortlessly elegant', value: 'lumiere' }, { title: 'Radiant & optimistic', value: 'solstice' }] },
  { question: 'Which world feels like yours?', kicker: '02 / YOUR WORLD', choices: [{ title: 'Midnight in a velvet lounge', value: 'nocturne' }, { title: 'A garden of red roses', value: 'rouge' }, { title: 'Morning light through linen', value: 'lumiere' }, { title: 'Sunshine on the Mediterranean', value: 'solstice' }] },
  { question: 'When do you feel most alive?', kicker: '03 / YOUR MOMENT', choices: [{ title: 'After dark', value: 'nocturne' }, { title: 'When love takes over', value: 'rouge' }, { title: 'In the quiet everyday', value: 'lumiere' }, { title: 'Discovering something new', value: 'solstice' }] }
];
function Quiz({ onClose, onView }) {
  const [answers, setAnswers] = useState([]);
  const step = answers.length;
  const resultId = useMemo(() => {
    const scores = { nocturne: 0, rouge: 0, lumiere: 0, solstice: 0 };
    answers.forEach(a => { scores[a]++; });
    return Object.keys(scores).sort((a,b) => scores[b] - scores[a])[0];
  }, [answers]);
  const result = getProduct(resultId);
  return <div className="overlay" role="presentation" onMouseDown={onClose}><div className="quiz-modal" role="dialog" aria-modal="true" aria-label="Find your fragrance" onMouseDown={e => e.stopPropagation()}>
    <button className="close-button" onClick={onClose} aria-label="Close quiz"><X/></button>
    <div className="quiz-ornament">✳</div>
    {step < quizzes.length ? <>
      <div className="eyebrow gold">{quizzes[step].kicker}</div>
      <h2>{quizzes[step].question}</h2><p className="quiz-intro">Follow your instinct. There are no wrong answers.</p>
      <div className="quiz-choices">{quizzes[step].choices.map((choice,i) => <button key={choice.value} onClick={() => setAnswers([...answers, choice.value])}><span>0{i+1}</span>{choice.title}<ArrowUpRight size={16}/></button>)}</div>
      <div className="quiz-progress"><div style={{ width: ((step + 1)/quizzes.length*100) + '%' }}/></div>
      {step > 0 && <button className="text-control" onClick={() => setAnswers(answers.slice(0,-1))}><ChevronLeft size={14}/> Previous question</button>}
    </> : <>
      <div className="eyebrow gold">YOUR SCENT PERSONALITY</div><h2>You are {result.name}.</h2>
      <div className="quiz-result"><BottleArtwork fragrance={result}/></div><p>{result.description}</p>
      <button className="btn btn-dark" onClick={() => { onClose(); onView(result); }}>DISCOVER YOUR FRAGRANCE <ArrowRight size={16}/></button>
      <button className="text-control" onClick={() => setAnswers([])}><RotateCcw size={14}/> Begin again</button>
    </>}
  </div></div>;
}
function ProductModal({ fragrance, onClose, onAdd, favorite, onFavorite }) {
  const [size, setSize] = useState(100);
  const price = fragrance.price - (size === 50 ? 45 : 0);
  return <div className="overlay" role="presentation" onMouseDown={onClose}><div className="detail-modal" role="dialog" aria-modal="true" aria-label={'Explore ' + fragrance.name} onMouseDown={e => e.stopPropagation()}>
    <button className="close-button" onClick={onClose} aria-label="Close product"><X/></button>
    <div className="detail-art" style={{ '--detail-tone': fragrance.surface }}><BottleStage fragrance={fragrance} interactive/><span className="detail-small-label">AN OBJECT OF DESIRE</span></div>
    <div className="detail-copy">
      <div className="eyebrow gold">ESSENCE / COLLECTION {fragrance.number}</div>
      <h2>{fragrance.name}</h2><p className="detail-subtitle">{fragrance.subtitle}</p><p className="detail-description">{fragrance.description}</p>
      <div className="note-lines"><div><span>TOP</span>{fragrance.top.join(' · ')}</div><div><span>HEART</span>{fragrance.heart.join(' · ')}</div><div><span>BASE</span>{fragrance.base.join(' · ')}</div></div>
      <p className="option-label">SELECT SIZE</p><div className="size-options">{[50,100].map(s => <button className={size===s?'selected':''} key={s} onClick={()=>setSize(s)}>{s} ML</button>)}</div>
      <div className="detail-actions"><button className="btn btn-dark" onClick={() => { onAdd(fragrance, { size, price }); onClose(); }}>ADD TO BAG · {formatMoney(price)} <ArrowRight size={17}/></button><button className="outline-icon" onClick={() => onFavorite(fragrance.id)} aria-label="Toggle favorite"><Heart fill={favorite?'currentColor':'none'} size={19}/></button></div>
      <div className="detail-benefits">COMPLIMENTARY SHIPPING OVER C$150 <span>·</span> COMPLIMENTARY GIFT WRAPPING</div>
    </div>
  </div></div>;
}
function CartDrawer({ items, onClose, onQty, onRemove, onCheckout }) {
  const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0);
  return <div className="drawer-overlay" onMouseDown={onClose}><div className="cart-drawer" role="dialog" aria-label="Shopping bag" aria-modal="true" onMouseDown={e => e.stopPropagation()}>
    <div className="drawer-top"><div><div className="eyebrow gold">YOUR SELECTION</div><h2>The bag <sup>({items.reduce((s,i)=>s+i.quantity,0)})</sup></h2></div><button onClick={onClose} aria-label="Close bag"><X/></button></div>
    {items.length === 0 ? <div className="empty-cart"><span className="empty-symbol">✳</span><h3>A beautiful beginning.</h3><p>Your bag is empty. Find a fragrance that feels like you.</p><button className="btn btn-dark" onClick={() => { onClose(); ensureSection('collection'); }}>EXPLORE THE COLLECTION <ArrowRight size={16}/></button></div>
    : <><div className="cart-items">{items.map(item => <div className="cart-item" key={item.key}><div className="cart-thumb" style={{ background: getProduct(item.id)?.surface }}><BottleArtwork fragrance={getProduct(item.id)}/></div><div className="cart-meta"><span>ESSENCE EAU DE PARFUM</span><h3>{getProduct(item.id)?.name || item.id}</h3><p>{item.size} ML {item.engraving ? ' · Engraved: ' + item.engraving : ''}</p>{item.custom && <p>Custom · {item.finish} / {item.cap}</p>}<div className="qty"><button aria-label="Decrease quantity" onClick={()=>onQty(item.key,-1)}><Minus size={13}/></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={()=>onQty(item.key,1)}><Plus size={13}/></button></div></div><div className="cart-end"><strong>{formatMoney(item.price*item.quantity)}</strong><button aria-label="Remove item" onClick={()=>onRemove(item.key)}><Trash2 size={16}/></button></div></div>)}</div>
    <div className="cart-bottom"><div className="cart-total"><span>SUBTOTAL</span><strong>{formatMoney(subtotal)}</strong></div><p>{subtotal >= 150 ? 'Complimentary shipping unlocked.' : 'Shipping is complimentary over C$150.'}</p><button className="btn btn-dark" onClick={onCheckout}>REQUEST AN ORDER <ArrowRight size={17}/></button><small>Concept store · no online payments are collected. Your email application will open with an order enquiry.</small></div></>}
  </div></div>;
}
function Header({ count, onBag, onSearch, favoritesOnly, onFavorites }) {
  const [mobile,setMobile] = useState(false);
  const go = id => { setMobile(false); ensureSection(id); };
  return <>
    <div className="announcement">COMPLIMENTARY SHIPPING ON ORDERS OVER C$150 <span>✳</span> DISCOVER THE ESSENCE OF YOU</div>
    <header className="header">
      <div className="header-side nav-links"><button onClick={()=>go('collection')}>COLLECTION</button><button onClick={()=>go('atelier')}>ATELIER</button><button onClick={()=>go('story')}>OUR STORY</button></div>
      <button className="mobile-menu" onClick={()=>setMobile(!mobile)} aria-label="Toggle navigation">{mobile?<X size={21}/>:<Menu size={21}/>}</button>
      <button className="wordmark" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>ESSENCE <span>MAISON DE PARFUM</span></button>
      <div className="header-side header-actions"><button onClick={onSearch} aria-label="Search fragrances"><Search size={18}/></button><button onClick={onFavorites} className={favoritesOnly?'active-action':''} aria-label="Show favorites"><Heart size={18} fill={favoritesOnly?'currentColor':'none'}/></button><button className="bag-trigger" onClick={onBag} aria-label={'Open bag with ' + count + ' items'}><ShoppingBag size={18}/><span>{count}</span></button></div>
    </header>
    {mobile && <div className="mobile-nav"><button onClick={()=>go('collection')}>THE COLLECTION <ArrowUpRight/></button><button onClick={()=>go('atelier')}>THE ATELIER <ArrowUpRight/></button><button onClick={()=>go('discovery')}>FIND YOUR SCENT <ArrowUpRight/></button><button onClick={()=>go('story')}>OUR STORY <ArrowUpRight/></button></div>}
  </>;
}
function SearchModal({ onClose, onView }) {
  const [query,setQuery] = useState('');
  const results = fragrances.filter(f => (f.name+' '+f.family+' '+f.top.join(' ')+' '+f.heart.join(' ')+' '+f.base.join(' ')).toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="overlay" onMouseDown={onClose}><div className="search-modal" role="dialog" aria-label="Search fragrances" aria-modal="true" onMouseDown={e=>e.stopPropagation()}>
    <div className="search-top"><span className="eyebrow gold">DISCOVER YOUR NEXT OBSESSION</span><button onClick={onClose} aria-label="Close search"><X/></button></div>
    <div className="search-input"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search notes, moods, fragrances..." aria-label="Search fragrance collection"/></div>
    <div className="search-results">{results.length ? results.map(f=><button key={f.id} onClick={()=>{onClose();onView(f);}}><span className="search-dot" style={{background:f.liquid}}/><span><strong>{f.name}</strong><small>{f.family}</small></span><ArrowUpRight/></button>) : <div className="no-results">No matching fragrance. Try oud, rose, jasmine or citrus.</div>}</div>
  </div></div>;
}
export default function App() {
  const [cart,setCart] = useStoredState('essence-cart-v1',[]);
  const [favorites,setFavorites] = useStoredState('essence-favorites-v1',[]);
  const [view,setView] = useState(null);
  const [quiz,setQuiz] = useState(false);
  const [search,setSearch] = useState(false);
  const [bag,setBag] = useState(false);
  const [favoritesOnly,setFavoritesOnly] = useState(false);
  const [finish,setFinish] = useState('smoke');
  const [cap,setCap] = useState('gold');
  const [engraving,setEngraving] = useState('');
  const [atelierScent,setAtelierScent] = useState('nocturne');
  const [atelierSize,setAtelierSize] = useState(100);
  const [toast,setToast] = useState('');
  const [email,setEmail] = useState('');
  const selectedScent = getProduct(atelierScent) || fragrances[0];
  const atelierPrice = selectedScent.price + 25 + (atelierSize === 50 ? -45 : 0);
  const filtered = favoritesOnly ? fragrances.filter(f=>favorites.includes(f.id)) : fragrances;
  useEffect(()=>{
    const ctx = gsap.context(()=>{
      gsap.fromTo('.hero-entrance',{y:38,opacity:0},{y:0,opacity:1,duration:1.25,stagger:0.16,ease:'power3.out',delay:0.2});
      gsap.utils.toArray('.reveal').forEach(element => {
        gsap.fromTo(element,{opacity:0,y:44},{opacity:1,y:0,duration:1.05,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 90%',once:true}});
      });
    });
    return ()=>ctx.revert();
  },[]);
  useEffect(()=>{document.body.style.overflow=(view||quiz||search||bag)?'hidden':'';return ()=>{document.body.style.overflow='';};},[view,quiz,search,bag]);
  const announce = msg => { setToast(msg); window.setTimeout(()=>setToast(''),3200); };
  const add = (fragrance, options={})=>{
    const size = options.size || 100;
    const item = { id:fragrance.id,size,price:options.price ?? fragrance.price,finish:options.finish || 'standard',cap:options.cap || 'standard',engraving:options.engraving || '',custom:!!options.custom };
    item.key = [item.id,item.size,item.finish,item.cap,item.engraving].join(':');
    setCart(prev=>{const found=prev.find(p=>p.key===item.key);return found?prev.map(p=>p.key===item.key?{...p,quantity:p.quantity+1}:p):[...prev,{...item,quantity:1}];});
    announce(fragrance.name+' added to your bag'); 
  };
  const toggleFavorite = id => setFavorites(prev=>prev.includes(id)?prev.filter(a=>a!==id):[...prev,id]);
  const changeQty = (key,amount) => setCart(prev=>prev.map(item=>item.key===key?{...item,quantity:Math.max(1,item.quantity+amount)}:item));
  const order = ()=>{
    const lines=cart.map(i=>{const f=getProduct(i.id);return i.quantity+' x '+(f?.name||i.id)+' / '+i.size+' ml / '+formatMoney(i.price)+' each'+(i.custom?' / '+i.finish+' glass / '+i.cap+' cap / engraving: '+(i.engraving||'none'):'');});
    const total=cart.reduce((sum,i)=>sum+i.price*i.quantity,0);
    const subject='ESSENCE concept store - order enquiry';
    const body='Hello ESSENCE,%0D%0A%0D%0AI would like to enquire about the following concept order:%0D%0A%0D%0A'+encodeURIComponent(lines.join('\n')+'\n\nTotal estimate: '+formatMoney(total)+' CAD\n\nPlease confirm availability and next steps.');
    window.location.href='mailto:nav.manshahia7@gmail.com?subject='+encodeURIComponent(subject)+'&body='+body;
  };
  const requestNewsletter=e=>{
    e.preventDefault();
    if(!email.trim()) return;
    window.location.href='mailto:nav.manshahia7@gmail.com?subject='+encodeURIComponent('ESSENCE early access request')+'&body='+encodeURIComponent('Please add me to ESSENCE updates: '+email);
    announce('Your email app will open to request early access.');
  };
  return <div className="app-shell">
    <Header count={cart.reduce((s,i)=>s+i.quantity,0)} onBag={()=>setBag(true)} onSearch={()=>setSearch(true)} favoritesOnly={favoritesOnly} onFavorites={()=>{setFavoritesOnly(!favoritesOnly);ensureSection('collection');}} />
    <main>
      <section className="hero" id="home">
        <div className="hero-noise"/><div className="hero-glow"/><div className="hero-vertical">MAISON DE PARFUM — PARIS — MMXXVI</div>
        <div className="hero-copy">
          <p className="eyebrow hero-entrance"><span className="tiny-star">✳</span> A NEW LANGUAGE OF LUXURY</p>
          <h1 className="hero-entrance">THE ART<br/>OF <em>feeling.</em></h1>
          <p className="hero-description hero-entrance">Fragrance is the invisible thing you leave behind. A memory, a moment, a version of yourself.</p>
          <div className="hero-buttons hero-entrance"><button className="btn btn-light" onClick={()=>ensureSection('collection')}>DISCOVER THE COLLECTION <ArrowUpRight size={17}/></button><button className="minimal-link" onClick={()=>setQuiz(true)}>FIND YOUR SCENT <ArrowRight size={15}/></button></div>
        </div>
        <div className="hero-scene"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-sparkle sparkle-a">✳</div><div className="hero-sparkle sparkle-b">✦</div><BottleStage fragrance={fragrances[0]} className="hero-bottle"/><div className="hero-signature">NOCTURNE <span>01 / 04</span></div></div>
        <div className="hero-bottom"><span>SCENTED IN SILENCE. REMEMBERED FOREVER.</span><button onClick={()=>ensureSection('collection')}>SCROLL TO EXPLORE <span className="down-arrow">↓</span></button><span>01 — THE BEGINNING</span></div>
      </section>
      <div className="marquee"><div>ART IN EVERY DROP <span>✳</span> THE UNSEEN SIGNATURE <span>✳</span> BEYOND THE ORDINARY <span>✳</span> ART IN EVERY DROP <span>✳</span> THE UNSEEN SIGNATURE <span>✳</span></div></div>

      <section className="collection section-wrap" id="collection">
        <div className="section-heading reveal"><div className="eyebrow dark-eyebrow">01 / THE COLLECTION</div><div className="split-heading"><h2>Every scent,<br/><em>a different story.</em></h2><p>Four distinct personalities. One shared philosophy: beauty is never ordinary. Discover the scent that feels unmistakably yours.</p></div></div>
        <div className="collection-toolbar"><span>{filtered.length.toString().padStart(2,'0')} SIGNATURE FRAGRANCES</span><button onClick={()=>setFavoritesOnly(!favoritesOnly)}><Heart size={15} fill={favoritesOnly?'currentColor':'none'}/>{favoritesOnly?'SHOW ALL':'YOUR FAVORITES'}</button></div>
        {filtered.length ? <div className="product-grid">{filtered.map(f=><ProductCard key={f.id} fragrance={f} favorite={favorites.includes(f.id)} onFavorite={toggleFavorite} onView={setView} onAdd={add}/>)}</div> : <div className="empty-favorites"><h3>No favorites yet.</h3><p>Tap the heart on a fragrance to save it here.</p><button className="text-control" onClick={()=>setFavoritesOnly(false)}>VIEW ALL FRAGRANCES <ArrowRight size={15}/></button></div>}
        <p className="collection-footnote">CRAFTED WITH INTENTION <span>✳</span> WORN WITH FEELING</p>
      </section>

      <section className="manifesto" id="manifesto"><div className="manifesto-overlay"/><div className="manifesto-content reveal"><div className="eyebrow">02 / THE PHILOSOPHY</div><h2>Some things are<br/><em>felt, not seen.</em></h2><p>We don't make fragrances to be noticed. We create them to be remembered.</p><button className="minimal-link light" onClick={()=>ensureSection('story')}>EXPLORE OUR WORLD <ArrowUpRight size={17}/></button></div><div className="manifesto-annotation">A SENSORY PORTRAIT OF THE INVISIBLE</div></section>

      <section className="notes-section section-wrap" id="notes"><div className="notes-heading reveal"><div className="eyebrow dark-eyebrow">03 / THE COMPOSITION</div><h2>Anatomy of<br/><em>an impression.</em></h2><p>Like a story, every fragrance unfolds in chapters. Explore the composition of our signature Nocturne.</p></div>
        <div className="notes-grid">
          {[{number:'01',type:'TOP NOTES',title:'The first encounter',words:'Black pepper · Cardamom · Bergamot',symbol:'✺',cls:'top'},{number:'02',type:'HEART NOTES',title:'The moment that stays',words:'Oud wood · Iris · Saffron',symbol:'✳',cls:'heart'},{number:'03',type:'BASE NOTES',title:'The lasting memory',words:'Amber · Leather · Musk',symbol:'✴',cls:'base'}].map(n=><div className={'note-card '+n.cls} key={n.type}><div className="note-card-top"><span>{n.number} — {n.type}</span><span>ESSENCE</span></div><span className="note-icon">{n.symbol}</span><div className="note-card-text"><h3>{n.title}</h3><p>{n.words}</p></div></div>)}
        </div>
      </section>

      <section className="atelier" id="atelier"><div className="atelier-top section-wrap"><div className="eyebrow">04 / THE PERSONAL ATELIER</div><div className="split-heading"><h2>Make it<br/><em>uniquely yours.</em></h2><p>Every detail is a choice. Create a personal expression with our interactive bespoke bottle studio.</p></div></div>
        <div className="atelier-workspace">
          <div className="atelier-stage"><div className="atelier-ring"/><span className="atelier-stage-index">ATELIER / 001</span><BottleStage fragrance={selectedScent} finish={finish} cap={cap} engraving={engraving} interactive className="atelier-canvas"/><span className="atelier-stage-bottom">DESIGNED BY YOU · FINISHED WITH INTENTION</span></div>
          <div className="atelier-panel"><div className="eyebrow gold">BESPOKE, BY ESSENCE</div><h3>The art of<br/><em>making it yours.</em></h3><p className="panel-subtitle">Personalize your signature bottle. The 3D model updates as you create.</p>
            <div className="custom-group"><div className="custom-title"><span>01</span> SELECT YOUR FRAGRANCE</div><div className="fragrance-choice">{fragrances.map(f=><button key={f.id} className={atelierScent===f.id?'active':''} onClick={()=>setAtelierScent(f.id)}>{f.name}</button>)}</div></div>
            <div className="custom-group"><div className="custom-title"><span>02</span> CHOOSE YOUR GLASS</div><div className="swatches">{[{id:'smoke',color:'#3d3532',name:'Smoked glass'},{id:'crystal',color:'#e3ded1',name:'Clear crystal'},{id:'rose',color:'#96596a',name:'Rose tint'},{id:'amber',color:'#9c6230',name:'Amber tint'}].map(option=><button key={option.id} className={finish===option.id?'selected':''} onClick={()=>setFinish(option.id)} aria-label={option.name} title={option.name}><span style={{background:option.color}}/></button>)}</div><p className="option-descriptor">{finish==='smoke'?'SMOKED GLASS':finish==='crystal'?'CLEAR CRYSTAL':finish==='rose'?'ROSE TINT':'AMBER TINT'}</p></div>
            <div className="custom-group"><div className="custom-title"><span>03</span> YOUR CAP FINISH</div><div className="pill-options">{['gold','silver','black'].map(c=><button className={cap===c?'selected':''} key={c} onClick={()=>setCap(c)}>{c.toUpperCase()}</button>)}</div></div>
            <div className="custom-group"><div className="custom-title"><span>04</span> PERSONAL ENGRAVING</div><input className="engraving-input" maxLength={16} value={engraving} onChange={e=>setEngraving(e.target.value.replace(/[^\p{L}\p{N} .-]/gu,''))} placeholder="Your name, your story (optional)" aria-label="Personal engraving"/><small>{engraving.length} / 16 CHARACTERS</small></div>
            <div className="custom-group size-and-price"><div><div className="custom-title"><span>05</span> BOTTLE SIZE</div><div className="pill-options">{[50,100].map(s=><button key={s} className={atelierSize===s?'selected':''} onClick={()=>setAtelierSize(s)}>{s} ML</button>)}</div></div><strong>{formatMoney(atelierPrice)}</strong></div>
            <button className="btn btn-light atelier-add" onClick={()=>add(selectedScent,{custom:true,finish,cap,engraving,size:atelierSize,price:atelierPrice})}>ADD YOUR CREATION TO BAG <ArrowUpRight size={18}/></button>
            <p className="atelier-disclaimer">Personalized bottle preview is a concept demonstration. Production and checkout are not enabled.</p>
          </div>
        </div>
      </section>

      <section className="discovery section-wrap" id="discovery"><div className="discovery-art"><span className="discover-symbol">✳</span><span>THE SECRET IS IN THE FEELING</span></div><div className="discovery-copy reveal"><div className="eyebrow dark-eyebrow">05 / THE SCENT FINDER</div><h2>A fragrance<br/><em>that finds you.</em></h2><p>Not sure where to begin? Tell us what moves you. We'll introduce you to a fragrance that reflects the way you feel.</p><button className="btn btn-outline-dark" onClick={()=>setQuiz(true)}>FIND YOUR SIGNATURE <ArrowUpRight size={16}/></button><span className="discovery-foot">THREE QUESTIONS · ONE PERSONAL MATCH</span></div></section>

      <section className="story" id="story"><div className="story-image"><div className="story-sun"/><div className="story-frame"><BottleArtwork fragrance={fragrances[2]} large/></div></div><div className="story-copy reveal"><div className="eyebrow gold">06 / OUR UNIVERSE</div><h2>For the moments<br/><em>between words.</em></h2><p>ESSENCE is a concept fragrance house devoted to the quiet power of scent: its ability to take us somewhere, remind us of someone, or reveal a side of ourselves we hadn't yet met.</p><p>Each composition is imagined as a personal story. Considered, contemporary, and unapologetically individual.</p><div className="story-divider"/><span>THE ART OF FEELING — EST. MMXXVI</span></div></section>

      <section className="newsletter section-wrap"><div><div className="eyebrow dark-eyebrow">THE ESSENCE LETTER</div><h2>Beautiful things<br/><em>are worth the wait.</em></h2></div><div><p>New stories, exclusive first looks and invitations from the atelier.</p><form onSubmit={requestNewsletter}><input type="email" required placeholder="Your email address" value={email} onChange={e=>setEmail(e.target.value)} aria-label="Email for early access"/><button type="submit" aria-label="Request early access"><ArrowUpRight/></button></form><small>Early-access requests open your email app. No mailing-list server is connected yet.</small></div></section>
    </main>
    <footer className="footer"><div className="footer-main"><div><div className="footer-logo">ESSENCE</div><p>Beyond fragrance.<br/>An experience.</p></div><div><span>EXPLORE</span><button onClick={()=>ensureSection('collection')}>Collection</button><button onClick={()=>ensureSection('atelier')}>Personal Atelier</button><button onClick={()=>setQuiz(true)}>Scent Finder</button></div><div><span>DISCOVER</span><button onClick={()=>ensureSection('story')}>Our Universe</button><button onClick={()=>ensureSection('notes')}>The Composition</button><a href="mailto:nav.manshahia7@gmail.com">Contact</a></div><div><span>FOLLOW THE STORY</span><a href="mailto:nav.manshahia7@gmail.com"><Mail size={17}/> Write to us</a><p>A fictional fragrance house<br/>created as an interactive design concept.</p></div></div><div className="footer-bottom"><span>© 2026 ESSENCE. CONCEPT BRAND.</span><span>DESIGNED TO BE REMEMBERED.</span><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>BACK TO TOP ↑</button></div><div className="footer-oversized">ESSENCE</div></footer>
    <AnimatePresence>{toast && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="toast"><Check size={17}/>{toast}<button onClick={()=>setBag(true)}>VIEW BAG <ArrowRight size={14}/></button></motion.div>}</AnimatePresence>
    {bag && <CartDrawer items={cart} onClose={()=>setBag(false)} onQty={changeQty} onRemove={key=>setCart(prev=>prev.filter(i=>i.key!==key))} onCheckout={order}/>}
    {search && <SearchModal onClose={()=>setSearch(false)} onView={setView}/>}
    {view && <ProductModal key={view.id} fragrance={view} onClose={()=>setView(null)} onAdd={add} favorite={favorites.includes(view.id)} onFavorite={toggleFavorite}/>}
    {quiz && <Quiz onClose={()=>setQuiz(false)} onView={setView}/>}
  </div>;
}
