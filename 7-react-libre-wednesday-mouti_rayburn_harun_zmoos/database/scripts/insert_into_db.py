import mysql.connector
import os

# Database connection settings
DB_NAME = "wordle_multiplayer"
DB_USER = "root"
DB_PASSWORD = "root"
DB_HOST = "127.0.0.1"
DB_PORT = 3306

# Path to the words file
WORDS_FILE_PATH = '5-letter-words.txt'

def read_words(file_path):
    with open(file_path, 'r') as file:
        words = file.read().splitlines()
    return words

def insert_words_into_db(words):
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT
        )
        cursor = connection.cursor()
        for word in words:
            cursor.execute("INSERT INTO solutions (word) VALUES (%s)", (word,))
        connection.commit()
        cursor.close()
        connection.close()
        print("Words inserted successfully")
    except mysql.connector.Error as error:
        print(f"Error inserting words: {error}")

if __name__ == '__main__':
    words = read_words(WORDS_FILE_PATH)
    insert_words_into_db(words)
