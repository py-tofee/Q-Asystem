from flask import g
from datetime import datetime

from App.server import db

# 定义User对象
class User(db.Model):

	# 该类的实例个数（用于创建实例的id）
	userNum = 0


	# 表的名字
	__tablename__ = 'user'

	# 表的结构
	user_id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(40), nullable=False)
	password = db.Column(db.String(40), nullable=False)
	role = db.Column(db.String(40), nullable=False)
	photo_path = db.Column(db.String(100))
	fans_amount = db.Column(db.Integer)

	def __init__(self, name, password, role, fans_amount=0):
		self.user_id = self.get_id()
		self.photo_path = 'images/userImages/default-user-image.jpg'
		self.name = name
		self.password = password
		self.role = role
		self.fans_amount = fans_amount

	# 得到用户id
	def get_id(self):
		# 如果是新用户，则赋值一个id; 否则返回用户id
		if not self.user_id :
			self.user_id = User.userNum + 1
			User.userNum = User.userNum + 1
		return self.user_id

	def __repr__(self):
		return '<User %r>' % self.name


class Question(db.Model):


	# 表的名字
	__tablename__ = 'question'

	q_id = db.Column(db.Integer, primary_key=True)
	q_category = db.Column(db.String(60)) # 问题类别
	q_title = db.Column(db.String(100))
	q_content = db.Column(db.Text)
	q_create_time = db.Column(db.String(20))

	q_read_amount = db.Column(db.Integer) # 阅读量/访问量
	q_concern_amount = db.Column(db.Integer) # 关注该问题的用户数量
	q_answer_amount = db.Column(db.Integer) # 评论量（答案量）

	q_userid = db.Column(db.Integer, db.ForeignKey('user.user_id'))
	user = db.relationship('User', backref=db.backref('question', lazy='dynamic'))

	def __init__(self, q_category, q_title, q_content, user, q_create_time=None, q_read_amount=0, q_concern_amount=0):
		self.q_id = self.get_id()
		self.q_category = q_category
		self.q_title = q_title
		self.q_content = q_content
		if q_create_time is None:
			now = datetime.now()
			q_create_time = now.strftime('%Y-%m-%d')
		self.q_create_time = q_create_time
		self.q_read_amount = q_read_amount
		self.q_concern_amount = q_concern_amount
		self.q_answer_amount = len(self.answer.all())
		self.user = user

	def get_id(self):
		if not self.q_id:
			questions = db.session.query(Question).all()
			self.q_id = len(questions) + 1
		return self.q_id

	def __repr__(self):
		return '<Question %r>' % self.q_id

class Answer(db.Model):

	__tablename__ = 'answer'

	a_id = db.Column(db.Integer, primary_key=True)
	a_create_time = db.Column(db.String(20))
	a_content = db.Column(db.Text)
	a_like_amount = db.Column(db.Integer) # 点赞数量
	# anwser 与 user 是 多对一 的关系
	a_userid = db.Column(db.Integer, db.ForeignKey('user.user_id'))
	user = db.relationship('User', backref=db.backref('answer', lazy='dynamic'))
	# anwser 与 question 是 多对一 的关系
	a_qid = db.Column(db.Integer, db.ForeignKey('question.q_id'))
	question = db.relationship('Question', backref=db.backref('answer', lazy='dynamic'))

	def __init__(self, a_content, user, question, a_create_time=None):
		self.a_id = self.get_id()
		self.a_content = a_content
		if a_create_time is None:
			now = datetime.now()
			a_create_time = now.strftime('%Y-%m-%d')
		self.a_create_time = a_create_time
		self.user = user
		self.question = question

	def get_id(self):
		if not self.a_id:
			answers = db.session.query(Answer).all()
			self.a_id = len(answers) + 1
		return self.a_id

	def __repr__(self):
		return '<Answer %r>' % self.a_id
