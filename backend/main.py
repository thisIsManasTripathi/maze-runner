from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MazeConfig(BaseModel):
    mazeDimensions: dict
    mazeGrid: list


@app.post("/api/configs/")
def getConfig(mazeConfig: MazeConfig):
    # return ["Jai", "Hind"]
    print(mazeConfig.mazeGrid)
    return {"project": "maze-runner", **mazeConfig.model_dump()}

# @app.get("/{item}")
# def read_root(item: str = "kachodi"):
#     return {"status": item, "framework": "FastAPI"}
