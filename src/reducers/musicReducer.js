export default function (state={
    musicList:[]
},action) {
    //Chat reducers
    switch (action.type) {
        case 'GET_MUSIC':
            return {...state,musicList:action.payload};

        case 'SEARCH_MUSIC':
            return {...state,musicList:action.payload};
        
        default:
            return state;
    }
}