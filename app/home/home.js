'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl: 'home/home.html',
		controller: 'HomeCtrl'
	});
}])

.controller('HomeCtrl', ['$scope', '$http', 'GroupService', '$location', function($scope, $http, GroupService, $location) {
	GroupService.fetchGroups().then(function(result) {
		$scope.groups = result;
	});

	$scope.go = function (id) {
		console.log('/#detail/' + id);
		$location.path('/detail/' + id);
	};
}]);