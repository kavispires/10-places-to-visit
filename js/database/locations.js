var database = {
	"San Francisco" :
	[
		{
			title: "Alcatraz",
			coord: {
				lat: "37.826723",
				lng: "-122.421067"
			}
		},
		{
			title: "AT&T Park",
			coord: {
				lat: "37.778595",
				lng: "-122.38927"
			}
		},
		{
			title: "California Academy of Sciences",
			coord: {
				lat: "37.769865",
				lng: "-122.466095"
			}
		},
		{
			title: "Chinatown",
			coord: {
				lat: "37.794138",
				lng: "-122.407791"
			}
		},
		{
			title: "Civic Center",
			coord: {
				lat: "37.779587",
				lng: "-122.417349"
			}
		},
		{
			title: "Ferry Building",
			coord: {
				lat: "37.795581",
				lng: "-122.393411"
			}
		},
		{
			title: "Fisherman's Wharf",
			coord: {
				lat: "37.808",
				lng: "-122.417743"
			}
		},
		{
			title: "Golden Gate Bridge",
			coord: {
				lat: "37.819929",
				lng: "-122.478255"
			}
		},
		{
			title: "Golden Gate Park",
			coord: {
				lat: "37.769421",
				lng: "-122.486214"
			}
		},
		{
			title: "Union Square",
			coord: {
				lat: "37.787994",
				lng: "-122.407437"
			}
		},	
	],
	"New York City" :
	[
		{
			title: "Brooklyn Bridge",
			coord: {
				lat: "40.706086",
				lng: "-73.996864"
			}
		},
		{
			title: "Central Park",
			coord: {
				lat: "40.771133",
				lng: "-73.974187"
			}
		},
		{
			title: "Empire State Building",
			coord: {
				lat: "40.748441",
				lng: "-73.985664"
			}
		},
		{
			title: "Madison Square Garden",
			coord: {
				lat: "40.750505",
				lng: "-73.993439"
			}
		},
		{
			title: "National September 11 Memorial & Museum",
			coord: {
				lat: "40.71058",
				lng: "-74.015583"
			}
		},
		{
			title: "Rockefeller Center",
			coord: {
				lat: "40.75861",
				lng: "-73.978209"
			}
		},
		{
			title: "St. Patrick's Cathedral",
			coord: {
				lat: "40.758545",
				lng: "-73.976299"
			}
		},
		{
			title: "Statue of Liberty",
			coord: {
				lat: "40.6892",
				lng: "-74.0445"
			}
		},
		{
			title: "The Metropolitan Museum of Art",
			coord: {
				lat: "40.779437",
				lng: "-73.963244"
			}
		},
		{
			title: "Yankee Stadium",
			coord: {
				lat: "40.829643",
				lng: "-73.926174"
			}
		},
	],
	"Los Angeles" :
	[
		{
			title: "3rd Street Promenade",
			coord: {
				lat: "34.016364",
				lng: "-118.497027"
			}
		},
		{
			title: "Echo Park Lake",
			coord: {
				lat: "34.072873",
				lng: "-118.260519"
			}
		},
		{
			title: "The Getty Center",
			coord: {
				lat: "34.078036",
				lng: "-118.474095"
			}
		},
		{
			title: "Griffith Observatory",
			coord: {
				lat: "34.119322",
				lng: "-118.300152"
			}
		},
		{
			title: "Hollywood Sign",
			coord: {
				lat: "34.134115",
				lng: "-118.321548"
			}
		},
		{
			title: "Hollywood Walk of Fame",
			coord: {
				lat: "34.101286",
				lng: "-118.342173"
			}
		},
		{
			title: "LACMA",
			coord: {
				lat: "34.063932",
				lng: "-118.359229"
			}
		},
		{
			title: "Rodeo Drive",
			coord: {
				lat: "34.073408",
				lng: "-118.407677"
			}
		},
		{
			title: "STAPLES Center",
			coord: {
				lat: "34.043018",
				lng: "-118.267254"
			}
		},
		{
			title: "Venice Canals",
			coord: {
				lat: "33.983258",
				lng: "-118.466494"
			}
		},
	],
	"Miami" :
	[
		{
			title: "American Airlines Arena",
			coord: {
				lat: "25.781401",
				lng: "-80.186969"
			}
		},
		{
			title: "Bayfront Park",
			coord: {
				lat: "25.774949",
				lng: "-80.185988"
			}
		},
		{
			title: "Coral Castle",
			coord: {
				lat: "25.500334",
				lng: "-80.444308"
			}
		},
		{
			title: "Fairchild Tropical Botanic Garden",
			coord: {
				lat: "25.676931",
				lng: "-80.272787"
			}
		},
		{
			title: "Freedom Tower",
			coord: {
				lat: "25.780273",
				lng: "-80.189669"
			}
		},
		{
			title: "Jungle Island",
			coord: {
				lat: "25.785703",
				lng: "-80.174355"
			}
		},
		{
			title: "Marlins Park",
			coord: {
				lat: "25.778205",
				lng: "-80.22054"
			}
		},
		{
			title: "Miami Seaquarium",
			coord: {
				lat: "25.734409",
				lng: "-80.164814"
			}
		},
		{
			title: "Miracle Mile",
			coord: {
				lat: "25.749524",
				lng: "-80.258694"
			}
		},
		{
			title: "Zoo Miami",
			coord: {
				lat: "25.607127",
				lng: "-80.399279"
			}
		},
	]
}

// Add favorite key to each item/location in each city in data
// Turn coordinates into numbers (not strings)

for (var key in database) {
	if (database.hasOwnProperty(key)) {
		for (var i = 0; i < database[key].length; i++) {
			database[key][i].coord.lng = Number(database[key][i].coord.lng);
			database[key][i].coord.lat = Number(database[key][i].coord.lat);
			database[key][i].index = i;
			database[key][i].favorite = ko.observable(false);
			database[key][i].highlight = ko.observable(false);
			database[key][i].filtered = ko.observable(true);
			database[key][i].address = '?';
		}
	}
}