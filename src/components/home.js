import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { getMusic,searchMusic } from "../actions";

class Home extends PureComponent {

    constructor(props) {
        super(props);
        this.mPlayer = React.createRef();
        this.progress = React.createRef();
        this.volume = React.createRef();
    }
    
    state = {
        artist: '',
        song:'',
        playing: false,
        src:'',
        curTime: '0:00',
        duration: '0:00',
        volume: 1,
        searchFor: ''
    }
   
    componentWillMount() {
        this.props.dispatch(getMusic())
    }
    
    fetchDuration = (number) => {
        number = Math.floor(number);
        let res = '';
        let minutes = number / 60 >> 0;
        let seconds = number - minutes*60;
        if (seconds < 10) {
            seconds='0'+seconds
        };
        res = minutes + ':' + seconds;
        return res
    };

    elapsedTime = () =>{
        let dur = this.state.duration;
        let cur = this.state.curTime;
        let result = +dur.split(':')[0]*60 + +dur.split(':')[1] - +cur.split(':')[0]*60 - +cur.split(':')[1];
        return this.fetchDuration(result)
    }

    renderMusic = (arr) => (
        arr.length !== 0 ?
            arr.map((item,i) =>(
                <div className='song_wrapper' key={i} onClick={()=>this.togglePlay(item)}>
                    {
                        this.state.src !== item.href ?
                        <div>
                            <span className='song_num'>{item.id+1}.</span>   
                            <span className='song_info'>
                                <span className='song_art'>{item.artist}</span>
                                <span className='song_name'>{item.song}</span>
                            </span>
                            <span className='song_dur'>{item.duration} </span>
                        </div>
                        :
                        <div className='activated'>
                            <span className='song_num'>{item.id+1}.</span>   
                            <span className='song_info'>
                                <span className='song_art'>{item.artist}</span>
                                <span className='song_name'>{item.song}</span>
                            </span>
                            <span className='song_dur'>{this.elapsedTime()} </span>
                        </div>
                    }
                </div>
            ))
        :
            <div></div>
    )

    onTimeUpdateHandler = () => {
        var ct = this.mPlayer.current.currentTime;
        this.setState({
            curTime: this.fetchDuration(ct)
        });
        var dur = this.state.duration.split(':')[0]*60 + +this.state.duration.split(':')[1];
        this.progress.current.value = ct/dur*100;
    }

    togglePlay = (item) => {
        if (item && item.href !== this.state.src && typeof item.href === 'string') {
            this.setState({
                src: item.href,
                artist: item.artist,
                song: item.song,
                playing: true,
                duration: item.duration
            },() => {
                this.mPlayer.current.play();
            });
        }
        else{
            if (this.state.src && this.state.playing===true) {
                this.setState({
                    playing: false
                });
                this.mPlayer.current.pause();
            }
            else if(this.state.src){
                this.setState({
                    playing: true
                });
                this.mPlayer.current.play();
            }; 
        } 
    }

    onEndedHandler = (current,indicator) => {
        const arr = this.props.music.musicList;
        for (let i = 0; i < arr.length; i++) {
            if (current === arr[i].href) {
                if (i+indicator >= arr.length) {
                    this.togglePlay(arr[0])
                }
                else if (i+indicator < 0) {
                    this.togglePlay(arr[arr.length-1])
                }
                else {
                    this.togglePlay(arr[i+indicator])
                }
            }
        }
    }

    onVolumeClickHandler = (e) => {
        var x = e.pageX - this.volume.current.offsetLeft;
        var clickedValue = x * this.volume.current.max / this.volume.current.offsetWidth;
        if (clickedValue >= 0) {
            this.mPlayer.current.volume = clickedValue;
            this.setState({
                volume: clickedValue
            })
        }
    }

    onMouseMoveHandler = (e) => {
        if (this.state.active && this.state.src) {
            var x = e.pageX - this.progress.current.offsetLeft;
            var clickedValue = x * this.progress.current.max / this.progress.current.offsetWidth;
            this.progress.current.value = clickedValue;
        }
    }

    onMouseDownHandler = (e) => {
        if(this.state.src){
            e.preventDefault()
            this.mPlayer.current.pause();
            this.setState({
                active:true
            });
            var x = e.pageX - this.progress.current.offsetLeft;
            var clickedValue = x * this.progress.current.max / this.progress.current.offsetWidth;
            if (this.mPlayer.current.duration) {
                var newTime = Math.floor(this.mPlayer.current.duration * clickedValue / 100);
                this.mPlayer.current.currentTime = newTime;
            }
        }
    }

    onMouseUpHandler = (e) => {
        if(this.state.src){
            e.preventDefault()
            this.mPlayer.current.play();
            this.setState({
                active:false
            });
            var x = e.pageX - this.progress.current.offsetLeft;
            var clickedValue = x * this.progress.current.max / this.progress.current.offsetWidth;
            if (this.mPlayer.current.duration) {
                var newTime = Math.floor(this.mPlayer.current.duration * clickedValue / 100);
                this.mPlayer.current.currentTime = newTime;
            }
        }
    }

    onMouseLeaveHandler = () => {
        if(this.state.src){
            this.setState({
                active:false
            });
            this.mPlayer.current.play();
        }
    }

    handleInputSearch = (e) => {
        e.preventDefault();
        if (e.target.value.length >= 1) {
            this.props.dispatch(searchMusic(e.target.value))
        };
        if (e.target.value.length === 0) {
            this.props.dispatch(getMusic())
        };
        this.setState({
            searchFor: e.target.value
        })
    }

    render() {
        return (
            <div className='mPlayer'>

                <div className='current'>
                    <div className='track'>
                        {
                            this.state.artist && this.state.song ? 
                            <div>
                                <span className='artist'>{this.state.artist}</span>
                                <span className='song'>{this.state.song}</span>
                            </div>
                            :
                            'Click on song to start playing'
                        }
                    </div>
                    
                    <div>
                        <span className='icn'>
                            <FontAwesome name="step-backward" onClick={()=>this.onEndedHandler(this.state.src,-1)}/>
                        </span>

                        <span className='icn'>
                            {
                                this.state.playing? 
                                <FontAwesome name="pause" onClick={this.togglePlay}/>
                                :
                                <FontAwesome name="play" onClick={this.togglePlay}/>
                            }
                        </span>

                        <span className='icn'>
                            <FontAwesome name="step-forward" onClick={()=>this.onEndedHandler(this.state.src,1)}/>
                        </span>
                        
                        <progress id="seekbar" value='0' max='100' ref={this.progress} onMouseMove={this.onMouseMoveHandler} onMouseLeave={this.onMouseLeaveHandler} onMouseDown={this.onMouseDownHandler} onMouseUp={this.onMouseUpHandler}></progress>

                        <span> {this.state.curTime} / {this.state.duration} </span>
                        
                    </div>

                    <div className='div_vol'>
                        <span> <FontAwesome name="volume-up"/> <progress id="volbar" ref={this.volume} value={this.state.volume} max='1' onClick={this.onVolumeClickHandler}/></span>
                    </div>

                    <div className="div_input">
                        <input type="text" placeholder="Start typing for search" value={this.state.searchFor} onChange={this.handleInputSearch}/>
                    </div>

                </div>

                <div className='space_holder'></div>

                {this.renderMusic(this.props.music.musicList)}

                <audio id='mPlayer' ref={this.mPlayer} src={this.state.src} onTimeUpdate={this.onTimeUpdateHandler} onEnded={()=>this.onEndedHandler(this.state.src,1)}>
                </audio>
            </div>
        );
    }
}

const  mapStateToProps = (state) => {
    return {
        music: state.music
    }
}

export default connect(mapStateToProps)(Home);
