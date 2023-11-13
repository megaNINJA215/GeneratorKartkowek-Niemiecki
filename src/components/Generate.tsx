import { useEffect, useState } from "react";
import "../styles/Generate.css";
import { store } from "../store";

function Generate() {
    const [textbooks, setTextbooks] = useState([]);
    const [chosenTextbook, setChosenTextbook] = useState("");
    const [sections, setSections] = useState([]);
    const [chosenSection, setChosenSection] = useState("");

    const getTextbooks = async () => {
        let storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        setTextbooks(storeData["textbooks"]);
    };
    useEffect(() => {
        getTextbooks();
    }, [])
    const handleTextbookChange = async () => {
        let storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        if (chosenTextbook !== "") {
            setSections(storeData[chosenTextbook]["sections"]);
        }
    }
    useEffect(() => {
        handleTextbookChange();
    }, [chosenTextbook])

    return (
        <div className="GenerateContainer">
            <div className="GenerateSettings">
                <select name="Podręcznik" id="Podręcznik" onChange={(e) => { setChosenTextbook(e.target.value); }}>
                    <option value="" hidden>--</option>
                    {textbooks.map((value, index) => {
                        return <option key={index} value={value}>{value}</option>
                    })}
                </select>
                <select name="Dział" id="Dział" value={chosenSection} onChange={(e) => { setChosenSection(e.target.value) }}>
                    <option value="" hidden>--</option>
                    {sections.map((value, index) => {
                        return <option key={index} value={value}>{value}</option>
                    })}
                </select>
                <div className="GenerateButton" onClick={() => {
                    console.log("generuj:", chosenTextbook, chosenSection);
                }}>Generuj</div>
            </div>
        </div>
    );
}

export default Generate;
