
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Todo from "./pages/todo";
import "./style.css";


function App()
{
  return (
    <div className="app">
       <BrowserRouter>
       <Routes>
       <Route path="/" element={<Todo/>} />
       </Routes>
       </BrowserRouter>
    </div>
    
  )
}
export default App