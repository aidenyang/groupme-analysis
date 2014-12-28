'use strict';

angular.module('myApp.groupme', [])


.factory('AuthService', function() {
	var accesstoken = '';
	return {
		setToken: function(tok) {
			accesstoken = tok;
		},
		getToken: function() {
			return accesstoken;
		}
	}
})

.factory('GroupService', ['AuthService', '$http', function(AuthService, $http) {
	var groups = [];
	return {
		fetchGroups: function() {
			var token = AuthService.getToken();
			return $http({
				method: 'GET',
				url: 'https://api.groupme.com/v3/groups?token=' + token,
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
	}])

.factory('MessageService', ['AuthService', '$http', function(AuthService, $http) {

	return {
		fetchMessages: function(groupid, before_id) {
			var token = AuthService.getToken();
			if (before_id != null) {
				return $http({
					method: 'GET',
					url: 'https://api.groupme.com/v3/groups/' + groupid + '/messages?limit=100&before_id=' + before_id + '&token=' + token,
					dataType: 'jsonp'
				}).then(function(result) {
					return result;
				});
			}
			else {
				return $http({
					method: 'GET',
					url: 'https://api.groupme.com/v3/groups/' + groupid + '/messages?limit=100&token=' + token,
					dataType: 'jsonp'
				}).then(function(result) {
					return result;
				});
			}
		}
	}
}])

.factory('LeaderboardService', ['AuthService', '$http', function(AuthService, $http) {
	var token = AuthService.getToken();
	return {
		fetchLeaderboard: function(groupid, period) {
			var token = AuthService.getToken();
			return $http({
				method: 'GET',
				url: 'https://api.groupme.com/v3/groups/' + groupid + '/likes?period=' + period + '&token=' + token,
				dataType: 'jsonp'
			}).then(function(result) {
				return result;
			});
		}
	}
}])

.factory('MemberService', function() {
	var member = {};
	var messages = [];
	var members = [];
	return {
		setMessages: function(msg) {
			messages = msg; 
		},
		getMessages: function() {
			return messages;
		},
		setMember: function(mbr) {
			member = mbr;
		},
		getMember: function() {
			return member;
		},
		setMembers: function(mbrs) {
			members = mbrs;
		},
		getMembers: function() {
			return members;
		}
	}
});