import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import freesasa from './freesasa.js';

let freesasa_run;
let FS;
freesasa().then(Module => {
  freesasa_run = Module.cwrap('freesasa_run', 'number', ['string', 'string', 'string'])
  FS = Module.FS;
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      result: '',
      error: '',
      pdbCode: '',
      loading: false,
    }
  }

  fetchPDB() {
    const pdbCode = this.state.pdbCode.toLowerCase();
    if (!pdbCode.match(/\w\w\w\w/)) {
      return;
    }
    this.setState({loading: true, error: '', result: ''});

    window.fetch('https://files.rcsb.org/download/' + pdbCode + '.pdb')
    .then(response => {
      if (response.status === 404) {
        this.setState({loading: false})
        throw Error('404: Couldn\'t find PDB with code ' + pdbCode);
      }
      return response.text();
    })
    .then(text => {
        FS.writeFile(pdbCode, text);
        FS.writeFile('out', '');
        FS.writeFile('err', '');

        const ret = freesasa_run(pdbCode, 'out', 'err');
        this.setState({loading: false});

        if (ret) {
          this.setState({error: String.fromCharCode.apply(null, FS.readFile('err'))});
          return;
        }

        this.setState({
          result: String.fromCharCode.apply(null, FS.readFile('out')),
          error: String.fromCharCode.apply(null, FS.readFile('err'))
        });
    })
    .catch(err => {
      console.error(err);
      this.setState({
        error: err.message
      });
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
        {this.state && this.state.loading ? <p>Loading</p> : '' }
        {this.state && this.state.result ? <h2>Results</h2> : ''}
        <pre className="result">{this.state && this.state.result}</pre>
        {this.state && this.state.error ? <h2>Errors</h2> : ''}
        <p className="error">{this.state && this.state.error}</p>
      </div>
    );
  }
}

export default App;
