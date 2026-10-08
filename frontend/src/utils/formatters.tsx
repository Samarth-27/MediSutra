
export function renderFormattedInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#0F172A', fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} style={{
          background: '#E0F2FE',
          color: '#0369A1',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.84em',
          fontFamily: 'monospace',
          fontWeight: 600
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function renderClinicalMarkdown(markdown: string) {
  if (!markdown) return null;
  const lines = markdown.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return null;

        if (line === '---' || line === '***') {
          return <hr key={idx} style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '8px 0' }} />;
        }

        if (line.startsWith('### ')) {
          const title = line.replace(/^###\s+/, '');
          return (
            <div key={idx} style={{
              fontSize: '1.02rem',
              fontWeight: 800,
              color: '#0369A1',
              background: '#F0F9FF',
              borderLeft: '4px solid #0284C7',
              padding: '6px 12px',
              borderRadius: '0 8px 8px 0',
              marginTop: idx === 0 ? 0 : '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {renderFormattedInline(title)}
            </div>
          );
        }

        if (line.startsWith('#### ')) {
          const sub = line.replace(/^####\s+/, '');
          return (
            <div key={idx} style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: '#1E293B',
              marginTop: '6px',
              paddingBottom: '2px',
              borderBottom: '1px dashed #E2E8F0'
            }}>
              {renderFormattedInline(sub)}
            </div>
          );
        }

        if (line.startsWith('• ') || line.startsWith('- ')) {
          const bullet = line.replace(/^([•-]\s+)/, '');
          return (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '0.87rem',
              color: '#334155',
              lineHeight: 1.5,
              paddingLeft: '4px'
            }}>
              <span style={{ color: '#0284C7', fontWeight: 800, fontSize: '0.9rem', lineHeight: '1.4' }}>›</span>
              <div>{renderFormattedInline(bullet)}</div>
            </div>
          );
        }

        return (
          <p key={idx} style={{
            margin: 0,
            fontSize: '0.88rem',
            color: '#334155',
            lineHeight: 1.6
          }}>
            {renderFormattedInline(line)}
          </p>
        );
      })}
    </div>
  );
}
