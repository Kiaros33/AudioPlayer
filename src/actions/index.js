import {DB} from '../config';
import axios from 'axios';

export function getMusic(){
    
    const request = axios.get(`${DB}/tracks`)
    .catch((e)=>{return console.log(e)})
    .then(response => {
        let res = response.data;
        for (let i = 0; i < res.length; i++) {
            let number = Math.floor(res[i].duration);
            let fTime = '';
            let minutes = number / 60 >> 0;
            let seconds = number - minutes*60;
            if (seconds < 10) {
                seconds='0'+seconds
            };
            fTime = minutes + ':' + seconds;
            res[i].duration = fTime;
        }
        return res
    })
    
    return {
        type: 'GET_MUSIC',
        payload: request
    }
}


export function searchMusic(e){

    const request = axios.get(`${DB}/tracks?artist_like=${e}`)
    .catch((e)=>{return console.log(e)})
    return (dispatch) => {
        request.then(response => {
            let res = response.data;
            for (let i = 0; i < res.length; i++) {
                let number = Math.floor(res[i].duration);
                let fTime = '';
                let minutes = number / 60 >> 0;
                let seconds = number - minutes*60;
                if (seconds < 10) {
                    seconds='0'+seconds
                };
                fTime = minutes + ':' + seconds;
                res[i].duration = fTime;
            }
            axios.get(`${DB}/tracks?song_like=${e}`)
            .catch((e)=>{return console.log(e)})
            .then(response => {
                let res2 = response.data;
                for (let i = 0; i < res2.length; i++) {
                    let number = Math.floor(res2[i].duration);
                    let fTime = '';
                    let minutes = number / 60 >> 0;
                    let seconds = number - minutes*60;
                    if (seconds < 10) {
                        seconds='0'+seconds
                    };
                    fTime = minutes + ':' + seconds;
                    res2[i].duration = fTime;
                    if (res.filter(e => e.song === res2[i].song).length === 0) {
                        res.push(res2[i]);
                    }
                };
                dispatch({
                    type:'SEARCH_MUSIC',
                    payload:res
                })
            })
        })
    }
}