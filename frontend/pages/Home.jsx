import { useState } from "react";
import { useNavigate } from "react-router";
import "./css/Home.css";
import { FaGithub } from "react-icons/fa";

export default function Home() {

  const [mazeConfigs, setMazeConfigs] = useState({ rows: 0, cols: 0 });
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleBuild = async (e) => {
    e.preventDefault();
    navigate("/build", { state: mazeConfigs });

    // console.log("Maze configs sent");
  };

  // console.log(mazeConfigs);

  return (
    <div className="home">


      <nav className="home-navbar">

        <div className="home-logo">
          <img src="../assets/knight-helm-logo.png" width={50} height={37} className="logo-knight"/>
          <span>MAZE RUNNER</span>
        </div>

        <div className="home-nav-icons">
          <a href="https://github.com/thisIsManasTripathi/maze-runner" target="_blank"><FaGithub /></a>
        </div>

      </nav>


      <section className="hero">

        <div className="hero-content">

          <h1 className="hero-title">

            You Build.
            <br />
            <span>I solve.</span>
          </h1>

          <div className="hero-divider">
            <span></span>
            <b>◆</b>
            <span></span>
          </div>

          <button
            className="build-button"
            onClick={() => setShowModal(true)}
          >
            <span>▶</span>
            BUILD A MAZE
          </button>

        </div>


        <div className="hero-art">

          <img
            src="../assets/hero-bg.png"
            alt="Pixel art maze"
          />

        </div>

      </section>



      <div className="pixel pixel-one"></div>
      <div className="pixel pixel-two"></div>
      <div className="pixel pixel-three"></div>



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



            <p className="dimension-title">
              CHOOSE MAZE DIMENSIONS
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
                  max="20"
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
                  max="30"
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