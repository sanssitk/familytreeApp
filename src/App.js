import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/HomePage/Home";
import NewFamilyForm from "./Routes/AddFamily/NewFamilyForm";

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/addmember" component={NewFamilyForm} />

          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
