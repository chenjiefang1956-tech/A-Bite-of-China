import { useEffect } from 'react';
import { Food } from '../domain/provinces';

type FoodModalProps = {
  food: Food | null;
  onClose: () => void;
};

export function FoodModal({ food, onClose }: FoodModalProps) {
  useEffect(() => {
    if (!food) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [food, onClose]);

  if (!food) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <article
        className="food-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-button" type="button" aria-label="关闭详情" onClick={onClose}>
          ×
        </button>
        <figure className="modal-image-panel">
          {food.hasImage ? (
            <a
              className="modal-image-link"
              href={food.imageSourceUrl || food.image}
              target="_blank"
              rel="noreferrer"
              aria-label="查看图片来源"
            >
              <img src={food.image} alt={food.imageAlt} />
            </a>
          ) : (
            <div className="modal-image-missing" aria-label={`${food.name}图片待补`}>
              <span>图片待补</span>
            </div>
          )}
          <figcaption>
            {food.hasImage ? `图片信息：${food.imageSourceName}` : '图片信息：待补充'}
          </figcaption>
        </figure>
        <div>
          <p>
            {food.province} · {food.city} · {food.category}
          </p>
          <h2 id="food-modal-title">{food.name}</h2>
          <span>{food.description}</span>
          <a className="source-link" href={food.sourceUrl} target="_blank" rel="noreferrer">
            来源：{food.sourceName}
          </a>
        </div>
      </article>
    </div>
  );
}
