import { describe, expect, it, vi } from 'vitest';
import { DialectSpeaker } from './dialectAudio';

describe('DialectSpeaker', () => {
  it('cancels the previous phrase before speaking the next province phrase', () => {
    const cancel = vi.fn();
    const speak = vi.fn();
    const speaker = new DialectSpeaker({
      cancel,
      speak,
      createUtterance: (text) => ({ text })
    });

    speaker.speak('四川话短句');
    speaker.speak('粤语短句');

    expect(cancel).toHaveBeenCalledTimes(2);
    expect(speak).toHaveBeenLastCalledWith({ text: '粤语短句' });
  });

  it('returns false when speech synthesis is unavailable', () => {
    const speaker = new DialectSpeaker();

    expect(speaker.speak('测试')).toBe(false);
  });
});
