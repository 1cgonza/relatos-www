import React, { Component } from 'react';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tipTime: ''
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

  onMouseLeave = e => {
    this.refs.tip.classList.remove('active');
  };

  render() {
    if (!this.props.dims) return null;
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
        <div className='videoPlayerOptions'>{this.getSubs()}</div>
      </div>
    );
  }
}
