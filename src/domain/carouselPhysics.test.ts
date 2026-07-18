import { describe, expect, it } from 'vitest';
import {
  applyInertia,
  getReleaseVelocity,
  getRestoredAutoVelocity
} from './carouselPhysics';

describe('carousel physics', () => {
  it('converts faster drag movement into stronger release velocity', () => {
    const slow = getReleaseVelocity([
      { x: 0, time: 0 },
      { x: 30, time: 300 }
    ]);
    const fast = getReleaseVelocity([
      { x: 0, time: 0 },
      { x: 180, time: 300 }
    ]);

    expect(Math.abs(fast)).toBeGreaterThan(Math.abs(slow));
  });

  it('decays inertia over time while moving the carousel', () => {
    const next = applyInertia({ offset: 100, velocity: 1 }, 16);

    expect(next.offset).toBeGreaterThan(100);
    expect(next.velocity).toBeLessThan(1);
    expect(next.isMoving).toBe(true);
  });

  it('restores automatic scrolling after inertia nearly stops', () => {
    const restored = getRestoredAutoVelocity(0.005, 0.018);

    expect(restored).toBe(0.018);
  });
});
