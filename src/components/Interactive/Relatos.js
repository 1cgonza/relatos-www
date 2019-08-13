import React, { Component } from 'react';
import DataStore from '../../stores/DataStore';
import Video from './Video';

export default class Project extends Component {
  onVideoSectionClick = () => {
    window.scrollTo({
      top: this.refs.sectionVideo.offsetHeight,
      left: 0,
      behavior: 'smooth'
    });
  };

  render() {
    const project = DataStore.getAllProjects()[0];

    return (
      <main>
        <section
          ref='sectionVideo'
          className='projectSection sectionVideo'
          onClick={this.onVideoSectionClick}
        >
          <Video slug={project.slug} videoID={project.oembed} />
        </section>
      </main>
    );
  }
}
