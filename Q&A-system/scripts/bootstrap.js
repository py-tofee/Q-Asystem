/**
 * 功能：初始化功能模块
 */
/*global define:true, require:true, angular:true, console:true */

(function () {
	"use strict";


	define([
		'angular',
		'postal',
		'controllers/AppController',
		'controllers/loginController',
		'widgets/homePage/homePageBootstrap',
		'widgets/askQuestion/askQuestionBootstrap',
		'widgets/userMessage/userMessageBootstrap',
		'widgets/hotQuestion/hotQuestionBootstrap',
		'widgets/questionContent/questionContentBootstrap'
		], function (angular, postal, AppController, loginController, homePageBootstrap, askQuestionBootstrap, userMessageBootstrap, hotQuestionBootstrap, questionContentBootstrap) {

			function init() {
				var app = angular.module('app', ['ngCookies', 'ngRoute']).config(function ($provide) {
					$provide.decorator('$rootScope', [
						'$delegate',
						function ($delegate) {
							Object.defineProperty($delegate.constructor.prototype, '$bus', {
								get: function () {
									var self = this
									return {
										subscribe: function () {
											var sub = postal.subscribe.apply(postal, arguments)
											self.$on('$destroy',
												function () {
													sub.unsubscribe()
												})
										},
										channel: postal.channel,
										publish: postal.publish

									}
								},
								enumerable: false
							})
							return $delegate
						}
					])
				}).config(function ($locationProvider) {
					$locationProvider.html5Mode(true).hashPrefix('!')
				}).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
					$locationProvider.html5Mode(false)
					$routeProvider.when('/Q&A-system', {
						controller: 'loginController',
						templateUrl: 'login.html'
					})
					.when('/Q&A-system/main', {
						controller: 'AppController',
						templateUrl: 'main.html'
					})
					.otherwise({
						redirectTo: 'Q&A-system'
					})
				}])

				AppController.start(app)
				loginController.start(app)
				homePageBootstrap.start(app)
				askQuestionBootstrap.start(app)
				userMessageBootstrap.start(app)
				hotQuestionBootstrap.start(app)
				questionContentBootstrap.start(app)

				angular.bootstrap(document.body, ['app'])
				return app
			}

			return {
				start: init
			}
		})
}).call(this)