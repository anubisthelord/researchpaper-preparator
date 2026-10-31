export default function QuestionEditor({ question, index, onChange, onDelete }) {
    const update = (patch) => onChange({ ...question, ...patch });
  
    return (
      <div className="question">
        <div className="q-head">
          <strong>Q{index + 1}</strong>
          <div style={{ flex: 1 }}></div>
          <button className="btn danger sm" onClick={onDelete} title="Delete Question">
            ✕ Remove
          </button>
        </div>
  
        <textarea
          rows={2}
          placeholder="Question"
          value={question.question}
          onChange={(e) => update({ question: e.target.value })}
        />
  
        <div className="answer-head">
          <span className="answer-label">Answer</span>
          <div className="format-toggle">
            <button
              type="button"
              className={`toggle-btn ${!question.isList ? 'active' : ''}`}
              onClick={() => update({ isList: false })}
            >
              Paragraph
            </button>
            <button
              type="button"
              className={`toggle-btn ${question.isList ? 'active' : ''}`}
              onClick={() => update({ isList: true })}
            >
              Bullet Points
            </button>
          </div>
        </div>
  
        <textarea
          rows={question.isList ? 4 : 2}
          placeholder={
            question.isList
              ? "Enter one bullet point per line...\nExample:\n- First point\n- Second point"
              : "Write a descriptive answer..."
          }
          value={question.answer}
          onChange={(e) => update({ answer: e.target.value })}
        />
      </div>
    );
  }