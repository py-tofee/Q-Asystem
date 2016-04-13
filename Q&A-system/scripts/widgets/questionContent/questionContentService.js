(function () {
	"use strict";

	define([
		], function  () {
			function questionContentService () {
				var _questionContentController = null

				return {
					setController: function (questionContentController) {
						_questionContentController = questionContentController
					},
					getController: function () {
						return _questionContentController
					}
				}
			}

			function init (App) {
				App.factory('questionContentService', questionContentService)
				return questionContentService
			}

			return {
				start: init
			}
		})
}).call(this)