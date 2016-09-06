var http = require('http');
var express = require('express');
var app = module.exports.app = express();
var sentiment = require('sentiment');
var axios = require('axios');
var bodyParser = require('body-parser');
var path    = require("path");
var chroma = require("chroma-js");
var _ = require('underscore');
var server = http.createServer(app);
var io = require('socket.io')(server);
var request = require('request');
server.listen(8080); 


var colors = [["#7B0051"], ['#007A87'], ['#00D1c1'], ['#8CE071'], ['#FFB400'], ['#FFAA91'], ['#B4A76C']];



Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/View'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/p5', function (req, res) {
  res.sendFile(path.join(__dirname+'/Sketch/index.html'));
});

app.post('/api/text', function (req, res) {
      
  var score = sentiment(req.body.data).score;
  var numberInRange = score.map(-4, 4, 0, 1)    
  var random = _.random(0, 6);

  var color = colors[random][0];

  
  var color0 = chroma(color);
  var color1 = chroma(color).darken();
  var color2 = chroma(color).darken(2);
  var color3 = chroma(color).darken(3);  
  var color4 = chroma(color).darken(4); 
    
  if(color > .5){
   color0 = chroma(color);
   color1 = chroma(color).brighted();
   color2 = chroma(color).brighted(2);
   color3 = chroma(color).brighted(3);  
   color4 = chroma(color).brighted(4);     
  
  }    
  
  res.send({color: [color0, color1, color2, color3, color4], data: sentiment(req.body.data)});
});





function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
//    response.setHeader('Content-Type', 'application/json');
    return { "data": info };
  }
}
 



app.post('/liwc', function(req,res){

    request({
      method: 'POST',    
      url: 'https://app.receptiviti.com/api/content',
      headers: {
        'X-API-KEY': '57c58b95d17a8405ce35981d',
        'X-API-SECRET-KEY': 'kUpgCeKug1ZvrCjEEpTVwwDJSkBsXyBHCJ6Crdudlfg'
      },
      formData: {
      content_source: 1,
      language_content: req.body.lyric  
    }      
    }, function(error, response, body){
        if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        res.json({ "data": info });
      }  
    });
})






// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    var time = null;
    socket.on('lyric',
      function(data) {
            time = data.time;
            request({
              method: 'POST',    
              url: 'https://app.receptiviti.com/api/content',
              headers: {
                'X-API-KEY': '57c58b95d17a8405ce35981d',
                'X-API-SECRET-KEY': 'kUpgCeKug1ZvrCjEEpTVwwDJSkBsXyBHCJ6Crdudlfg'
              },
              formData: {
              content_source: 1,
              language_content: data.data  
            }      
            }, function(error, response, body){
                if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                io.sockets.emit('lyric', {"data":info, "lyric":data, "time":time});    
              }  
            });
      }
    );
    
    
    socket.on('annyang',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'annyang' " + data);
      
        // Send it to all other clients
        
        
        
        
        var score = sentiment(data).score;

        io.sockets.emit('annyang', score);
        
        
        // This is a way to send to everyone including sender
        // io.sockets.emit('message', "this goes to everyone");

      }
    );
    
    socket.on('song', function(data) {
        
      for(var i = 0; i < data.length; i++){
        var score = {lyric: data[i], score: sentiment(data[i])};  
        io.sockets.emit('lyricAnalyzed', score);
        console.log(data[i]);  
    } 
        
      
    });
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
    

    
  }
);

