import { SurfaceType } from './Engine'

/*
  Represents a surface, with a coefficient of kinetic friction
  In this world, there's no static friction because it just seemed unnecessary

  Somewhat obsolete, since I got rid of the ice surfaces...
*/

export class Surface {
  public constructor(private id : number) {
  }

  public getType() {
    if(this.id == 7 || this.id == 2) {
      return SurfaceType.ICE;
    } else return SurfaceType.OTHER;
  }
  public getFriction() {
    return this.friction[this.getType()];
  }

  private readonly friction = {
    [SurfaceType.ICE] : 0.035,
    [SurfaceType.OTHER] : 0.1,
  }
}
