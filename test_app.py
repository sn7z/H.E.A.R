from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from db_config import get_connection
from werkzeug.security import generate_password_hash, check_password_hash
import traceback
from flask_cors import CORS  # You'll need to install this: pip install flask-cors
import os

app = Flask(__name__)
app.secret_key = 'safeguard_secret_key'

# Enable CORS to allow requests from your frontend dev server
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Path to your frontend build directory (if serving frontend from Flask)
# This would be the directory where your npm build outputs files
FRONTEND_BUILD_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../frontend/dist')

# Serve frontend static files if needed
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(FRONTEND_BUILD_PATH, path)

@app.route('/')
def home():
    # Redirect to login if not logged in, else to dashboard
    if 'user' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Check if the request is JSON (API call from frontend)
        if request.is_json:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            mobile_no = data.get('mobile_no')
            emergency_contact = data.get('emergency_contact')
        else:
            # Regular form submission
            username = request.form.get('username')
            email = request.form.get('email')
            password = request.form.get('password')
            mobile_no = request.form.get('mobile_no')
            emergency_contact = request.form.get('emergency_contact')

        # Basic validation
        if not username or not email or not password:
            if request.is_json:
                return jsonify({"success": False, "message": "Username, Email, and Password are required."}), 400
            flash("Username, Email, and Password are required.", "danger")
            return render_template('signup.html')

        password_hash = generate_password_hash(password)

        try:
            conn = get_connection()
            cursor = conn.cursor()

            # Check for duplicate username or email
            cursor.execute("SELECT id FROM users WHERE email=%s OR username=%s", (email, username))
            existing = cursor.fetchone()
            if existing:
                if request.is_json:
                    return jsonify({"success": False, "message": "Email or Username already exists."}), 400
                flash("Email or Username already exists.", "danger")
                return render_template('signup.html')

            # Insert new user
            cursor.execute("""
                INSERT INTO users (username, email, password, mobile_no, emergency_contact)
                VALUES (%s, %s, %s, %s, %s)
            """, (username, email, password_hash, mobile_no, emergency_contact))
            conn.commit()
            
            if request.is_json:
                return jsonify({"success": True, "message": "Account created successfully. Please log in."})
            flash("Account created successfully. Please log in.", "success")
            return redirect(url_for('login'))

        except Exception as e:
            print(traceback.format_exc())
            if request.is_json:
                return jsonify({"success": False, "message": f"Signup Error: {str(e)}"}), 500
            flash(f"Signup Error: {str(e)}", "danger")
        finally:
            if 'cursor' in locals(): cursor.close()
            if 'conn' in locals(): conn.close()

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Check if the request is JSON (API call from frontend)
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
        else:
            # Regular form submission
            email = request.form.get('email')
            password = request.form.get('password')

        try:
            conn = get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            user = cursor.fetchone()

            if user and check_password_hash(user['password'], password):
                session['user'] = user['username']
                
                if request.is_json:
                    return jsonify({
                        "success": True, 
                        "message": "Login successful!",
                        "redirect": url_for('dashboard')
                    })
                flash("Login successful!", "success")
                return redirect(url_for('dashboard'))
            else:
                if request.is_json:
                    return jsonify({"success": False, "message": "Invalid email or password."}), 401
                flash("Invalid email or password.", "danger")

        except Exception as e:
            print(traceback.format_exc())
            if request.is_json:
                return jsonify({"success": False, "message": f"Login Error: {str(e)}"}), 500
            flash(f"Login Error: {str(e)}", "danger")
        finally:
            if 'cursor' in locals(): cursor.close()
            if 'conn' in locals(): conn.close()

    return render_template('login.html')

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    """API endpoint to check if user is authenticated"""
    if 'user' in session:
        return jsonify({"authenticated": True, "username": session['user']})
    return jsonify({"authenticated": False})

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        if request.headers.get('Accept') == 'application/json':
            return jsonify({"success": False, "message": "Please login first."}), 401
        flash("Please login first.", "warning")
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['user'])

@app.route('/logout')
def logout():
    session.pop('user', None)
    if request.headers.get('Accept') == 'application/json':
        return jsonify({"success": True, "message": "Logged out successfully."})
    flash("Logged out successfully.", "info")
    return redirect(url_for('login'))

# Add this missing import for serving static files
from flask import send_from_directory

if __name__ == '__main__':
    app.run(debug=True, port=5000)