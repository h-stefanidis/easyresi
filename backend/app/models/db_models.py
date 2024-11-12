from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime,Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime


Base = declarative_base()

# User table
class User(Base):
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    user_type = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    managed_by = Column(Integer, default=0)

    profiles = relationship('UserProfile', backref='user')
    scores = relationship('UserScore', backref='user')

# UserProfile table
class UserProfile(Base):
    __tablename__ = 'userprofiles'
    
    #profile_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'),primary_key=True, nullable=False)
    
    visa_type = Column(String(100), nullable=False)
    age_group = Column(String(10), nullable=False)
    english_proficiency = Column(String(50), nullable=False)
    overseas_experience = Column(String(50), nullable=False)
    australian_experience = Column(String(50), nullable=False)
    qualification = Column(String(255), nullable=False)
    australian_education = Column(String(10), nullable=False)
    specialist_education = Column(String(10), nullable=False)
    community_lang = Column(String(20), nullable=False)
    regional_area = Column(String(10), nullable=False)
    marital_status = Column(String(20), nullable=False)
    professional_year = Column(String(10), nullable=False)
    nomination = Column(String(255), nullable=False)
    preferred_qualifications = Column(String(50), nullable=False)
    preferred_course = Column(String(100), nullable=False)
    preferred_industry = Column(String(100), nullable=False)
    preferred_occupation = Column(String(50), nullable=False)
    preferred_location = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

# UserScore table
class UserScore(Base):
    __tablename__ = 'userscore'

    user_id = Column(Integer, ForeignKey('users.user_id'), primary_key=True, nullable=False)
    age_group_score = Column(Integer, nullable=False)
    english_proficiency_score = Column(Integer, nullable=False)
    overseas_experience_score = Column(Integer, nullable=False)
    australian_experience_score = Column(Integer, nullable=False)
    qualification_score = Column(Integer, nullable=False)
    australian_education_score = Column(Integer, nullable=False)
    specialist_education_score = Column(Integer, nullable=False)
    community_lang_score = Column(Integer, nullable=False)
    regional_area_score = Column(Integer, nullable=False)
    marital_status_score = Column(Integer, nullable=False)
    professional_year_score = Column(Integer, nullable=False)
    nomination_score = Column(Integer, nullable=False)
    industry_score = Column(Integer, default=0)
    sol_score = Column(Integer, default=0)
    total_score = Column(Integer, nullable=False)


class JobsShortage(Base):
    __tablename__ = 'occupation_shortage'

    anzsco=Column(Integer, primary_key=True)
    occupation=Column(String(255), nullable=False)
    nsw_shortage=Column(Integer, nullable=False)
    vic_shortage=Column(Integer, nullable=False)
    qld_shortage=Column(Integer, nullable=False)
    sa_shortage=Column(Integer, nullable=False)
    wa_shortage=Column(Integer, nullable=False)
    tas_shortage=Column(Integer, nullable=False)
    nt_shortage=Column(Integer, nullable=False)
    act_shortage=Column(Integer, nullable=False)
    sector=Column(String(20), nullable=False)

class UniCourse(Base):
    __tablename__ = 'unicourse'
    course_id=Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    course=Column(String(100), nullable=False)
    sector=Column(String(20), nullable=False)
    uni=Column(String(50), nullable=False)
    state=Column(String(20),nullable=False)
    course_type=Column(String(20), nullable=False)
    duration=Column(Float, nullable=False)
    fee=Column(Integer, nullable=False)
    uni_rank=Column(Integer, nullable=False)

class CostOfLiving(Base):
    __tablename__='cost_of_living'
    city_id=Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    city_name=Column(String(20), nullable=False)
    state=Column(String(20), nullable=False)
    min_cost=Column(Integer, nullable=False)
    max_cost=Column(Integer, nullable=False)