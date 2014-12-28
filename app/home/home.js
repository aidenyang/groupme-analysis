'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl: 'home/home.html',
		controller: 'HomeCtrl'
	});
}])

.controller('HomeCtrl', ['$scope', '$http', 'GroupService', '$location', '$routeParams', 'AuthService', function($scope, $http, GroupService, $location, $routeParams, AuthService) {

	var token = $routeParams.access_token;
	if (token == null) {
		$scope.loggedIn = false;
	}
	else {
		$scope.loggedIn = true;
		AuthService.setToken(token);
		GroupService.fetchGroups().then(function(result) {
			$scope.groups = result;
		});

	}

	$scope.go = function (id) {
		$location.path('/detail/' + id);
	};
}]);