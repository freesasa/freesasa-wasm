import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Result from './Result';

import freesasa from './freesasa.js';

let freesasa_run;
let FS;
freesasa().then(Module => {
  freesasa_run = Module.cwrap('freesasa_run', 'number', ['string', 'string'])
  FS = Module.FS;
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      result: '',
      pdbCode: ''
    }
  }

  fetchPDB() {
    const pdbCode = this.state.pdbCode;
    if (!pdbCode.match(/\w\w\w\w/)) {
      return;
    }

    window.fetch('https://files.rcsb.org/download/' + pdbCode + '.pdb')
    .then(response => response.text())
    .then(text => {
        FS.writeFile('/pdb', text);
        FS.writeFile('/out', '');
        freesasa_run('/pdb', '/out');
        this.setState({result: String.fromCharCode.apply(null, FS.readFile('/out'))});
    });
  }

  setPDB(code) {
    this.setState({pdbCode: code});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <input type="text" value={this.state.pdbCode} onChange={evt => this.setPDB(evt.target.value)}/>
        <button onClick={this.fetchPDB()}>calculate</button>
        <pre>{this.state && this.state.result}</pre>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
