from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_bcrypt import Bcrypt
from config import Config  # Adjust import based on the location of your config file
from app.models.db_models import User, Base  # Replace with the file where your User model is defined

bcrypt = Bcrypt()

# Create a database engine using the configuration from Config class
DATABASE_URL = Config.SQLALCHEMY_DATABASE_URI
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Create the users table if it doesn't exist
Base.metadata.create_all(engine)

# Function to add a user
def add_user(firstname, lastname, email, password, user_type):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        first_name=firstname,
        last_name=lastname,
        email=email,
        password_hash=hashed_password,
        user_type=user_type
    )
    session.add(user)
    session.commit()
    print(f"{user_type.capitalize()} {firstname} {lastname} added successfully.")

# Main function to add admin, agents, and users
def main():
    try:
        # Adding one admin
        add_user(
            firstname='Admin',
            lastname='Admin',  # Admin will have last name as '1'
            email='admin@gmail.com',
            password='12345',  # Same password for all users
            user_type='admin'
        )

        # Adding three agents
        for i in range(1, 4):  # Agent last names will be '2', '3', '4'
            add_user(
                firstname='Agent',
                lastname=str(i),
                email=f'agent{i}@gmail.com',
                password='12345',
                user_type='agent'
            )

        # Adding three applicants
        for i in range(1, 4):  # Applicant last names will be '5', '6', '7'
            add_user(
                firstname='User',
                lastname=str(i),
                email=f'user{i}@gmail.com',
                password='12345',
                user_type='applicant'
            )

    except Exception as e:
        session.rollback()  # In case of any error, roll back the transaction
        print(f"Error: {e}")
    finally:
        session.close()  # Always close the session when done

if __name__ == "__main__":
    main()