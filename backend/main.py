from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data.data import labels


app = FastAPI()

origins = [
    "chrome-extension://*",  # Allow all chrome extensions
    "http://localhost",      # For local testing
    "http://localhost:8000", # Also commonly used for local testing
    "https://funda.nl/*",
    "https://funda.nl",
    "https://www.funda.nl/*",
    "https://www.funda.nl",

    # Add any other origins from which you expect requests, if any
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_id(link: str) -> str:
    path = link.rstrip('/').split('/')[-1]
    id_ = path.split('-')[1]
    return id_

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/lookup/")
async def lookup(keys: List[str]):
    return {"results": [labels.get(extract_id(key), "N/A") for key in keys]}
