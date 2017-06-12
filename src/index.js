import "whatwg-fetch";
import "babel-polyfill";
import React, { Component } from "react";
import ReactDOM, { render } from "react-dom";
import App from "./components";

render(
  <App />,
  document.getElementById('app')
);
