type SpeechLike = {
  cancel: () => void;
  speak: (utterance: any) => void;
};

type DialectSpeakerOptions = SpeechLike & {
  createUtterance: (text: string) => unknown;
};

export class DialectSpeaker {
  private readonly speech?: SpeechLike;
  private readonly createUtterance?: (text: string) => unknown;

  constructor(options?: DialectSpeakerOptions) {
    if (options) {
      this.speech = {
        cancel: options.cancel,
        speak: options.speak
      };
      this.createUtterance = options.createUtterance;
      return;
    }

    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      this.speech = window.speechSynthesis;
      this.createUtterance = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9;
        utterance.pitch = 0.92;
        return utterance;
      };
    }
  }

  speak(text: string) {
    if (!this.speech || !this.createUtterance) {
      return false;
    }

    this.speech.cancel();
    this.speech.speak(this.createUtterance(text));
    return true;
  }
}
