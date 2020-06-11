import { BoundingBox, Force, Player, Vector } from "./Engine";
import Dispatch from "./Dispatch";
import { PhysicsMoveEvent } from '../event/Events'
import { TickEvent } from "../event/TickEvent";
import Physics from "./Physics";

/*
    The meat and potatoes of the whole physics operation. 
    Each instance represents one physical object that can have forces act on it.

    When "tick" is called, the system calculates net force by adding vectors
    and determines the object's acceleration.

    Over time, acceleration is accumulated into the object's velocity. 
    This allows for realistic inertia.
*/

export class PhysicalObject extends BoundingBox {
    private velocity : Vector = new Vector(0, 0); //pixels per tick
    private acceleration : Vector = new Vector(0, 0); //pixels per tick^2
    private forces : Force[] = [];

    constructor(x:number, y:number, width:number, height:number, private mass: number) {
      super(x,y,width,height);
      this.forces.push(new Force(3 * Math.PI / 2, Physics.GRAVITY * mass))
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }

    /*
        Returns the normal force in the Y direction,
        which is essentially the down force if the surface is perfectly flat

        Note, that this method uses a net force calculation that DOES NOT include itself,
        otherwise we'd just be alternating between no normal force and normal force for infinity
    */
    normalForce() {
        let normal = new Force(Math.PI / 2, Math.abs(this.getNetForce().getY()));
        normal.setNormal(true);
        return normal;
    }

    /*
        Returns the current velocity of the object.
    */
    getVelocity() {
        return this.velocity;
    }

    /*
        Applies a force to the object.
    */
    applyForce(force : Force) {
        this.forces.push(force);
    }
    
    /*
        Applies a force to the object, but removes it after it acts for a tick 
        so it can be re-calculated and re-added if needed
    */
    applyOnce(force : Force) {
        force.setTemporary(true);
        this.forces.push(force);
    }

    /*
        Applies a constant force to the object for a set amount of time
    */
    applyImpulse(force : Force, sec: number) {
        force.setDuration(sec);
        force.setTemporary(false);
        this.forces.push(force);
    }

    /*
        To stop an object in the X direction, we just set the velocity and acceleration to zero.
        Too much work to make it realistic, and it really makes no difference visually speaking.
    */
    stopH() {
        this.acceleration = this.acceleration.setX(0);
        this.velocity = this.velocity.setX(0);
    }

    /*
        To stop an object in the Y direction, normal force is applied. 
        This method is called when there is a collision. 
        Ideally, normal force would be applied at the angle of collision. 
        However, for this project, the angle of collision will always be straight up or down.
    */

    stopV() {
        let force = this.normalForce();
        force.setTemporary(true);
        this.applyForce(force);
    }

    /*
       Returns the net force acting on an object, minus any normal force (for reasons explained in Force.ts)
    */
    getNetForce() {
        var netForce = new Vector(0, 0);
        
        this.forces.filter(force=> !force.getNormal()).forEach((force) => {
            netForce = netForce.plusVec(force);
        })
        return netForce;
    }

    /*
       Returns all the forces acting on an object, but not combined.
    */
    getForces() {
        return this.forces;
    }

    /*
        Clears all forces but gravity
    */
    clearForces() {
        this.acceleration = new Vector(0,0);
        this.velocity = new Vector(0,0)
        this.forces = [new Force(3 * Math.PI / 2, Physics.GRAVITY * this.mass)]
    }

    /*
       Simulate 1/20th of a second of physics (or whatever amount is determined in event/TickEvent.ts)
    */
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

        //the .div(TickEvent.TPS * 10) also scales down all physics by 10x, just because it looked ridiculous when I didn't
        this.acceleration = netForce.div(this.mass).mult(Player.HEIGHT / Player.METRIC_HEIGHT).div(TickEvent.TPS * 10)
        
        //accumulate velocity
        this.velocity = this.velocity.plusVec(this.acceleration).roundX();

        //if the object has velocity from inertia, we should check that 
        //moving the object won't create collisions, and apply velocity-dependent / frictive forces:
        if(this.velocity.getX() == 0 && this.velocity.getY() == 0) return;
            Dispatch.fire(new PhysicsMoveEvent(this, this.getLocation(), this.getLocation().plusVec(this.velocity)))
    }

  }