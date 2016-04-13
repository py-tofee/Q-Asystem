import sqlite3

conn = sqlite3.connect('Q&Asystem.db')
cursor = conn.cursor()
cursor.execute('select * from user where role=?',('student',))
values = cursor.fetchall()
print(values)
cursor.close()
conn.close()