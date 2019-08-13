import React, { Component } from 'react';
import DataStore from '../stores/DataStore.js';

export default class Home extends Component {
  render() {
    let page = DataStore.getPageBySlug('sobre');
    console.log(page);
    return (
      <main className='pageWrapper m-90 t-70 d-50 ld-40'>
        <h1 className='pageTitle'>{page.title.rendered}</h1>
        <div
          className='pageContent'
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </main>
    );
  }
}
