# -*- coding:utf-8 -*-

from flask import g, abort, make_response, request, Response
from flask.ext import restful

from PIL import Image
import math

from App.server import app, db, auth
from App.models import User, Question, Answer

import json
from functools import wraps

def return_json(f):
	@wraps(f)
	def decorated_function(*args, **kw):
		result = f(*args, **kw)
		headers = {"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Qrigin, X-Requested-With, Content-Type, Accept, X-ID, X-TOKEN, X-ANY-YOUR-CUSTOM-HEADER",
					"Access-Control-Allow-Methods": "POST, PUT, GET, OPTIONS, DELETE"}
		return Response(result, mimetype='application/json', headers=headers)
	return decorated_function


# 改进404错误处理，使404错误也返回客户端能够识别的json格式
@app.errorhandler(404)
def not_found(error):
	return make_response(json.dumps({'error':'Not found'}),404)

# 注册
@app.route('/QASystem/register.do', methods=['POST'])
@return_json
def user_register():
	if not request.form or not 'name' in request.form or not 'password' in request.form or not 'role' in request.form:
		abort(400)
	# 如果数据库中不存在该用户
	if not db.session.query(User).filter(User.name == request.form['name']).first():
		new_user = User(request.form['name'], request.form['password'], request.form['role'])
		db.session.add(new_user)
		db.session.commit()
		this_new_user = {
			'user_id': new_user.user_id,
			'username': new_user.name,
			'password': new_user.password,
			'role': new_user.role,
			'photo_path': new_user.photo_path,
			'fans_amount': new_user.fans_amount
		}
		return json.dumps({'data': {'message': 'success', 'user': this_new_user}})
	else:
		return json.dumps({'data': {'message': 'username is exists'}})

# 登录
@app.route('/QASystem/login.do', methods=['GET','POST'])
@return_json
def user_login():
	if not request.form or not 'name' in request.form or not 'password' in request.form:
		abort(400)
	user = db.session.query(User).filter(User.name == request.form['name']).first()

	if user and user.password == request.form['password']:

		this_user = {
			'user_id': user.user_id,
			'username': user.name,
			'password': user.password,
			'role': user.role,
			'photo_path': user.photo_path,
			'fans_amount': user.fans_amount
		}

		return json.dumps({'data': {'message': 'success', 'user': this_user}})
	else :
		return json.dumps({'data': {'message': 'username or password error'}})

# 上传头像
@app.route('/QASystem/uploadImage', methods=['POST'])
@return_json
def upload_image():
	if request.method == 'POST' and 'user_id' in request.form :
		user_file = request.files['userPhoto']
		user_filename = user_file.filename
		user_mimetype = user_file.content_type

		user_file.save('../Q&A-system/images/userImages/userId_' + request.form['user_id'] + user_filename)

		user = db.session.query(User).filter(User.user_id == request.form['user_id']).first()
		user.photo_path = 'images/userImages/userId_' + request.form['user_id'] + user_filename
		
		db.session.add(user)
		db.session.commit()

		return json.dumps({"data": {"filename": user_filename, "mimetype": user_mimetype}})
	else:
		print('error')
		abort(400)


# 返回用户头像的路径
@app.route('/QASystem/get/ImagePath', methods=['GET','POST'])
@return_json
def get_image_path():
	if request.form and 'user_id' in request.form:
		user = db.session.query(User).filter(User.user_id == request.form['user_id']).first()
		print(user.question.all())
		return json.dumps({"data": {'message': 'success', "photo_path": user.photo_path}})
	else:
		abort(400)

# 修改用户名和密码
@app.route('/QASystem/update/userMessage', methods=['POST'])
@return_json
def update_userMessage():
	if request.form and 'user_id' in request.form and 'new_username' in request.form and 'new_password' in request.form:
		user = db.session.query(User).filter(User.user_id == request.form['user_id']).first()
		user.name = request.form['new_username']
		user.password = request.form['new_password']

		db.session.add(user)
		db.session.commit()

		return json.dumps({"data": {"message": "success"}})
	else:
		abort(400)


# 创建问题
@app.route('/QASystem/create/question', methods=['GET', 'POST'])
@return_json
def create_questions():
	if request.form and 'q_category' in request.form and 'q_title' in request.form and 'q_content' in request.form and 'q_userid' in request.form :

		user = db.session.query(User).filter(User.user_id == request.form['q_userid']).first()
		new_question = Question(request.form['q_category'], request.form['q_title'], request.form['q_content'], user)
		

		if 'invited_user_name' in request.form :
			invied_user = db.session.query(User).filter(User.name == request.form['invited_user_name']).first()
			new_question.q_invited_userid = invied_user.user_id
			print(invied_user.user_id)

		db.session.add(new_question)
		db.session.commit()

		q_user = {
			"user_id": new_question.user.user_id,
			"username": new_question.user.name,
		}

		this_new_question = {
			'q_id': new_question.q_id,
			'q_title': new_question.q_title,
			'q_category': new_question.q_category,
			'q_content': new_question.q_content,
			'q_create_time': new_question.q_create_time,
			'q_userid': new_question.user.user_id,
			'q_read_amount': new_question.q_read_amount,
			'q_concern_amount': new_question.q_concern_amount,
			'q_answer_amount': new_question.q_answer_amount
		}

		return json.dumps({'data': {'message': 'success', 'question': this_new_question, 'q_user': q_user}})

# 获取当前用户收到的邀请问题
@app.route('/QASystem/get/currentUser/invited/questions', methods=['POST'])
@return_json
def get_cur_user_invited_questions():
	if request.form and 'user_id' in request.form:
		invited_questions = db.session.query(Question).filter(Question.q_invited_userid == request.form['user_id']).all()

		invitedQuestions = []
		for q in invited_questions:
			question = {
				'q_id': q.q_id,
				'q_title': q.q_title,
				'q_category': q.q_category,
				'q_content': q.q_content,
				'q_create_time': q.q_create_time,
				'q_userid': q.user.user_id,
				'q_read_amount': q.q_read_amount,
				'q_concern_amount': q.q_concern_amount,
				'q_answer_amount': q.q_answer_amount
			}
			invitedQuestions.append(question)
		return json.dumps({'data': {'message': 'success', 'invitedQuestions': invitedQuestions, 'invitedQuestionsNum': len(invited_questions)}})

# 获取当前用户 提的问题
@app.route('/QASystem/get/currentUser/questions', methods=['POST'])
@return_json
def get_cur_user_questions():
	if request.form and 'user_id' in request.form:
		user = db.session.query(User).filter(User.user_id == request.form['user_id']).first()
		qs = user.question.all()
		
		questions = []
		for q in qs:
			question = {
				'q_id': q.q_id,
				'q_title': q.q_title,
				'q_category': q.q_category,
				'q_content': q.q_content,
				'q_create_time': q.q_create_time,
				'q_userid': q.user.user_id,
				'q_read_amount': q.q_read_amount,
				'q_concern_amount': q.q_concern_amount,
				'q_answer_amount': q.q_answer_amount
			}
			questions.append(question)
		return json.dumps({'data': {'message': 'success', 'questions': questions, 'questionNum': len(qs)}})

# 获得所有问题类型
@app.route('/QASystem/get/allTypes', methods=['GET'])
@return_json
def getAllType():
	allQuestions = db.session.query(Question).all()
	allTypes = []
	for q in allQuestions:
		allTypes.append(q.q_category)
	# 去重
	allTypes = list(set(allTypes))

	allUniqueTypes = []
	for t in allTypes:
		category = {
			'category': t
		}
		allUniqueTypes.append(category)
	return json.dumps({'data': {'message': 'success', 'allTypes': allUniqueTypes}})

# 首页  根据条件查找问题 / 全局搜索
@app.route('/QASystem/query/byConditions/<int:page>', methods=['POST'])
@return_json
def query_by_conditions(page):
	if request.form and 'conditions' in request.form:
		pageSize = 10
		if request.form['conditions'] == 'all' :
			allQuestions = db.session.query(Question).all()
		elif request.form['conditions'] == 'queryByContent' and 'content' in request.form :
			allQuestions = db.session.query(Question).filter(Question.q_title.like('%'+request.form["content"]+'%')).all()
			print(allQuestions)
		else:
			conditionInfo = request.form['conditions'].split('&')
			allQuestions = []
			for c in conditionInfo:
				match_question = db.session.query(Question).filter(Question.q_category == c).all()
				allQuestions = allQuestions + match_question

		pageTotleNum = math.ceil(len(allQuestions)/pageSize)
		print('pageTotleNum', pageTotleNum)

		start = 10*(page-1)
		end = 10*page

		pageQuestions = allQuestions[start:end]

		curPageQuestions = []

		for q in pageQuestions:

			question = {
				'q_id': q.q_id,
				'q_title': q.q_title,
				'q_category': q.q_category,
				'q_content': q.q_content,
				'q_create_time': q.q_create_time,
				'q_userid': q.user.user_id,
				'q_username': q.user.name,
				'q_read_amount': q.q_read_amount,
				'q_concern_amount': q.q_concern_amount,
				'q_answer_amount': q.q_answer_amount,
				'photo_path': q.user.photo_path,
				'userrole': q.user.role,
				'questionAmount': len(q.user.question.all()),
				'answerAmount': len(q.user.answer.all()),
				'fans_amount': q.user.fans_amount
			}
			curPageQuestions.append(question)

		return json.dumps({'data': {'message': 'success', 'page': page , 'pageSize': pageSize, 'pageTotleNum': pageTotleNum, 'curPageQuestions': curPageQuestions}})

# 创建回答
@app.route('/QASystem/create/answer', methods=['POST'])
@return_json
def create_answer():
	if request.form and 'q_id' in request.form and 'user_id' in request.form and 'content' in request.form:
		this_question = db.session.query(Question).filter(Question.q_id == request.form['q_id']).first()
		this_user = db.session.query(User).filter(User.user_id == request.form['user_id']).first()
		new_answer = Answer(request.form['content'], this_user, this_question)
		db.session.add(new_answer)
		db.session.commit()

		answer = {
			'a_id': new_answer.a_id,
			'a_create_time': new_answer.a_create_time,
			'a_content': new_answer.a_content,
			'a_like_amount': new_answer.a_like_amount,
			'a_user_id': new_answer.user.user_id,
			'a_user_name': new_answer.user.name,
			'a_user_role': new_answer.user.role,
			'a_user_photo_path': new_answer.user.photo_path,
			'a_user_fans_amount': new_answer.user.fans_amount,
			'a_q_id': new_answer.question.q_id
		}

		return json.dumps({'data': {'message': 'success', 'answer': answer}})

# 获取当前用户的所有回答的问题
@app.route('/QASystem/get/currentUser/answers', methods=['POST'])
@return_json
def get_cur_user_answers():
	if request.form and 'user_id' in request.form:
		user = db.session.query(User).filter(User.user_id == request.form['user_id']).first()
		answers = user.answer.all()
		useranswers = []

		for a in answers:
			answer = {
				'a_id': a.a_id,
				'a_create_time': a.a_create_time,
				'a_content': a.a_content,
				'a_like_amount': a.a_like_amount,
				'a_q_id': a.question.q_id,
				'a_q_title': a.question.q_title
			}
			useranswers.append(answer)
		return json.dumps({'data': {'message': 'success', 'useranswers': useranswers, 'answersNum': len(answers)}})

# 获取当前问题的所有回答
@app.route('/QASystem/get/curQuestion/answers', methods=['POST'])
@return_json
def get_cur_question_answers():
	if request.form and 'q_id' in request.form:
		question = db.session.query(Question).filter(Question.q_id == request.form['q_id']).first()
		question.q_read_amount = question.q_read_amount + 1 # 访问量加1

		answers = question.answer.all()
		question.q_answer_amount = len(answers)
		print(question.q_answer_amount)
		db.session.add(question)
		db.session.commit()

		questionanswers = []

		for a in answers:
			answer = {
				'a_id': a.a_id,
				'a_create_time': a.a_create_time,
				'a_content': a.a_content,
				'a_like_amount': a.a_like_amount,
				'a_user_id': a.user.user_id,
				'a_user_name': a.user.name,
				'a_user_role': a.user.role,
				'a_user_photo_path': a.user.photo_path,
				'a_user_fans_amount': a.user.fans_amount,
				'a_q_id': a.question.q_id
			}
			questionanswers.append(answer)
		return json.dumps({'data': {'message': 'success', 'questionanswers': questionanswers}})

# 对回答点赞
@app.route('/QASystem/addLike/to/answer', methods=['POST'])
@return_json
def add_like_to_answer():
	if request.form and 'a_id' in request.form and 'addLike' in request.form:
		answer = db.session.query(Answer).filter(Answer.a_id == request.form['a_id']).first()
		answer.a_like_amount = answer.a_like_amount + int(request.form['addLike'])
		db.session.add(answer)
		db.session.commit()

		return json.dumps({'data': {'message': 'success', 'like_amount': answer.a_like_amount}})


# 对问题点赞
@app.route('/QASystem/addLike/to/question', methods=['POST'])
@return_json
def add_like_to_question():
	if request.form and 'q_id' in request.form and 'addLike' in request.form:
		question = db.session.query(Question).filter(Question.q_id == request.form['q_id']).first()
		question.q_concern_amount = question.q_concern_amount + int(request.form['addLike'])
		db.session.add(question)
		db.session.commit()

		return json.dumps({'data': {'message': 'success', 'concern_amount': question.q_concern_amount}})

# 关注用户
@app.route('/QASystem/addLike/to/user', methods=['POST'])
@return_json
def add_like_to_user():
	if request.form and 'user_id' in request.form and 'addLike' in request.form:
		user = db.session.query(User).filter(User.user_id == request.form['user_id']).first()
		user.fans_amount = user.fans_amount + int(request.form['addLike'])
		db.session.add(user)
		db.session.commit()

		return json.dumps({'data': {'message': 'success', 'fans_amount': user.fans_amount}})

# 获取最热门的10个问答
@app.route('/QASystem/get/hot/questions', methods=['GET'])
@return_json
def get_hot_questions():
	questions = db.session.query(Question).order_by(Question.q_read_amount).all()
	hotQuestions = []

	for q in questions[-10:]:
		question = {
				'q_id': q.q_id,
				'q_title': q.q_title,
				'q_category': q.q_category,
				'q_content': q.q_content,
				'q_create_time': q.q_create_time,
				'q_userid': q.user.user_id,
				'q_username': q.user.name,
				'q_read_amount': q.q_read_amount,
				'q_concern_amount': q.q_concern_amount,
				'q_answer_amount': q.q_answer_amount,
				'photo_path': q.user.photo_path,
				'userrole': q.user.role,
				'questionAmount': len(q.user.question.all()),
				'answerAmount': len(q.user.answer.all()),
				'fans_amount': q.user.fans_amount
			}
		hotQuestions.append(question)
	hotQuestions.reverse()

	return json.dumps({'data': {'message': 'success', 'hotQuestions': hotQuestions}})