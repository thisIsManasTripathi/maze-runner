import numpy as np
import random as rm


class GridWorld:

    penalty = -10

    def __init__(self, gridInp: list, goalLoc: tuple):
        self.nrows = len(gridInp)
        self.ncols = len(gridInp[0])
        self.goalLoc = goalLoc

        ## Generating the map
        try:
            self.mapMatrix = np.array(gridInp)
            # print(self.mapMatrix)
        except Exception as e:

            print(e)

        # print("Environment set!")
        # print(self.mapMatrix)

    def setNonTerminalStates(self):
        self.nonTerminalStates = []
        for i in range(self.nrows):
            for j in range(self.ncols):
                self.nonTerminalStates.append((i,j)) if (self.mapMatrix[i,j] != self.penalty) else 0

      

class Agent():

    actions = ["up", "down", "left", "right"]

    actionsSymbolic = ["▲", "▼", "◀", "▶"]
    


    def __init__(self, nrows: int, ncols):
        self.rowStates=nrows
        self.colStates = ncols
        self.Q = np.zeros((nrows, ncols, 4)) #4 possible actions in each state
        self.N = np.zeros((nrows, ncols, 4))
        self.policy = np.full((nrows, ncols, 4), 0.25)


    def move(self, action:str, pos: tuple):

        match(action):
            case "up":
                next_state = (pos[0]-1, pos[1])
            case "down":
                next_state = (pos[0]+1, pos[1])
            case "left":
                next_state = (pos[0], pos[1]-1)
            case "right":
                next_state = (pos[0], pos[1]+1)
                
        return next_state

    def getPolicy(self, ptype: str = 'simple'):
        
        match (ptype):
            case 'simple':
                policyH = np.full((self.rowStates,self.colStates), "") #policyH(uman readable)
                for i in range(1, self.rowStates-1):
                    for j in range(1, self.colStates-1):
                        # print(f"{(i,j)=}")
                        policyH[i,j] = self.actionsSymbolic[np.argmax(self.policy[i,j])]

                return policyH
            case 'serio':
                policyA = np.zeros(shape=(self.rowStates, self.colStates, 2)) #policyA(ctionable)
                for i in range(1, self.rowStates-1):
                    for j in range(1, self.colStates-1):
                        action = np.argmax(self.policy[i,j])
                        match (action):
                            case 0:
                                value = [-1,0]
                            case 1:
                                value = [1,0]
                            case 2:
                                value = [0,-1]
                            case _:
                                value = [0,1]

                        policyA[i, j] = value

                return policyA


class MCAgent(Agent):

    def __init__(self, numStates: int):
        pass


class Trainer():

    rng = np.random.default_rng()

    def __init__(self, numRounds: int = 15, numEpisodes:int = 750, gamma: float = 0.9, epsilon: float = 0.1):
        self.numRounds = numRounds
        self.numEpisodes = numEpisodes
        self.gamma = gamma
        self.epsilon = epsilon
        self.goalCount = 0
        self.crashCount = 0

    @staticmethod
    def random_argmax(arr):
        max_val = np.max(arr)
        all_indices = np.where(arr == max_val)
        return rm.choice(all_indices[0])
    

    def generate_episode(self, state, agent, environment):
        episode = []
        
        while (state != environment.goalLoc and len(episode)<100):


            # print(actions_prob)

            # for i in range(4):
            #     agent.policy[*state, i] = greedy_prob if i == greedy_action_index else non_greedy_prob
            # print(state)

            action = Trainer.rng.choice([0,1,2,3], p=agent.policy[state])
            # print (state, action)
            nextState = agent.move(Agent.actions[action], state)
            episode.append((*state,action))
            if (nextState not in environment.nonTerminalStates):
                episode.append((*nextState,action))
                # print(f" went out of bound : {nextState}")
                continue

            state = nextState

        episode.append((*state, 0))
        # print(f"{episode=}\n\n")
        return np.array(episode)
    

    def improvePolicy(self, agent, environment):


        for i in range(1,environment.nrows-1):
            for j in range(1,environment.ncols-1):  

                greedy_action_index = Trainer.random_argmax(agent.Q[i,j])
                # print(f"{greedy_action_index=}")
                non_greedy_prob = self.epsilon/4 #cause here the number of actions in any state is 4
                greedy_prob = 1 - self.epsilon + non_greedy_prob

                actions_prob = [greedy_prob if i == greedy_action_index else non_greedy_prob for i in range(4)]
                agent.policy[i,j] = actions_prob.copy() 


    def train(self, agent, environment: GridWorld):
        for i in range(self.numRounds):

            agent.Q = np.zeros((environment.nrows, environment.ncols, 4))
            agent.N = np.zeros_like(agent.Q)

            for i in range(self.numEpisodes):
                episode = self.generate_episode(rm.choice(environment.nonTerminalStates), agent, environment)
                # print(episode[-1][:-1])
                if (episode[-1][:-1] == environment.goalLoc).all():
                    self.goalCount += 1
                else:
                    self.crashCount += 1
                # print(f"Episode : \n{episode}\n")
                rows = episode[:,0]
                cols = episode[:,1]
                rews = environment.mapMatrix[rows, cols]  #vector of rewards
                # print(f"{rews=}")
                visited = set()
                for epIdx in range(len(episode)-1):
                    if tuple(episode[epIdx]) not in visited:
                        # visited.add(episode[epIdx])
                        visited.add(tuple(episode[epIdx]))

                        # discountedReward = rew*(self.gamma**(len(episode)-epIdx-2))
                        # G = np.sum(rews[epIdx:]) #undiscountedReturn
                        # [print(f"{rews[i]}*{self.gamma**i:.2f}", end=" + ") for i in range(len(rews[epIdx:]))]
                        # print("\n\n")
                        # print(np.dot((rews[epIdx:]), np.array([self.gamma**i for i in range(len(rews[epIdx:]))])))
                        discountedReward = np.sum(np.dot((rews[epIdx:]), np.array([self.gamma**i for i in range(len(rews[epIdx:]))])))
                        # print(f"Reward for state {episode[epIdx]} = {discountedReward}\n\n")
                        # G = (len(episode)-epIdx-1)*(-0.1) + rew # 'return' of the state, action
                        agent.N[*episode[epIdx]] += 1
                        # print("Old Q:", agent.Q[*episode[epIdx]])
                        # print(agent.Q[*episode[epIdx]])
                        agent.Q[*episode[epIdx]] = agent.Q[*episode[epIdx]] + ((1/agent.N[*episode[epIdx]])*(discountedReward - agent.Q[*episode[epIdx]])) #for discounted reward
                        # agent.Q[episode[epIdx]] = agent.Q[episode[epIdx]] + ((1/agent.N[episode[epIdx]])*(G - agent.Q[episode[epIdx]])) #for negative step reward

                        # print("State:", episode[epIdx][:2])
                        # print("Action:", episode[epIdx][2])
                        # print("Return:", discountedReward)
                        # print("New Q:", agent.Q[*episode[epIdx]])
                                            
            self.improvePolicy(agent, environment)
            # print(agent.getSimplePolicy(True))

        return agent.policy
    
pathVal = -0.1
# # arr = [[-10, -10, -10, -10, -10, -10, -10, -10], 
# #              [-10, pathVal, pathVal, pathVal, pathVal, pathVal, pathVal, -10], 
# #              [-10, pathVal, -10, pathVal, -10, -10, pathVal, -10], 
# #              [-10, pathVal, -10, pathVal, pathVal, -10, pathVal, -10], 
# #              [-10, pathVal, pathVal, -10, -10, pathVal, pathVal, -10], 
# #              [-10, -10, pathVal, pathVal, pathVal, -10, -10, -10], 
# #              [-10, pathVal, -10, -10, pathVal, pathVal, 100, -10], 
# #              [-10, -10, -10, -10, -10, -10, -10, -10]]
arr = [[-10,   -10,   -10,   -10,   -10,   -10,   -10,   -10,  ],
 [-10,    pathVal, -10,    pathVal, -10,   -10,   -10,   -10  ],
 [-10,    pathVal,  pathVal,  pathVal, -10,    10,  pathVal, -10  ],
 [-10,    pathVal, -10,    pathVal, -10,   -10,    pathVal, -10  ],
 [-10,    pathVal, -10,    pathVal, -10,    pathVal,  pathVal, -10  ],
 [-10,    pathVal, -10,    pathVal,  pathVal,  pathVal, -10,   -10  ],
 [-10,    pathVal, -10,    pathVal, -10,   -10,   -10,   -10  ],
 [-10,   -10,   -10,   -10,   -10,   -10,   -10,   -10  ]]
# arr = [[-10, -10, -10, -10, -10, -10, -10, -10],
#         [-10, -0.1, -10, -0.1, -10, 100, -0.1, -10],
#         [-10, -0.1, -0.1, -0.1, -10, -10, -0.1, -10],
#         [-10, -0.1, -10, -0.1, -10, -0.1, -0.1, -10],
#         [-10, -0.1, -10, -0.1, -0.1, -0.1, -10, -10],
#         [-10, -0.1, -10, -0.1, -10, -0.1, -0.1, -10],
#         [-10, -0.1, -10, -0.1, -10, -10, -0.1, -10],
#         [-10, -10, -10, -10, -10, -10, -10, -10]]

# # '''[[-100, -100, -100, -100, -100, -100, -100, -100], 

# #              [-100, 0, 0, 0, 0, 0, 0, -100], 
# #              [-100, 0, -100, 0, -100, -100, 0, -100], 
# #              [-100, 0, -100, 0, 0, -100, 0, -100], 
# #              [-100, 0, 0, -100, -100, 0, 0, -100], 
# #              [-100, -100, 0, 0, 0, -100, -100, -100], 
# #              [-100, 0, -100, -100, 0, 0, 10, -100], 
# #              [-100, -100, -100, -100, -100, -100, -100, -100]]'''
# # print("ran from file")
grid = GridWorld(arr, (1,5))


grid.setNonTerminalStates()
print(grid.nonTerminalStates)
agentVinod = Agent(grid.nrows, grid.ncols)
# print(agentVinod.policy)
trainer = Trainer(numRounds=10,numEpisodes=200)
# trainer = Trainer()
trainer.train(agentVinod, grid)
# print(agentVinod.policy)
print(agentVinod.getPolicy('simple'))
print(agentVinod.getPolicy('serio'))

# print(f"{trainer.crashCount=}")
# print(f"{trainer.goalCount=}")
# print(np.max(agentVinod.Q))
# print(np.min(agentVinod.Q))
# print(np.mean(agentVinod.Q))


