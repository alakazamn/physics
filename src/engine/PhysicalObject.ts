import { BoundingBox, Force, Player, Vector } from "../Engine";
import Dispatch from "../logic/dispatch";
import { PhysicsMoveEvent } from '../Events'
import { TickEvent } from "../event/TickEvent";
import Physics from "../logic/physics";

export class PhysicalObject extends BoundingBox {
    private velocity : Vector = new Vector(0, 0); //pixels per tick
    private acceleration : Vector = new Vector(0, 0); //pixels per tick^2
    private forces : Force[] = [];

    constructor(x:number, y:number, width:number, height:number, private mass: number) {
      super(x,y,width,height);
      this.forces.push(new Force(3 * Math.PI / 2, Physics.GRAVITY * mass))
    }
    normalForce() {
        return new Force(3 * Math.PI / 2, Physics.GRAVITY * this.mass);
    }
    getVelocity() {
        return this.velocity;
    }
    applyForce(force : Force) {
        this.forces.push(force);
    }
    applyImpulse(force : Force, sec: number) {
        force.setDuration(sec);
        force.setTemporary(false);
        this.forces.push(force);
    }
    stopH() {
        this.acceleration = this.acceleration.setX(0);
        this.velocity = this.velocity.setX(0);
    }
    stopV() {
        this.acceleration = this.acceleration.setY(0);
        this.velocity = this.velocity.setY(0);
    }
    getNetForce() {
        var netForce = new Vector(0, 0);
        
        this.forces.forEach((force) => {
            netForce = netForce.plusVec(force);
        })
        return netForce;
    }
    tick() {
        this.forces = this.forces.filter(force => force.isApplied());
        var netForce = new Vector(0, 0);
        
        this.forces.forEach((force) => {
            netForce = netForce.plusVec(force);
            if(force.isTemporary()) {
                force.unapply();
            }
            if(force.getDuration() != -1) {
                if(force.getDuration() == 0) {
                    force.unapply();
                } else {
                    force.tick();
                }

            }
        })

        this.acceleration = netForce.div(this.mass).mult(Player.HEIGHT / Player.METRIC_HEIGHT).div(TickEvent.TPS * 10)
        
        this.velocity = this.velocity.plusVec(this.acceleration);
        if(this.velocity.getX() == 0 && this.velocity.getY() == 0) return;
            Dispatch.fire(new PhysicsMoveEvent(this, this.getLocation(), this.getLocation().plusVec(this.velocity)))
    }

  }