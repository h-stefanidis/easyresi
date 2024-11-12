import pandas as pd
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Float
from app.models.database import create_database, create_tables
from config import Config

# Step 1: Create a database engine
def get_db_engine():
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    return engine


# Step 3: Load data from CSVs and insert into the custom tables
def load_data(engine):
    # Load CSVs into dataframes
    unicourse_df = pd.read_csv('app/data_sets/unicourse.csv').dropna(axis=1, how='all')
    cost_of_living_df = pd.read_csv('app/data_sets/cost_of_living.csv').dropna(axis=1, how='all')
    occupation_shortage_df = pd.read_csv('app/data_sets/occupation_shortage.csv').dropna(axis=1, how='all')

    # Insert data into unicourse table
    unicourse_df.to_sql('unicourse', con=engine, if_exists='replace', index=False)

    # Insert data into cost_of_living table
    cost_of_living_df.to_sql('cost_of_living', con=engine, if_exists='replace', index=False)

    # Insert data into occupation_shortage table
    occupation_shortage_df.to_sql('occupation_shortage', con=engine, if_exists='replace', index=False)

    print("Data loaded successfully")

# Main function to create tables and load data
def main():
    engine = get_db_engine()

    # Load data from CSV files and insert into the custom tables
    load_data(engine)

if __name__ == "__main__":
    create_database()  # Create the database if it doesn't exist
    create_tables()  # Create the necessary tables
    main()