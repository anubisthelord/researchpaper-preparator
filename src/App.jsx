import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SectionEditor from './components/SectionEditor';
import PDFPreview from './components/PDFPreview';

// Empty templates without IDs
export const emptyQuestion = () => ({
  type: 'qa',
  question: '',
  answer: '',
  basis: '',
  options: [''],
  correctOptions: [],
  explanation: '',
  explanationType: 'paragraph'
});

export const emptySection = (isMain = false) => ({
  title: '',
  description: '',
  questions: [],
  subsections: isMain ? [] : undefined
});

export default function App() {
  const [doc, setDoc] = useState({
    title: 'My Question Bank',
    description: 'A collection of questions and answers.',
    sections: [emptySection(true)]
  });

  const [generating, setGenerating] = useState(false);
  const previewRef = useRef(null);

  const generatePDF = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const el = previewRef.current;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${doc.title.replace(/\s+/g, '_') || 'questions'}.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <h1>📘 Q&A PDF Generator</h1>
        <button className="btn primary" onClick={generatePDF} disabled={generating}>
          {generating ? 'Generating…' : '📄 Download PDF'}
        </button>
      </header>

      <div className="layout">
        <div className="editor">
          <div className="card">
            <label>Main Title</label>
            <input
              value={doc.title}
              onChange={(e) => setDoc({ ...doc, title: e.target.value })}
              placeholder="e.g. JavaScript Interview Questions"
            />
            <label>Description</label>
            <textarea
              rows={3}
              value={doc.description}
              onChange={(e) => setDoc({ ...doc, description: e.target.value })}
              placeholder="Short intro for the whole document"
            />
          </div>

          {doc.sections.map((sec, idx) => (
            <SectionEditor
              key={idx}
              section={sec}
              isMain
              onChange={(updated) => {
                const next = [...doc.sections];
                next[idx] = updated;
                setDoc({ ...doc, sections: next });
              }}
              onDelete={() => {
                setDoc({
                  ...doc,
                  sections: doc.sections.filter((_, i) => i !== idx)
                });
              }}
            />
          ))}

          <button
            className="btn"
            onClick={() =>
              setDoc({ ...doc, sections: [...doc.sections, emptySection(true)] })
            }
          >
            + Add Main Section
          </button>
        </div>

        <div className="preview">
          <h3>Live Preview</h3>
          <div className="preview-paper">
            <PDFPreview ref={previewRef} doc={doc} />
          </div>
        </div>
      </div>
    </div>
  );
}