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

				$('#selectQuestionType').on('change', function () {
					if ($('#selectQuestionType').val() == '自定义') {
						$('#questionType').attr('disabled', false)
					}
					else {
						$('#questionType').attr('disabled', true)
					}
				})

				// 响应menu的点击
				$scope.$bus.subscribe({
					channel: 'menu',
					topic: 'menu.onActive',
					callback: function (data) {
						if(data.name == 'askQuestion') {
							$scope.askQuestionVisible = true
							getAllTypes ()

						}
						else {
							$scope.askQuestionVisible = false
						}
					}
				})
				// 获取所有的问题类型
				function getAllTypes () {
					$.ajax({
						type: 'get',
						url: 'http://127.0.0.1:5000/QASystem/get/allTypes',
						dataType: 'json',
						success: function (response) {
							if(response.data.message == 'success') {
								$scope.allTypes = response.data.allTypes
							}
						}
					})
				}

				// 创建问题
				$scope.createQuestion = function () {
					var contentHTML = $('.note-editable')[0].innerHTML

					var questionType = ''
					if ($('#selectQuestionType').val() == '自定义') {
						questionType = $scope.questionType
						
					}
					else if ($('#selectQuestionType').val() == '请选择问题类型') {
						alert('请选择问题类型')
						return
					}
					else {
						questionType = $('#selectQuestionType').val()
					}

					var questionData = {
						'q_category': questionType,
						'q_title': $scope.questionTitle,
						'q_content': contentHTML,
						'q_userid': $cookies.user_id,
						'invited_user_name': $scope.invitedUserName
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
				getAllTypes()


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