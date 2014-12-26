'use strict';

angular.module('myApp.groupme', [])

.factory('GroupService', function($http) {
	var groups = [];
	return {
		fetchGroups: function() {
			return $http({
				method: 'GET',
				url: 'https://api.groupme.com/v3/groups?token=0716afb06ea301327f545a881ffffb1c',
				dataType: 'jsonp'
			}).then(function(result) {
				var pregroups = result.data.response;
				for (var i = 0; i < pregroups.length; i++) {
					if (pregroups[i].image_url == null) {
						pregroups[i].image_url = "http://lorempixel.com/500/300/cats";
					}
				}
				groups = pregroups;
				return groups;
			})},
			getGroups: function() {
				var self = this;
				if (groups == null) {
					this.fetchGroups().then(function(result) {
						return result;
					});
				}
				else {
					return groups;
				}
			}
		}
	})

.factory('MessageService', function($http) {
	return {
		fetchMessages: function(groupid, after_id) {
			if (after_id != null) {
				return $http({
					method: 'GET',
					url: 'https://api.groupme.com/v3/groups/' + groupid + '/messages?limit=100&after_id=' + after_id + '&token=0716afb06ea301327f545a881ffffb1c',
					dataType: 'jsonp'
				}).then(function(result) {
					return result;
				});
			}
			else {
				return $http({
					method: 'GET',
					url: 'https://api.groupme.com/v3/groups/' + groupid + '/messages?token=0716afb06ea301327f545a881ffffb1c',
					dataType: 'jsonp'
				}).then(function(result) {
					return result;
				});
			}
		}
	}
})

.factory('LeaderboardService', function($http) {
	return {
		fetchLeaderboard: function(groupid, period) {
			return $http({
				method: 'GET',
				url: 'https://api.groupme.com/v3/groups/' + groupid + '/likes?period=' + period + '&token=0716afb06ea301327f545a881ffffb1c',
				dataType: 'jsonp'
			}).then(function(result) {
				return result;
			});
		}
	}
})

.factory('MemberService', function() {
	var messages = [];
	return {
		setMessages: function(msg) {
			messages = msg; 
		},
		getMessages: function() {
			return messages;
		}
	}
});