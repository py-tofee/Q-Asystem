/**
 * 
 */

(function() {
	"use strict";

	define([
		'angular'
		], function (angular) {

			function AppController ($scope, $window, $cookies, $http) {

				$scope.selectesMenu = 'homePage'

				// 点击menu跳转
				$scope.activeMenu = function (menuWidgetName) {

					$scope.selectesMenu = menuWidgetName

					$scope.$bus.publish({
						channel: 'menu',
						topic: 'menu.onActive',
						data: {
							name: menuWidgetName
						}
					})
				}
				
			}

			function init (App) {
				App.controller('AppController', ['$scope', '$window', '$cookies', '$http', AppController])
				return AppController
			}

			return {
				start: init
			}
		})

}).call(this)