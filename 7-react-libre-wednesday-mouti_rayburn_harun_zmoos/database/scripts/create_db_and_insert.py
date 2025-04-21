import mysql.connector
import os

# Database connection settings
DB_NAME = "wordle_multiplayer"
DB_USER = "wordle"
DB_PASSWORD = "wordle_admin"
DB_HOST = "127.0.0.1"
DB_PORT = 3306

# Path to the words file
WORDS_FILE_PATH = '5-letter-words.txt'
SQL_SCRIPT_PATH = 'create_tables_and_insert.sql'

def read_words(file_path):
    with open(file_path, 'r') as file:
        words = file.read().splitlines()
    return words

def execute_sql_script(script_path, connection):
    cursor = connection.cursor()
    with open(script_path, 'r') as file:
        sql_commands = file.read().split(';')
    for command in sql_commands:
        command = command.strip()
        if command:
            print(f"Executing SQL command: {command}")
            cursor.execute(command)
    connection.commit()
    cursor.close()

def insert_words_into_db(words):
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT
        )

        # Execute SQL script to create tables
        execute_sql_script(SQL_SCRIPT_PATH, connection)
        connection.commit()
        connection.close()
        print("Words inserted successfully")
    except mysql.connector.Error as error:
        print(f"Error inserting words: {error}")

if __name__ == '__main__':
    words = read_words(WORDS_FILE_PATH)
    insert_words_into_db(words)
