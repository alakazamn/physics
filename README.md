# Basic 2D Game Engine
Written for AP Physics. Press [W] to jump, and try not to run into anything or fall off the map.

Visit online at: https://physics-demo.herokuapp.com/ (easiest).

## Code Layout

The main physics calculations are done in: [engine/Physics.ts](src/engine/Physics.ts), [engine/Force.ts](src/engine/Force.ts),  [engine/PhysicalObject.ts](src/engine/PhysicalObject.ts), and [engine/Vector.ts](src/engine/Vector.ts)

## Controls
* [W] = [Jump]

* [L] = Disable Music

* [F3] = Show Forces (free-body diagram)

* [F11] = Fullscreen

## Attribution
Code that is borrowed is noted in comments. Audio files are borrowed from: https://github.com/hawkthorne/hawkthorne-journey and licensed under CC BY-NC 3.0. Includes all .ogg, and .wav files. Textures are from: https://jesse-m.itch.io/jungle-pack

## How to run locally
1. Download / Install npm and node.js from here: https://nodejs.org/en/download/

2. Press [WIN + R] and type `cmd`, then press enter

3. Type `git clone https://github.com/themichaelcaruso/physics`, then press enter

4. Type `npm install` and press enter to install dependencies, then type `npm start` and press enter to run the game.

5. Go to http://localhost:5000 to try out the game.

