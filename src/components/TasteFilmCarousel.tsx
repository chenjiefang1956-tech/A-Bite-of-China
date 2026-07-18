import { PointerEvent, useEffect, useRef, useState } from 'react';
import {
  applyInertia,
  getReleaseVelocity,
  getRestoredAutoVelocity,
  DragPoint
} from '../domain/carouselPhysics';
import { Food, Province } from '../domain/provinces';

type TasteFilmCarouselProps = {
  province: Province;
  onSelectFood: (food: Food) => void;
};

const autoVelocity = 0.018;

export function TasteFilmCarousel({ province, onSelectFood }: TasteFilmCarouselProps) {
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);
  const velocityRef = useRef(autoVelocity);
  const dragPointsRef = useRef<DragPoint[]>([]);
  const draggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, offset: 0 });
  const dragDistanceRef = useRef(0);

  const foods = [...province.foods, ...province.foods, ...province.foods];

  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    function tick(now: number) {
      const delta = Math.min(now - last, 32);
      last = now;

      if (!draggingRef.current) {
        const next = applyInertia(
          {
            offset: offsetRef.current,
            velocity: velocityRef.current
          },
          delta
        );
        const restoredVelocity = getRestoredAutoVelocity(next.velocity, autoVelocity);

        offsetRef.current = wrapOffset(next.offset);
        velocityRef.current = restoredVelocity;
        setOffset(offsetRef.current);
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    dragPointsRef.current = [{ x: event.clientX, time: performance.now() }];
    pointerStartRef.current = { x: event.clientX, offset: offsetRef.current };
    dragDistanceRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) {
      return;
    }

    const distance = event.clientX - pointerStartRef.current.x;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(distance));
    offsetRef.current = wrapOffset(pointerStartRef.current.offset + distance);
    setOffset(offsetRef.current);
    dragPointsRef.current = [
      ...dragPointsRef.current.slice(-4),
      { x: event.clientX, time: performance.now() }
    ];
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    velocityRef.current = getReleaseVelocity(dragPointsRef.current);
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function openFood(food: Food) {
    if (dragDistanceRef.current > 8) {
      dragDistanceRef.current = 0;
      return;
    }
    onSelectFood(food);
  }

  return (
    <section className="film-stage" aria-label={`${province.name}味觉胶片`}>
      <div className="film-heading">
        <p>味觉胶片</p>
        <h2>{province.name} · 代表风味</h2>
      </div>
      <div
        className="film-strip"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="film-track" style={{ transform: `translate3d(${offset}px, 0, 0)` }}>
          {foods.map((food, index) => (
            <button
              className="food-card"
              type="button"
              key={`${food.id}-${index}`}
              onClick={() => openFood(food)}
            >
              <img src={food.image} alt={food.name} draggable="false" />
              <span>{food.city}</span>
              <strong>{food.name}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function wrapOffset(value: number) {
  if (value < -760) {
    return value + 380;
  }
  if (value > 80) {
    return value - 380;
  }
  return value;
}
