import Dispatch from "./Dispatch";

import { EventResult, PlayerStopEvent, PlayerJumpEvent, PhysicsMoveEvent, PlayerDeathEvent } from "../event/Events";

/* 
  Handles that music that I'm sure you love...
  And sound effects too...
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
  private static DEATH = new Audio('sfx/death.ogg');

  private music = true;
  private constructor() {
    Dispatch.addPriorityListener("PlayerJumpEvent", this.onPlayerJump)
    Dispatch.addPriorityListener("PlayerDeathEvent", this.onDeath)

    this.audio.play();

    this.audio.loop = true;
  }

  onDeath = (e : PlayerDeathEvent) => {
    this.audio.pause();
    AudioManager.DEATH.play();
  }

  onPlayerJump = (e : PlayerJumpEvent) => {
    if(e.getResult() != EventResult.DENY) {  
        AudioManager.JUMP.currentTime = 0;
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