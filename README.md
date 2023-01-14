# Basic 2D Game Engine
Written for AP Physics. Press [W] to jump, and try not to run into anything or fall off the map. If you die, you'll have to refresh the page. I didn't really have time to finish the game mechanics (i.e. respawn, score, and infinite world generation)

Visit online at: https://physics-game.onrender.com/ (easiest).

## Code Layout

The main physics calculations are done in: [engine/Physics.ts](src/engine/Physics.ts), [engine/Force.ts](src/engine/Force.ts),  [engine/PhysicalObject.ts](src/engine/PhysicalObject.ts), and [engine/Vector.ts](src/engine/Vector.ts)

## Features
* Gravity, Friction, and Air Resistance
* Full force-based physics with free-body diagrams 
* Poorly written auto-generated random terrain
* Animated sprites and parallax backgrounds + Death animations
* Annoying toggleable chiptune music and non-negotiable sound effects
* Event-based game programming


Basically everything is written from the ground up. This was terrible to write and I regret all of it.


## Controls
* [W] = [Jump]

* [L] = Disable Music

* [F3] = Show Forces (free-body diagram)

* [F11] = Fullscreen

## Attribution
Code that is borrowed is noted in comments. Audio files are borrowed from: https://github.com/hawkthorne/hawkthorne-journey and licensed under CC BY-NC 3.0. Includes all .ogg, and .wav files. Textures are from: https://jesse-m.itch.io/jungle-pack

## Assorted Notes
This used to have very, very basic multiplayer and some other bells and whistles, but I removed them since they weren't useful for this project. This started as a 2D RPG engine with no physics; I basically took my tile rendering code from a few months ago, rewrote almost all of it, and used it to render a physics simulation. Originally, there were multiple surfaces with different coefficients of friction, but I couldn't find a good texture pack with ice and stuff like that so I just made one surface type for the demo; it's pretty trivial to change that though. This was written with the intent that one could write an entire real game on top, but for now it's really just a demonstration of some of the library functionality.

I've written a cookie into the game so that if you turn on the free-body diagram option and refresh the page, it'll stay on. That should help in case you find yourself dying a lot in the game.

## How to run locally
1. Download / Install npm and node.js from here: https://nodejs.org/en/download/

2. Press [WIN + R] and type `cmd`, then press enter

3. Type `git clone https://github.com/themichaelcaruso/physics`, then press enter

4. Type `npm install` and press enter to install dependencies, then type `npm start` and press enter to run the game.

5. Go to http://localhost:5000 to try out the game.
