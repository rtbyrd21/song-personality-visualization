jQuery.fn.scrollTo = function(elem, speed) { 
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
    }, speed == undefined ? 1000 : speed); 
    return this; 
};

jQuery.fn.extend({
    getPath: function () {
        var path, node = this;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) { 
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});

var app = angular.module("visApp", []);

app.controller("VisualizationCtrl", function($scope, $rootScope, $timeout) {
    
    
    $timeout(function(){
        $rootScope.$broadcast('currentSong',{
        song: 0
    }); 
    }, 1000);
    
    
    $rootScope.index = 0;
    
    
    $scope.navClass = function (points) {

        if (points > 80){
            return '';
        }else{
            return 'non-essential';
        }
    };  
   
    
    $scope.filters = [];
    
    
    
    $scope.$on('currentSong', function (event, data) {
        if ($scope.filters.length){
            $scope.filters = [];
        }
        
        for( var k in rendered[data.song]) {    
            var point = rendered[data.song][k]["points"].length; 
            var color = rendered[data.song][k]["color"]
            $scope.filters.push({key: k.replace("_", " "), color: color, amount: point});
        };
        $rootScope.index = data.song;
        $rootScope.currentTrack = $rootScope.trackList[data.song];
        $scope.$apply();
    });
    
    
    $rootScope.filterLog = [];
    
    $rootScope.currentTrackData;
    

$rootScope.determineSelectedFilters = function(){

    angular.forEach(selectedFilters, function(value, key){
        
        $('.filter').each(function(){
            if ($(this).attr('data') == value.filter){
                $(this).css({"background-color":"rgb("+value.color+")"});
            
            };
        });
    });
}    
    
    var selectedFilters = [];
    $scope.broadcast = function(data, color, $event){
        selectedFilters = [];
        if($rootScope.filterLog.indexOf(data) == -1){
            $rootScope.filterLog.push(data);
            selectedFilters.push({filter: data, color: color});
            $($event.target).css({"background-color":"rgb("+color+")"});
        }else{
            $rootScope.filterLog.splice($rootScope.filterLog.indexOf(data), 1);
        $($event.target).css({"background-color":"grey"}); 
            
        }
        
        
        
        $rootScope.$broadcast('myCustomEvent',{
            category: data,
            filterLog: $rootScope.filterLog
        });
        
        
        
        
    }
    
    

    
    $rootScope.trackList = [
    "Dreams Come True Girl",
    "Prima Donna",
    "You Saved My Life",
    "Don't Vote",
    "The Executioner's Song",
    "Harmonia",
    "My Sister, My Spouse",
    "Lionkiller Got Married",
    "Eavesdropping on the Competition",
    "Jonesy Boy",
    "One Way to Go"    
    ]
    
    
    
    $rootScope.currentTrack = $rootScope.trackList[0];
    
    
    
    
    
});



app.controller("LyricCtrl", function($scope, $rootScope){

    
$scope.lyrics = rendered[$rootScope.index]['cold']['lyrics'][0];
    
    
$scope.lyric = null;    
    
$scope.inactive = true;
    
    $scope.$on('updateLyric', function (event, data) {
            $scope.lyric = data.lyric;
//            console.log(data.color);
//            $('#lyric-container').css({'background-color': 
//"rgb(" + data.color[0] +","+ data.color[1]+ "," + data.color[2]+")"});
        
            $($(".lyric-line")).each(function(){
                $(this).css({'color': 'black'}).css({'opacity': '1'});
            });
            
            $($(".lyric-line")[data.index]).css({'color': 
"rgb(" + data.color[0] +","+ data.color[1]+ "," + data.color[2]+")"}).siblings().css({'opacity': '.3'});

        
            var path = ".line" + [data.index];
//            $("#lyric-lines").scrollTo(path, 1000);
//        
//            $("#song-lyrics").scrollTo(path,1000);
        
            var container = $("#song-lyrics"),
            scrollTo = $(path);

            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );

            
        
        
            $scope.$apply();
            resetInterval();
        });
    
    
timer = setInterval(function () {
    $scope.lyric = null;   
    $scope.$apply();
 }, 3000);      
    
    
function resetInterval() {
     clearInterval(timer);
     timer = setInterval(function () {
        $scope.lyric = null;
        $($(".lyric-line")).each(function(){
                $(this).css({'color': 'black'}).css({'opacity': '1'});
            }); 
        $scope.$apply();
     }, 3000); 
 }

});



app.directive("offset", function ($window, $rootScope) {
    return function(scope, element, attrs) {
      
        $('#album').on("scroll", function() {
            $rootScope.determineSelectedFilters();
            if($(element).offset().left < 300 && $(element).offset().left > 0){
               var currentSong = attrs.id.replace('track', '');
               $rootScope.$broadcast('currentSong',{
                    song: currentSong
                });   
            }
            
        });
    };
});


app.directive("skipTrack", function ($window, $rootScope) {
    return function(scope, element, attrs) {
        $(element).on("click", function() {
            if (attrs.skipTrack == "forward"){
                $rootScope.index ++;

                $rootScope.currentTrack = $rootScope.trackList[$rootScope.index];
                
                scope.$apply();
                $('#album').animate({
                    scrollLeft: $("#defaultCanvas" + $rootScope.index).offset().left * $rootScope.index
                }, 1000);
                
                
            }else{
                $rootScope.index --;
                $rootScope.currentTrack = $rootScope.trackList[$rootScope.index];
                scope.$apply();
                $('#album').animate({
                    scrollLeft: 900 * $rootScope.index
                }, 1000);
            
            }
        });
    };
});



app.filter('orderByKey', [function () {
    return function (input) {
        if (!angular.isUndefined(input)) {
            var tmpInput = [];
            angular.forEach(input, function(value, key){
                tmpInput.push(key[2]);
            });
            tmpInput.sort();
            console.log()
            var tmpOutput = [];
            angular.forEach(tmpInput, function(key){
                tmpOutput.push(input[key]);
            });
            return tmpOutput;
        } else {
            return input;
        }
    };
}]);



app.directive("stickTo", function ($window, $rootScope) {
    return function(scope, element, attrs) {
        $(element).fixTo('#song-lyrics');
    };
});