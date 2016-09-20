app.controller("Visualization", function($scope, $rootScope) {

var canvasWidth = 900;   
var canvasHeight = 720;    
    
    
var a = function(p) {

  var index = 0;    
  var length = songLength[index];
  var hit = false;
  var lyric = [rendered[index]['body_focus']["lyrics"], rendered[index]['body_focus']["time"]]; 
    
    
  p.setup = function() {
    p.frameRate(30);  
    p.createCanvas(canvasWidth + 15, canvasHeight);
    reSetup();    
  };
    
  
    
var reSetup = function(){
      p.noStroke();
        
        for( var k in rendered[index]) {    
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 

            
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                var yPos = p.map(item[1], -500, canvasHeight, 0, canvasHeight);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1] + 100, item[2] * item[4], item[3] * item[4]);
            })
                       
}
    
      
var lyric = [rendered[index]['body_focus']["lyrics"], rendered[index]['body_focus']["time"]];      

var timeSigs = [];
      
    lyric.forEach(function(item){
            
            if(item != undefined){
                var timeBegin;
                var timeEnd;
                var log = [];
                item[1].forEach(function(time, i){
                    
                    timeBegin = p.map(item[1][i], 0, length, 0, canvasWidth);   
                    timeEnd = p.map(item[1][i + 1], 0, length, 0, canvasWidth);   
                    
                    log.push([ timeBegin, timeEnd]);
                });    
                timeSigs.push(log);
            }
        }); 
      

timeSigs.forEach(function(item){
    var rLog = [];
    var gLog = [];
    var bLog = [];
    var red;
    var green;
    var blue;
    item.forEach(function(time){
      
        for( var k in rendered[index]) {
                  
                var point = rendered[index][k]["points"]; 
                var color = rendered[index][k]["color"];
                point.forEach(function(j){
                    var position = j[0];
                    if(position > time[0] && position < time[1]){
                        rLog.push(color[0]);
                        gLog.push(color[1]);
                        bLog.push(color[2]);
                        var sum = 0;
                        if(rLog.length){
                            for(var i = 0; i < rLog.length; i++){
                                sum += parseInt(rLog[i]);
                            }
                            var rAvg = Math.floor(sum/rLog.length);
                        }
                        red = rAvg;



                        var gSum = 0;
                        if(gLog.length){
                            for(var i = 0; i < gLog.length; i++){
                                gSum += parseInt(gLog[i]);
                            }
                            var gAvg = Math.floor(gSum/gLog.length);
                        }
                        green = gAvg;


                        var bSum = 0;
                        if(bLog.length){
                            for(var i = 0; i < bLog.length; i++){
                                bSum += parseInt(bLog[i]);
                            }
                            var bAvg = Math.floor(bSum/bLog.length);
                        }
                        blue = bAvg;

                       
                        
                    }
                })
              averageColor = [red, green, blue];
            
              if (!rendered[index][k]["lyrics"][2]){
                rendered[index][k]["lyrics"][2] = [];
              }
                
              rendered[index][k]["lyrics"][2].push(averageColor);
        }
    }); 
    
    
});

}    
    
    
    
$scope.$on('myCustomEvent', function (event, data) {
        p.background(255);
        for( var k in rendered[index]) {
            var myVal = k.replace("_", " ");   
            $rootScope.filterLog.forEach(function(item){
            
            if (item == myVal){
                
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1], item[2] * item[4], item[3] * item[4]);
            })
            }; 
                
            });  
            
        }  
    
    
        if(!$rootScope.filterLog.length){
        for( var k in rendered[index]) {    
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 

            
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1], item[2] * item[4], item[3] * item[4]);
            })
                    
            
        }
        
        
        }
    
});  
    
    
    
    
    
    
    
p.draw = function() {      

    hit = false;
            
            lyric.forEach(function(item){
                if(item != undefined){
                item[1].forEach(function(time, i){
                    var position = p.map(time, 0, length, 0, canvasWidth);     
                
                p.stroke(100);    
                p.fill(255,255,255,70);    
                p.rect(position, 20, 20, 20);    
                p.noStroke();  
                    
               hit = p.collidePointRect(p.mouseX,p.mouseY,position,20,20,20);
                if(hit){
                    $rootScope.$broadcast('updateLyric',{
                        lyric: item[0][i], color: item[2][i], index: i
                    }); 
                    p.fill(0);
                    p.rect(position, 20, 20, 20);
                };
                    
                });    
                
                }
            });   

      
  };
};  
    
var b = function(p) {

  var index = 1;    
  var length = songLength[index];
  var hit = false;
  var lyric = [rendered[index]['body_focus']["lyrics"], rendered[index]['body_focus']["time"]]; 
    
    
  p.setup = function() {
    p.frameRate(30);  
    p.createCanvas(canvasWidth + 15, canvasHeight);
    reSetup();    
  };
    
  
    
var reSetup = function(){
      p.noStroke();
        
        for( var k in rendered[index]) {    
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 

            
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                var yPos = p.map(item[1], -500, canvasHeight, 0, canvasHeight);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1] + 100, item[2] * item[4], item[3] * item[4]);
            })
                       
}
    
      
var lyric = [rendered[index]['body_focus']["lyrics"], rendered[index]['body_focus']["time"]];      

var timeSigs = [];
      
    lyric.forEach(function(item){
            
            if(item != undefined){
                var timeBegin;
                var timeEnd;
                var log = [];
                item[1].forEach(function(time, i){
                    
                    timeBegin = p.map(item[1][i], 0, length, 0, canvasWidth);   
                    timeEnd = p.map(item[1][i + 1], 0, length, 0, canvasWidth);   
                    
                    log.push([ timeBegin, timeEnd]);
                });    
                timeSigs.push(log);
            }
        }); 
      

timeSigs.forEach(function(item){
    var rLog = [];
    var gLog = [];
    var bLog = [];
    var red;
    var green;
    var blue;
    item.forEach(function(time){
      
        for( var k in rendered[index]) {
                  
                var point = rendered[index][k]["points"]; 
                var color = rendered[index][k]["color"];
                point.forEach(function(j){
                    var position = j[0];
                    if(position > time[0] && position < time[1]){
                        rLog.push(color[0]);
                        gLog.push(color[1]);
                        bLog.push(color[2]);
                        var sum = 0;
                        if(rLog.length){
                            for(var i = 0; i < rLog.length; i++){
                                sum += parseInt(rLog[i]);
                            }
                            var rAvg = Math.floor(sum/rLog.length);
                        }
                        red = rAvg;



                        var gSum = 0;
                        if(gLog.length){
                            for(var i = 0; i < gLog.length; i++){
                                gSum += parseInt(gLog[i]);
                            }
                            var gAvg = Math.floor(gSum/gLog.length);
                        }
                        green = gAvg;


                        var bSum = 0;
                        if(bLog.length){
                            for(var i = 0; i < bLog.length; i++){
                                bSum += parseInt(bLog[i]);
                            }
                            var bAvg = Math.floor(bSum/bLog.length);
                        }
                        blue = bAvg;

                       
                        
                    }
                })
              averageColor = [red, green, blue];
            
              if (!rendered[index][k]["lyrics"][2]){
                rendered[index][k]["lyrics"][2] = [];
              }
                
              rendered[index][k]["lyrics"][2].push(averageColor);
        }
    }); 
    
    
});

}    
    
    
    
$scope.$on('myCustomEvent', function (event, data) {
        p.background(255);
        for( var k in rendered[index]) {
            var myVal = k.replace("_", " ");   
            $rootScope.filterLog.forEach(function(item){
            
            if (item == myVal){
                
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1], item[2] * item[4], item[3] * item[4]);
            })
            }; 
                
            });  
            
        }  
    
    
        if(!$rootScope.filterLog.length){
        for( var k in rendered[index]) {    
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 

            
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1], item[2] * item[4], item[3] * item[4]);
            })
                    
            
        }
        
        
        }
    
});  
    
    
    
    
    
    
    
p.draw = function() {      

    hit = false;
            
            lyric.forEach(function(item){
                if(item != undefined){
                item[1].forEach(function(time, i){
                    var position = p.map(time, 0, length, 0, canvasWidth);     
                
                p.stroke(100);    
                p.fill(255,255,255,70);    
                p.rect(position, 20, 20, 20);    
                p.noStroke();  
                    
               hit = p.collidePointRect(p.mouseX,p.mouseY,position,20,20,20);
                if(hit){
                    $rootScope.$broadcast('updateLyric',{
                        lyric: item[0][i], color: item[2][i]
                    }); 
                    p.fill(0);
                    p.rect(position, 20, 20, 20);
                };
                    
                });    
                
                }
            });   

      
  };
};       
    
    
var c = function(p) {

  var index = 2;    
  var length = songLength[index];
  var hit = false;
  var lyric = [rendered[index]['body_focus']["lyrics"], rendered[index]['body_focus']["time"]]; 
    
    
  p.setup = function() {
    p.frameRate(30);  
    p.createCanvas(canvasWidth + 15, canvasHeight);
    reSetup();    
  };
    
  
    
var reSetup = function(){
      p.noStroke();
        
        for( var k in rendered[index]) {    
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 

            
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                var yPos = p.map(item[1], -500, canvasHeight, 0, canvasHeight);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1] + 100, item[2] * item[4], item[3] * item[4]);
            })
                       
}
    
      
var lyric = [rendered[index]['body_focus']["lyrics"], rendered[index]['body_focus']["time"]];      

var timeSigs = [];
      
    lyric.forEach(function(item){
            
            if(item != undefined){
                var timeBegin;
                var timeEnd;
                var log = [];
                item[1].forEach(function(time, i){
                    
                    timeBegin = p.map(item[1][i], 0, length, 0, canvasWidth);   
                    timeEnd = p.map(item[1][i + 1], 0, length, 0, canvasWidth);   
                    
                    log.push([ timeBegin, timeEnd]);
                });    
                timeSigs.push(log);
            }
        }); 
      

timeSigs.forEach(function(item){
    var rLog = [];
    var gLog = [];
    var bLog = [];
    var red;
    var green;
    var blue;
    item.forEach(function(time){
      
        for( var k in rendered[index]) {
                  
                var point = rendered[index][k]["points"]; 
                var color = rendered[index][k]["color"];
                point.forEach(function(j){
                    var position = j[0];
                    if(position > time[0] && position < time[1]){
                        rLog.push(color[0]);
                        gLog.push(color[1]);
                        bLog.push(color[2]);
                        var sum = 0;
                        if(rLog.length){
                            for(var i = 0; i < rLog.length; i++){
                                sum += parseInt(rLog[i]);
                            }
                            var rAvg = Math.floor(sum/rLog.length);
                        }
                        red = rAvg;



                        var gSum = 0;
                        if(gLog.length){
                            for(var i = 0; i < gLog.length; i++){
                                gSum += parseInt(gLog[i]);
                            }
                            var gAvg = Math.floor(gSum/gLog.length);
                        }
                        green = gAvg;


                        var bSum = 0;
                        if(bLog.length){
                            for(var i = 0; i < bLog.length; i++){
                                bSum += parseInt(bLog[i]);
                            }
                            var bAvg = Math.floor(bSum/bLog.length);
                        }
                        blue = bAvg;

                       
                        
                    }
                })
              averageColor = [red, green, blue];
            
              if (!rendered[index][k]["lyrics"][2]){
                rendered[index][k]["lyrics"][2] = [];
              }
                
              rendered[index][k]["lyrics"][2].push(averageColor);
        }
    }); 
    
    
});

}    
    
    
    
$scope.$on('myCustomEvent', function (event, data) {
        p.background(255);
        for( var k in rendered[index]) {
            var myVal = k.replace("_", " ");   
            $rootScope.filterLog.forEach(function(item){
            
            if (item == myVal){
                
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1], item[2] * item[4], item[3] * item[4]);
            })
            }; 
                
            });  
            
        }  
    
    
        if(!$rootScope.filterLog.length){
        for( var k in rendered[index]) {    
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 

            
            point.forEach(function(item){
                var xPos = p.map(item[0], 0, point[point.length - 1][0], 0, canvasWidth);
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(xPos, item[1], item[2] * item[4], item[3] * item[4]);
            })
                    
            
        }
        
        
        }
    
});  
    
    
    
    
    
    
    
p.draw = function() {      

    hit = false;
            
            lyric.forEach(function(item){
                if(item != undefined){
                item[1].forEach(function(time, i){
                    var position = p.map(time, 0, length, 0, canvasWidth);     
                
                p.stroke(100);    
                p.fill(255,255,255,70);    
                p.rect(position, 20, 20, 20);    
                p.noStroke();  
                    
               hit = p.collidePointRect(p.mouseX,p.mouseY,position,20,20,20);
                if(hit){
                    $rootScope.$broadcast('updateLyric',{
                        lyric: item[0][i], color: item[2][i]
                    }); 
                    p.fill(0);
                    p.rect(position, 20, 20, 20);
                };
                    
                });    
                
                }
            });   

      
  };
};          
    
    
var d = function(p) {
    
  var x = 100; 
  var y = 100;
  var index = 4;    
    
  p.setup = function() {
    p.createCanvas(canvasWidth, canvasHeight);
        p.noStroke();
        for( var k in rendered[index]) {    
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 
            point.forEach(function(item){
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(item[0], item[1], item[2] * item[4], item[3] * item[4]);
            })
            
        }


  };
    
$scope.$on('myCustomEvent', function (event, data) {
        p.background(255);
        for( var k in rendered[index]) {
            var myVal = k.replace("_", " ");   
            $rootScope.filterLog.forEach(function(item){
            
            if (item == myVal){
                
            var point = rendered[index][k]["points"]; 
            var color = rendered[index][k]["color"]; 
            point.forEach(function(item){
                p.fill(color[0],color[1],color[2], 60);
                p.ellipse(item[0], item[1], item[2] * item[4], item[3] * item[4]);
            })
            }; 
                
            });            
        }  
});  
     
    
    

  p.draw = function() {
      
  };
};
    


var myp5 = new p5(a, 'track0'); 
var myp5 = new p5(b, 'track1');    
var myp5 = new p5(c, 'track2');  
var myp5 = new p5(d, 'track4');    
    
});