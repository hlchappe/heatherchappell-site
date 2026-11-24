(function(){
  document.querySelectorAll('pre').forEach(function(pre){
    var b=document.createElement('button'); b.className='copy'; b.type='button'; b.textContent='Copy';
    b.addEventListener('click',function(){
      var t=pre.querySelector('code')?pre.querySelector('code').innerText:pre.innerText;
      (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy'},1500)},function(){
        var r=document.createRange(); r.selectNodeContents(pre); var s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent='Selected';});
    });
    pre.appendChild(b);
  });
  var nb=document.querySelector('.navbtn'), side=document.querySelector('.side');
  if(nb&&side){nb.addEventListener('click',function(){var o=side.classList.toggle('open');nb.setAttribute('aria-expanded',o)});
    side.addEventListener('click',function(e){if(e.target.closest('a'))side.classList.remove('open')});}
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={}; links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.remove('on')}); var a=map[e.target.id]; if(a)a.classList.add('on');}})},{rootMargin:'-80px 0px -70% 0px'});
    document.querySelectorAll('.doc h2[id]').forEach(function(h){io.observe(h)});
  }
  var q=document.getElementById('q');
  if(q){
    var idx=null, out=document.getElementById('results');
    fetch('search-index.json').then(function(r){return r.json()}).then(function(d){idx=d; if(q.value)run();});
    function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
    function run(){
      if(!idx)return; var t=q.value.trim().toLowerCase(); out.innerHTML='';
      if(t.length<2)return;
      var words=t.split(/\s+/), hits=[];
      idx.forEach(function(s){var hay=(s.h+' '+s.t).toLowerCase(); if(words.every(function(w){return hay.indexOf(w)>-1})){
        var i=s.t.toLowerCase().indexOf(words[0]); var snip=s.t.slice(Math.max(0,i-60),i+120);
        hits.push('<li><a href="'+s.u+'">'+esc(s.d)+' · '+esc(s.h)+'<small>'+esc(snip)+'</small></a></li>');}});
      out.innerHTML=hits.slice(0,40).join('')||'<li><small>No matches.</small></li>';
    }
    q.addEventListener('input',run);
  }
})();
