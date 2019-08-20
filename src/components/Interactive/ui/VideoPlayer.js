import React, { Component } from 'react';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tipTime: '',
      prevVol: 0
    };

    this.subsD = {
      en: 'English',
      es: 'Español'
    };
  }

  timelineClick = e => {
    const coords = e.target.getBoundingClientRect();
    const pos = e.clientX - coords.left;
    let s = (this.props.duration / coords.width) * pos;
    s = s >= 0 ? s : 0;
    this.props.seekTo(s);
  };

  onVolIconClick = e => {
    if (e.target.classList.contains('mute')) {
      this.props.onVolumeChange(this.state.prevVol);
    } else {
      this.props.onVolumeChange(0);
    }
  };

  getSubs() {
    if (!this.props.subList) return null;
    let on = this.props.currentSubLang ? this.props.currentSubLang : '';

    return (
      <div className='subsOption'>
        <span className='optionTitle'>CC</span>
        <select
          className='subsPicker'
          onChange={this.props.onSubsChange}
          value={on}
        >
          <option key='none' value=''>
            Off
          </option>
          {this.props.subList.map(lang => (
            <option key={lang} value={lang}>
              {this.subsD[lang]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  onMouseMove = e => {
    if (this.props.duration === 0) return null;
    const coords = e.target.getBoundingClientRect();
    const pos = e.clientX - coords.left;
    let s = (this.props.duration / coords.width) * pos;
    s = s >= 0 ? s : 0;

    this.refs.tip.style.left = `${e.clientX}px`;
    this.refs.tip.classList.add('active');

    this.setState({
      tipTime: Math.floor(s / 60) + ':' + ('0' + Math.floor(s % 60)).slice(-2)
    });
  };

  onVolumeChange = e => {
    this.props.onVolumeChange(e.target.value);
    this.setState({
      prevVol: e.target.value
    });
  };

  onMouseLeave = e => {
    this.refs.tip.classList.remove('active');
  };

  render() {
    if (!this.props.dims || !this.props.duration) return null;
    const step = this.props.dims.w / this.props.duration;

    return (
      <div className='videoPlayerWrapper'>
        <div
          className='videoPlayerTimeline'
          style={{
            width: `${this.props.dims.w}px`
          }}
          onClick={this.timelineClick}
          onMouseMove={this.onMouseMove}
          onMouseLeave={this.onMouseLeave}
        >
          <span ref='tip' className='tip'>
            {this.state.tipTime}
          </span>
          <span
            className='buffered'
            style={{
              width: `${this.props.buffered * step}px`
            }}
          />
          <span
            className='played'
            style={{
              width: `${this.props.currentTime * step}px`
            }}
          />
        </div>
        <div className='videoPlayerOptions'>
          <div className='volumeOption'>
            <span
              ref='volIcon'
              className={`volIcon${this.props.volume == 0 ? ' mute' : ''}`}
              onClick={this.onVolIconClick}
            />
            <input
              className='volume'
              type='range'
              min='0'
              max='1'
              step='.05'
              value={this.props.volume}
              onChange={this.onVolumeChange}
            />
          </div>
          {this.getSubs()}
        </div>
      </div>
    );
  }
}
