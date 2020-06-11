import Core from './engine/Core';

/* This sets up the main game loop, 
   which does all the physics calculations
*/

window.onload = Core.getInstance().load;
window.onunload = Core.getInstance().end;
