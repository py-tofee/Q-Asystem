(function () {
	"use strict";

	define([
		], function () {
			function userMessageService () {
				var _userMessageController = null

				return {
					setController: function  (userMessageController) {
						_userMessageController = userMessageController
					},
					getController: function  (userMessageController) {
						return _userMessageController
					}
				}
			}

			function init (App) {
				App.factory('userMessageService',userMessageService)
				return userMessageService
			}

			return {
				start: init
			}
		})
}).call(this)