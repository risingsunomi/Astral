// just for visual/dynamic map display - no user interaction or geolocation tracking
var map; //global

function buildMap(position)
{	
	map = new google.maps.Map(document.getElementById('gmap'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 2
	});

	map.setTilt(45);

	google.maps.event.addListenerOnce(map, 'idle', attachMapMeth);
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

	//console.log(marker, infowindow, map);

	marker.addListener('click', function() {
		infowindow.setContent(content)
		infowindow.open(map, marker);
	});
}

function getAllPosts()
{
	$.post("/msgs/phoenix/", function(success) {
		if(success.posts)
		{
			present_msgs = []
			$("#mstream > div").each(function(){
				console.log($(this).attr("id"));
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

					$("#mstream").prepend(mhtml);
					$("#mstream").children(':first').hide().fadeIn('slow');

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
		}
		
		
	}).fail(function(err){
		bootbox.alert(err);
	});
}

function attachMapMeth(){
	console.log("map loaded");
	getAllPosts();

	setInterval(function(){ 
		getAllPosts();
	}, 3000);
}