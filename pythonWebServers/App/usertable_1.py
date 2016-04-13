# -*- coding:utf-8 -*-

from sqlalchemy import Column, String, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 创建对象的基类
Base = declarative_base()

# 定义User对象
class User(Base):
	# 表的名字
	__tablename__ = 'user'

	# 表的结构
	user_id = Column(String(20), primary_key=True)
	name = Column(String(40))
	password = Column(String(40))
	role = Column(String(40))

	def __init__(self, user_id, name, password, role):
		self.user_id = user_id
		self.name = name
		self.password = password
		self.role = role


engine = create_engine('sqlite:///Q&Asystem.db')
DBSession = sessionmaker(bind=engine)

# 创建session对象
session = DBSession()

# 创建新的user对象
new_user = User(2,'pengyao2','123456','student')

# 添加到session
session.add(new_user)

# 提交即保存到数据库
session.commit()

# 关闭session
session.close()
