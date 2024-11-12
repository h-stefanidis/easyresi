from flask import Blueprint, jsonify, request, session
from create_app import db
from app.models.db_models import *
from app.routes.auth import admin_login_required
from app.routes.utils import *

# Create a Blueprint for authentication routess
admin = Blueprint('admin', __name__)

# Dashboard Route
@admin.route('/dashboard', methods=['GET'])
@admin_login_required
def Dashboard():
    user = db.session.query(User).filter_by(user_id=session['user_id']).first()
    return jsonify({'message': 'Welcome to the admin Dashboard {}!'.format(user.first_name)})


# Route to show all agents in the system
@admin.route('/show_agents', methods=['GET'])
@admin_login_required
def show_agents():
    try:
        users = db.session.query(User).filter_by(user_type='agent').all()
        agents = [
            {
                'agent_id': user.user_id,
                'firstname': user.first_name,
                'lastname': user.last_name,
                'email': user.email
            }
            for user in users
        ]
        return jsonify({'type':'success', 'message': 'Agents fetched successfully', 'data':agents}), 200
    except Exception as e:
        return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500

# Route to show all agents in the system
@admin.route('/update_agents', methods=['GET','POST'])
@admin_login_required
def update_agents():
    if request.method == 'GET':
        try:
            users = db.session.query(User).filter_by(user_type = 'applicant').all()
            agents = db.session.query(User).filter_by(user_type = 'agent').all()
            applicants = [
                {
                    'user_id': user.user_id,
                    'firstname': user.first_name,
                    'lastname': user.last_name,
                    'email': user.email
                }
                for user in users
            ]

            agent = [
                {
                    'user_id': agent.user_id,
                    'firstname': agent.first_name,
                    'lastname': agent.last_name,
                    'email': agent.email
                }
                for agent in agents
            ]
            return jsonify({'type':'success', 'message': 'Users and agents fetched successfully', 'data': {'users': applicants, 'agents': agent}}), 200
        except Exception as e:
            return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500
    
    if request.method == 'POST':
        data = request.get_json()
        try:
            user = db.session.query(User).filter_by(user_id=data.get('user_id')).first()
            if user:
                user.managed_by = data.get('agent_id')
                db.session.commit()
                return jsonify({'type':'success', 'message': 'Updated user and agent'}), 200
            else :
                return jsonify({'type':'error','message': 'User not found'}), 404
        except Exception as e:
            print(e)
            return jsonify({'type':'error','message': 'An internal error occured.\n {}'.format(e)}), 500


    
    return data