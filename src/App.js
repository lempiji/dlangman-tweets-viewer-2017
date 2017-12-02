import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import EmbedTweet from './EmbedTweet';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      index: 0,
      posText: "0",
      sliderPos: 0,
    };

    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderDragStop = this.handleSliderDragStop.bind(this);
  }

  render() {
    const {
      min,
      max,
      currentId,
      currentIndex,
      currentSliderPos,
      currentText,
      isFetched,
      handlePrev,
      handleNext,
      handleTextChange,
      handleSliderChange,
      handleSliderDragStop,
    } = this;

    return (
      <MuiThemeProvider theme={getMuiTheme()}>
        <div className="app">
          <header style={{ padding: "1em" }}>
            <div>
              <TextField id="text" value={currentText} style={{ width: "4em" }} onChange={handleTextChange} autoFocus={true} />
              <RaisedButton label="Prev" onClick={handlePrev} style={{ margin: "auto 0" }} />
              <RaisedButton primary={true} label="Next" onClick={handleNext} style={{ margin: "auto 0" }} />
            </div>
            <div>
              {
                isFetched
                  ? <Slider
                    value={currentSliderPos}
                    min={min}
                    max={max}
                    step={1}
                    onChange={handleSliderChange}
                    onDragStop={handleSliderDragStop}
                  />
                  : <Slider disabled={true} />
              }
            </div>
            <div>Index : {currentIndex}</div>
            <div>Tweet ID : {currentId}</div>
          </header>
          <main>
            {
              isFetched
                ? <EmbedTweet id={currentId} />
                : (<div style={{ position: "relative", textAlign: "center" }}>
                  <RefreshIndicator status="loading" top={0} left={0} style={{ display: "inline-block", position: "relative" }} />
                </div>)
            }
          </main>
        </div>
      </MuiThemeProvider>
    );
  }

  async componentDidMount() {
    const response = await fetch("https://gist.githubusercontent.com/simdnyan/02fbf4106ad9bd39cf02eb418ced5fa5/raw/4b5cfe9712d0c1ea5a2f81ffd71ffe9d14deb6bd/20161201-20171130");
    const data = await response.text();
    const ids = data.trim().split("\n");
    this.setState({ ids, index: 0 });
  }

  handlePrev() {
    this.moveTo(this.state.index - 1);
  }
  handleNext() {
    this.moveTo(this.state.index + 1);
  }

  moveTo(index) {
    if (typeof index === "string") {
      index = +index;
    }
    if (isNaN(index)) {
      index = this.currentIndex;
    }
    if (index < this.min) index = this.min;
    if (index > this.max) index = this.max;
    this.setState({ index, posText: "" + index, sliderPos: index });
  }

  handleTextChange(event) {
    this.moveTo(event.target.value);
  }

  handleSliderChange(event, newValue) {
    this.setState({ sliderPos: newValue, posText: "" + newValue });
  }

  handleSliderDragStop() {
    this.moveTo(this.state.sliderPos);
  }

  get isFetched() {
    return this.state.ids.length > 0;
  }

  get currentId() {
    return this.state.ids[this.currentIndex];
  }
  get currentSliderPos() {
    return this.state.sliderPos;
  }
  get currentIndex() {
    return this.state.index;
  }
  get currentText() {
    return this.state.posText;
  }

  get min() {
    return 0;
  }
  get max() {
    return this.isFetched ? this.state.ids.length - 1 : 1;
  }
}

export default App;
