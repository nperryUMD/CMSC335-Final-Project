let http = require("http");
let port_number = 5001;
let path = require("path");
let express = require("express");

process.stdin.setEncoding("utf8");
let bodyparser = require("body-parser");
let app = express();

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:false}));

app.get("/", (request, response) => {
    response.render("index.ejs");
});

app.get("/search", (request, response) => {
    var location = request.query.location;
    var results = "";
    if(location == undefined || location == null || location.length == 0){
        location = "";
    }
    //do a query for a list of locations
    //temporary var
    var places = [{id: "1", owner: "Nicholas Perry", street: "8204 Baltimore ave", city: "College Park", state: "Maryland", zip: "20740", cost: "50", image: "https://odis.homeaway.com/odis/destination/5941b1e0-2600-4b2a-b27e-c667abf7e510.carousel-m.jpg"}, 
                    {id: "2", owner: "asdf asdfadsf", street: "232 vasedfd ave", city: "College Park", state: "Maryland", zip: "20740", cost: "80", image: "https://i0.wp.com/files.tripstodiscover.com/files/2021/07/Bamboo-House-Netflix.jpg?resize=784%2C521"},
                    {id: "3", owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100" ,image: "https://www.southernliving.com/thmb/eOuNUEM15ZXO2hDAK7oXVVR17Fc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gettyimages-525981286-2000-dac41913bef747e78a797b341dc3708d.jpg"},
                    {id: "4", owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100", image: "https://images.ctfassets.net/gxwgulxyxxy1/7Dhves120IEQzq3Zz7yOo6/64f12e4d88f4ac268f6d842dcf807aa9/lake-1453079_1280.jpg"},
                    {id: "5", owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100", image: "https://www.fortunebuilders.com/wp-content/uploads/2021/04/best-places-to-buy-vacation-rental-property.jpg"},
                    {id: "6", owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100", image: "https://wp-tid.zillowstatic.com/18/FL_TPA_HISTORIC_KENWOOD_82561_239_qrt-d7969b.jpg"}];
    
    
    for(var i = 0; i < places.length; i++){
        results += "<div class='results'><image class='resultImages' src=" + places[i].image + "></image><button class='rentButton' onclick='rent(" + places[i].id + ")'>Rent Me!</button><p>Address: " 
                    + places[i].street + ", " + places[i].city + " " + places[i].state + " " 
                    + places[i].zip + "</p><p>Price: $" + places[i].cost + "/night</p><p>Owner: " + places[i].owner + "</p></div>";
    }
    
    response.render("search.ejs", {searchBar: location, searchResults: results});
});

app.get("/rentOutPlace", (request, response) =>{
    response.render("rentOutPlace.ejs");
});

app.get("/rentPlace", (request, response) =>{
    response.render("rentPlace.ejs");
});


http.createServer(app).listen(port_number);
console.log(`Web server started and running at http://localhost:${port_number}`);
console.log("Stop to shutdown the server: ");

process.stdin.on('data', (data) => {
        let input = data;
    
        if (input !== null) {
            let command = input.trim();
            switch (command){
                case "stop":
                    console.log("Shutting down the server");
                    process.exit(0);
                default:
                    console.log(`Invalid command: ${command}`);
                    console.log("Stop to shutdown the server: ");
                    process.stdin.resume();
            }
        }
});


