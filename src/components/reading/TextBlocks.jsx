export function splitIntoBlocks(text = '') {
  return text
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function TextBlocks({ text = '', className = '' }) {
  const blocks = splitIntoBlocks(text);

  if (!blocks.length) {
    return null;
  }

  const paragraphClass = className ? `space-y-4 leading-relaxed ${className}` : 'space-y-4 leading-relaxed';

  return (
    <div className="reading-blocks">
      {blocks.map((block, index) => (
        <p key={`${index}-${block.slice(0, 16)}`} className={paragraphClass}>
          {block}
        </p>
      ))}
    </div>
  );
}

export default TextBlocks;
