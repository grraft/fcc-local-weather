const temperatureImages = {
  'clear-day': { src: 'https://images.unsplash.com/photo-1486070952095-9cef22decedd?dpr=1&auto=format&fit=crop&w=1500&h=1029&q=80&cs=tinysrgb&crop='}, 
  'clear-night': { src: 'https://images.unsplash.com/photo-1441731803376-430fac71134d?dpr=1&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop='},
  'rain': { src: 'https://images.unsplash.com/photo-1486016006115-74a41448aea2?dpr=1&auto=format&fit=crop&w=1500&h=1004&q=80&cs=tinysrgb&crop='},
  'snow': { src: 'https://images.unsplash.com/photo-1444655632395-39cb88c88367?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop='},
  'sleet': { src: 'https://images.unsplash.com/photo-1482597869166-609e91429f40?dpr=1&auto=format&fit=crop&w=1500&h=1500&q=80&cs=tinysrgb&crop='},
  'wind': { src: 'https://images.unsplash.com/12/barley.jpg?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop='},
  'fog': { src: 'https://images.unsplash.com/photo-1415938631621-bc6316bd55f1?dpr=1&auto=format&fit=crop&w=1500&h=1001&q=80&cs=tinysrgb&crop='},
  'cloudy': { src: 'https://images.unsplash.com/uploads/14122598319144c6eac10/5f8e7ade?dpr=1&auto=format&fit=crop&w=1500&h=821&q=80&cs=tinysrgb&crop='},
  'partly-cloudy-day': { src: 'https://images.unsplash.com/photo-1487732051747-883a9d609c1e?dpr=1&auto=format&fit=crop&w=1500&h=994&q=80&cs=tinysrgb&crop='},
  'partly-cloudy-night': { src: 'https://images.unsplash.com/uploads/14125383307942ca04b48/2c169440?dpr=1&auto=format&fit=crop&w=1500&h=938&q=80&cs=tinysrgb&crop='},
  'hail': { src: 'https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?dpr=1&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop='}
}

const convertTemperature = (temperature, inCelsius) => {
  if (inCelsius) {
    return Math.floor((1.8*temperature)+32);
  } else {
    return Math.floor((temperature-32)*5/9);
  }
}

angular.module('app', []);

angular.module('app')
.controller("WeatherCtrl", function($scope, $http, dataService) {
  $scope.loading = true;
  $scope.error = false;
  $scope.inCelsuis = false; // weather api returns fahrenheit
  $scope.temperatureImages = temperatureImages;
  $scope.background = temperatureImages['hail'].src; // set default image
  $scope.convertTemperature = () => {
    $scope.temperature = convertTemperature($scope.temperature, $scope.inCelsuis);
    $scope.inCelsuis = !$scope.inCelsuis;
  }
  
  dataService.getCurrentPosition()
    .then((position) => {
      $scope.coords = position.coords;
      return dataService.getWeather(position.coords);
    })
    .catch(() => {
      $scope.loading = false;
      $scope.error = true;
    })
    .then((weather) => {
      if (weather) {
          $scope.loading = false;
          $scope.error = false;
          $scope.weather = weather;
          $scope.icon = weather.data.currently.icon;
        
          $scope.timezone = weather.data.timezone;
          $scope.temperature = weather.data.currently.temperature;
          $scope.convertTemperature();
          if (temperatureImages[weather.data.currently.icon]) {
            $scope.background = temperatureImages[weather.data.currently.icon].src;
          }
      } else {
        $scope.loading = false;
        $scope.error = true;
      }
    })
    .catch(() => {
      $scope.loading = false;
      $scope.error = true;
    });
})
.service('dataService', function($http, $q) {
  this.getCurrentPosition = function() {
    var deferred = $q.defer();
    if (!navigator.geolocation) {
        deferred.reject('Geolocation not supported.');
    } else {
      navigator.geolocation.getCurrentPosition(
        function (position) {
            deferred.resolve(position);
        },
        function (err) {
            deferred.reject(err);
        }
      );
    }
    return deferred.promise;
  }
  
  this.getWeather = function(coords) {
    const apiKey = '91220fadde76f436a058a631cd07814d';
    // crossorigin to allow calls from CodePen
    const weatherAPI = `https://crossorigin.me/https://api.darksky.net/forecast/${apiKey}/${coords.latitude},${coords.longitude}`;
    return $http({
      method: 'GET',
      url: weatherAPI,
    }).success(function(data){
      return data;
    }).error(function(){
      return null ;
    });
   }
 })
.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover',
                'top' : '0',
                'height' : '105vh',
            });
        });
    };
});