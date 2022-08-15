import config from '../../config/config';
import {
  ADD_NEW_FIGURE,
  GET_ACTIVE_FIGURE,
  RESET_ACTIVE_FIGURE,
  SAVE_POSITION,
  GET_NEW_COLOR_TO_ACTIVE_FIGURE,
  KEY_LISTENER_DELETE,
  UNDO_EVENT,
  REDO_EVENT,
} from '../actions/actionTypes';
import { ShapeType } from '../../types';

type StateType = {
  figures: Array<ShapeType>;
  maxZIndexCSS: number;
  activeFigure: null | ShapeType;
};

type HistoryType = {
  history: Array<StateType>;
  index: number;
};

type ActionType = {
  type: string;
  name: 'triangle' | 'rectangle' | 'ellipse';
  value: {
    figure: ShapeType;
    index: number;
  };
  index: number;
  top: string;
  left: string;
  height: string;
  width: string;
  color: string;
  eCode: string;
};

// Загружаем историю
const initialState: HistoryType = localStorage.getItem(config.LOCAL_STORAGE_FIGURE)
  ? {
      history: JSON.parse(localStorage.getItem(config.LOCAL_STORAGE_FIGURE) || '{}').history,
      index: JSON.parse(localStorage.getItem(config.LOCAL_STORAGE_FIGURE) || '{}').index,
    }
  : {
      history: [
        {
          figures: [],
          maxZIndexCSS: 0,
          activeFigure: null,
        },
      ],
      index: 0,
    };

export default function figuresReducer(state = initialState, action: ActionType) {
  const current = state.history[state.index];

  switch (action.type) {
    case ADD_NEW_FIGURE:
      const newFigure = {
        zIndexCSS: current.maxZIndexCSS + 1,
        type: action.name,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        position: {
          top: 'calc(50% - 50px)',
          left: 'calc(50% - 100px)',
        },
        size: {
          height: '200',
          width: '200',
        },
      };

      const sliceHistory = state.history.slice(0, state.index + 1);

      return {
        ...state,
        history: [
          ...sliceHistory,
          {
            figures: [...current.figures, newFigure],
            maxZIndexCSS: current.maxZIndexCSS + 1,
            activeFigure: newFigure,
          },
        ],
        index: state.index + 1,
      };

    case GET_ACTIVE_FIGURE:
      if (action.value.figure.zIndexCSS < current.maxZIndexCSS) {
        state.history[state.index].maxZIndexCSS = current.maxZIndexCSS + 1;
        state.history[state.index].activeFigure = action.value.figure;
        return {
          ...state,
          history: state.history,
          index: state.index,
        };
      }

      current.maxZIndexCSS = current.maxZIndexCSS + 1;
      current.activeFigure = action.value.figure;
      state.history[state.index] = current;

      return {
        ...state,
        history: state.history,
      };

    case RESET_ACTIVE_FIGURE:
      state.history[state.index].activeFigure = null;

      return {
        ...state,
        history: state.history,
      };

    case SAVE_POSITION:
      const figures = JSON.parse(JSON.stringify(state.history[state.index].figures));
      figures[action.index].position.top = action.top;
      figures[action.index].position.left = action.left;
      figures[action.index].size.height = action.height;
      figures[action.index].size.width = action.width;
      const sliceHistory2 = state.history.slice(0, state.index + 1);
      return {
        ...state,
        history: [
          ...sliceHistory2,
          {
            figures: [...figures],
            maxZIndexCSS: current.maxZIndexCSS + 1,
            activeFigure: current.activeFigure,
          },
        ],
        index: state.index + 1,
      };

    case GET_NEW_COLOR_TO_ACTIVE_FIGURE:
      const activeFigureId = current.activeFigure!.zIndexCSS;
      return {
        ...state,
        figures: [
          ...current.figures.map((f) => {
            if (f.zIndexCSS === activeFigureId) {
              return { ...f, color: action.color };
            }
            return f;
          }),
        ],
      };

    case UNDO_EVENT:
      return {
        ...state,
        index: state.index - 1 < 0 ? 0 : state.index - 1,
      };

    case REDO_EVENT:
      return {
        ...state,
        index: state.index + 1 < state.history.length ? state.index + 1 : state.index,
      };

    case KEY_LISTENER_DELETE:
      if (action.eCode === config.DELETE_KEY_DOWN) {
        const figures = JSON.parse(JSON.stringify(current.figures));
        figures.splice(action.index, 1);
        const sliceHistory = state.history.slice(0, state.index + 1);
        return {
          ...state,
          history: [
            ...sliceHistory,
            {
              figures: [...figures],
              maxZIndexCSS: current.maxZIndexCSS + 1,
              activeFigure: null,
            },
          ],
          index: sliceHistory.length,
        };
      }
      return state;

    default:
      return state;
  }
}
