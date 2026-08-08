import "./ToolBarCell.css";

export default function ToolBarCell({ name, icon, value, active, onClick }) {
    return (
        <div
            className={`toolbar-cell ${active ? "active" : ""}`}
            title={name}
            onClick={() => onClick(name)}
        >
            {icon}
        </div>
    );
}
