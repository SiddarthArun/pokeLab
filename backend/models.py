from config import db
from sqlalchemy import JSON
from werkzeug.security import generate_password_hash, check_password_hash


class Team(db.Model):
    id=db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), nullable = False)
    pokemons = db.Column(JSON)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)

    def set_password(self,password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
