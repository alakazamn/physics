import Core from './engine/core';

Core.getInstance().preload();
window.onload = Core.getInstance().load;
window.onunload = Core.getInstance().end;
