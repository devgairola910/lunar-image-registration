// Sound system disabled as requested

class SoundSystem {
  public isMuted: boolean = true;
  public playClick() {}
  public playStageComplete() {}
  public playSuccessLock() {}
  public toggleMute(): boolean {
    return true;
  }
}

export const soundFx = new SoundSystem();
