import { combineReducers } from 'redux';
import music from '../reducers/musicReducer';

//Standard root reducer
const rootReducer = combineReducers({
    music
});

export default rootReducer;