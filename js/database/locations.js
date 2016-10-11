var data = {
	"san francisco" :
	[
		{
			name: "Golden Gate Bridge",
			lat: "37.819929",
			long: "-122.478255"
		},
		{
			name: "Alcatraz",
			lat: "37.826723",
			long: "-122.421067"
		},
		{
			name: "Fisherman's Wharf",
			lat: "37.808",
			long: "-122.417743"
		},
		{
			name: "Union Square",
			lat: "37.787994",
			long: "-122.407437"
		},
		{
			name: "Chinatown",
			lat: "37.794138",
			long: "-122.407791"
		},
		{
			name: "Californa Academy of Sciences",
			lat: "37.769865",
			long: "-122.466095"
		},
		{
			name: "AT&T Park",
			lat: "37.778595",
			long: "-122.38927"
		},
		{
			name: "Ferry Building",
			lat: "37.795581",
			long: "-122.393411"
		},
		{
			name: "Civic Center",
			lat: "37.779587",
			long: "-122.417349"
		},
		{
			name: "Golden Gate Park",
			lat: "37.769421",
			long: "-122.486214"
		}
	],
	"new york" :
	[
		{
			name: "Empire State Building",
			lat: "",
			long: ""
		},
		{
			name: "Statue of Liberty",
			lat: "",
			long: ""
		},
		{
			name: "Central Park",
			lat: "",
			long: ""
		},
		{
			name: "Rockefeller Center",
			lat: "",
			long: ""
		},
		{
			name: "National September 11 Memorial & Museum",
			lat: "",
			long: ""
		},
		{
			name: "Brooklyn Bridge",
			lat: "",
			long: ""
		},
		{
			name: "Madison Square Garden",
			lat: "",
			long: ""
		},
		{
			name: "Yankee Stadium",
			lat: "",
			long: ""
		},
		{
			name: "Metropolitan Museum of Art",
			lat: "",
			long: ""
		},
		{
			name: "St. Patrick's Cathedral",
			lat: "",
			long: ""
		}
	],
	"los angeles" :
	[
		{
			name: "Hollywood Sign",
			lat: "34.134115",
			long: "-118.321548"
		},
		{
			name: "Hollywood Walk of Fame",
			lat: "34.101286",
			long: "-118.342173"
		},
		{
			name: "Echo Park Lake",
			lat: "34.072873",
			long: "-118.260519"
		},
		{
			name: "3rd Street Promenade",
			lat: "34.016364",
			long: "-118.497027"
		},
		{
			name: "Venice Canals",
			lat: "33.983258",
			long: "-118.466494"
		},
		{
			name: "STAPLES Center",
			lat: "34.043018",
			long: "-118.267254"
		},
		{
			name: "Rodeo Drive",
			lat: "34.073408",
			long: "-118.407677"
		},
		{
			name: "Griffith Observatory",
			lat: "34.119322",
			long: "-118.300152"
		},
		{
			name: "LACMA",
			lat: "34.063932",
			long: "-118.359229"
		},
		{
			name: "The Getty Center",
			lat: "34.078036",
			long: "-118.474095"
		}
	],
	"miami" :
	[
		{
			name: "Zoo Miami",
			lat: "25.607127",
			long: "-80.399279"
		},
		{
			name: "Coral Castle",
			lat: "25.500334",
			long: "-80.444308"
		},
		{
			name: "Freedom Tower",
			lat: "25.780273",
			long: "-80.189669"
		},
		{
			name: "Miracle Mile",
			lat: "25.749524",
			long: "-80.258694"
		},
		{
			name: "Jungle Island",
			lat: "25.785703",
			long: "-80.174355"
		},
		{
			name: "Miami Seaquarium",
			lat: "25.734409",
			long: "-80.164814"
		},
		{
			name: "American Airlines Arena",
			lat: "25.781401",
			long: "-80.186969"
		},
		{
			name: "Bayfront Park",
			lat: "25.774949",
			long: "-80.185988"
		},
		{
			name: "Fairchild Tropical Botanic Garden",
			lat: "25.676931",
			long: "-80.272787"
		},
		{
			name: "Marlins Park",
			lat: "25.778205",
			long: "-80.22054"
		}
	]
}

// Add favorite key to each item/location in each city in data

for (var key in data) {
	if (data.hasOwnProperty(key)) {
		for (var i = 0; i < data[key].length; i++) {
			data[key][i].favorite = false;
		}
	}
}