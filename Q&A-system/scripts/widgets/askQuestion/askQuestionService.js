(function () {
	"use strict";

	define([
		], function  () {
			function askQuestionService () {
				var _askQuestionController = null

				return {
					setController: function (askQuestionController) {
						_askQuestionController = askQuestionController
					},
					getController: function () {
						return _askQuestionController
					}
				}
			}

			function init (App) {
				App.factory('askQuestionService', askQuestionService)
				return askQuestionService
			}

			return {
				start: init
			}
		})
}).call(this)