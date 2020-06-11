import { Vector } from "./Engine";
import { TickEvent } from "../event/TickEvent";

/*
    A force. Basically just a vector but with some extra parameters.

    For example, we can declare the force "normal," meaning it won't get used
    while trying to calculate normal force (you can see how that might create a problem)

    We can also declare a force "temporary," meaning its value is due to be re-calculated each
    game tick (unit of time; there are currently 20 ticks per second... you can find the
    exact amount in event/TickEvent under TPS = ...)

    Finally, for things like impulses, where a force is applied for a specific amount of time,
    one can set the duration of the force
*/

export class Force extends Vector {
    private applied = true;
    private ticks = -1; //duration
    private isNormal = false;

    /*
        Construct a Force with a direction and a magnitude
        This is usually easier than specifying the components
    */
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
    public setNormal(normal : boolean) {
        this.isNormal = normal;
    }
    public getNormal() {
        return this.isNormal;
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