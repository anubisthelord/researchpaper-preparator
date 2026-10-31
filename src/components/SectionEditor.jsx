import QuestionEditor from './QuestionEditor';
import { emptyQuestion, emptySection } from '../App';

export default function SectionEditor({ section, isMain, onChange, onDelete }) {
  const update = (patch) => onChange({ ...section, ...patch });

  return (
    <div className={`card ${isMain ? 'main-section' : 'sub-section'}`}>
      <div className="section-head">
        <input
          className="section-title"
          value={section.title}
          placeholder={isMain ? 'Main Section Title' : 'Sub-category Title'}
          onChange={(e) => update({ title: e.target.value })}
        />
        <button className="btn danger sm" onClick={onDelete}>
          Delete {isMain ? 'Section' : 'Sub-category'}
        </button>
      </div>

      <textarea
        rows={2}
        placeholder="Description (optional)"
        value={section.description}
        onChange={(e) => update({ description: e.target.value })}
      />

      <div className="questions">
        {section.questions.map((q, i) => (
          <QuestionEditor
            key={i}
            question={q}
            index={i}
            onChange={(updated) => {
              const questions = [...section.questions];
              questions[i] = updated;
              update({ questions });
            }}
            onDelete={() =>
              update({ questions: section.questions.filter((_, idx) => idx !== i) })
            }
          />
        ))}
      </div>

      <button
        className="btn sm"
        onClick={() => update({ questions: [...section.questions, emptyQuestion()] })}
      >
        + Add Question
      </button>

      {isMain && (
        <div className="subsections-container">
          <div className="subsections">
            {(section.subsections || []).map((sub, i) => (
              <SectionEditor
                key={i}
                section={sub}
                isMain={false}
                onChange={(updated) => {
                  const subsections = [...section.subsections];
                  subsections[i] = updated;
                  update({ subsections });
                }}
                onDelete={() =>
                  update({
                    subsections: section.subsections.filter((_, idx) => idx !== i)
                  })
                }
              />
            ))}
          </div>
          <button
            className="btn sm ghost add-sub-btn"
            onClick={() =>
              update({
                subsections: [...(section.subsections || []), emptySection(false)]
              })
            }
          >
            + Add Sub-category
          </button>
        </div>
      )}
    </div>
  );
}