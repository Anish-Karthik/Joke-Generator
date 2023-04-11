const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {

    const category = req.body.category;
    const flags = {
        nsfw: req.body.nsfw,
        religious: req.body.religious,
        political: req.body.political,
        racist: req.body.racist,
        sexist: req.body.sexist,
        explicit: req.body.explicit
    };
    
    var flagsQuery = "";
    for (var key in flags) {
        if (flags[key] == "on") {
            flagsQuery += "&blacklistFlags="+key;
        }
    }
    const lang = req.body.lang;
    var type = req.body.type;
    if(type == "both" || type == undefined) {
        type = "";
    }else {
        type = "&type="+type;
    }

    const url = "https://v2.jokeapi.dev/joke/"+category+"?amount=1"+flagsQuery+"&lang="+lang+type;

    console.log(url);
    https.get(url, (response) => {

        console.log(response.statusCode);
        response.on('data', (data) => {

            const jokeData = JSON.parse(data);
            
            if(jokeData.type == "single") {
                res.write("<h1>" + jokeData.joke + "</h1>");
            } else {
                res.write("<h1>" + jokeData.setup + "</h1>");
                res.write("<h1>" + jokeData.delivery + "</h1>");
            }
            res.write("<a href='/'>Back to home</a>");
            res.send(); 
        });

    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});