'use strict';

angular.module('myApp.member', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/member/:id/:groupid', {
		templateUrl: 'member/member.html',
		controller: 'MemberCtrl'
	});
}])

.controller('MemberCtrl', ['$scope', '$routeParams', 'MemberService', function($scope, $routeParams, MemberService) {

	var findTop = function() {
		var top = _.max($scope.messages, function(message) {return message.favorited_by.length; });
		return top;
	}

	var collectWords = function() {
		var result = '';
		for (var i = 0; i < $scope.messages.length; i++) {
			var text = $scope.messages[i].text;
			result = result + " " + text;
		}
		console.log(result);
		return result.toLowerCase(23);
	}

	var countWords = function(text) {
		var removePunctuation = text.replace(/[!,?.":;]/g, ' ');

		var split = removePunctuation.split(" ");

		var res =
		_.chain(split).without('', ' ')
		.groupBy(function(word) { return word;})
		.sortBy( function(word)  {  return word.length;})
		.value();

		// strip common words since they're not interesting
		var commonWords = ["the", "of", "and", "to", "a", "in", "for", "is", "on", "that", "by", "this", "with", "i", "you", "it", "not", "or", "be", "are", "from", "at", "as", "your", "all", "have", "null", "my", "he", "she", "we", "but", "don't", "my", "do", "can", "can't", "was", "would", "me", "will", "i'm", "http", "https", "www"];
		res = _.reject(res, function(word) { 
			if (_.indexOf(commonWords, word[0]) != -1) {
				return true;
			}
			else {
				return false;
			}
		});
		return res.reverse();
	}

	$scope.asNickname = function(id) {
		var match = _.where($scope.members, {user_id: id});
		if (match.length > 0) {
			return match[0].nickname;
		}
		else {
			return "Former Member";
		}
	}

	$scope.convertDate = function(sSinceEpoch) {
		var date = new Date(sSinceEpoch * 1000);
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var convertedDate = month + "/" + day + "/" + year;
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = "";
		if (hours > 12) {
			hours = hours - 12;
			ampm = "PM";
		}
		else {
			ampm = "AM";
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		var time = hours + ":" + minutes + " " + ampm;
		var result = convertedDate + " @ " + time;
		return result;
	}

	// $scope.getMostFrequent = function() {
	// 	var limit = $scope.freqlimit;
	// 	var result = [];
	// 	console.log($scope.freq);
	// 	for (var i = $scope.freq.length - 1; i >= $scope.freq.length - limit; i--) {
	// 		result.push({
	// 			'word': $scope.freq[i][0],
	// 			'freq': $scope.freq[i].length
	// 		});
	// 	}
	// 	console.log(result.length);
	// 	console.log(result);
	// 	return result;
	// }

	// setup	
	$scope.freqLimit = 10;
	$scope.groupid = $routeParams.groupid;
	$scope.hasComments = true;
	$scope.messages = MemberService.getMessages();
	if ($scope.messages.length == 0) {
		$scope.hasComments = false;
	}
	$scope.member = MemberService.getMember()[0];
	$scope.members = MemberService.getMembers();
	$scope.topComment = findTop();
	$scope.totalComments = $scope.messages.length;
	var allwords = collectWords();
	$scope.freq = countWords(allwords);
	console.log($scope.freq);

	

}]);