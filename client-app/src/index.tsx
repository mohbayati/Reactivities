import React from "react";
import ReactDOM from "react-dom";
import "./app/layout/index.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import { Router } from "react-router-dom";
import ScrollToTop from "./app/layout/ScrollToTop";
import {createBrowserHistory} from 'history';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/dist/css/react-widgets.css';
import dateFnsLocalizer from 'react-widgets-date-fns';
 dateFnsLocalizer();


export const history=createBrowserHistory();

ReactDOM.render(
  <Router history={history}>  
  <ScrollToTop />
    <App />
    
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
