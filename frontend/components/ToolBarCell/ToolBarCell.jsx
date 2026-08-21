import "./ToolBarCell.css";

export default function ToolBarCell({ name, icon, value, active, onClick }) {

    const logo = { 
        wall: "../../assets/wall_tool.png", //the tools images are basically larger size of the respective tiles
        eraser: "../../assets/hammer_tool.png", 
        goal: "../../assets/goal_tool.png",
        start: "../../assets/start_tool.png",
    }

    return (
        <div
            className={`toolbar-cell ${active ? "active" : ""}`}
            title={name}
            onClick={() => onClick(name)}
        >
            {/* {icon} */}
            <img src={logo[name]} alt="blah" />
        </div>
    );
}
