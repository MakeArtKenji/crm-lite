from fastapi import FastAPI
import uvicorn

# Initialize the FastAPI app
app = FastAPI()

# Define the route
@app.get("/")
def hello():
    return {"message": "Hello from FastAPI!"}

# This part replaces Flask's app.run()
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)