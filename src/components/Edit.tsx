import { useEffect, useRef, useState } from "react";
import "../styles/Edit.css";
import { store } from "../store";
import Path from "./Path";
import TextbookCard from "./TextbookCards";
import SectionCard from "./SectionCards";
import WordsCard from "./WordsCards";

function Edit() {
    const [textbooksData, setTextbooksData] = useState([{ "textbook": "", "sections": 0 }])
    const [sectionsData, setSectionsData] = useState([""])
    const [wordsData, setWordsData] = useState([{ "polish": "", "german": "", "isProverb": false }])
    const [chosenTextbook, setChosenTextbook] = useState("");
    const [chosenSection, setChosenSection] = useState("");
    const [isDeleteMode, setDeleteMode] = useState(false);
    const [isAdding, setAddingMode] = useState(false);
    const addingValuesCardRef = useRef<HTMLDivElement>(null);
    const [firstClick, setFirstClick] = useState(true);


    const getTextbooks = async () => {
        let storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        let textbooks = storeData["textbooks"];
        let newTextbooksData: { "textbook": string, "sections": number }[] = [];
        for (let textbook in textbooks) {
            let sections: Array<string> = storeData[textbooks[textbook]]["sections"];
            newTextbooksData.push({ "textbook": textbooks[textbook], "sections": sections.length })
        }
        setTextbooksData(newTextbooksData);
    }
    const getSections = async () => {
        if (chosenTextbook != "") {
            let storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
            setSectionsData(storeData[chosenTextbook]["sections"]);
        }
    }
    const getWords = async () => {
        if (chosenSection != "") {
            let storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
            let words = storeData[chosenTextbook][chosenSection];
            setWordsData(words);
        }
    }

    useEffect(() => {
        getTextbooks();
    }, [])
    useEffect(() => {
        getSections();
    }, [chosenTextbook])
    useEffect(() => {
        getWords();
    }, [chosenSection])
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (addingValuesCardRef.current && !addingValuesCardRef.current.contains(event.target as Node)) {
                if (!firstClick) {
                    // Kliknięcie miało miejsce poza danym <div> po drugim kliknięciu
                    setAddingMode(false);
                    setFirstClick(true);
                } else {
                    // To jest pierwsze kliknięcie, zignoruj
                    setFirstClick(false);
                }
            }
        };

        // Dodaj globalny event listener do nasłuchiwania kliknięć
        document.addEventListener('click', handleClickOutside);

        // Usuń event listener po zniszczeniu komponentu
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [firstClick]);

    return (
        <div className="EditContainer">
            <Path
                chosenSection={chosenSection}
                chosenTextbook={chosenTextbook}
                setChosenSection={setChosenSection}
                setChosenTextbook={setChosenTextbook}
                setDeleteMode={setDeleteMode}
                isDeleteMode={isDeleteMode} />

            {chosenTextbook == "" && <TextbookCard
                textbooksData={textbooksData}
                isDeleteMode={isDeleteMode}
                setChosenTextbook={setChosenTextbook}
                isAdding={isAdding}
                addingValuesCardRef={addingValuesCardRef}
                setAddingMode={setAddingMode}
                getTextbooks={getTextbooks}
                setDeleteMode={setDeleteMode}
                setFirstClick={setFirstClick} />}

            {chosenTextbook != "" && chosenSection == "" && <SectionCard
                sectionsData={sectionsData}
                isDeleteMode={isDeleteMode}
                setChosenSection={setChosenSection}
                isAdding={isAdding}
                addingValuesCardRef={addingValuesCardRef}
                setAddingMode={setAddingMode}
                chosenTextbook={chosenTextbook}
                setSectionsData={setSectionsData}
                getTextbooks={getTextbooks}
                setDeleteMode={setDeleteMode}
                getSections={getSections}
                setFirstClick={setFirstClick} />}



            {chosenSection != "" && <WordsCard
                wordsData={wordsData}
                isDeleteMode={isDeleteMode}
                addingValuesCardRef={addingValuesCardRef}
                chosenTextbook={chosenTextbook}
                chosenSection={chosenSection}
                setWordsData={setWordsData}
                setDeleteMode={setDeleteMode}
                setAddingMode={setAddingMode}
                setFirstClick={setFirstClick}
                isAdding={isAdding} />}
        </div>
    );
}

export default Edit;
