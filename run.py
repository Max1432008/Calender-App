from flask import Flask, render_template, url_for, session, redirect
from auth import auth
from models import User, engine
from kalender import kalender
from send_mail import send_mail
from sqlalchemy.orm import sessionmaker
Session = sessionmaker(bind=engine)

app = Flask(__name__)
app.secret_key = "dev"

app.register_blueprint(auth)
app.register_blueprint(kalender)
app.register_blueprint(send_mail)

@app.route("/")
def index():
    return render_template("login.html")

@app.route("/register")
def registrieren():

    return render_template("register.html")


@app.route("/month-look")
def Calender_app():
    db_session = Session()

    user_id = session.get("user_id")

    if user_id is None:
        return redirect(url_for("index"))
    user = db_session.query(User).filter_by(id=user_id).first()

    if user is None:
        session.clear()
        return redirect(url_for("index"))

    return render_template("month-look.html")



@app.route("/logout")
def logout():

    session.pop("user_id", None)  # Löscht die user_id aus der Session

    return redirect(url_for("index"))






if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
