import sqlite3
conn = sqlite3.connect('db.sqlite3')
cur = conn.cursor()
cur.execute("UPDATE product_product SET season='Bahor', color='Jigarrang', size='32' WHERE id % 4 = 0")
cur.execute("UPDATE product_product SET season='Qish', color='Qizil', size='34' WHERE id % 4 = 1")
cur.execute("UPDATE product_product SET season='Yoz', color='Yashil', size='36' WHERE id % 4 = 2")
cur.execute("UPDATE product_product SET season='Kuz', color='Pushti', size='38' WHERE id % 4 = 3")
conn.commit()
print('Successfully updated database with sample seasons and colors!')
