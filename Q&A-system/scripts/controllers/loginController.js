/**
 * 功能：登录
 */

(function() {
	"use strict";

	define([
		'angular'
		], function (angular) {
			
			function loginController($scope, $cookies, $http, $location) {

				$scope.loginErrorMessage = ''
				$scope.loginError = false

				$scope.registerErrorMessage = ''
				$scope.registerError = false

				$scope.loginboxVisible = true
				$scope.registerboxVisible = false

				$scope.showRegisterBox = function () {
					$scope.loginboxVisible = false
					$scope.registerboxVisible = true
					$scope.loginErrorMessage = ''
					$scope.loginError = false
				}

				$scope.showLoginBox = function () {
					$scope.loginboxVisible = true
					$scope.registerboxVisible = false
					$scope.registerErrorMessage = ''
					$scope.registerError = false
				}




				// 登录
				$scope.login = function() {

					var user_data = {
						'name': $scope.username,
						'password': $scope.password
					}

					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/login.do',
						data: user_data,
						dataType: 'json',
						success: function  (response) {
							var responseData = response.data
							if(responseData.message == 'success') {
								//跳转
								$cookies.username = responseData.user.username
								$cookies.user_id = responseData.user.user_id
								$cookies.user_role = responseData.user.role
								$cookies.photo_path = responseData.user.photo_path
								$cookies.fansAmount = responseData.user.fans_amount
								$scope.loginError = false
								$location.path('/Q&A-system/main')

							}
							else{
								$scope.loginError = true
								$scope.loginErrorMessage = responseData.message
							}
						}
					})
					
				}

				// 注册
				$scope.register = function() {

					var register_data = {
						'name': $scope.regisname,
						'password': $scope.regispassword,
						'role': $scope.regisrole
					}

					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/register.do',
						data: register_data,
						dataType: 'json',
						success: function (response) {
							var responseData = response.data
							if(responseData.message == 'success') {
								$scope.showLoginBox()
								$scope.username = responseData.user.username
								$scope.password = responseData.user.password
								$scope.registerError = false
								alert('注册成功，可以登录咯~')
							}
							else {
								$scope.registerError = true
								$scope.registerErrorMessage = responseData.message
							}
						}
					})
				}

			}

			function init(App) {
				App.controller('loginController', ['$scope', '$cookies', '$http', '$location', loginController])
				return loginController
			}

			return {
				start: init
			}
		})
}).call(this)