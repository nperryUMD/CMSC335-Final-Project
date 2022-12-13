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


