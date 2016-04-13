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

				// 响应menu的点击
				$scope.$bus.subscribe({
					channel: 'menu',
					topic: 'menu.onActive',
					callback: function (data) {
						if(data.name == 'homePage') {
							$scope.homePageVisible = true
							getAllTypes()
							$scope.initQuestion({'conditions': 'all'}, 1)
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
					if(queryConditions.length > 0){
						var querystr = queryConditions.length + '&'
						for (var i = 0; i < queryConditions.length; i++) {
							querystr = querystr + queryConditions[i] + '&'
						}
						conditiondata = {'conditions': querystr}
					}else{
						conditiondata = {'conditions': 'all'}
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

				$scope.showQuestionDetails = function (index) {
					if($scope.answe_index == index){
						$scope.answe_index = ''
					}else {
						$scope.answe_index = index
					}
				}

				// $sce
				$scope.TrustDangerousSnippet = function (post) {
					return $sce.trustAsHtml(post)
				}

				$scope.addNewAnswer = function () {
					//
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