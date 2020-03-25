import Renderer from "../graphics/Renderer";
import Core from "./core";
import Keyboard from "./keyboard";
import GameEvent from "../../shared/event/event";
const uuidv4 = require("uuid/v4")

export default class Dispatch {
  //modifiable

  private static instance : Dispatch;

  private priorityListeners = {};
  private listeners = {};
  private constructor() {}

  private static getInstance() : Dispatch {
    if(!Dispatch.instance) {
      Dispatch.instance = new Dispatch();
    }
    return Dispatch.instance;
  }

  public static addEventListener = (eventName : string, callback :  { (event: GameEvent): void; }) : string => Dispatch.getInstance().addEventListener(eventName, callback)
  public static removeEventListener = (eventName : string, id : string) => Dispatch.getInstance().removeEventListener(eventName, id)
  public static addPriorityListener = (eventName : string, callback :  { (event: GameEvent): void; }) : string => Dispatch.getInstance().addPriorityListener(eventName, callback)
  public static removePriorityListener = (eventName : string, id : string) => Dispatch.getInstance().removePriorityListener(eventName, id)

  public static fire = (eventName : string, event: GameEvent) => Dispatch.getInstance().fire(eventName, event)

  private addPriorityListener = (eventName : string, callback :  { (event: GameEvent): void; }) : string  => {
    let id = uuidv4();
    if(!(eventName in this.priorityListeners))
      this.priorityListeners[eventName] = {};
    this.priorityListeners[eventName][id] = callback;
    return id;
  }
  private removePriorityListener = (eventName : string, id : string) => {
    delete this.priorityListeners[eventName][id];
  }

  private addEventListener = (eventName : string, callback :  { (event: GameEvent): void; }) : string  => {
    let id = uuidv4();
    if(!(eventName in this.listeners))
      this.listeners[eventName] = {};
    this.listeners[eventName][id] = callback;
    return id;
  }
  private removeEventListener = (eventName : string, id : string) => {
    delete this.listeners[eventName][id];
  }
  private fire(eventName : string, event: GameEvent) {
    if(eventName in this.priorityListeners)
      for(const listener of Object.keys(this.priorityListeners[eventName])) {
        this.priorityListeners[eventName][listener](event);
      }
    if(eventName in this.listeners)
      for(const listener of Object.keys(this.listeners[eventName])) {
        this.listeners[eventName][listener](event);
      }
  }
}


export enum InputType {
    UP,DOWN,LEFT,RIGHT
}
