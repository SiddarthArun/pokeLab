from flask import request, jsonify
from config import app, db
from models import Team, User
from pokeAlgorithm import rate
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


@app.route('/save_team', methods = ['POST'])
@jwt_required()
def save_team():
    data = request.json
    print(data)

    user_id = get_jwt_identity()
    team_name = data.get('name')
    pokemons = data.get('pokemons')

    if not team_name or not pokemons:
        return jsonify({'error':'Missing team name or pokemons'}),400
    new_team = Team(name=team_name, pokemons=pokemons, user_id=user_id)
    db.session.add(new_team)
    db.session.commit()

    return jsonify({'message':'Team created successfully'})

@app.route('/teams', methods=['GET'])
def get_teams():
    page= request.args.get('page',type=int)
    pagination = Team.query.paginate(page=page, per_page=10,error_out=False)
    teams = pagination.items

    return jsonify({
        'teams': [{'id': t.id, 'name': t.name, 'pokemons': t.pokemons} for t in teams],
        'page': pagination.page,
        'total_pages': pagination.pages,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
    })

@app.route('/my_teams', methods =['GET'])
@jwt_required()
def get_my_teams():
    user_id = get_jwt_identity()

    #get the page we're on
    page = request.args.get('page',1,type=int)

    pagination = Team.query.filter_by(user_id=user_id).paginate(page=page, per_page=5, error_out=False)
    teams = pagination.items
    
    return jsonify({
        'teams': [{'id': t.id, 'name': t.name, 'pokemons': t.pokemons} for t in teams],
        'page': pagination.page,
        'total_pages': pagination.pages,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
    })
        

@app.route('/delete_team', methods = ['DELETE'])
@jwt_required()
def delete_team():
    data = request.json
    team_id = data.get('id')
    user_id = get_jwt_identity()

    if not team_id:
        return jsonify({'error': 'Missing team name'}),400
    
    team = Team.query.filter_by(id=team_id, user_id=user_id).first()

    if not team:
        return jsonify({'error':'Team not found'}),404
    
    db.session.delete(team)
    db.session.commit()

    return jsonify({'message':'Team deleted successfully'})

@app.route('/analyze', methods=['POST'])
def analyze():
    team_data = request.json.get('team', [])
    team_names = [pokemon.get('name', '') for pokemon in team_data if 'name' in pokemon]

    if not team_names:
        return jsonify({'error': 'No valid Pokémon names provided for analysis.'}), 400

    result = rate(team_names)
    return jsonify(result)



#Signup/Login/Logout Routes

@app.route('/register', methods = ['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error':'User already exists'}),400
    user = User(username=data['username'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered'})

@app.route('/login', methods = ['POST'])
def login():
    data=request.json
    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error':'Invalid credentials'}), 401
    
    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token':token})



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)