import {
  ADD_NEW_FIGURE,
  GET_ACTIVE_FIGURE,
  RESET_ACTIVE_FIGURE,
  SAVE_POSITION,
  GET_NEW_COLOR_TO_ACTIVE_FIGURE,
  KEY_LISTENER_DELETE,
  UNDO_EVENT,
  REDO_EVENT,
} from './actionTypes';
import { GetActiveFigureType } from '../../types';

// Создания событий

export function addNewFigure(name: string) {
  return {
    type: ADD_NEW_FIGURE,
    name,
  };
}

export function getactiveFigure(value: GetActiveFigureType): {
  type: any;
  value: GetActiveFigureType;
} {
  return {
    type: GET_ACTIVE_FIGURE,
    value,
  };
}

export function resetActiveFigure() {
  return {
    type: RESET_ACTIVE_FIGURE,
  };
}

export function onUndo() {
  return {
    type: UNDO_EVENT,
  };
}

export function onRedo() {
  return {
    type: REDO_EVENT,
  };
}

export function onSavePosition(
  index: number,
  top: string,
  left: string,
  height: string,
  width: string,
) {
  return {
    type: SAVE_POSITION,
    index,
    top,
    left,
    height,
    width,
  };
}

export function getNewColorToFigure(color: string) {
  return {
    type: GET_NEW_COLOR_TO_ACTIVE_FIGURE,
    color,
  };
}

export function onDeleteKeyDownListener(eCode: string, index: number) {
  return {
    type: KEY_LISTENER_DELETE,
    eCode,
    index,
  };
}
