from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

from rl import GridWorld, MCAgent, SARSAAgent, Trainer

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
    goalLocation: list
    modelConfigs: dict

def solveMaze(mazeConfig: MazeConfig):

    print(f"Model Configs : {mazeConfig.modelConfigs}") # type: ignore
    grid = GridWorld(gridInp=mazeConfig.mazeGrid, goalLoc=tuple(mazeConfig.goalLocation))
    grid.setNonTerminalStates()

    match mazeConfig.modelConfigs['model']: # type: ignore
        case "SARSA":
            agent = SARSAAgent(grid.nrows, grid.ncols)

        case "MC":
            agent = MCAgent(grid.nrows, grid.ncols)

    trainer = Trainer(numEpisodes=mazeConfig.modelConfigs['numEpisodes'], numRounds=mazeConfig.modelConfigs['numRounds'], gamma=mazeConfig.modelConfigs['gamma'], epsilon=mazeConfig.modelConfigs['epsilon']) # type: ignore
    trainer.train(agent=agent, environment=grid)
    print(agent.getPolicy('simple'))
    print(f"{trainer.crashCount=}")
    print(f"{trainer.goalCount=}")
    print(np.max(agent.Q))
    print(np.min(agent.Q))
    print(np.mean(agent.Q))
    return agent.getPolicy('serio')


@app.post("/api/configs/")
def getConfig(mazeConfig: MazeConfig):
    # return ["Jai", "Hind"]
    print(mazeConfig.mazeGrid)
    policy = solveMaze(mazeConfig).tolist()
    print(policy)
    return {"policy": policy}




# @app.get("/{item}")
# def read_root(item: str = "kachodi"):
#     return {"status": item, "framework": "FastAPI"}
