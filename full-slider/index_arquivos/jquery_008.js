(function(e){e.fn.fadeTo=function(t){var n=e.extend({},e.fn.fadeTo.defaults,t),r=this,i=r.find(n.imagens),s=r.find(n.controles),o=n.selecionado,u=n.effect,a=n.durationEffect,f=n.indice,l=n.speedTime;var c=i.is("ul")?"li":"img",h=Number(i.find(c).length-1),p=null,d=String("active");if(!i.find(c).eq(0).is(":visible")){i.find(c).eq(0).addClass(o);s.find("a").eq(0).addClass(o)}var v=function(){f=f>=h?0:f+1;m()},m=function(){if(i.find(c).eq(f).length==0)f=0;y();s.find("a").removeClass(o).eq(f).addClass(o);g()},g=function(){if(h>0){clearTimeout(p);p=setTimeout(v,l)}else s.fadeOut("fast")},y=function(){switch(u){case"slide":i.find(c+":visible").removeClass(d).slideUp(a).end().find(c).eq(f).addClass(d).slideDown(a);break;case"showHide":i.find(c+":visible").removeClass(d).hide().end().find(c).eq(f).addClass(d).show();break;default:i.find(c+":visible").removeClass(d).fadeOut(a).end().find(c).eq(f).addClass(d).fadeIn(a)}};s.on("click","a",function(){var t=e(this).index();if(!i.is(":animated")&&t!=f){f=t;m()}return false});r.on("mouseenter",function(){s.stop().animate({opacity:1},{duration:200});clearTimeout(p)}).on("mouseleave",function(){s.stop().animate({opacity:.5},{duration:200});g()});f!=0?m():g();return this};e.fn.fadeTo.defaults={imagens:".content-slide",controles:".controls-slide",selecionado:"selected",effect:"fade",durationEffect:"fast",indice:0,speedTime:7e3}})(jQuery)