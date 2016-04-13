(function () {
	"use strict";

	define([
		], function  () {
			function hotQuestionService () {
				var _hotQuestionController = null

				return {
					setController: function (hotQuestionController) {
						_hotQuestionController = hotQuestionController
					},
					getController: function () {
						return _hotQuestionController
					}
				}
			}

			function init (App) {
				App.factory('hotQuestionService', hotQuestionService)
				return hotQuestionService
			}

			return {
				start: init
			}
		})
}).call(this)