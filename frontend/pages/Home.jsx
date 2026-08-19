import { useState } from "react";
import { useNavigate } from "react-router";
import "./css/Home.css";

export default function Home() {

  const [mazeConfigs, setMazeConfigs] = useState({ rows: 0, cols: 0 });
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleBuild = async (e) => {
    e.preventDefault();
    navigate("/build", { state: mazeConfigs });

    console.log("Maze configs sent");
  };

  console.log(mazeConfigs);

  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}

      <nav className="home-navbar">

        <div className="home-logo">
          {/* <span className="logo-knight">♞</span> */}
          <img src="../assets/knight-helm-logo.png" width={60} height={45} />
          <span>MAZE RUNNER</span>
        </div>

        <div className="home-nav-icons">
          <button>♜</button>
          <button>▥</button>
          <button>⚙</button>
        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <h1 className="hero-title">
            SOLVE.
            <br />
            STRATEGIZE.
            <br />
            <span>CONQUER.</span>
          </h1>

          <div className="hero-divider">
            <span></span>
            <b>◆</b>
            <span></span>
          </div>

          <p className="hero-description">
            Enter the maze, outsmart the twists,
            <br />
            and reach the goal. Every move
            <br />
            tests your mind.
          </p>

          <button
            className="build-button"
            onClick={() => setShowModal(true)}
          >
            <span>▶</span>
            BUILD A MAZE
          </button>

        </div>


        {/* ================= HERO ART ================= */}

        <div className="hero-art">

          <img
            src="../assets/hero-bg.png"
            alt="Pixel art maze"
          />

        </div>

      </section>


      {/* ================= DECORATION ================= */}

      <div className="pixel pixel-one"></div>
      <div className="pixel pixel-two"></div>
      <div className="pixel pixel-three"></div>


      {/* ================= SCROLL ================= */}

      <div className="scroll-indicator">

        <span>SCROLL DOWN</span>

        <div className="scroll-arrow">
          ⌄
        </div>

      </div>


      {/* ================= BUILD MODAL ================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={() => setShowModal(false)}
        >

          <form
            className="maze-card"
            onSubmit={handleBuild}
            onMouseDown={(e) => e.stopPropagation()}
          >

            {/* Modal header */}

            <div className="maze-card-header">

              <h2>BUILD A MAZE</h2>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>

            </div>


            <div className="card-divider">
              <span></span>
              <b>◆</b>
              <span></span>
            </div>


            {/* Dimensions */}

            <p className="dimension-title">
              CHOOSE DIMENSIONS
            </p>

            <div className="size-inputs">

              <div className="dimension-field">

                <label htmlFor="rows">
                  ROWS
                </label>

                <input
                  id="rows"
                  value={mazeConfigs.rows ? mazeConfigs.rows : ""}
                  type="number"
                  min="2"
                  placeholder="Rows"
                  onChange={(currVal) => {
                    setMazeConfigs(prevConfig => {
                      return {
                        ...prevConfig,
                        rows: Number(currVal.target.value)
                      };
                    });
                  }}
                />

              </div>


              <span className="cross">
                ×
              </span>


              <div className="dimension-field">

                <label htmlFor="cols">
                  COLUMNS
                </label>

                <input
                  id="cols"
                  value={mazeConfigs.cols ? mazeConfigs.cols : ""}
                  type="number"
                  min="2"
                  placeholder="Cols"
                  onChange={(currVal) => {
                    setMazeConfigs(prevConfig => {
                      return {
                        ...prevConfig,
                        cols: Number(currVal.target.value)
                      };
                    });
                  }}
                />

              </div>

            </div>


            {/* Build */}

            <button
              className="modal-build-button"
              type="submit"
            >
              <span>▶</span>
              BUILD
            </button>

          </form>

        </div>

      )}

    </div>
  );
}