'use strict';

angular.module('myApp.member', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/member/:id', {
		templateUrl: 'member/member.html',
		controller: 'MemberCtrl'
	});
}])

.controller('MemberCtrl', ['$scope', '$routeParams', 'GroupService', 'MessageService', 'LeaderboardService', function($scope, $routeParams, GroupService, MessageService, LeaderboardService) {

}]);