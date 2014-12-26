'use strict';

angular.module('myApp.detail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/detail/:id', {
		templateUrl: 'detail/detail.html',
		controller: 'DetailCtrl'
	});
}])

.controller('DetailCtrl', ['$scope', '$location', '$routeParams', 'GroupService', 'MessageService', 'LeaderboardService', 'MemberService', function($scope, $location, $routeParams, GroupService, MessageService, LeaderboardService, MemberService) {

	// setup details
	$scope.id = $routeParams.id;
	$scope.groups = GroupService.getGroups();
	$scope.muted = [];
	$scope.messages = [];
	// in case user gets to this link without going to the homepage first; must load groups 
	GroupService.fetchGroups().then(function(result) {
		$scope.groups = result;
		setup();
	});

	// functions
	var setup = function() {
		var group = $.grep($scope.groups, function(e){ return e.id == $scope.id; });
		if (group.length == 0) {
			console.log("Group not found");
		}
		else if (group.length > 0) {
			$scope.group = group[0];
			console.log($scope.group);
			$scope.members = $scope.group.members;
			console.log($scope.members);
			calcStats();
			$scope.processLeaderboard($scope.id, "day");
			processMessages();
			console.log($scope.messages);
		}
	}

	var calcStats = function() {
		$scope.img = $scope.group.image_url;
		$scope.msgcount = $scope.group.messages.count;
		$scope.pctMuted = calcMuted();
	}

	var calcMuted = function() {
		var muted = 0;
		var total = $scope.members.length;
		console.log($scope.members);
		for (var i = 0; i < $scope.members.length; i++) {
			if ($scope.members[i].muted) {
				muted++;
				$scope.muted.push($scope.members[i].nickname);
			}
		}
		var percentage = Math.round((muted/total) * 100);
		return percentage;
	}

	$scope.generateMemberPage = function(id) {
		console.log($scope.messages);
		console.log(id);
		var matches = _.where($scope.messages, {
			sender_id: id});
		console.log("Matches follow:");
		console.log(matches);
		MemberService.setMessages(matches);
		$location.path('/member/' + id)
	}

	var processMessages = function() {
		var pages = Math.ceil($scope.msgcount/100);
		var after_id = null;
		for (var i = 0; i < pages; i++) {
			MessageService.fetchMessages($scope.id, after_id).then(function(result) {
				var msgpg = result.data.response.messages;
				$scope.messages = $scope.messages.concat(msgpg);
				after_id = _.last(msgpg).id;
			});
		}
	}

	$scope.processLeaderboard = function(groupid, period) {
		LeaderboardService.fetchLeaderboard(groupid, period).then(function(result) {
			$scope.leaderboard = result.data.response.messages;
			if ($scope.leaderboard.length == 0) {
				$scope.noMessages = true;
			}
		});
	}

	// UI Logic

	$scope.isActive1 = true;
	$scope.isActive2 = false;
	$scope.isActive3 = false;

	$scope.toggleLb = function(index) {
		console.log(index);
		switch(index) {
			case 1: 
			$scope.isActive1 = true;
			$scope.isActive2 = false;
			$scope.isActive3 = false;
			break;
			case 2:
			$scope.isActive1 = false;
			$scope.isActive2 = true;
			$scope.isActive3 = false;
			break;
			case 3:
			$scope.isActive1 = false;
			$scope.isActive2 = false;
			$scope.isActive3 = true;
			break;
		}
	}
	
}]);