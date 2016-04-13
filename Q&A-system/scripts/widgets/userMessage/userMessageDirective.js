(function () {
	"use strict";

	define([
			'angular',
			'text!widgets/userMessage/template/userMessageTemplate.html'
		], function (angular, tpl) {
			
			function userMessageDirective () {
				return {
					restrict: 'E',
					template: tpl,
					controller: 'userMessageController',
					scope: {},
					link: function (scope, iElement, iAttrs){

					}
				}
			}

			function init(App) {
				App.directive('userMessage', userMessageDirective)
			}

			return {
				start: init
			}
		})

}).call(this)