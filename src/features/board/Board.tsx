import { useBoardStore } from '@stores/boardStore';
import './Board.css';

const Board = () => {
  const { stages } = useBoardStore();
  const stageArray = Array.from(stages.values());

  return (
    <div className="board-container">
      <header className="board-header">
        <h1 className="board-title neon-text">
          Kandoo VibeFlow
        </h1>
        <p className="board-subtitle">Where code meets consciousness</p>
      </header>

      <div className="kanban-board">
        {stageArray.map((stage) => (
          <div key={stage.id} className="kanban-column glass-surface">
            <div className="column-header">
              <span className="column-icon">{stage.icon}</span>
              <h2 className="column-title">{stage.title}</h2>
              {stage.wipLimit && (
                <span className="wip-limit">
                  {stage.cards.length} / {stage.wipLimit}
                </span>
              )}
            </div>

            <div className="column-body">
              {stage.cards.length === 0 ? (
                <div className="empty-state">
                  <p>No cards yet</p>
                  <button className="btn-glass">Add Card</button>
                </div>
              ) : (
                <div className="cards-list">
                  {/* Cards will be rendered here */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
