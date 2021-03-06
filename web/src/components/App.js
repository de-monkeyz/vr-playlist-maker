import "styles/components/App.styl";

import { ipcRenderer } from "electron";

import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { connect } from "react-redux";
import { autobind } from "core-decorators";

import { activePlaylist, currentIndex } from "selectors";
import { startPlaylist, stopPlaylist, restartApp } from "actions";

import Playlist from "./Playlist";
import ControlBar from "./ControlBar";

class App extends React.Component {
  static propTypes = {
    start: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
    restart: PropTypes.func.isRequired,
    running: PropTypes.bool.isRequired,
    playlist: PropTypes.arrayOf(PropTypes.shape({
      exe: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
    })),
    current: PropTypes.number.isRequired,
    counter: PropTypes.number.isRequired,
  };

  state = {
    processes: [],
  };

  @autobind
  handleStartStop() {
    const { start, stop, running } = this.props;
    if (running) {
      stop();
    } else {
      start();
    }
  }

  @autobind
  handleRestart() {
    this.props.restart();
  }

  handleShowConfig() {
    ipcRenderer.send("SHOW_CONFIG_WINDOW");
  }

  handleShowEditor() {
    ipcRenderer.send("SHOW_EDITOR_WINDOW");
  }

  render() {
    const { running, playlist, current, counter } = this.props;
    return (
      <div className="App">
        <ControlBar title="VR Playlist Maker" />
        <button
          className={cn("App__start", {
            "is-running": running,
          })}
          type="button"
          onClick={this.handleStartStop}
        >
          {running ? "Running (Stop)" : "Click to start"}
        </button>
        <Playlist
          items={playlist}
          current={current}
          counter={counter}
          onRestart={this.handleRestart}
        />
        <nav className="App__actions">
          <button
            className="App__actions__button App__actions__button--editor"
            onClick={this.handleShowEditor}
            title="Edit Playlist"
          >
            Edit Playlist
          </button>
          <button
            className="App__actions__button App__actions__button--config"
            onClick={this.handleShowConfig}
            title="Settings"
          >
            Config
          </button>
        </nav>
      </div>
    );
  }
}

export { App };
export default connect(state => ({
  running: state.playback.running,
  playlist: activePlaylist(state),
  current: currentIndex(state),
  counter: state.playback.counter,
}), dispatch => ({
  start: () => dispatch(startPlaylist()),
  stop: () => dispatch(stopPlaylist()),
  restart: () => dispatch(restartApp()),
}))(App);
