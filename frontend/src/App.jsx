import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home'
import Output from './pages/Output'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:id" element={<Output/>}/>
      </Routes>

    </div>
  );
}

export default App;
