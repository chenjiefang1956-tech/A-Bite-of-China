export type DragPoint = {
  x: number;
  time: number;
};

export type InertiaState = {
  offset: number;
  velocity: number;
};

export function getReleaseVelocity(points: DragPoint[]) {
  if (points.length < 2) {
    return 0;
  }

  const recent = points.slice(-5);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const elapsed = Math.max(last.time - first.time, 1);

  return (last.x - first.x) / elapsed;
}

export function applyInertia(state: InertiaState, deltaMs: number) {
  const offset = state.offset + state.velocity * deltaMs;
  const velocity = Math.abs(state.velocity) < 0.01 ? 0 : state.velocity * 0.94;

  return {
    offset,
    velocity,
    isMoving: velocity !== 0
  };
}

export function getRestoredAutoVelocity(currentVelocity: number, autoVelocity: number) {
  return Math.abs(currentVelocity) < 0.01 ? autoVelocity : currentVelocity;
}
