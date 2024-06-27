import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'antd/dist/reset.css';
import './App.css';
// Your component imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Company from './pages/Company';
import DeliveryOrder from './pages/DeliveryOrder';
import OrderHistory from './pages/OrderHistory';
import Admin from './pages/Admin';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/admin' component={Admin} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/company/:companyId' component={Company} />
        <Route
          exact
          path='/company/:companyId/history'
          component={OrderHistory}
        />
        <Route
          exact
          path='/company/:companyId/order'
          component={DeliveryOrder}
        />
      </Switch>
    </Router>
  );
};

export default App;
