from flask import Flask, render_template
from auth import auth

app = Flask(__name__)
app.secret_key = "dev"

app.register_blueprint(auth)

@app.route("/")
def index():
    return render_template("login.html")

@app.route("/register")
def registrieren():
    return render_template("register.html")


@app.route("/month-look")
def Calender_app():
    return render_template("month-look.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
