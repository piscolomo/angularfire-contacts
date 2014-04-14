angular.module('myapp', ['ngRoute', 'firebase'])
 
.value('fbURL', 'https://brilliant-fire-3723.firebaseio.com/')
 
.factory('Users', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
})
.factory('User', function($firebase, fbURL){
	return function(userId){
		return $firebase(new Firebase(fbURL + userId));
	}
})
 
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'ListCtrl',
      templateUrl:'list.html'
    })
    .when('/new', {
      controller:'CreateCtrl',
      templateUrl:'detail.html'
    })
    .when('/edit/:userId', {
      controller:'EditCtrl',
      templateUrl:'detail.html'
    }) 
    .otherwise({
      redirectTo:'/'
    });
})
 
.controller('ListCtrl', function($scope, Users) {
  $scope.users = Users;
})

.controller('CreateCtrl', function($scope, $location, $timeout, Users) {
  $scope.save = function() {
    Users.$add($scope.user, function() {
      $timeout(function() { $location.path('/'); });
    });
  };
})
.controller('EditCtrl',
  function($scope, $location, $routeParams, $firebase, User) {
    
    $scope.user = User($routeParams.userId);
 
    $scope.destroy = function() {
      $scope.user.$remove();
      $location.path('/');
    };
 
    $scope.save = function() {
      $scope.user.$save();
      $location.path('/');
    };
});