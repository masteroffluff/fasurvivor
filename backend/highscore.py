from flask import Flask, jsonify
from flask import request
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
# testing
@app.route("/highscore", methods = ['POST', 'GET'])
def highscore():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='user',
            password='supersecretpassword',
            database='highscore'
        )

        if connection.is_connected():
            print("Connected to MySQL database")
            if request.method == 'POST':
                cursor = connection.cursor()
                sql_query = "INSERT INTO highscore (id, score) VALUES (%s, %s)"
                cursor.execute(sql_query, (new_score["id"], new_score["score"]))
                connection.commit()  # Commit the transaction
                return jsonify({"message": "Score added successfully!"}), 201
            else:
                cursor = connection.cursor()
                cursor.execute("SELECT `users`.`name`, `highscore`.`score` FROM `highscore` JOIN `users` on `highscore`.`user` = `users`.`user_id`; ")
                records = cursor.fetchall()
                results = []
                for row in records:
                    results.append({"id": row[0], "score": row[1]})
                return jsonify(results) 

    except Error as e:
        print("Error while connecting to MySQL", e)
        return jsonify({"error": "Failed to connect to the database."}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")
    return "<p>no data</p>"