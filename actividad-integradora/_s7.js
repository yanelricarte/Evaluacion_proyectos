window.addEventListener('load',function(){setTimeout(function(){
 var W=document.documentElement.clientWidth, o=[];
 var sw=document.documentElement.scrollWidth;
 o.push(sw>W+2?('DESBORDA la página '+sw+'>'+W):'ok');
 var malos=[];
 document.querySelectorAll('*').forEach(function(e){
  if(e.offsetParent===null) return;
  var r=e.getBoundingClientRect();
  if(r.right>W+2 && r.width>40 && e.children.length===0) malos.push(e.tagName+'.'+String(e.className).split(' ')[0]);
  if(e.scrollWidth>e.clientWidth+2 && getComputedStyle(e).overflowX==='visible' && e.children.length===0) malos.push('recorte:'+e.tagName);
 });
 if(malos.length) o.push('elementos fuera: '+malos.slice(0,5).join(', '));
 // cuerpo de texto
 var tam={};
 document.querySelectorAll('p,li').forEach(function(e){ if(e.offsetParent===null) return;
   if(e.textContent.trim().length<120) return;
   var f=Math.round(parseFloat(getComputedStyle(e).fontSize)); tam[f]=(tam[f]||0)+1;});
 var mej=null,c=0; for(var k in tam) if(tam[k]>c){c=tam[k];mej=k}
 o.push('cuerpo='+(mej||'?')+'px');
 document.title='SONDA::'+o.join(' | ');
},600);});
