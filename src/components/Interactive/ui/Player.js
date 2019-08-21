import React, { Component } from 'react';
import DataStore from '../../../stores/DataStore';
import { themesData, techniquesData } from '../../../utils/categories';

export default class Player extends Component {
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
        <div ref='timeline' className='timeline'>
          {points}
        </div>

        <div className='options' ref='options'>
          {this.getOptions()}
        </div>
      </div>
    );
  }
}
