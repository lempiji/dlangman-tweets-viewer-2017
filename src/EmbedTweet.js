import React, { Component } from 'react'

class EmbedTweet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      target: props.id,
    };
  }

  componentDidMount() {
    this.renderTweet(this.state.target);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!nextProps.id && this.props.id !== nextProps.id;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.setState({ target: this.props.id });
    }
  }

  render() {
    return <div ref={(c) => this._container = c} />;
  }

  componentDidUpdate() {
    while (this._container && this._container.firstChild) {
      this._container.firstChild.remove();
    }
    this.renderTweet(this.state.target);
  }

  renderTweet(id) {
    window.twttr.ready().then(async ({ widgets }) => {
      if (this.state.target !== id) return;

      widgets.createTweetEmbed(this.props.id, this._container);
    });
  }
}

export default EmbedTweet;