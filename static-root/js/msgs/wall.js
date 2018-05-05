var map; //global
var map_center;
var user_marker;
var user_ip;
var markers = [];
var no_geo = false;

function set_location(latlng)
{
	$.post("/user/locset/", latlng, function(success){
		console.log(success.msg);
		$("#cloc").html("<b>longitude: "+latlng.lng.toString()+" latitude: "+latlng.lat.toString()+"</b>");
	}).fail(function(err){
		console.log(err);
	});
}

function buildMap(position)
{	
	var user_latlng = {lat: position.coords.latitude, lng: position.coords.longitude};

	map = new google.maps.Map(document.getElementById('gmap'), {
		center: user_latlng,
		zoom: 8
	});

	map.setTilt(45);

	var marker = new google.maps.Marker({
		position: user_latlng,
		map: map,
		title: 'Current Position'
	});

	//markers.push(marker);

	user_marker = marker;

	map_center = map.getCenter();

	google.maps.event.addListenerOnce(map, 'idle', attachMapMeth);

	/*google.maps.event.addListener(map, 'zoom_changed', function() {
		console.log(map.getZoom());
		if (map.getZoom() < 8) map.setZoom(8);
 	});*/

	set_location(user_latlng);
}

function google_gupdate(){
	$.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA688RPX9jvR0fURyV_aQmGEk2YiG1kg0E", function(success) {
		var lat = success.location.lat; 
		var lng = success.location.lng;
		var latlng = new google.maps.LatLng(lat,lng);

		if(lat != user_marker.getPosition().lat() && lng != user_marker.getPosition().lng())
		{
			map.setCenter(new google.maps.LatLng(lat,lng));
			user_marker.setPosition(new google.maps.LatLng(lat,lng));
			set_location({lat: lat, lng: lng});
		}
		
	}).fail(function(err){
		var lat = 0.0; 
		var lng = 0.0;
		if(lat != user_marker.getPosition().lat() && lng != user_marker.getPosition().lng())
		{
			map.setCenter(new google.maps.LatLng(lat,lng));
			user_marker.setPosition(new google.maps.LatLng(lat,lng));
			set_location({lat: lat, lng: lng});
		}
	});
}

function ipapi_gupdate(){
	if(user_ip)
	{
		$.post("http://ip-api.com/json/"+user_ip, function(success) {
			var lat = success.lat; 
			var lng = success.lon;
			var latlng = new google.maps.LatLng(lat,lng);

			if(lat != user_marker.getPosition().lat() && lng != user_marker.getPosition().lng())
			{
				//map.setCenter(new google.maps.LatLng(lat,lng));
				user_marker.setPosition(new google.maps.LatLng(lat,lng));
				set_location({lat: lat, lng: lng});
			}
		}).fail(function(err){
			var lat = 0.0; 
			var lng = 0.0;
			if(lat != user_marker.getPosition().lat() && lng != user_marker.getPosition().lng())
			{
				//map.setCenter(new google.maps.LatLng(lat,lng));
				user_marker.setPosition(new google.maps.LatLng(lat,lng));
				set_location({lat: lat, lng: lng});
			}
		});
	}else{
		$.getJSON('//gd.geobytes.com/GetCityDetails?callback=?', function(data) {
			var uip = JSON.stringify(data, null, 2);
			$.post("http://ip-api.com/json/"+uip["geobytesremoteip"], function(success) {
				var lat = success.lat; 
				var lng = success.lon;
				var latlng = new google.maps.LatLng(lat,lng);

				if(lat != user_marker.getPosition().lat() && lng != user_marker.getPosition().lng())
				{
					//map.setCenter(new google.maps.LatLng(lat,lng));
					user_marker.setPosition(new google.maps.LatLng(lat,lng));
					set_location({lat: lat, lng: lng});
				}
			}).fail(function(err){
				var lat = 0.0; 
				var lng = 0.0;
				if(lat != user_marker.getPosition().lat() && lng != user_marker.getPosition().lng())
				{
					//map.setCenter(new google.maps.LatLng(lat,lng));
					user_marker.setPosition(new google.maps.LatLng(lat,lng));
					set_location({lat: lat, lng: lng});
				}
			});
		});
	}
}

function update_location(){
	var geoOptions = {
    	enableHighAccuracy: true
  	}
 
	if(no_geo == false){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var lat = parseFloat(position.coords.latitude); 
				var lng = parseFloat(position.coords.longitude);

				if(lat != user_marker.getPosition().lat() && lng != user_marker.getPosition().lng())
				{
					//map.setCenter(new google.maps.LatLng(lat,lng));
					user_marker.setPosition(new google.maps.LatLng(lat,lng));
					set_location({lat: lat, lng: lng});
				}
			}, function(){ buildMap({coords: {latitude: 0.0, longitude: 0.0}}); }, geoOptions);
	    } else {
	    	buildMap({coords: {latitude: 0.0, longitude: 0.0}});
	    }
	}
	
}

function attachMapMeth(){
	console.log("map loaded");
	getAllPosts();
	$(window).resize(function() {
		google.maps.event.trigger(map, "resize");
		map.setCenter(map_center);
	});

	setInterval(function(){ 
		getAllPosts();
	}, 3000);

	setInterval(function(){ 
		update_location();
	}, 1000);
}

function google_geoloc(){
	$.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA688RPX9jvR0fURyV_aQmGEk2YiG1kg0E", function(success) {
		buildMap({coords: {latitude: success.location.lat, longitude: success.location.lng}});
	}).fail(function(err){
		buildMap({coords: {latitude: 0.0, longitude: 0.0}});
	});
}

function ipapi_geoloc(){
	console.log("ipapi_geoloc");
	$.getJSON('//gd.geobytes.com/GetCityDetails?callback=?', function(data) {
		var uip = data;
		console.log(uip);
		user_ip = uip["geobytesremoteip"];
		console.log("http://ip-api.com/json/"+uip.geobytesremoteip);
		$.post("http://ip-api.com/json/"+uip.geobytesremoteip, function(success) {
			console.log(success);
			buildMap({coords: {latitude: success.lat, longitude: success.lon}});
		}).fail(function(err){
			buildMap({coords: {latitude: 0.0, longitude: 0.0}});
		});
	});
}
function initMap()
{
	var geoOptions = {
    	enableHighAccuracy: true
  	}

	if (navigator.geolocation) {
		console.log("geolocation used!");
		
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				coords: {
					latitude: parseFloat(position.coords.latitude),
					longitude: parseFloat(position.coords.longitude)
				}
			};
			buildMap(pos);
		}, function() {
			console.log("geolocation error - using ipapi");
			no_geo = true;
			buildMap({coords: {latitude: 0.0, longitude: 0.0}});
			//ipapi_geoloc();
			//google_geoloc();
		}, geoOptions);
    } else {
    	console.log("geolocation not found - using ipapi");
    	no_geo = true;
    	buildMap({coords: {latitude: 0.0, longitude: 0.0}});
    	//ipapi_geoloc();
    	//google_geoloc();
    }

	
}

function setMsgMarker(content, user, ulat, ulng, created){
	var pinColor = "00FF00";
    var pinImage = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    var pinShadow = new google.maps.MarkerImage("https://chart.googleapis.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));

	var infowindow = new google.maps.InfoWindow();

	var marker = new google.maps.Marker({
		position: {lat: parseFloat(ulat), lng: parseFloat(ulng)},
		map: map,
		title: 'Message From '+user+' '+created,
		icon: pinImage,
        shadow: pinShadow,
	});

	console.log(marker, infowindow, map);

	marker.addListener('click', function() {
		infowindow.setContent(content)
		infowindow.open(map, marker);
	});

	//markers.push(marker);

	// var options = {
 //        imagePath: 'images/m'
 //    };

	// var markerCluster = new MarkerClusterer(map, markers, options);

	// console.log(markerCluster);
}

function getAllPosts()
{
	$.post("/msgs/summon/", function(success) {
		present_msgs = []
		$("#mstream > div").each(function(){
			present_msgs.push($(this).attr("id"));
		});

		for(var i=0; i<success.posts.length; i++)
		{
			if($.inArray(success.posts[i].id, present_msgs) == -1)
			{
				var mhtml = "<div id='"+success.posts[i].id+"'><div class='row'><div class='col-sm-12 col-lg-12 mheader'>";
					mhtml +="<b>"+success.posts[i].user+"</b>&nbsp;<i>"+success.posts[i].created+"</i></div></div>";
					mhtml += "<div class='row'><div class='col-sm-12 col-lg-12 mcontent'>"+success.posts[i].content+"</div></div>";
					mhtml += "<div class='row mloc'><div class='col-sm-6 col-lg-6'>longitude: "+success.posts[i].longitude+"</div>";
					mhtml += "<div class='col-sm-6 col-lg-6'>latitude: "+success.posts[i].latitude+"</div></div>";
					mhtml += "</div><br>";

				console.log(map);
				mhtml += "</table><br>";
				$("#mstream").prepend(mhtml);
				$("#mstream").children(':first').hide().fadeIn(1500);

				var contentString = '<div id="content">'+
					'<div id="siteNotice">'+
					'</div>'+
					'<h1 id="firstHeading" class="firstHeading">'+success.posts[i].user+'</h1>'+
					'<div id="bodyContent">'+
					'<p><b>'+success.posts[i].created+'</b>,<p style="word-wrap: break-word;">'+success.posts[i].content+'</p><p>longitude '+success.posts[i].longitude+'<br />'+'latitude '+success.posts[i].latitude+'</p>'+
					'</div>'+
					'</div>';

			    setMsgMarker(contentString,success.posts[i].user,success.posts[i].latitude,success.posts[i].longitude,success.posts[i].created);
			}
			
		}
		
	}).fail(function(err){
		bootbox.alert(err);
	});
}

$(function(){
	$("#mpost").on('click', function(){
		$.post('/msgs/enchant/', {'content': $("#mcontent").val()}, function(success){
			getAllPosts();
			$("#mcontent").val("")
		}).fail(function(err){
			console.log(err);
		});
	});
});