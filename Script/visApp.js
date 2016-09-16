var app = angular.module("visApp", []);

app.controller("VisualizationCtrl", function($scope, $rootScope) {
    
    
    
    var log = [];
    angular.forEach(rendered[1], function(value, key) {
      this.push([key.replace("_", " "), value.color]);  
    }, log);
    
    $scope.filters = log;
    $rootScope.filterLog = [];
    
    $scope.broadcast = function(data, color, $event){
        
        if($rootScope.filterLog.indexOf(data) == -1){
            $rootScope.filterLog.push(data);
            $($event.target).css({"background-color":"rgb("+color+")"});
        }else{
            $rootScope.filterLog.splice($rootScope.filterLog.indexOf(data), 1);
        $($event.target).css({"background-color":"grey"});    
        }
        
        
        
        $rootScope.$broadcast('myCustomEvent',{
            category: data
        });
        
        
        
        
    }
    
    $scope.trackList = [
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
    
    
    
});



app.controller("LyricCtrl", function($scope, $rootScope){
    
    $scope.$on('updateLyric', function (event, data) {
            $scope.lyric = data.lyric;
//            console.log(data.color);
            $('#lyric-container').css({'background-color': 
"rgb(" + data.color[0] +","+ data.color[1]+ "," + data.color[2]+")"});
            $scope.$apply();
        
//    console.log("rgb(" + data.color[0] +","+ data.color[1]+ "," + data.color[2]+")");
        });

});