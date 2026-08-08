from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

from rl import GridWorld, Agent, Trainer

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

def solveMaze(mazeGridInput: list, goal: tuple = (1,5)):
    grid = GridWorld(gridInp=mazeGridInput, goalLoc=goal)
    grid.setNonTerminalStates()
    agent = Agent(grid.nrows, grid.ncols)
    trainer = Trainer()
    trainer.train(agent=agent, environment=grid)
    # print(agent.getSimplePolicy(True))
    print(f"{trainer.crashCount=}")
    print(f"{trainer.goalCount=}")
    print(np.max(agent.Q))
    print(np.min(agent.Q))
    print(np.mean(agent.Q))


@app.post("/api/configs/")
def getConfig(mazeConfig: MazeConfig):
    # return ["Jai", "Hind"]
    print(mazeConfig.mazeGrid)
    solveMaze(mazeConfig.mazeGrid)
    return {"project": "maze-runner", **mazeConfig.model_dump()}




# @app.get("/{item}")
# def read_root(item: str = "kachodi"):
#     return {"status": item, "framework": "FastAPI"}
