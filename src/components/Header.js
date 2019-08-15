import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MainMenu from './Interactive/ui/MainMenu';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      showScroll: true
    };
  }

  onClick = e => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  onScroll = e => {
    if (
      window.pageYOffset >=
      document.body.clientHeight - window.innerHeight - 400
    ) {
      this.setState({
        showScroll: false
      });
    } else {
      if (!this.state.showScroll) {
        this.setState({
          showScroll: true
        });
      }
    }
  };

  getScroll(hide) {
    if (hide) return null;

    let cl = 'iconScroll';
    cl += !this.state.showScroll ? ' hide' : '';
    return <div ref='iconScroll' className={cl} />;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const pathname = location.pathname;
    const showMainMenu = pathname === '/' || pathname === '/sobre';

    return (
      <header>
        {!showMainMenu ? <MainMenu /> : null}
        <Link className='siteLogo' to='/' />
        {this.getScroll(showMainMenu)}
      </header>
    );
  }
}
