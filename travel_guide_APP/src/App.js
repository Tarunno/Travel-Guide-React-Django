import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';

import NavBar from './components/Layouts/NavBar/NavBar';
import Home from './components/pages/Home/Home';
import About from './components/pages/About/About';
import Category from './components/pages/Category/Category';
import Profile from './components/pages/Profile/Profile';
import Place from './components/pages/Place/Place';
import Signin from './components/pages/Signin/Signin';


class App extends Component {
    render(){
        return (
          <div className="App">
              <Router>
                <NavBar />
                    <Switch>
                        <Route path="/" exact component={Home}/>
                        <Route path="/about" exact component={About}/>
                        <Route path="/category/" component={Category}/>
                        <Route path="/place/" component={Place}/>
                        <Route path="/signin/" component={Signin}/>
                        <Route path="/profile" component={Profile}/>
                    </Switch>
              </Router>
          </div>
        );
    }
}
export default App;
