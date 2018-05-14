import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link, { navigateTo } from 'gatsby-link';
import Helmet from 'react-helmet';
import Swipeable from 'react-swipeable';

import './index.css';

const Header = ({ name, title, date, path, now, slides }) => (
  <header>
    <nav>
      <Link to="/1" title="Вернуться на первую">
        <span className="logo" >{name}</span>
      </Link>
       — 
      {path
        ? <span>Резюме — <a href="javascript:history.back()" title="Посмотреть портфолио">{title}</a></span>
        : <span>{title} — <Link to="/resume" title="Посмотреть резюме">Резюме</Link></span>
      }
    </nav>
    {!path &&
      <span className="pagination">{now} / {slides}</span>
    }
    <time>{date}</time>
  </header>
)

class TemplateWrapper extends Component {
  NEXT = 39;
  PREV = 37;

  constructor(props) {
    super(props)
    this.state = {
      resume: false,
      now: parseInt(window.location.pathname.substr(1)),
      slides: this.props.data.allMarkdownRemark.edges.filter(({ node }) => {
        const id = node.fileAbsolutePath.replace(/^.*[\\\/]/, '').split('.')[0];

        if (id && id !== 404) {
          return true;
        }
      })
    }
  }

  whatPath = () => {
    window.location.pathname.includes('res')
    ? !this.state.resume && this.setState({ resume: true })
    : this.state.resume && this.setState({ resume: false })
  }

  swipeLeft = () => {
    this.navigate({ keyCode: this.NEXT });
  };

  swipeRight = () => {
    this.navigate({ keyCode: this.PREV });
  };

  navigate = ({ keyCode }) => {
    const now = parseInt(location.pathname.substr(1));

    const slides = this.props.data.allMarkdownRemark.edges.filter(
      ({ node }) => {
        const id = node.fileAbsolutePath.replace(/^.*[\\\/]/, '').split('.')[0];

        if (id && id !== 404) {
          return true;
        }
      }
    );

    if (now) {
      if (keyCode === this.PREV && now === 1) {
        return false;
      } else if (keyCode === this.NEXT && now === (slides.length - 1)) {
        return false;
      } else if (keyCode === this.NEXT) {
        navigateTo(`/${now + 1}`);
      } else if (keyCode === this.PREV) {
        navigateTo(`/${now - 1}`);
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.navigate);
    this.whatPath()
  }

  componentDidUpdate = (prevState) => {
    this.whatPath()
    let newNow = parseInt(window.location.pathname.substr(1))
    if (!this.state.resume && this.state.now !== newNow)
      this.setState({ now: newNow })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.navigate);
  }

  render() {
    const { children, data } = this.props;
    return (
      <div>
        <Helmet
          title={`${this.state.resume ? 'Резюме' : data.site.siteMetadata.title} — ${data.site.siteMetadata.name}`}
        />
        <Header
          name={data.site.siteMetadata.name}
          title={data.site.siteMetadata.title}
          date={data.site.siteMetadata.date}
          path={this.state.resume}
          now={this.state.now}
          slides={this.state.slides.length-1}
        />
        <Swipeable
          onSwipingLeft={this.swipeLeft}
          onSwipingRight={this.swipeRight}
        >
          <div id={this.state.resume ? 'resume' : 'slide'}>{children()}</div>
        </Swipeable>
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object,
};

export default TemplateWrapper;

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        name
        title
        date
      }
    }
    allMarkdownRemark {
      edges {
        node {
          fileAbsolutePath
        }
      }
    }
  }
`;
