import "../styles/Menu.css";
import React from 'react';

interface MenuProps {
    setCurrent: React.Dispatch<React.SetStateAction<string>>;
    current: string;
}


const Menu: React.FC<MenuProps> = ({ setCurrent, current }) => {

    return (
        <div className="MenuContainer">
            {
                current == "G" ? <div className="MenuButton" onClick={() => { setCurrent('E') }}>Generuj ➜ Podręczniki</div>
                    : <div className="MenuButton" onClick={() => { setCurrent('G') }}>Podręczniki ➜ Generuj</div>
            }

        </div >
    );
}

export default Menu;
