import React, { Component } from 'react';
import DataStore from '../../stores/DataStore';
import { fitElement, random, Debouncer, shuffle } from '../../utils/helpers';
import Player from './ui/Player';
import PlayPause from './ui/PlayPause';
import VideoPlayer from './ui/VideoPlayer';
import { themesData, techniquesData } from '../../utils/categories';

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProject: null,
      currentProjectThemes: null,
      currentProjectThemeD: null,
      videoReady: false,
      playbackReady: false,
      duration: 0,
      position: null,
      playing: false,
      nextPosition: null,
      playbackTheme: null,
      dims: null,
      buffered: 0,
      currentTime: 0,
      subList: null,
      currentSubLang: null,
      volume: null
    };

    this.debouncer = new Debouncer();
  }

  onResize = () => {
    if (!this.state.playbackReady) return;

    this.debouncer.debounce().then(() => {
      const dims = fitElement(
        1280,
        720,
        document.body.clientWidth,
        window.innerHeight
      );

      this.player.width = `${dims.w}px`;
      this.player.height = `${dims.h}px`;

      if (this.state.playing) {
        window.scrollTo({
          top: this.refs.videoWrapper.offsetHeight,
          left: 0,
          behavior: 'smooth'
        });
      }

      this.setState({
        dims: dims
      });
    });
  };

  // https://developer.dailymotion.com/player#player-api-events
  onPlaybackReady = e => {
    // add play button
    this.setState({
      playbackReady: true,
      volume: this.player.volume
    });
  };

  onPlay = e => {
    this.setState({
      playing: true
    });

    window.scrollTo({
      top: this.refs.videoWrapper.offsetHeight,
      left: 0,
      behavior: 'smooth'
    });
  };

  onPause = () => {
    this.setState({
      playing: false
    });
  };

  onLoadedMeta = () => {
    this.setState({
      videoReady: true,
      duration: this.player.duration,
      currentSubLang: this.player.subtitle
    });
  };

  onVolumeChange = val => {
    this.player.setVolume(val);
    this.setState({
      volume: val
    });
  };

  loadNewVideoInPosition() {
    const rel = themesData.find(t => t.name === this.state.playbackTheme)
      .projects;
    const next = DataStore.getProjectBySlug(rel[random(0, rel.length)]);
    let copy = [...next.themesSrt.d];
    shuffle(copy);

    const position = copy.find(p => {
      return p.terms.find(term => term === this.state.playbackTheme);
    });
    this.setState({
      position: position,
      currentProject: next.slug,
      currentProjectThemes: next.themesSrt.options,
      currentProjectThemeD: next.themesSrt.d
    });

    this.player.load(next.oembed, {
      autoplay: true,
      start: position.startTime
    });
  }

  onTimeUpdate = () => {
    if (this.state.position) {
      if (this.state.position.endTime <= this.player.currentTime) {
        const d = this.state.currentProjectThemeD;
        let posI = d.findIndex(pos => {
          return pos.startTime === this.state.position.startTime;
        });

        if (posI + 1 < d.length) {
          const nextPoint = d[++posI];

          if (nextPoint.terms.includes(this.state.playbackTheme)) {
            this.setState({
              position: nextPoint
            });
          } else {
            this.loadNewVideoInPosition();
          }
        } else {
          this.loadNewVideoInPosition();
        }
      }
    }

    this.setState({
      currentTime: this.player.currentTime,
      buffered: this.player.bufferedTime
    });
  };

  onVideoEnd = () => {
    const next = DataStore.getProjectBySlug(
      DataStore.getPrevNextProjects(this.state.currentProject).next
    );

    this.setState({
      currentProject: next.slug,
      currentProjectThemes: next.themesSrt.options,
      currentProjectThemeD: next.themesSrt.d
    });

    this.player.load(next.oembed, {
      autoplay: true
    });
  };

  onSubsAvailable = e => {
    let subs = this.player.subtitles;
    subs = subs.filter(val => val === 'en' || val === 'es');
    this.setState({
      subList: subs
    });
  };

  onSubsChange = e => {
    this.player.setSubtitle(e.target.value);
    this.setState({
      currentSubLang: e.target.value
    });
  };

  getCurrentTime = () => {
    return this.player.currentTime;
  };

  updatePosition = position => {
    this.setState({
      position: position
    });
  };

  setNextPosition = nextPosition => {
    this.setState({
      nextPosition: nextPosition
    });
  };

  setPlaybackTheme = theme => {
    this.setState({
      playbackTheme: theme
    });
  };

  seekTo = time => {
    if (this.player.bufferedTime === 0) {
      this.player.load(this.props.videoID, {
        autoplay: true,
        start: time
      });
    } else {
      if (this.player.paused) this.player.play();
      this.player.seek(time);
    }
  };

  videoScriptLoaded = () => {
    const dims = fitElement(
      1280,
      720,
      document.body.clientWidth,
      window.innerHeight
    );

    this.player = DM.player(this.refs.player, {
      video: this.props.videoID,
      width: `${dims.w}px`,
      height: `${dims.h}px`,
      params: {
        autoplay: false,
        controls: false,
        quality: '720',
        'sharing-enable': false,
        'ui-logo': false,
        'ui-start-screen-info': false,
        fullscreen: false
      }
    });

    this.player.addEventListener('playback_ready', this.onPlaybackReady);
    this.player.addEventListener('loadedmetadata', this.onLoadedMeta);
    this.player.addEventListener('play', this.onPlay);
    this.player.addEventListener('pause', this.onPause);
    this.player.addEventListener('timeupdate', this.onTimeUpdate);
    this.player.addEventListener('video_end', this.onVideoEnd);
    this.player.addEventListener('subtitlesavailable', this.onSubsAvailable);
    // this.player.addEventListener('controlschange', this.onContolsChange);
    // this.player.addEventListener('start', this.onVideoStart);
    // this.player.addEventListener('progress', this.onProgress);
    // this.player.addEventListener('playing', this.onPlaying);
    // this.player.addEventListener('waiting', this.onBuffering);
    // this.player.addEventListener('apiready', this.videoApiReady);

    this.setState({
      currentProject: this.props.slug,
      dims: dims
    });
  };

  componentDidMount() {
    // Load DailyMotion SDK
    const dailyMotionS = document.createElement('script');
    dailyMotionS.async = true;
    dailyMotionS.src = 'https://api.dmcdn.net/all.js';
    const siteS = document.getElementsByTagName('script')[0];
    siteS.parentNode.insertBefore(dailyMotionS, siteS);
    window.dmAsyncInit = this.videoScriptLoaded;

    const project = DataStore.getProjectBySlug(this.props.slug);
    this.setState({
      currentProject: this.props.slug,
      currentProjectThemes: project.themesSrt.options,
      currentProjectThemeD: project.themesSrt.d
    });

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    this.player.removeEventListener('playback_ready', this.onPlaybackReady);
    this.player.removeEventListener('loadedmetadata', this.onLoadedMeta);
    this.player.removeEventListener('play', this.onPlay);
    this.player.removeEventListener('pause', this.onPause);
    this.player.removeEventListener('timeupdate', this.onTimeUpdate);
    this.player.removeEventListener('video_end', this.onVideoEnd);

    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return (
      <div id='videoWrapper' ref='videoWrapper'>
        <div ref='player' />
        <PlayPause
          ready={this.state.playbackReady}
          playing={this.state.playing}
        />
        <VideoPlayer
          dims={this.state.dims}
          duration={this.state.duration}
          seekTo={this.seekTo}
          buffered={this.state.buffered}
          currentTime={this.state.currentTime}
          subList={this.state.subList}
          currentSubLang={this.state.currentSubLang}
          onSubsChange={this.onSubsChange}
          volume={this.state.volume}
          onVolumeChange={this.onVolumeChange}
        />
        <Player
          slug={this.state.currentProject}
          currentProjectThemes={this.state.currentProjectThemes}
          currentProjectThemeD={this.state.currentProjectThemeD}
          seekTo={this.seekTo}
          getCurrentTime={this.getCurrentTime}
          updatePosition={this.updatePosition}
          setNextPosition={this.setNextPosition}
          setPlaybackTheme={this.setPlaybackTheme}
        />
      </div>
    );
  }
}
