import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

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

  submit(e) {
    e.preventDefault();
    console.log(e);
    this.fetchPDB();
  }

  setPDB(code) {
    this.setState({pdbCode: code});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">FreeSASA WASM Demo</h1>
        </header>
        <form onSubmit={(e) => this.submit(e)}>
          <input type="text" placeholder="PDB code" value={this.state.pdbCode} onChange={e => this.setPDB(e.target.value)} />
          <button>Calculate</button>
        </form>
        {this.state && this.state.result ? <h2>Results</h2> : ''}
        <pre>{this.state && this.state.result}</pre>
      </div>
    );
  }
}

export default App;
