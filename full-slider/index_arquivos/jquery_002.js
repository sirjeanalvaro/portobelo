jQuery(function($){

	var $container 	= $("div#banner"),
		$slide		= $container.find("ul#content-image"),
		$controls 	= $container.find("div#content-controls"),
		_selected 	= "selected",
		_transition = "trans",
		index		= 0,
		timer		= null,
		_widthA 	= $(window).width(),
		_height 	= $slide.height(),
		easeArr 	= ["easeOutCirc", "easeOutQuart", "easeOutBack", "easeOutBack", "easeOutBounce", "easeOutCubic", "easeOutSine"],
		posArr 		= ["left", "right", "bottom", "top"],
		durArr 		= [450, 600, 750, 900, 1100, 800, "slow"];

	var limit, elementStyle, _round, speed;

	limit = Number($slide.find("li").length -1);
	$slide.find("li").eq(index).addClass(_selected);

	// nav click
	var definerotate = function(){
		clearTimeout(timer);

		if(index >= limit){
			index = 0;
			setStopPlayVideo();
		} else {
			index++;
			startTrans();
		};
	};

	//rondom animation
	var startTrans = function(){
		_round 	= Math.floor(Math.random() * posArr.length);
		_widthA = $(window).width();
		speed 	= 900;
		_height = $slide.height();

		// clear timer
		clearTimeout(timer);

		switch(posArr[_round]){
			case "right":
			case "top":
				elementStyle = {"left":Number(_widthA * -1), "top":0};
				break;
			
			default: // bottom - left
				elementStyle = {"left":_widthA, "top":0};
		};

		$controls.removeClass(_selected).eq(index).addClass(_selected);


		var objRepeat = $slide.find( "li" );


		/* animacao-elementos */
		objRepeat.removeClass( _transition ).filter( "." + _selected ).addClass( _transition ).removeClass( _selected );
		objRepeat.eq( index ).addClass( _selected ).css( elementStyle ).animate({ left:0, top:0 }, { duration:speed, easing:easeArr[_round], complete:function(){
				setTimeout(exeRotate, 500); 
			} });


		/*
		$slide.find("li.trans").find("div.center-slide").fadeOut(200);
		$slide.find("li").eq(index).addClass(_selected); // .find(".banner-center > div:not('.cb')").hide();
		$slide.find("li."+_selected).css(elementStyle).animate({ left:0, top:0 }, {duration:speed, easing:easeArr[_round], complete:function(){ setTimeout(exeRotate, 700); } });
		*/

		//if($slide.find("li."+_selected).hasClass("video")) fnResize();

	}, exeRotate = function(){ 	// set transition

		var _visible 	= $slide.find("li:visible .banner-center"),
			_style 		= undefined;

		
		$slide.find( "li" ).removeClass( "animated trans" ).filter( "." + _selected ).addClass( "animated" ).find( "div.center-slide" ).fadeOut(200);


		/*jQuery.each(_visible.find(" > div:not('.cb')"), function(ind, obj){
			
			$(obj).css("visibility","hidden").show();

			_round = Math.floor(Math.random() * easeArr.length);
			_style = getSetStyle( $(obj) );

			$(obj).css(_style["newStyle"]).show().delay(500 * ind).animate(_style["default"], { duration:durArr[_round], easing:easeArr[_round], complete:function(){$(this).removeAttr("style");} });
			
		});*/

		/*
		//conceito-simonetto
		if(isMobile() && _visible.find(".conceito-fundo").length > 0){
			_visible.find(".conceito-fundo").find("img").css({"height":Number(_visible.height()) });
		};
		*/

		//slideShow
		clearTimeout(timer);
		if( !$slide.find("li.video").is(":visible") ){
			
			var durationTimer 	= 9000,
				newTimer 		= $slide.find("li").filter( "." + _selected ).data("timer");

			if(newTimer != undefined) durationTimer = newTimer;

			clearTimeout(timer);
			timer = setTimeout(definerotate, durationTimer);

		};

	}, getSetStyle = function(TARGET){

		var nn = Math.random(1).toFixed(2);

		if(nn<0.4) nn=0;
		else if(nn>0.4 || nn>0.7) nn = nn*-1;

		var style = {
			"default" : {
				"left"		: TARGET.position().left,
				"top"		: TARGET.position().top,
				"opacity"	: 1,
				"rotate" 	: 0
			}, "newStyle" : {
				"left"		: Math.floor(nn * 280),
				"top"		: 0,
				"visibility": "visible",
				"opacity"	: 0,
				"rotate" 	: nn
			}
		};

		return style;

	}, setStopPlayVideo = function(){ /* play or pause video */
		
		if(containerVideo.length > 0){
			if(index==0) containerVideo.get(0).play();
    		else containerVideo.get(0).pause();
		};

		if(limit >= 1) startTrans();

	};

	// VIDEO
	var mainVideo 		= $slide.find("li.video"),
		containerVideo 	= mainVideo.find("video#example_video_1_html5_api"),
		intervalVideo 	= null;

	// resize video	
	var fnResize = function(){
		var largura 	= mainVideo.width(),
			novaAltura 	= Number(largura * mainVideo.height() / largura);

		mainVideo.find("#example_video_1").css({"height":mainVideo.height(), "width":largura}).find("video#example_video_1_html5_api").css({"width":largura, "height":"auto"});
		
		// se altura do video for menor que o bloco
		if(novaAltura < containerVideo.height()){
			//containerVideo.css({"height":novaAltura});
		};
		
	}, tamanhoVideo = function(){

		fnResize(); 	// resize video window
		if(containerVideo.height() < mainVideo.height()){
			clearInterval(intervalVideo);
		};

	}, removeVideo = function(){

		mainVideo.removeClass("video").find("#example_video_1, span.grid-video").remove();
		clearTimeout(timer);
		timer = setTimeout(definerotate, 10000);

	}, 

	init = function(){ //init banner
		if(limit >= 1){
			var _html = "";
			$.each($slide.find("li"), function(ind, obj){
				_html += "<a href='#veja-mais'><span>" + Number(ind+1) + "</span></a>";
			});
			
			$controls.html(_html).find("a:eq('0')").addClass(_selected);
			$controls = $controls.find( "a" );

		} else $controls.empty();


		if(!$slide.find("li").eq(index).hasClass("video")) startTrans();

		// Support Video true
		if( Modernizr.video && containerVideo.length ){

			containerVideo.get(0).play(); 		// play video

	    	// add event video complete
	        containerVideo.on("ended", function(e){
				index = 1;
				setStopPlayVideo();
			});
			fnResize();							// resize video

			intervalVideo = setInterval(tamanhoVideo, 500);

		} else {

			removeVideo();

		};

		var h = Number( $slide.find("li").eq(0).height() ).toFixed();
		$container.animate({ "height":h }, { "duration":200, complete:function(){
			setTimeout(function(){ $container.removeAttr( "style" ); }, 1600);
		}});


	}();

	$(window).resize(function(){ fnResize(); });
	fnResize();


	// clicked controles banner
	$controls.on("click", function (event){
		var ind = $(this).index();

		if(!$slide.find("li").is(":animated") && ind!=index){
			index = ind;
			clearTimeout(timer);
    		($slide.find("li.video").is(":visible") || index==0) ? setStopPlayVideo() : startTrans();
		};

    	return false;
    });

	$slide.on("mouseenter", function(){
		clearTimeout(timer);
	}).on("mouseleave", function(){
		if(!$slide.find("li.video").is(":visible")){
			var durationTimer 	= 9000,
				newTimer 		= $slide.find("li:visible").data("timer");

			if(newTimer != undefined) durationTimer = newTimer;

			clearTimeout(timer);
			timer = setTimeout(definerotate, durationTimer);
		};
	});

	$(window).load(function(){
		
		if ( containerVideo.length < 1 ) return false; 

		containerVideo.get(0).play();

        if(containerVideo.get(0).readyState != 4){
        	if($slide.find("li.video").length > 0) removeVideo(); //remove video
        } else {
        	mainVideo.removeAttr("style"); 		//remove background
        };

    });

    if(window.isMobile()){
        removeVideo();
    };

});




