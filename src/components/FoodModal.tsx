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
        <img src={food.image} alt={food.name} />
        <div>
          <p>{food.city}</p>
          <h2 id="food-modal-title">{food.name}</h2>
          <span>{food.description}</span>
        </div>
      </article>
    </div>
  );
}
