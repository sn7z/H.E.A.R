import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",  # Change as per your MySQL configuration
        password="Murtuza0@",  # Change as per your MySQL configuration
        database="auth_system"
    )

# Only test connection if this file is run directly
if __name__ == "__main__":
    try:
        conn = get_connection()
        print("Database connection successful!")
        conn.close()
    except Exception as e:
        print(f"Error connecting to database: {e}")