(function () {
	"use strict";

	define([
		'angular'
		], function  (angular) {
			
			function hotQuestionController($scope, $http, $cookies, $sce, hotQuestionService, homePageService) {
				$scope.hotQuestionVisible = false
				$scope.hotAuthorMsgVisible = false
				$scope.hotsubmiterrorVisible = false

				// 响应menu的点击
				$scope.$bus.subscribe({
					channel: 'menu',
					topic: 'menu.onActive',
					callback: function (data) {
						if(data.name == 'hotQuestion') {
							$scope.hotQuestionVisible = true
							$scope.initHotQuestion()
						}
						else {
							$scope.hotQuestionVisible = false
						}
					}
				})

				$scope.initHotQuestion = function () {
					
					$.ajax({
						type: 'get',
						url: 'http://127.0.0.1:5000/QASystem/get/hot/questions',
						dataType: 'json',
						success: function (response) {
							if(response.data.message == 'success'){
								$scope.hotQuestions = response.data.hotQuestions
							}
						}
					})
				}

				$scope.showHotAuthorMessage = function (index, question) {
					if(!index && !question) {
						$scope.hotAuthorMsgVisible = true
						return
					}
					$scope.hotAuthorMsgVisible = true
					$scope.authorName = question.q_username
					$scope.userrole = question.userrole
					$scope.fans_amount = question.fans_amount
					$scope.questionAmount = question.questionAmount
					$scope.answerAmount = question.answerAmount
					$scope.photo_path = question.photo_path

					var this_obj = $('.hot-author-name')[index]
					$('#hotauthorMsg').css({'top': (this_obj.offsetTop - 150)+'px','left': (this_obj.offsetLeft - 50) + 'px'})
				}

				$scope.hideHotAuthorMessage = function() {
					$scope.hotAuthorMsgVisible = false
				}


				$scope.addConcern = function () {
					//
				}

				$scope.showHotQuestionDetails = function (question, index) {
					if($scope.oldindex == index){
						$scope.answe_index = -1
						$scope.oldindex = -1
					}else {
						$scope.answe_index = index
						$scope.oldindex = index
						get_answers(question.q_id)
					}
				}

				$scope.TrustDangerousSnippet = function (post) {
					return $sce.trustAsHtml(post)
				}

				$scope.commitAnswer = function (question, index) {
					if($('.hot-comment-content')[index].value != ''){
						$scope.hotsubmiterrorVisible = false
						var answerData = {
							'q_id': question.q_id,
							'user_id': $cookies.user_id,
							'content': $('.hot-comment-content')[index].value
						}
						$.ajax({
							type: 'post',
							url: 'http://127.0.0.1:5000/QASystem/create/answer',
							data: answerData,
							dataType: 'json',
							success: function (response) {
								if (response.data.message == 'success') {
									get_answers(question.q_id)
								}
								else {
									$scope.hotsubmiterror = '发表失败'
								}
							}
						})
					}else {
						$scope.hotsubmiterrorVisible = true
						$scope.hotsubmiterror = '请输入你的回答'
					}
				}

				// 获取当前问题的 回答列表
				function get_answers(questionId) {
					var data = {
						'q_id': questionId
					}
					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/get/curQuestion/answers',
						data: data,
						dataType: 'json',
						success: function (response) {
							if (response.data.message == 'success') {
								$scope.curHotQuestionAnswers = response.data.questionanswers
							}
						}
					})
				}

				$scope.addLikeToAnswer = function (answerId) {
					var addLike = 0
					if ($scope.heartclass == 'icon-heart-empty'){
						$scope.heartclass = 'icon-heart'
						addLike = 1
					}
					else {
						$scope.heartclass = 'icon-heart-empty'
						addLike = -1
					}
					var data = {
						'a_id': answerId,
						'addLike': addLike
					}
					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/addLike/to/answer',
						data: data,
						dataType: 'json',
						success: function (response) {
							if (response.data.message == 'success') {
								// $scope.likeAmount = response.data.like_amount
							}
						}
					})
				}

				$scope.toAddNewAnswer = function () {
					//跳转到创建回答的地方
				}

				// 对Array数组方法扩展
				Array.prototype.indexOf = function(e) {
					for (var i = 0; i < this.length; i++) {
						var j = this[i]
						if(j == e) {
							return i
						}
					}
					return -1
				}

				$scope.heartclass = 'icon-heart-empty'

			}

			function init(App) {
				App.controller('hotQuestionController', ['$scope', '$http', '$cookies', '$sce', 'hotQuestionService', 'homePageService', hotQuestionController])
				return hotQuestionController
			}

			return {
				start: init
			}

		})

}).call(this)