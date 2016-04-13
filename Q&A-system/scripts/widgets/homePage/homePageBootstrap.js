/**
 * 
 */

(function () {
	"use strict";

	define([
			'widgets/homePage/homePageController',
			'widgets/homePage/homePageDirective',
			'widgets/homePage/homePageService'
		], function (homePageController, homePageDirective, homePageService) {
			function init (App) {
				homePageController.start(App)
				homePageDirective.start(App)
				homePageService.start(App)
			}

			return {
				start: init
			}
		})
}).call(this)
