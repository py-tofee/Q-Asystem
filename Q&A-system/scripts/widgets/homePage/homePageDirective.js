(function (){
	"use strict";

	define([
			'angular',
			'text!widgets/homePage/template/homePageTemplate.html'
		], function (angular, tpl) {

			function homePageDirective() {
				return {
					restrict: 'E',
					template: tpl,
					controller: 'homePageController',
					scope: {},
					link: function (scope, iElement, iAttrs){

					}
				}
			}

			function init(App) {
				App.directive('homePage', homePageDirective)
			}

			return {
				start: init
			}
		})
}).call(this)