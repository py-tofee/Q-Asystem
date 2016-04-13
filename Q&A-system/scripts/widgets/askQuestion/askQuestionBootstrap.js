/**
 * 
 */

(function () {
	"use strict";

	define([
			'widgets/askQuestion/askQuestionController',
			'widgets/askQuestion/askQuestionDirective',
			'widgets/askQuestion/askQuestionService'
		], function (askQuestionController, askQuestionDirective, askQuestionService) {
			function init (App) {
				askQuestionController.start(App)
				askQuestionDirective.start(App)
				askQuestionService.start(App)
			}

			return {
				start: init
			}
		})
}).call(this)
