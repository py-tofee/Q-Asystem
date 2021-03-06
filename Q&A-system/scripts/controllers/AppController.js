/**
 * 
 */

(function() {
	"use strict";

	define([
		'angular'
		], function (angular) {

			function AppController ($scope, $window, $cookies, $http, homePageService) {

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

				$('.search-form').keydown(function (e) {
					var e = e || event
					var keycode = e.which || e.keyCode
					if(keycode == 13) {
						homePageService.getController().initQuestion($('#query').val(), 1)
					}
				})
				
			}

			function init (App) {
				App.controller('AppController', ['$scope', '$window', '$cookies', '$http', 'homePageService', AppController])
				return AppController
			}

			return {
				start: init
			}
		})

}).call(this)