/**
 * 
 */

(function () {
	"use strict";

	define([
			'widgets/hotQuestion/hotQuestionController',
			'widgets/hotQuestion/hotQuestionDirective',
			'widgets/hotQuestion/hotQuestionService'
		], function (hotQuestionController, hotQuestionDirective, hotQuestionService) {
			function init (App) {
				hotQuestionController.start(App)
				hotQuestionDirective.start(App)
				hotQuestionService.start(App)
			}

			return {
				start: init
			}
		})
	
}).call(this)
