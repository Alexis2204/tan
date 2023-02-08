import './App.scss'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NotFound from './components/NotFound/NotFound'
import Home from './components/Home/Home';
import New from './components/New/New';
import Trajet from './components/Trajet/Trajet';
import logo from './media/images/Logo.png'

export default function App() {
  return (
    <Router>
      <div className='app'>
        <Link to="/">
          <div className='logo'>
            <img src={logo} alt="logo" height='100px' />
          </div>
        </Link>
        <div className='page'>
            <Routes>
              <Route path="/" element={<Home></Home>}/>
              <Route path="/new" element={<New></New>}/>
              <Route path="/trajet/:id" element={<Trajet></Trajet>}/>
              <Route path='*' element={<NotFound></NotFound>}/>
            </Routes>
        </div>
        <footer></footer>
      </div>
    </Router>
    );
}
