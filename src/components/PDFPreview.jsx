import { forwardRef } from 'react';

const PDFPreview = forwardRef(function PDFPreview({ doc }, ref) {
  return (
    <div ref={ref} className="pdf-page">
      {/* CENTERED HEADER BLOCK */}
      <div className="pdf-header-block">
        <h1 className="pdf-main-title">{doc.title || 'Untitled'}</h1>
        {doc.description && <p className="pdf-desc">{doc.description}</p>}
      </div>

      {doc.sections.map((s, i) => (
        <RenderSection key={i} section={s} level={1} />
      ))}
    </div>
  );
});

function RenderSection({ section, level }) {
  const HeadingTag = level === 1 ? 'h2' : 'h3';
  return (
    <div className={`pdf-section level-${level}`}>
      <HeadingTag className="pdf-section-title">{section.title || 'Untitled'}</HeadingTag>
      {section.description && <p className="pdf-desc">{section.description}</p>}

      {section.questions.map((q, i) => (
        <div key={i} className="pdf-question">
          <p className="pdf-q">
            <strong>Q{i + 1}.</strong> {q.question}
          </p>

          {q.answer && (
            <div className="pdf-answer-block">
              <strong>Answer: </strong>
              {q.isList ? (
                <ul className="pdf-answer-list">
                  {q.answer.split('\n').filter(line => line.trim() !== '').map((line, li) => (
                    <li key={li}>{line.replace(/^[-*•]\s*/, '')}</li>
                  ))}
                </ul>
              ) : (
                <span>{q.answer}</span>
              )}
            </div>
          )}
        </div>
      ))}

      {section.subsections?.map((sub, i) => (
        <RenderSection key={i} section={sub} level={level + 1} />
      ))}
    </div>
  );
}

export default PDFPreview;