import { combineReducers } from 'redux';

import figuresState from './reducers/shapeReducer';
import fillColorState from './reducers/fillColorReducer';

export default combineReducers({
  figuresState,
  fillColorState,
});
