(function (){
	"use strict";

	define([
			'angular',
			'text!widgets/askQuestion/template/askQuestionTemplate.html'
		], function (angular, tpl) {

			function askQuestionDirective() {
				return {
					restrict: 'E',
					template: tpl,
					controller: 'askQuestionController',
					scope: {},
					link: function (scope, iElement, iAttrs){

					}
				}
			}

			function init(App) {
				App.directive('askQuestion', askQuestionDirective)
			}

			return {
				start: init
			}
		})
}).call(this)