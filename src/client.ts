import Core from './logic/core';

Core.getInstance().preload();
window.onload = Core.getInstance().load;
window.onunload = Core.getInstance().end;
