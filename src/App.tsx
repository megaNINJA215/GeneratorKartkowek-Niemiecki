import "./styles/App.css";
import { useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";
import Menu from "./components/Menu";
import Generate from "./components/Generate";
import Edit from "./components/Edit";
import { clearData } from "./store";

const store = new Store(".data.dat");

function App() {
  const [isBlur, setBlur] = useState<boolean>(true);
  const [current, setCurrent] = useState<string>('G');

  const loadData = async () => {
    await store.load();
  }
  useEffect(() => {
    loadData();
    setBlur(false);
  }, []);

  if (false) {
    clearData();
  }

  return (
    <div className="MainContainer" style={isBlur ? { filter: "blur(2.5px)" } : { filter: "blur(0px)" }}>
      <Menu setCurrent={setCurrent} current={current} />
      {current == 'G' && <Generate />}
      {current == 'E' && <Edit />}
    </div>
  );
}

export default App;
