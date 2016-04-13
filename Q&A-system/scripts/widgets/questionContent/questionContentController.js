(function () {
	"use strict";
	define([
		'angular'
		], function (angular) {
		function questionContentController ($scope, $http, $cookies, questionContentService) {
			
		}
		
		function init (App) {
			App.controller('questionContentController', ['$scope', '$http', '$cookies', 'questionContentService', questionContentController])
			return questionContentController
		}

		return {
			start: init
		}
	})
}).call(this)