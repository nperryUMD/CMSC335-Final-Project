let http = require("http");
let port_number = 5001;
let path = require("path");
let express = require("express");
const {ObjectId} = require('mongodb');
require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const databaseAndCollection = {db: "CMSC335_DB", collection:"AirBnB"};
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.syho2an.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

process.stdin.setEncoding("utf8");
let bodyparser = require("body-parser");
let app = express();

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:false}));



async function insertPlace(client, databaseAndCollection, place) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(place);
}

async function getById(client, databaseAndCollection, id) {
    let filter = {_id : ObjectId(id)};
    const result = client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .findOne(filter);

    return result;
}

async function getAll(client, databaseAndCollection) {
    let filter = {};
    const cursor = client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .find(filter);

    const result = await cursor.toArray();
    return result;
}

app.get("/", (request, response) => {
    response.render("index.ejs");
});

app.get("/search", async (request, response) => {
    var location = request.query.location;
    var results = "";
    if(location == undefined || location == null || location.length == 0){
        location = "";
    }

    let places;

    try {
        await client.connect();
        places = await getAll(client, databaseAndCollection);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    
    for(var i = 0; i < places.length; i++){
        results += "<div class='results'><image class='resultImages' src=" + places[i].image + "></image><button class='rentButton' onclick=\"rent('" + places[i]._id.toString() 
                    + "')\">Rent Me!</button><p class='topText'>Address: " + places[i].street + ", " + places[i].city + " " + places[i].state + " " + places[i].zip + "</p><p>" 
                    + places[i].bed + " beds, " + places[i].bath + " baths" + "</p><p>Price: $" + places[i].cost + "/night</p><p>Owner: " + places[i].owner + "</p></div>";
    }
    
    response.render("search.ejs", {searchBar: location, searchResults: results});
});

app.get("/manageProperty", (request, response) =>{
    response.render("manageProperty.ejs");
});

app.get("/rentPlace", async (request, response) =>{
    var id = request.query.id;
    if(id == undefined || id == null || id.length == 0){
        location = "";
        response.redirect("/search");
    }
    var place;

    try {
        await client.connect();
        place = await getById(client, databaseAndCollection, id);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    if(!place){
        response.redirect("/search");
    }

    var addy = place.street + ", " + place.city + " " + place.state + " " + place.zip;
    var bedBathText = place.bed + " beds, " + place.bath + " baths";
    var available = "";
    if(place.availablility){
        available = "<strong>available</strong>";
    }else{
        available = "<strong>not available</strong>";
    }


    // form to rent

    var form = "";
    

    response.render("rentPlace.ejs", {address: addy, bedBath: bedBathText, cost: place.cost, owner: place.owner, image: place.image, availablility: available});
});

app.post("/managePropertyAdded", async (request, response) =>{
    var name = request.body.name;
    var street = request.body.street;
    var city = request.body.city;
    var state = request.body.state;
    var zip = request.body.zip;
    var cost = request.body.cost;
    var bed = request.body.bed;
    var bath = request.body.bath;
    var image = request.body.image;
    var place = {owner: name, street: street, city: city, state: state, zip: zip, cost: cost, bed, bath, image: image, availablility: true};

    try {
        await client.connect();
        await insertPlace(client, databaseAndCollection, place);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
});

app.post("/managePropertyRemoved", async (request, response) =>{
    var name = request.body.name;
    var street = request.body.street;
    var city = request.body.city;
    var state = request.body.state;
    var zip = request.body.zip;
    
    var image = request.body.image;
    var place;

    if(place){

    }

});


app.post("/loadFakeData", async (request, response) =>{
    var places = [{owner: "Nicholas Perry", street: "8204 Baltimore ave", city: "College Park", state: "Maryland", zip: "20740", 
                    cost: "50", bed: "3", bath: "2", image: "https://odis.homeaway.com/odis/destination/5941b1e0-2600-4b2a-b27e-c667abf7e510.carousel-m.jpg", availablility: true}, 
                    
                    {owner: "asdf asdfadsf", street: "232 vasedfd ave", city: "College Park", state: "Maryland", zip: "20740", 
                    cost: "80", bed: "3", bath: "2", image: "https://i0.wp.com/files.tripstodiscover.com/files/2021/07/Bamboo-House-Netflix.jpg?resize=784%2C521", availablility: true},
                    
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", cost: "100", bed: "3", bath: "2", 
                    image: "https://www.southernliving.com/thmb/eOuNUEM15ZXO2hDAK7oXVVR17Fc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gettyimages-525981286-2000-dac41913bef747e78a797b341dc3708d.jpg", 
                    availablility: true},
                    
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", 
                    cost: "100", bed: "3", bath: "2", image: "https://images.ctfassets.net/gxwgulxyxxy1/7Dhves120IEQzq3Zz7yOo6/64f12e4d88f4ac268f6d842dcf807aa9/lake-1453079_1280.jpg", availablility: true},
                    
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", 
                    cost: "100", bed: "3", bath: "2", image: "https://www.fortunebuilders.com/wp-content/uploads/2021/04/best-places-to-buy-vacation-rental-property.jpg", availablility: true},
                    
                    {owner: "scooby do", street: "705 church st", city: "sipper bark", state: "Virginia", zip: "20368", 
                    cost: "100", bed: "3", bath: "2", image: "https://wp-tid.zillowstatic.com/18/FL_TPA_HISTORIC_KENWOOD_82561_239_qrt-d7969b.jpg", availablility: true}];
    
    try {
        await client.connect();

        for(var i = 0; i < places.length; i++){
            await insertPlace(client, databaseAndCollection, places[i]);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    
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


