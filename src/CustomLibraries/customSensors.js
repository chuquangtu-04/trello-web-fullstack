import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor
} from '@dnd-kit/core'

function shouldHandleEvent(element) {
  let cur = element
  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false
    }
    cur = cur.parentElement
  }
  return true
}

export class CustomMouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown',
      handler: (event) => {
        return shouldHandleEvent(event.target)
      }
    }
  ]
}

export class CustomTouchSensor extends LibTouchSensor {
  static activators = [
    {
      eventName: 'onTouchStart',
      handler: (event) => {
        return shouldHandleEvent(event.target)
      }
    }
  ]
}