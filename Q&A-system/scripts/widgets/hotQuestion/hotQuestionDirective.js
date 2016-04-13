(function (){
	"use strict";

	define([
			'angular',
			'text!widgets/hotQuestion/template/hotQuestionTemplate.html'
		], function (angular, tpl) {

			function hotQuestionDirective() {
				return {
					restrict: 'E',
					template: tpl,
					controller: 'hotQuestionController',
					scope: {},
					link: function (scope, iElement, iAttrs){

					}
				}
			}

			function init(App) {
				App.directive('hotQuestion', hotQuestionDirective)
			}

			return {
				start: init
			}
		})
}).call(this)