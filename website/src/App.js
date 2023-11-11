import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Navigation/Navbar.js';
import Filter from './Filter/Filter.js';
import Graph from './Graph/Graph.js';
import HeartRate from './HeartRate/HeartRate.js';
import './Navigation/Navbar.css';
import circle from './images/circle.png'
import { Route,Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Navbar />
      <div className='diagonal-split-background'>
        <img class="main-circle" src={circle} alt="Blue Circle"></img>
        <Routes>        
          <Route path="/Filter"  element={<Filter/>} />
          <Route path="/Graph"  element={<Graph />}/>
          <Route path="/HeartRate"  element={<HeartRate/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
