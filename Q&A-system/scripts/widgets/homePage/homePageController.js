(function () {
	"use strict";

	define([
			'angular'
		], function (angular) {
			
			function homePageController ($scope, $http, $cookies, $compile, $sce, homePageService) {
				$scope.homePageVisible = true
				$scope.queryConditions = []
				$scope.queryConditionsVisible = false
				$scope.authorMsgVisible = false
				$scope.questionContentVisible = false

				$scope.submiterrorVisible = false

				homePageService.setController($scope)

				// 响应menu的点击
				$scope.$bus.subscribe({
					channel: 'menu',
					topic: 'menu.onActive',
					callback: function (data) {
						if(data.name == 'homePage') {
							$scope.homePageVisible = true
							getAllTypes()
							$scope.initQuestion($scope.queryConditions, 1)
						}
						else {
							$scope.homePageVisible = false
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

				// 按条件查找 初始化
				$scope.initQuestion = function (queryConditions, page) {
					var conditiondata = {}
					if(queryConditions instanceof Array && queryConditions.length > 0){
						var querystr = ''
						for (var i = 0; i < queryConditions.length; i++) {
							if(i == queryConditions.length-1){
								querystr = querystr + queryConditions[i]
							}else{
								querystr = querystr + queryConditions[i] + '&'
							}
							
						}
						conditiondata = {'conditions': querystr}
					}
					else if (queryConditions instanceof Array && queryConditions.length == 0) {
						conditiondata = {
							'conditions': 'all'
						}

					}
					else{
						conditiondata = {'conditions': 'queryByContent', 'content': queryConditions}
					}
					
					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/query/byConditions/' + page,
						data: conditiondata,
						dataType: 'json',
						success: function (response) {
							if(response.data.message == 'success'){
								$scope.curPageQuestions = response.data.curPageQuestions
								$scope.pageTotleNum = response.data.pageTotleNum
								$scope.curPage = response.data.page
								$scope.pageArray = []
								for(var i = 0; i < $scope.pageTotleNum; i++) {
									$scope.pageArray.push(i+1)
								}
							}
						}
					})

				}

				// 选择条件 查询
				$scope.queryByConditions = function () {
					
					if($scope.queryConditions.indexOf(this.t.category) == -1){
						$scope.queryConditions.push(this.t.category)
						$scope.queryConditionsVisible = true
					}
					$scope.initQuestion($scope.queryConditions, 1)
				}

				$scope.removeCondition = function (index) {
					$scope.queryConditions.splice(index,1)
					$scope.initQuestion($scope.queryConditions, 1)					
				}

				$scope.selectePage = function (page) {
					if(page <= 0 || page > $scope.pageTotleNum){
						return
					}
					$scope.initQuestion($scope.queryConditions, page)

				}


				// 鼠标放在作者名上 显示作者相关信息
				$scope.showAuthorMessage = function (index, question) {
					if(!index && !question) {
						$scope.authorMsgVisible = true
						return
					}
					$scope.authorMsgVisible = true
					$scope.authorName = question.q_username
					$scope.userrole = question.userrole
					$scope.fans_amount = question.fans_amount
					$scope.questionAmount = question.questionAmount
					$scope.answerAmount = question.answerAmount
					$scope.photo_path = question.photo_path

					var this_obj = $('.author-name')[index]
					$('#authorMsg').css({'top': (this_obj.offsetTop - 150)+'px','left': (this_obj.offsetLeft - 50) + 'px'})
					
				}

				$scope.hideAuthorMessage = function () {
					$scope.authorMsgVisible = false
				}

				// 对作者添加关注
				$scope.addConcern = function () {
					// 
				}
				
				$scope.toAddNewAnswer = function () {
					//跳转到创建回答的地方
				}

				$scope.showQuestionDetails = function (question, index) {
					if($scope.oldindex == index){
						$scope.answe_index = -1
						$scope.oldindex = -1
					}else {
						$scope.answe_index = index
						$scope.oldindex = index
						get_answers(question.q_id)
					}
					
				}

				// $sce
				$scope.TrustDangerousSnippet = function (post) {
					return $sce.trustAsHtml(post)
				}

				// 创建回答 并提交
				$scope.commitAnswer = function (question, index) {
					if($('.comment-content')[index].value != ''){
						$scope.submiterrorVisible = false
						// alert($('#commentContent').val())
						var answerData = {
							'q_id': question.q_id,
							'user_id': $cookies.user_id,
							'content': $('.comment-content')[index].value
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
									$scope.submiterror = '发表失败'
								}
							}
						})
					}else {
						$scope.submiterrorVisible = true
						$scope.submiterror = '请输入你的回答'
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
								$scope.curQuestionAnswers = response.data.questionanswers
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

				$scope.showCurQuestion = function (questionId) {
					var container = $('body')
					var scrollTo = $('#question'+questionId)
					// 滚动到所点击的问题处
					container.scrollTop(scrollTo.offset().top - 200)
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
				getAllTypes()
				$scope.initQuestion($scope.queryConditions, 1)
			}

			function init(App) {
				App.controller('homePageController', ['$scope', '$http', '$cookies', '$compile', '$sce', 'homePageService', homePageController])
				return homePageController
			}

			return {
				start: init
			}
		})
	
}).call(this)