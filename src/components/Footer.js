import React, { Component } from 'react';
import Drawing from './Interactive/Drawing';
import DataStore from '../stores/DataStore';
import Flock from './Interactive/graphics/Flock';

export default class Footer extends Component {
  getDrawingUI(hide) {
    if (hide) return null;

    return (
      <section className='drawingSection'>
        <Drawing />
      </section>
    );
  }

  getFlock() {
    if (!DataStore.userAnim) return null;

    return <Flock img={DataStore.userAnim} />;
  }

  render() {
    const url = location.pathname;
    const hideDrawing = url === '/' || url === '/sobre' || url === '/relatos';

    return (
      <footer>
        {this.getFlock()}
        {this.getDrawingUI(hideDrawing)}
      </footer>
    );
  }
}
