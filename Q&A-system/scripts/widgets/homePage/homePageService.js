(function () {
	"use strict";

	define([
		], function  () {
			function homePageService () {
				var _homePageController = null

				return {
					setController: function (homePageController) {
						_homePageController = homePageController
					},
					getController: function () {
						return _homePageController
					}
				}
			}

			function init (App) {
				App.factory('homePageService', homePageService)
				return homePageService
			}

			return {
				start: init
			}
		})
}).call(this)