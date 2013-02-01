document.documentElement.id = 'js';

$(function(){

	// Tweets

	$.fn.tweets = function( q ) {
		var list = $( this ),
			url = 'http://search.twitter.com/search.json?q=%23' + q + '&rpp=20&callback=?';
		$.getJSON( url, function( data ) {
			$.each( data.results, function( i, item ) {
				var user = item.from_user,
					image = item.profile_image_url,
					text = item.text;
				text = text.replace(
					/(^|\s)(?:#([\d\w_]+)|@([\d\w_]{1,15}))|(https?:\/\/[^\s"]+[\d\w_\-\/])|([^\s:@"]+@[^\s:@"]*)/gi,
					function( all, space, hashtag, username, link, email ) {
						var res = '<a href="mailto:' + email + '">' + email + "</a>";
							hashtag && (res = space + '<a href="http://search.twitter.com/search?q=%23' + hashtag + '">#' + hashtag + "</a>");
							username && (res = space + '<a href="http://twitter.com/' + username + '">@' + username + "</a>");
							link && (res = '<a href="' + encodeURI(decodeURI(link.replace(/<[^>]*>/g, ""))) + '">' + link + "</a>");
						return res;
					}
				);
				list.append(
					'<li><a href="http://twitter.com/' +
					user + '" title="' +
					user + '"><img src="' +
					image + '"></a>' +
					text + '</li>'
				);
			});
		});
	};

	$('#twitter').find('ul').tweets('-RT%20wstdays');

	// Map

	$.fn.map = function() {
		var map = document.getElementById( this.selector.substr( 1 ) );

		if(typeof map === 'undefined' || map === null) {
			return;
		}

		var query = map.firstChild.src.split('?')[1].split('&'),
			ymap,
			mapData = {},
			centerCoords = {},
			marker = {
			};

		for (var i=0, prop, queryLength = query.length; i < queryLength; i++ ) {
			prop = query[i].split('=');
			mapData[prop[0]] = prop[1];
		}

		centerCoords = {
			lng: mapData.ll.split(',')[0],
			lat: mapData.ll.split(',')[1]
		};

		marker.coords = {
			lng: mapData.pt.split(',')[0],
			lat: mapData.pt.split(',')[1]
		};

		marker.point = [marker.coords.lat, marker.coords.lng];

		marker.style = {
			iconImageHref:"/static/i/map-logo.png",
			iconImageSize:[93, 83],
			iconImageOffset:[-24, -83],
			iconShadow:true,
			iconShadowImageHref:"/static/i/map-shadow.png",
			iconShadowImageSize:[93, 83],
			iconShadowImageOffset:[-24, -83]
		};

		ymaps.ready(function () {
			map.removeChild(map.firstChild);
			ymap = new ymaps.Map(map, {
				center: [centerCoords.lat, centerCoords.lng],
				zoom: mapData.z
			});

			marker.placemark = new ymaps.Placemark(marker.point, {}, marker.style);

			ymap.geoObjects.add(marker.placemark);

			ymap.controls.add('smallZoomControl',
				{left: '8px', top: '24px'});

			if (mapData.l === 'pmap') {
				ymap.setType('yandex#publicMap');
			}
		});
	};

	$('#map').map();

	// Donate

	$('a[href=#donate]').click(function(){
		$('#donate').toggleClass('target');
		return false;
	});

});
