import { Vector } from "../Engine";
import { TickEvent } from "../event/TickEvent";

export class Force extends Vector {
    private applied = true;
    private ticks = -1;
    constructor(angle:number, magnitude:number, private temporary: boolean = false) {
        super(magnitude * Math.cos(angle), -1 * magnitude * Math.sin(angle))
    }
    public setDuration(seconds : number) {
        this.ticks = seconds * TickEvent.TPS;
    }
    public getDuration() : number {
        return this.ticks
    }
    public tick() {
        if(this.ticks > 0)
            this.ticks--;
    }
    public setTemporary(temporary : boolean) {
        this.temporary = temporary;
    }
    public isTemporary() {
        return this.temporary;
    }
    public unapply() {
        this.applied = false;
    }
    public isApplied() {
        return this.applied;
    }
  }