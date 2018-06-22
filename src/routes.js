import React from 'react';
import { Switch, Route } from "react-router-dom";
import Home from './components/home';


const Routes = () => (
        <Switch>
            <Route path="/" exact component={Home}/>

            {/* Show page not found if path does not match with any above*/}
            {/* <Route path="/" component={fourOFour}/> */}
            
        </Switch>
);

export default Routes;