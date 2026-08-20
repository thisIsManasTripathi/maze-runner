import "./ToolBarCell.css";

export default function ToolBarCell({ name, icon, value, active, onClick }) {

    const logo = { 
        wall: "../../assets/wall_tool.png",
        eraser: "../../assets/hammer_tool.png",
    }
    // console.log(logo[name])
    console.log(name)
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
