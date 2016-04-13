(function () {
	"use strict";

	define([
			'widgets/userMessage/userMessageController',
			'widgets/userMessage/userMessageDirective',
			'widgets/userMessage/userMessageService'
		], function (userMessageController, userMessageDirective, userMessageService) {
			function init (App) {
				userMessageController.start(App)
				userMessageDirective.start(App)
				userMessageService.start(App)
			}

			return {
				start: init
			}
		})
}).call(this)