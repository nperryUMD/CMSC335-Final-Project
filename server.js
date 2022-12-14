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
    if(location == undefined || location == null || location.length == 0){
        location = "";
    }
    //do a query for a list of locations
    //temporary var
    var places = [{owner: "Nicholas Perry", street: "8204 Baltimore ave", city: "College Park", state: "Maryland", zip: "20740", cost: "50"}, 
                    {owner: "asdf asdfadsf", street: "232 vasedfd ave", city: "College Park", state: "Maryland", zip: "20740", cost: "80"},
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100"},
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100"},
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100"},
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100"}];
    
    var results = "";
    for(var i = 0; i < places.length; i++){
        results += "<div class='results'><p>Address: " + places[i].street + ", " + places[i].city + " " + places[i].state + " " 
                    + places[i].zip + "</p><p>Price: $" + places[i].cost + "/night</p><p>Owner: " + places[i].owner + "</p></div>";
    }
    
    response.render("search.ejs", {searchBar: location, searchResults: results});
});

app.get("/rentOutPlace", (request, response) =>{
    response.render("rentOutPlace.ejs");
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


