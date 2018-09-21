import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Result extends Component {
  render() {
    return (
      <pre>{props.value}</pre>
    );
  }
}