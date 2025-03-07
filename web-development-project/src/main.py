from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from typing import List

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def home():
    return {"message": "Welcome to Resume Enhancer API"}

class User(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    experience: int = Field(..., ge=0)

# In-memory storage for users
users = [
    User(name="John Doe", email="john@example.com", experience=5),
    User(name="Jane Smith", email="jane@example.com", experience=3)
]

@app.post("/user/")
def create_user(user: User):
    users.append(user)
    return {"message": f"User {user.name} with email {user.email} and {user.experience} years of experience created successfully."}

@app.get("/users/", response_model=List[User])
def get_users():
    return users

@app.put("/user/{email}")
def update_user(email: str, updated_user: User):
    for user in users:
        if user.email == email:
            user.name = updated_user.name
            user.experience = updated_user.experience
            return {"message": f"User {user.name} with email {user.email} updated successfully."}
    raise HTTPException(status_code=404, detail="User not found")

@app.delete("/user/{email}")
def delete_user(email: str):
    global users
    users = [user for user in users if user.email != email]
    return {"message": f"User with email {email} deleted successfully."}