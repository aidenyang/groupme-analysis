'use strict';

angular.module('myApp.member', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/member/:id', {
		templateUrl: 'member/member.html',
		controller: 'MemberCtrl'
	});
}])

.controller('MemberCtrl', ['$scope', '$routeParams', 'MemberService', function($scope, $routeParams, MemberService) {
	$scope.messages = MemberService.getMessages();
	console.log($scope.messages);
}]);