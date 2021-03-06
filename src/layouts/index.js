import React, { Component } from "react";
import PropTypes from "prop-types";
import Link, { navigateTo } from "gatsby-link";
import Helmet from "react-helmet";
import Swipeable from "react-swipeable";

import "./index.css";
import favicon from "./favicon.png";

const Header = ({ name, title, date, resume, welcome, now, slides }) => (
  <header>
    <nav>
      <Link to="/welcome" title="Вернуться на первую">
        <span className="logo">{name}</span>
      </Link>
       —
      {resume ? (
        <span>
          Резюме — <span
            className="button-back"
            onClick={() => history.back(1)}
            title="Посмотреть портфолио"
          >
            {title}
          </span>
        </span>
      ) : (
        <span>
          {title} — <Link to="/resume" title="Посмотреть резюме">
            Резюме
          </Link>
        </span>
      )}
    </nav>
    {!resume &&
      !welcome &&
      now && (
        <span className="pagination">
          {now} / {slides - 2}
        </span>
      )}
    <time>{date}</time>
  </header>
);

class TemplateWrapper extends Component {
  NEXT = 39;
  PREV = 37;

  constructor(props) {
    super(props);
    this.state = {
      resume: false
    };
  }

  whatPath = () => {
    window.location.pathname.includes("res")
      ? !this.state.resume && this.setState({ resume: true })
      : this.state.resume && this.setState({ resume: false });
  };

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
        const id = node.fileAbsolutePath.replace(/^.*[\\\/]/, "").split(".")[0];

        if (id && id !== 404) {
          return true;
        }
      }
    );

    if (now) {
      if (keyCode === this.PREV && now === slides.length - 2) {
        navigateTo("/1");
      } else if (keyCode === this.NEXT && now === 1) {
        navigateTo(`/${slides.length - 2}`);
      } else if (keyCode === this.NEXT) {
        navigateTo(`/${now - 1}`);
      } else if (keyCode === this.PREV) {
        navigateTo(`/${now + 1}`);
      }
    } else {
      if (keyCode === this.PREV && location.pathname.substr(1) === "welcome") {
        navigateTo("/1");
      } else if (
        keyCode === this.NEXT &&
        location.pathname.substr(1) === "welcome"
      ) {
        navigateTo(`/${slides.length - 2}`);
      }
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.navigate);
    this.whatPath();
    this.setState({
      now: window.location.pathname.substr(1),
      slides: parseInt(
        this.props.data.allMarkdownRemark.edges.filter(({ node }) => {
          const id = node.fileAbsolutePath
            .replace(/^.*[\\\/]/, "")
            .split(".")[0];

          if (id && id !== 404) {
            return true;
          }
        }).length
      )
    });
  }

  componentDidUpdate = prevState => {
    this.whatPath();
    let newNow = window.location.pathname.substr(1);
    if (!this.state.resume && this.state.now !== newNow)
      this.setState({ now: newNow });
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", this.navigate);
  }

  render() {
    const { children, data } = this.props;
    return (
      <div>
        <Helmet
          title={`${
            this.state.resume ? "Резюме" : data.site.siteMetadata.title
          } — ${data.site.siteMetadata.name}`}
        >
          <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
        </Helmet>
        <Header
          name={data.site.siteMetadata.name}
          title={data.site.siteMetadata.title}
          date={data.site.siteMetadata.date}
          resume={this.state.resume}
          welcome={this.state.now === "welcome"}
          now={this.state.now}
          slides={this.state.slides}
        />
        <Swipeable
          onSwipingLeft={this.swipeLeft}
          onSwipingRight={this.swipeRight}
        >
          <div id={this.state.resume ? "resume" : "slide"}>{children()}</div>
        </Swipeable>
      </div>
    );
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object
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
