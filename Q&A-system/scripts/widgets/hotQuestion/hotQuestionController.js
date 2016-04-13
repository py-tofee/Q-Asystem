(function () {
	"use strict";

	define([
		'angular'
		], function  (angular) {
			
			function hotQuestionController($scope, $http, $cookies, hotQuestionService) {
				$scope.hotQuestionVisible = false

				// 响应menu的点击
				$scope.$bus.subscribe({
					channel: 'menu',
					topic: 'menu.onActive',
					callback: function (data) {
						if(data.name == 'hotQuestion') {
							$scope.hotQuestionVisible = true
						}
						else {
							$scope.hotQuestionVisible = false
						}
					}
				})

			}

			function init(App) {
				App.controller('hotQuestionController', ['$scope', '$http', '$cookies', 'hotQuestionService', hotQuestionController])
				return hotQuestionController
			}

			return {
				start: init
			}

		})

}).call(this)