import React, { Component } from 'react';
import DataStore from '../../../stores/DataStore';
import { sizeFromPercentage, random } from '../../../utils/helpers';
import { themesData, techniquesData } from '../../../utils/categories';

export default class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      themeOptions: null,
      tehcsOptions: null,
      projectW: 0
    };
  }

  onResize = e => {
    this.setState({
      projectW:
        this.refs.timeline.clientWidth / DataStore.getAllProjects().length
    });
  };

  timelineClick = e => {
    let coords = e.target.getBoundingClientRect();
    const pos = e.clientX - coords.left;
    const s = pos * (this.props.duration / Math.round(coords.width));
    this.props.seekTo(s);
  };

  handleMouseEnter = e => {
    let coords = e.target.getBoundingClientRect();
    this.refs.tip.style.left = `${coords.x}px`;
    this.refs.tip.style.top = `${coords.y + 20}px`;
    this.refs.tip.innerText = e.target.dataset.name;
    this.refs.tip.classList.add('active');
  };

  handleMouseLeave = () => {
    this.refs.tip.innerText = '';
    this.refs.tip.classList.remove('active');
  };

  handleClick = e => {
    this.player.seekTo(e.target.dataset.start);
  };

  getTimelineEles() {
    if (!this.state.d || !this.state.duration) {
      return null;
    }

    let h = sizeFromPercentage(18, window.innerHeight) | 0;
    let w = sizeFromPercentage(90, window.innerWidth) | 0;
    let stepH = h / this.state.options.length;
    let stepW = w / (this.state.duration * 1000);

    return this.state.options.map((option, i) => {
      return option.d.map((node, j) => {
        return (
          <span
            key={option.slug + i + j}
            className={`timelineEle ${option.slug}`}
            data-name={option.name}
            data-start={node.start / 1000}
            style={{
              left: node.start * stepW + 'px',
              top: i * stepH + 'px'
            }}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick}
          />
        );
      });
    });
  }

  getPoints() {
    if (!this.refs.timeline) return null;

    const projects = DataStore.getAllProjects();
    return projects.map((project, i) => {
      const len = project.themesSrt.d[project.themesSrt.d.length - 1].endTime;
      const x1 = i * this.state.projectW;
      const stepX = this.state.projectW / len;

      return project.themesSrt.d.map((point, j) => {
        const x2 = stepX * point.startTime;
        const w = (point.endTime - point.startTime) * stepX;

        return point.terms.map((theme, ii) => {
          const themeI = themesData.findIndex(obj => obj.name === theme);
          return (
            <span
              key={`project${i}-point${j}-term${ii}`}
              className={`timelinePoint ${project.slug} ${
                themesData[themeI].slug
              }`}
              style={{
                left: `${x1 + x2}px`,
                width: `${w}px`,
                top: `${themeI * 5}px`,
                opacity: this.props.slug === project.slug ? 1 : 0.3
              }}
            />
          );
        });
      });
    });
  }

  optionClick = e => {
    const theme = e.target.innerText;

    // Define position
    const currentTime = this.props.getCurrentTime();
    let position = this.props.currentProjectThemeD.find(point => {
      return point.startTime >= currentTime && point.terms.indexOf(theme) >= 0;
    });

    if (position) {
      this.props.updatePosition(position);
      this.props.seekTo(position.startTime);
    }

    this.props.setPlaybackTheme(theme);
  };

  getOptions() {
    if (!this.props.currentProjectThemes) {
      return null;
    }

    return this.props.currentProjectThemes.map((option, i) => {
      const themeI = themesData.findIndex(theme => theme.name === option);
      return (
        <span
          key={`op${i}`}
          className={`timelineOption ${themesData[themeI].slug}`}
          data-name={option}
          onClick={this.optionClick}
        >
          {option}
        </span>
      );
    });
  }

  componentDidMount() {
    this.setState({
      projectW:
        this.refs.timeline.clientWidth / DataStore.getAllProjects().length
    });
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    const points = this.getPoints();

    return (
      <div className='player'>
        <div ref='timeline' className='timeline' onClick={this.timelineClick}>
          {points}
          <div ref='progress' className='progress' />
          <div ref='header' className='header' />
        </div>

        <div className='options' ref='options'>
          {this.getOptions()}
        </div>
        <div ref='tip' className='tip' />
      </div>
    );
  }
}
