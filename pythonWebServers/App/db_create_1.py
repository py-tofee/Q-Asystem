import sqlite3

conn = sqlite3.connect('Q&Asystem.db')
cursor = conn.cursor()

cursor.execute('create table if not exists user (user_id number(10) primary key, name varchar(40), password varchar(40), role varchar(40))')
cursor.close()
conn.commit()
conn.close()