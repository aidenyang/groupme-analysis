'use strict';

angular.module('myApp.detail', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/detail/:id', {
		templateUrl: 'detail/detail.html',
		controller: 'DetailCtrl'
	});
}])

.controller('DetailCtrl', ['$scope', '$location', '$routeParams', 'GroupService', 'MessageService', 'LeaderboardService', 'MemberService', 'AuthService', function($scope, $location, $routeParams, GroupService, MessageService, LeaderboardService, MemberService, AuthService) {
	
	$scope.token = AuthService.getToken();
	// setup details
	$scope.isLoading = true;
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
			$scope.members = $scope.group.members;
			console.log($scope.members);
			MemberService.setMembers($scope.members);
			calcStats();
			$scope.processLeaderboard($scope.id, "day");
			processMessages();
		}
	}

	var calcStats = function() {
		$scope.img = $scope.group.image_url;
		$scope.msgcount = $scope.group.messages.count;
		$scope.pages = Math.ceil($scope.msgcount/100);
		$scope.pctMuted = calcMuted();
	}

	var calcMuted = function() {
		var muted = 0;
		var total = $scope.members.length;
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
		// this is not working
		var matches = _.where($scope.messages, {
			sender_id: id});
		var member = _.where($scope.members, {
			user_id: id});
		MemberService.setMember(member);
		MemberService.setMessages(matches);
		$location.path('/member/' + id + '/' + $scope.id)
	}

	var processMessages = function(before_id) {
		var count = 0;
		MessageService.fetchMessages($scope.id, before_id).then(
			function(result) {
				var msgpg = result.data.response.messages;
				$scope.messages = $scope.messages.concat(msgpg);
				if($scope.messages.length == $scope.msgcount) {
					$scope.isLoading = false;
				}
				before_id = _.last(msgpg).id;
				processMessages(before_id);
			});
	}



	// functions that need to be exposed on scope

	$scope.processLeaderboard = function(groupid, period) {
		LeaderboardService.fetchLeaderboard(groupid, period).then(function(result) {
			$scope.noMessages = false;
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