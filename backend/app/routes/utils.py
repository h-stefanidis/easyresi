from create_app import db
from app.models.db_models import *
import pandas as pd
from flask import session, jsonify

points_table = {
    'age': {
        "18-25":25,
        "25-33":30,
        "33-40":25,
        "40-45":15
    },
    "english_proficiency" : {
        "competent" : 0,
        "proficient" : 10,
        "superior": 20
    },
    "overseas_experience" : {
        "0":0,
        "3-5":5,
        "5-8":10,
        "8+":15
    },
    "australian_experience" : {
        "0":0,
        "1-3":5,
        "3-5":10,
        "5-8":15,
        "8+":20
    },
    "qualification": {
        "phd":20,
        "bachelor":15,
        "diploma":10,
        "qualification":10
    },
    "specialist_education": {
        "yes":10,
        "no":0
    },
    "australian_education" : {
        "yes":5,
        "no":0
    },
    "professional_year": {
        "yes":5,
        "no":0
    },
    "community_lang" : {
        "yes":5,
        "no":0
    },
    "regional_area" : {
        "yes":5,
        "no":0
    },
    "marital_status": {
        "single":10,
        "married_skilled":10,
        "married_unskilled":5
    },
    "nomination" : {
        "yes":5,
        "no":0
    },
    "state": {
        "nsw": 1,
        "vic": 2,
        "qld":3,
        "sa":4,
        "wa":5,
        "tas":6,
        "nt":7,
        "act":8
    }
}

def get_or_update_points(profile,db,existing_entry=False):
    user_id = profile.user_id
    age_group_score = points_table["age"][profile.age_group]
    english_proficiency_score = points_table["english_proficiency"][profile.english_proficiency]
    overseas_experience_score = points_table["overseas_experience"][profile.overseas_experience]
    australian_experience_score = points_table["australian_experience"][profile.australian_experience]
    qualification_score = points_table["qualification"][profile.qualification]
    australian_education_score = points_table["australian_education"][profile.australian_education]
    specialist_education_score = points_table["specialist_education"][profile.specialist_education]
    community_lang_score = points_table["community_lang"][profile.community_lang]
    regional_area_score = points_table["regional_area"][profile.regional_area]
    marital_status_score = points_table["marital_status"][profile.marital_status]
    professional_year_score = points_table["professional_year"][profile.professional_year]
    nomination_score = points_table["nomination"][profile.nomination]

    job = db.session.query(JobsShortage).filter_by(anzsco=profile.preferred_occupation).first()

    preferred_state_value = getattr(job, str(profile.preferred_location).lower() + "_shortage")
    industry_score=preferred_state_value
    #sol = db.session.query(SolList).filter_by(anzsco=prfile.preferred_occupation).first()
    #sol_score = sol.sol_score
    sol_score = 5
    total_score = age_group_score + english_proficiency_score + overseas_experience_score + australian_experience_score + qualification_score +\
        australian_education_score + specialist_education_score + community_lang_score + regional_area_score + marital_status_score +\
        professional_year_score + nomination_score + industry_score + sol_score
    if existing_entry:
        existing_entry.age_group_score=age_group_score,
        existing_entry.english_proficiency_score=english_proficiency_score,
        existing_entry.overseas_experience_score=overseas_experience_score,
        existing_entry.australian_experience_score=australian_experience_score,
        existing_entry.qualification_score=qualification_score,
        existing_entry.australian_education_score=australian_education_score,
        existing_entry.specialist_education_score=specialist_education_score,
        existing_entry.community_lang_score=community_lang_score,
        existing_entry.regional_area_score=regional_area_score,
        existing_entry.marital_status_score=marital_status_score,
        existing_entry.professional_year_score=professional_year_score,
        existing_entry.nomination_score=nomination_score,
        existing_entry.industry_score=industry_score,
        existing_entry.sol_score=sol_score,
        existing_entry.total_score=total_score
        db.session.commit()
        return None
    else:
        new_entry = UserScore(
            user_id=profile.user_id,
            age_group_score=age_group_score,
            english_proficiency_score=english_proficiency_score,
            overseas_experience_score=overseas_experience_score,
            australian_experience_score=australian_experience_score,
            qualification_score=qualification_score,
            australian_education_score=australian_education_score,
            specialist_education_score=specialist_education_score,
            community_lang_score=community_lang_score,
            regional_area_score=regional_area_score,
            marital_status_score=marital_status_score,
            professional_year_score=professional_year_score,
            nomination_score=nomination_score,
            industry_score=industry_score,
            sol_score=sol_score,
            total_score=total_score
        )
        return new_entry

def get_input_json(data):
    input_json = {
            'visa_type' : data.get('visaType'),
            'age_group' : data.get('age'),
            'english_proficiency' : data.get('englishProficiency'),
            'overseas_experience' : data.get('overseasExperience'),
            'australian_experience' : data.get('australiaExperience'),
            'qualification' : data.get('education'),
            'australian_education' : data.get('australianStudy'),
            'specialist_education' : data.get('specialistEducation'),
            'community_lang' : data.get('communityLanguage'),
            'professional_year' : data.get('professionalYear'),
            'regional_area' : data.get('regionalStudy'),
            'marital_status' : data.get('maritalStatus'),
            'nomination' : data.get('nomination'),
            'preferred_location' : data.get('statePreferred'),
            'preferred_industry' : data.get('preferredIndustry'),
            'preferred_qualifications' : data.get('courseLevel'),
            'preferred_course' : data.get('preferredCourse'),
            'preferred_occupation' : data.get('preferredOccupation')
        }
    return input_json

def get_or_update_profile_entry(input_json,db,input_user_id,existing_profile=False):
    # Create a new Questionnaire entry
    if existing_profile:
        print('existing profile: ', existing_profile.user_id)
        existing_profile.visa_type = input_json['visa_type'],
        existing_profile.age_group=input_json['age_group'],
        existing_profile.english_proficiency=input_json['english_proficiency'],
        existing_profile.overseas_experience=input_json['overseas_experience'],
        existing_profile.australian_experience=input_json['australian_experience'],
        existing_profile.qualification=input_json['qualification'],
        existing_profile.australian_education=input_json['australian_education'],
        existing_profile.specialist_education=input_json['specialist_education'],
        existing_profile.community_lang=input_json['community_lang'],
        existing_profile.professional_year=input_json['professional_year'],
        existing_profile.regional_area=input_json['regional_area'],
        existing_profile.marital_status=input_json['marital_status'],
        existing_profile.nomination=input_json['nomination'],
        existing_profile.preferred_location=input_json['preferred_location'],
        existing_profile.preferred_industry=input_json['preferred_industry'],
        existing_profile.preferred_qualifications=input_json['preferred_qualifications'],
        existing_profile.preferred_course=input_json['preferred_course'],
        existing_profile.preferred_occupation=input_json['preferred_occupation']

        db.session.commit()
        return None
    else:
        profile_entry = UserProfile(
            user_id=input_user_id,
            visa_type = input_json['visa_type'],
            age_group=input_json['age_group'],
            english_proficiency=input_json['english_proficiency'],
            overseas_experience=input_json['overseas_experience'],
            australian_experience=input_json['australian_experience'],
            qualification=input_json['qualification'],
            australian_education=input_json['australian_education'],
            specialist_education=input_json['specialist_education'],
            community_lang=input_json['community_lang'],
            professional_year=input_json['professional_year'],
            regional_area=input_json['regional_area'],
            marital_status=input_json['marital_status'],
            nomination=input_json['nomination'],
            preferred_location=input_json['preferred_location'],
            preferred_industry=input_json['preferred_industry'],
            preferred_qualifications=input_json['preferred_qualifications'],
            preferred_course=input_json['preferred_course'],
            preferred_occupation=input_json['preferred_occupation']
        )
        return profile_entry

def generate_model_input(profile,scores):
    input_data = {
        "age_group_score": scores.age_group_score,
        "english_proficiency_score": scores.english_proficiency_score,
        "overseas_experience_score": scores.overseas_experience_score,
        "australian_experience_score": scores.australian_experience_score,
        "qualification_score": scores.qualification_score,
        "specialist_education_score": scores.specialist_education_score,
        "australian_education_score": scores.australian_education_score,
        "professional_year_score": scores.professional_year_score,
        "community_lang_score": scores.community_lang_score,
        "regional_area_score": scores.regional_area_score,
        "marital_status_score": scores.marital_status_score,
        "nomination_score": scores.nomination_score,
        "industry_score": scores.industry_score,
        "state": points_table["state"][str(profile.preferred_location).lower()],
        "sol_score": scores.sol_score,
        "total_score": scores.total_score,
        "anzco": int(profile.preferred_occupation)
    }
    model_inputdf = pd.DataFrame([input_data], columns=[
    'age_group_score',
    'english_proficiency_score',
    'overseas_experience_score',
    'australian_experience_score',
    'qualification_score',
    'specialist_education_score',
    'australian_education_score',
    'professional_year_score',
    'community_lang_score',
    'regional_area_score',
    'marital_status_score',
    'nomination_score',
    'industry_score',
    'state',
    'sol_score',
    'total_score',
    'anzco'
    ])

    return model_inputdf

def get_pr_prob(model,df):
    y_proba=model.predict_proba(df)
    pr_prob = round(float(y_proba[:, 1][0]*100),3)
    return pr_prob

def get_pr_prob_for_states(profile,input_df,model):
    prob_for_states = {}
    df = input_df.copy()
    states = {1:"NSW",2:"VIC",3:"QLD",4:"SA",5:"WA",6:"TAS",7:"NT",8:"ACT"}
    job = db.session.query(JobsShortage).filter_by(anzsco=profile.preferred_occupation).first()
    original_score = df['total_score']+ (df['industry_score'] * -1)
    for state in points_table["state"].values():
        df['state'] = state
        df['industry_score']  = getattr(job, states[state].lower() + "_shortage")
        df['total_score'] = original_score+df['industry_score']
        y_proba=model.predict_proba(df)
        prob_class_1 = round(float(y_proba[:, 1][0]*100),3)
        prob_for_states[states[state]] = prob_class_1
    
    return prob_for_states

def get_pr_prob_for_jobs(model,input_df,db,profile):
    prob_for_jobs={}
    df = input_df.copy()
    industry=db.session.query(JobsShortage.sector).filter_by(anzsco=int(df['anzco'][0])).first()
    column_to_select = getattr(JobsShortage, str(profile.preferred_location).lower() + "_shortage")
    jobs = db.session.query(JobsShortage).filter_by(sector=industry[0]).order_by(column_to_select).limit(5).all()
    original_score = df['total_score']+ (df['industry_score'] * -1)
    for job in jobs:
        df['anzco']=job.anzsco
        df['industry_score'] = getattr(job, column_to_select.key)
        df['total_score'] = original_score + df['industry_score']
        y_proba=model.predict_proba(df)
        prob_class_1 = round(float(y_proba[:, 1][0]*100),3)
        prob_for_jobs[job.anzsco] = prob_class_1
    
    return prob_for_jobs

def cost_of_living(db,profile): # add cost of living function
    print("starting cost of living")
    state = profile.preferred_location
    query = "SELECT * FROM cost_of_living WHERE lower(state) = lower('{}')".format(state)
    df = pd.read_sql(query, db.engine)
    cost_of_living = {
        'min_cost': int(df['min_cost'].values[0]),
        'max_cost': int(df['max_cost'].values[0])
    }    
    print("some string")
    print(cost_of_living)
    return cost_of_living


def recommend_uni(db,profile):
    state = profile.preferred_location
    degree = profile.preferred_qualifications
    industry = profile.preferred_industry
    print("dfhjsdfhj: ", state, degree, industry)
    # Define the SQL query
    query = "SELECT * FROM unicourse WHERE lower(state) = lower('{}') AND lower(course_type) = lower('{}') AND lower(sector) = lower('{}')".format(state,degree,industry)

    # Use the db engine to connect and fetch data into a pandas DataFrame
    df = pd.read_sql(query, db.engine)
    
    
    #filtered_df = df[(df['State'] == state) & (df['Type'] == degree) & (df['Sector'] == industry)].copy()

    df.loc[:, 'yearly_fee'] = df['fee'] / df['duration']

    sorted_by_fee_df = df.sort_values(by='yearly_fee').head(5)
    sorted_by_rank_df = df.sort_values(by='uni_rank').head(5)
    #cost_of_living = cf[cf['state'] == state][['Min Cost', 'Max Cost']].values[0]

    #result = sorted_df[['University', 'Degree', 'Yearly Fee', 'Duration']].copy()
    #result['Total Min Cost (Tuition + Min Cost)'] = result['Yearly Fee'] + cost_of_living[0]
    #result['Total Max Cost (Tuition + Max Cost)'] = result['Yearly Fee'] + cost_of_living[1]
    return {
                "by_fee":sorted_by_fee_df.to_dict(orient='records'),
                "by_rank":sorted_by_rank_df.to_dict(orient='records'),
            }

def get_ques_data(db):
    
    occupation_by_industry = {}
    #SQL query
    query = "SELECT anzsco, occupation, sector FROM occupation_shortage"
    
    # Use the db engine to connect and fetch data into a pandas DataFrame
    df = pd.read_sql(query, db.engine)

    industries = ['IT', 'Business', 'Health', 'Education', 'Engineering']

    for industry in industries:
        filtered_df = df[df['sector'] == industry]
        occupation_list = filtered_df[['anzsco','occupation']].to_dict(orient='records')
        occupation_by_industry[industry] = occupation_list
    
    return occupation_by_industry

def prefill_ques(profile):

    user_input = {
            'visaType' : profile.visa_type,
            'age' : profile.age_group,
            'englishProficiency' : profile.english_proficiency,
            'overseasExperience' : profile.overseas_experience,
            'australiaExperience' : profile.australian_experience,
            'education' : profile.qualification,
            'australianStudy' : profile.australian_education,
            'specialistEducation' : profile.specialist_education,
            'communityLanguage' : profile.community_lang,
            'professionalYear' : profile.professional_year,
            'regionalStudy' : profile.regional_area,
            'maritalStatus' : profile.marital_status,
            'nomination' : profile.nomination,
            'statePreferred' : profile.preferred_location,
            'preferredIndustry' : profile.preferred_industry,
            'courseLevel' : profile.preferred_qualifications,
            'preferredCourse' : profile.preferred_course,
            'preferredOccupation' : profile.preferred_occupation
        }
    return user_input