import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import DataStore from '../../stores/DataStore';
import Tree from './Tree';
import Video from './Video';
import Docs from './Docs';
import GalleryUI from './ui/GalleryUI';
import RiverColors from './graphics/RiverColors';
import Bosque from './graphics/Bosque';

export default class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchTo: null
    };
  }

  switchProject = slug => {
    // this.props.history.push(`/${slug}`);
    this.setState({
      switchTo: slug
    });
  };

  onVideoSectionClick = () => {
    window.scrollTo({
      top: this.refs.sectionVideo.offsetHeight,
      left: 0,
      behavior: 'smooth'
    });
  };

  getVideo(id) {
    if (!id) return null;
    return (
      <Video
        slug={this.props.slug}
        videoID={id}
        switchProject={this.switchProject}
      />
    );
  }

  getQuote(quote) {
    if (!quote) return null;
    return <p className='projectQuote'>{quote}</p>;
  }

  getArrows() {
    const prevNext = DataStore.getPrevNextProjects(this.props.slug);

    let next = prevNext.next ? (
      <Link key='right' className='arrow arrowRight' to={`/${prevNext.next}`} />
    ) : null;
    let prev = prevNext.prev ? (
      <Link key='prev' className='arrow arrowLeft' to={`/${prevNext.prev}`} />
    ) : null;

    return [next, prev];
  }

  render() {
    if (this.state.switchTo) {
      return (
        <Redirect
          to={{
            pathname: `/${this.state.switchTo}`,
            state: {
              autoplay: true
            }
          }}
        />
      );
    }

    const project = DataStore.getPageBySlug(this.props.slug, 'projects');
    let arrows = this.getArrows();

    return (
      <main>
        {arrows}
        <section className='projectSection sectionForest' ref='main'>
          <div className='projectSummary' style={{ zIndex: 9 }}>
            <h1 className='projectTitle'>{project.title}</h1>
            {this.getQuote(project.quote)}
          </div>

          <Tree
            treeImg='/assets/arbol.png'
            colorImgs={project.gallery}
            violence={project.violencia}
          />
          <Bosque />
          <RiverColors violenceIds={project.violencia} />
        </section>
        <section
          ref='sectionVideo'
          className='projectSection sectionVideo'
          slug={project.slug}
          onClick={this.onVideoSectionClick}
        >
          {this.getVideo(project.oembed)}
        </section>
        <Docs project={project} />
        <GalleryUI />
      </main>
    );
  }
}
