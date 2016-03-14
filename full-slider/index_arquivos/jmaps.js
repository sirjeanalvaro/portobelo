var counter = 0,
	markers = [],
    marker = null,
	iNum = 0,
	htmlContent = [],
	index = null;

var boxListagem = $("div.boxListagem"), State = "", City = "", map=null, iconMaker=null, typeMapa=$("input#mapaType").val();

typeMapa = (typeMapa == undefined) ? "" : typeMapa;

var styles = [
	[{
	    url: 'map/markerClusterer.png',
	    height: 26,
	    width: 26,
	    opt_anchor: [16, 0],
	    textColor: '#ffffff'
	}]
],
requisitionPoint = function(iN){
	$.ajax({
        url: "busca-unidades.php",
        type: "POST",
        data: {
            "tipo": typeMapa,
            "quem": iN
        },
        success: function (data) {
            if(data!="complete"){

                var dados = data.split("[LOCATION]"),
                    htmlInfo = dados[0],
                    location = dados[1],
                    latLng = location.split("|"),
                    markerOptions = {
                        "map": map,
                        "icon": iconMaker,
                        "position": new google.maps.LatLng(latLng[0], latLng[1])
                    };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker);
                htmlContent.push(htmlInfo);

                if(boxListagem.length) boxListagem.append(htmlInfo);

                marker.infowindow = new google.maps.InfoWindow({ content:htmlInfo, maxHeight:160 });
                google.maps.event.addListener(marker, "click", function(event){
                    // close-openInfobox
                    if(typeof (openInfobox) != 'undefined') openInfobox.close();

                    marker = this;
                    marker.infowindow.open(map, marker);
                    openInfobox = marker.infowindow;

                    var center = marker.getPosition();
                    map.panTo(center);

                    if(map.getZoom()<10) map.setZoom(10);
                });

                iNum++;
                requisitionPoint(iNum);

            }else{
            	//var markerCluster = new MarkerClusterer(map, markers, { styles:styles[0] });
            };
        }
    });
}, init = function(){
    var center = new google.maps.LatLng(-21, -55),
    z = ( typeMapa == 'UNIDADES' ) ? 5 : 4;
    options = {
        scrollwheel: false,
        'zoom': z,
        'center': center,
        'mapTypeId': google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), options);
    iconMaker = new google.maps.MarkerImage('map/icon-map.png', new google.maps.Size(20, 24), new google.maps.Point(0, 0), new google.maps.Point(10, 24));

    if( !boxListagem.length ) boxListagem.empty();

    requisitionPoint(iNum);
}(); // auto-start


jQuery(function($){
    // open-infoBox
    var infoPreview = function(){
        marker.infowindow = new google.maps.InfoWindow({ content:htmlContent[index] });

        if(typeof (openInfobox)!='undefined') openInfobox.close();

        marker.infowindow.open(map, markers[index]);
        openInfobox = markers[index].infowindow;

        var center = markers[index].getPosition();
        map.panTo(center);

        if(map.getZoom()<6) map.setZoom(6);
    };

    if(boxListagem.length){
        $(boxListagem).on("click", ".info", function(){
            index = $(this).index();
            infoPreview();
            return false;
        });
    };

});




