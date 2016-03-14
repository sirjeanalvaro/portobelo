var hash = window.location.pathname.split("/").pop(),
	_main = $("#main");

window.isMobile = function(){
    var deviceAgent = navigator.userAgent.toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
  
    if (agentID) return true;
    else return false;
};

jQuery(function($){
	var pageActive = "aSelected";

	$.each(_main.find("a"), function(){
		if($(this).attr("href")==hash) $(this).addClass(pageActive);
	});

	if(_main.find("a."+pageActive).length>0){
		_main.find("a."+pageActive).on("click", function(){
			return false;
		});
	};

	/* window-resize */
	var w = _main.width(),
		h = _main.height(),
		topo = $("#conteudo-topo"),
		navbar = topo.find("ul.navbar"),
		htmlBtNav = "<a href='#navbar' class='open-nav'>MENU</a>";

	topo.on("click", "a.open-nav", function(){
		if(navbar.is(":visible")) navbar.slideUp("fast");
		else navbar.slideDown("fast");
		return false;
	}).on("click", "li.box-nav", function(){
		var target = $(this);
		if(w<=410){
			if(target.find(".submenu").is(":visible")) target.find(".submenu").slideUp("fast");
			else target.find(".submenu").slideDown("fast");
		};
	});

	/* scroll-document */
	if(hash!=""&&hash!="home"&&hash!="main"){
		$("html,body").stop(true,true).animate({scrollTop:$("#centro").offset().top}, {duration:600});
	};

	/* resize-window */
	var fnResize = function(){
		w = _main.width();
		h = _main.height();
		if(w<=410){
			var aNav = topo.find("a.open-nav");
			if(aNav.length<=0){
				topo.append(htmlBtNav);
			};
			navbar.find("li.box-nav .submenu").css("display", "none");
		}else{
			var aNav = topo.find("a.open-nav");
			navbar.removeAttr("style").find("li.box-nav .submenu").removeAttr("style");
			if(aNav.length>0) aNav.remove();
		};
	};
	$(window).resize(fnResize);
	fnResize();
});