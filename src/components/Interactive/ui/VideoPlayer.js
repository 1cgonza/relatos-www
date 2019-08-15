import React, { Component } from 'react';

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
  }

  timelineClick = e => {
    const coords = e.target.getBoundingClientRect();
    const pos = e.clientX - coords.left;
    const s = (this.props.duration / coords.width) * pos;
    console.log(s, this.props.duration);
    this.props.seekTo(s);
  };

  render() {
    if (!this.props.dims) return null;
    const step = this.props.dims.w / this.props.duration;
    // console.log(this.props.dims.w, this.props.duration);

    return (
      <div
        className='videoPlayerWrapper'
        style={{
          width: `${this.props.dims.w}px`
        }}
        onClick={this.timelineClick}
      >
        <span className='tip' />
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
    );
  }
}
