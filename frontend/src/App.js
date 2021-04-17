import './App.css';
import { Route, Switch } from "react-router-dom";
import  login  from "./login/login";
import dashboard from './dashboard/dashboard';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Switch>
      <Route path="/" exact component={login} />
      <Route path="/dashboard" exact component={dashboard} />
      </Switch>
    </div>
  );
}

export default App;
