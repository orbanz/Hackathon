angular.module('appMaps', ['uiGmapgoogle-maps'])

  .controller("mapCtrl", ["$scope", "$http", "uiGmapLogger", "uiGmapObjectIterators",
    function ($scope,$http, logger, uiGmapObjectIterators) {
      logger.doLog = true;
      logger.currentLevel = logger.LEVELS.debug;
      var lastId = 1;
      var clusterThresh = 6;
      $scope.showList = true;
      $scope.actCanteen;

      $scope.map = {
        doCluster: true,
        options: {
          streetViewControl: false,
          panControl: false,
          maxZoom: 18,
          minZoom: 3
        },
        events: {
          idle: function () {
            if ($scope.map.zoom <= clusterThresh) {
              if (!$scope.map.doCluster) {
                $scope.map.doCluster = true;
                $scope.searchResults.results = [];
              }
            }
            else {
              if ($scope.map.doCluster) {
                $scope.map.doCluster = false;
                $scope.searchResults.results = [];
              }
            }
            $scope.addMarkers();
          }
        },
        center: {
          latitude: 50.8434830,
          longitude: 4.3825600
        },
        clusterOptions: {},
        zoom: 15
      };

      $scope.searchResults = {
        results: {
          length: 0
        }
      };


      $scope.addMarkers = function () {
        var markers = {};
        var i = 0;
        $http.get('json/canteens.json')//load model with delay
    .success(function(data) {

        console.log(data);
        $scope.canteenData = data;
        for(i=0; i<data.Canteens.length;i++) {
          markers[data.Canteens[i].CanteenID] ={
            'coords': {
              'latitude': data.Canteens[i].latitude,
              'longitude': data.Canteens[i].longitude
            },
            'key': 'someKey-' + lastId
          };
          lastId++;
        }
        lastId = 1;//reset
        markers.length = data.Canteens.length;
        
        $scope.searchResults.results = uiGmapObjectIterators.slapAll(markers);

    });         

        $http.get('json/menu.json')//load model with delay
    .success(function(data) {

        console.log(data);
        $scope.menuData = data;
    });         

      };
      
      $scope.reset = function () {
        lastId = 1;
        $scope.searchResults = {
          results: {
            length: 0
          }
        };
      };

      $scope.clicked = function ( canteenId) {
        $scope.actCanteen = $scope.searchCanteen(canteenId);
        $scope.showList = false;
      };

      $scope.searchCanteen = function(canteenId) {
        for(i=0; i<$scope.canteenData.Canteens.length;i++) {
          if ($scope.canteenData.Canteens[i].CanteenID == canteenId) {
            return $scope.canteenData.Canteens[i];
          }
        }
      };
    }
  ]);
