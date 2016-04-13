(function () {
	"use strict";

	define([
		'angular'
		], function  (angular) {
			
			function askQuestionController($scope, $http, $cookies, askQuestionService, userMessageService) {

				// run summernote
				$(document).ready(function () {
					$('#summernote').summernote({
						height: 350
					})
				})
				

				$scope.askQuestionVisible = false

				// 响应menu的点击
				$scope.$bus.subscribe({
					channel: 'menu',
					topic: 'menu.onActive',
					callback: function (data) {
						if(data.name == 'askQuestion') {
							$scope.askQuestionVisible = true
						}
						else {
							$scope.askQuestionVisible = false
						}
					}
				})

				// 创建问题
				$scope.createQuestion = function () {
					var contentHTML = $('.note-editable')[0].innerHTML
					var questionData = {
						'q_category': $scope.questionType,
						'q_title': $scope.questionTitle,
						'q_content': contentHTML,
						'q_userid': $cookies.user_id
					}

					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/create/question',
						data: questionData,
						dataType: 'json',
						success: function  (response) {
							if(response.data.message == 'success') {
								alert('创建成功')
								$('#questionTitle').innerHTML = ''
								$('#questionType').innerHTML = ''
								$('.note-editable')[0].innerHTML = ''
								userMessageService.getController().getCurUserQuestions()
							}else{

							}
						}
					})
				}



			}

			function init(App) {
				App.controller('askQuestionController', ['$scope', '$http', '$cookies', 'askQuestionService', 'userMessageService', askQuestionController])
				return askQuestionController
			}

			return {
				start: init
			}

		})

}).call(this)