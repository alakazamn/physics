import Dispatch from "./Dispatch";

import { EventResult, PlayerStopEvent, PlayerJumpEvent, PhysicsMoveEvent } from "../event/Events";

/* 
  Handles collisions (normal forces too) and applying velocity-resistive / friction forces 
  The actual logic that computates net force and determines acceleration / velocity is in engine/PhysicalObject.ts
*/

export default class AudioManager {
  private static instance : AudioManager;

  public static getInstance() : AudioManager {
    if(!AudioManager.instance) {
        AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  private audio = new Audio('sfx/daybreak.ogg');
  private static JUMP = new Audio('sfx/jump.ogg');

  private music = true;
  private constructor() {
    Dispatch.addPriorityListener("PlayerJumpEvent", this.onPlayerJump)
    
    this.audio.play();

    this.audio.loop = true;
  }

  onPlayerJump = (e : PlayerJumpEvent) => {
    if(e.getResult() != EventResult.DENY) {  
        AudioManager.JUMP.play();
    }
  }

  toggleMusic = () => {
    this.music = !this.music;
    if(this.music) {
        this.audio.play()
    } else {
        this.audio.pause();
    }
  }
}