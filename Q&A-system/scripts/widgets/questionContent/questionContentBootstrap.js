/**
 * 
 */

(function () {
	"use strict";

	define([
			'widgets/questionContent/questionContentController',
			'widgets/questionContent/questionContentDirective',
			'widgets/questionContent/questionContentService'
		], function (questionContentController, questionContentDirective, questionContentService) {
			function init (App) {
				questionContentController.start(App)
				questionContentDirective.start(App)
				questionContentService.start(App)
			}

			return {
				start: init
			}
		})
}).call(this)
