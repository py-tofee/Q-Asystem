(function () {
	"use strict";

	define([
			'angular'
		], function (angular) {
			
			function userMessageController ($scope, $http, $cookies, userMessageService) {

				$scope.username = $cookies.username
				$scope.userrole = $cookies.user_role
				$scope.fansAmount = $cookies.fansAmount

				$scope.updateUserMessageVisible = false
				$scope.updateusername = $cookies.username

				userMessageService.setController($scope)

				
				var formdata = {
					"user_id": $cookies.user_id
				}

				// 选择文件
				$('#scanFileBtn').on('click', function () {
					$('#userPhoto').click()
				})

				// 上传文件
				$('#uploadPhoto').on('click', function () {

					if($('#userPhoto').val().length > 0) {

						$.ajaxFileUpload({
							url: 'http://127.0.0.1:5000/QASystem/uploadImage',
							secureuri: false,
							headers: {'Content-Type': 'text/html;charset=utf-8'},
							data: formdata,
							fileElementId: 'userPhoto',
							dataType: 'text',
							success: function (data, status) {
								if(status == 'success'){
									getPhotoPath()
									alert('上传成功')
								}
							
							},
							error: function (XMLHttpRequest, textStatus, errorThrown) {
								if(textStatus == 'error'){
									alert('上传失败')
								}
								
							}
						})

						$('#userPhoto').replaceWith('<input type="file" id="userPhoto" name="userPhoto" style="display: none;" />') //清空userPhoto的val()
					}
					else{
						alert('点击头像，并选择要上传的图片！')
					}
					
				})

				// 获得用户 头像path
				function getPhotoPath () {
					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/get/ImagePath',
						data: formdata,
						dataType: 'json',
						success: function(response){
							if(response.data.message == 'success') {
								$('#userPhotoImage').attr('src', response.data.photo_path)
							}

						}
					})
				}
				

				$scope.showUpdateMessage = function () {
					// 设置遮罩层
					$scope.updateUserMessageVisible = true
				}

				$scope.hiddenUpdateMessage = function () {
					$scope.updateUserMessageVisible = false
				}

				// 修改用户信息
				$scope.updateUserMessage = function () {
					if($scope.updatepassword1 && $scope.updatepassword1 != $scope.updatepassword2) {
						alert('密码输入不一致')
						return
					}
					var updateData = {
						"user_id": $cookies.user_id,
						"new_username": $scope.updateusername,
						"new_password": $scope.updatepassword2
					}
					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/update/userMessage',
						data: updateData,
						dataType: 'json',
						success: function (response) {
							if(response.data.message == 'success') {
								alert('保存成功')
								$scope.username = $scope.updateusername
								$cookies.username = $scope.updateusername
								$scope.updateUserMessageVisible = false
							}
						}
					})
				}

				// 获取用户 提的问题
				$scope.getCurUserQuestions = function () {
					$.ajax({
						type: 'post',
						url: 'http://127.0.0.1:5000/QASystem/get/currentUser/questions',
						data: formdata,
						dataType: 'json',
						success: function (response) {
							if(response.data.message == 'success'){
								$scope.currentUserQuestions = response.data.questions
							}
						}
					})
				}


				getPhotoPath() //获取用户的头像
				$scope.getCurUserQuestions()


			}

			function init(App) {
				App.controller('userMessageController', ['$scope', '$http', '$cookies', 'userMessageService', userMessageController])
				return userMessageController
			}

			return {
				start: init
			}
		})

}).call(this)