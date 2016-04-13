# import App.db_create

from App.server import app, db

db.create_all()

if __name__ == '__main__':
	app.run(debug=True)