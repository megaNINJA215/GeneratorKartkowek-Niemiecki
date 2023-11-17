import "./styles/App.css";
import { useState } from "react";
import Menu from "./components/Menu";
import Generate from "./components/Generate";
import Edit from "./components/Edit";


function App() {
  const [current, setCurrent] = useState<string>('G');


  return (
    <div className="MainContainer">
      <Menu setCurrent={setCurrent} current={current} />
      {current == 'G' && <Generate />}
      {current == 'E' && <Edit />}
    </div>
  );
}

export default App;
