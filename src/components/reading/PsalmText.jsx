import { splitIntoBlocks } from './TextBlocks';

function isPsalmResponse(block = '') {
  if (!block) return false;
  return /^R[.:-]/i.test(block) || block.length < 90;
}

function PsalmText({ text = '', className = '' }) {
  const blocks = splitIntoBlocks(text);

  if (!blocks.length) {
    return null;
  }

  const [firstBlock, ...rest] = blocks;
  const hasResponse = isPsalmResponse(firstBlock);
  const paragraphClass = className ? `space-y-4 leading-relaxed ${className}` : 'space-y-4 leading-relaxed';

  return (
    <div className="reading-blocks">
      {hasResponse ? (
        <p className={paragraphClass}>
          <strong>{firstBlock}</strong>
        </p>
      ) : (
        <p className={paragraphClass}>{firstBlock}</p>
      )}

      {rest.map((block, index) => (
        <p key={`${index}-${block.slice(0, 16)}`} className={paragraphClass}>
          {block}
        </p>
      ))}
    </div>
  );
}

export default PsalmText;
