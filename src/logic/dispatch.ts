import { GameEvent } from "../event/Event";

import * as uuidv4 from "uuid/v4";

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

  public static fire = (event: GameEvent) => Dispatch.getInstance().fire(event)

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
  private fire(event: GameEvent) {
    if(event.getEventName() in this.priorityListeners)
      for(const listener of Object.keys(this.priorityListeners[event.getEventName()])) {
        this.priorityListeners[event.getEventName()][listener](event);
      }
    if(event.getEventName() in this.listeners)
      for(const listener of Object.keys(this.listeners[event.getEventName()])) {
        this.listeners[event.getEventName()][listener](event);
      }
  }
}


export enum InputType {
    UP,DOWN,LEFT,RIGHT
}
