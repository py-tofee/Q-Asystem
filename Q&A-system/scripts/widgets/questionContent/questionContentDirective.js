(function (){
	"use strict";

	define([
			'angular',
			'text!widgets/questionContent/template/questionContentTemplate.html'
		], function (angular, tpl) {

			function questionContentDirective() {
				return {
					restrict: 'E',
					template: tpl,
					controller: 'questionContentController',
					scope: {},
					link: function (scope, iElement, iAttrs){

					}
				}
			}

			function init(App) {
				App.directive('questionContent', questionContentDirective)
			}

			return {
				start: init
			}
		})
}).call(this)