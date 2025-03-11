import sqlite3
import bcrypt

DATABASE_URL = "jamevo.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row
    return conn


def create_user_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'user')) NOT NULL,
            instrument TEXT
        )
    """)
    conn.commit()
    conn.close()


def hash_password(password: str):
    bytes = password.encode()
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytes, salt).decode()


def verify_password(input_pass: str, hashed_pass: str):
    return bcrypt.checkpw(input_pass.encode(), hashed_pass.encode())


def insert_user(user_name, password, role, instrument):
    conn = get_db_connection()
    cursor = conn.cursor()
    hashed_pass = hash_password(password)
    cursor.execute("""
        INSERT INTO users (username, password, role, instrument)
        VALUES (?, ?, ?, ?)
    """, (user_name, hashed_pass, role, instrument))
    conn.commit()
    conn.close()


def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user


def get_user_role(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT role FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user["role"] if user else None


