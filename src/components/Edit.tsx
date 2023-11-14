import { useEffect, useRef, useState } from "react";
import "../styles/Edit.css";
import { store } from "../store";

function Edit() {
    const [textbooksData, setTextbooksData] = useState([{ "textbook": "", "sections": 0 }])
    const [sectionsData, setSectionsData] = useState([""])
    const [wordsData, setWordsData] = useState([{ "polish": "", "german": "", "isProverb": false }])
    const [chosenTextbook, setChosenTextbook] = useState("");
    const [chosenSection, setChosenSection] = useState("");
    const [isDeleteMode, setDeleteMode] = useState(false);
    const [isAdding, setAddingMode] = useState(false);
    const addingValuesCardRef = useRef<HTMLDivElement>(null);
    const textbookTitleInput = useRef<HTMLInputElement>(null);
    const sectionTitleInput = useRef<HTMLInputElement>(null);
    const wordPolishInput = useRef<HTMLInputElement>(null);
    const wordGermanInput = useRef<HTMLInputElement>(null);
    const proverbInput = useRef<HTMLInputElement>(null);
    const [firstClick, setFirstClick] = useState(true);


    const deleteTextbook = async (textbook: string) => {
        const storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        delete storeData[textbook];
        storeData["textbooks"] = storeData["textbooks"].filter((value: string) => { return value !== textbook });
        await store.set("GeneratorData", storeData);
        await store.save();
        getTextbooks();
        setDeleteMode(false);
    }
    const deleteSection = async (section: string) => {
        const storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        delete storeData[chosenTextbook][section];
        storeData[chosenTextbook]["sections"] = storeData[chosenTextbook]["sections"].filter((value: string) => { return value !== section });
        setSectionsData(storeData[chosenTextbook]["sections"]);
        await store.set("GeneratorData", storeData);
        await store.save();
        getTextbooks();
        setDeleteMode(false);
    }
    const deleteWords = async (word: { "polish": string, "german": string, "isProverb": boolean }) => {
        const storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        console.log(word);
        storeData[chosenTextbook][chosenSection] = storeData[chosenTextbook][chosenSection].filter((value: { "polish": string, "german": string, "isProverb": boolean }) => {
            return value.polish !== word.polish || value.german !== word.german || value.isProverb !== word.isProverb;
        });
        console.log(storeData[chosenTextbook][chosenSection]);
        setWordsData(storeData[chosenTextbook][chosenSection]);
        await store.set("GeneratorData", storeData);
        await store.save();
        setDeleteMode(false);
    }
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
    const addTextbook = async () => {
        if (textbookTitleInput.current !== null && textbookTitleInput.current.value !== "") {
            const storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
            storeData["textbooks"].push(textbookTitleInput.current.value);
            storeData[textbookTitleInput.current.value] = { "sections": [] };
            await store.set("GeneratorData", storeData);
            await store.save();
            getTextbooks();
        }
        setAddingMode(false);
        setFirstClick(true);
    }
    const addSection = async () => {
        if (sectionTitleInput.current !== null && sectionTitleInput.current.value !== "") {
            const storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
            storeData[chosenTextbook]["sections"].push(sectionTitleInput.current.value);
            storeData[chosenTextbook][sectionTitleInput.current.value] = [];
            await store.set("GeneratorData", storeData);
            await store.save();
            getSections();
            getTextbooks();
        }
        setAddingMode(false);
        setFirstClick(true);
    }
    const addWords = async () => {
        if (wordGermanInput.current !== null && wordPolishInput.current !== null) {
            if (wordGermanInput.current.value != "" && wordPolishInput.current.value != "") {
                const storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
                storeData[chosenTextbook][chosenSection]
                    .push({ "polish": wordPolishInput.current.value, "german": wordGermanInput.current.value, "isProverb": proverbInput.current?.checked });
                setWordsData(storeData[chosenTextbook][chosenSection])
                await store.set("GeneratorData", storeData);
                await store.save();
            }
        }
        setAddingMode(false);
        setFirstClick(true);
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
            <div className="PathAndDelete">
                <div className="Path">
                    <div className="PathElement" onClick={() => {
                        setChosenTextbook("");
                        setChosenSection("");
                    }}>C:/</div>
                    <div className={chosenTextbook != "" ? "PathElement" : ""} onClick={() => {
                        setChosenSection("");
                    }}>{chosenTextbook != "" && (chosenTextbook + "/")}</div>
                    <div className={chosenSection != "" ? "PathElement" : ""}>{chosenSection != "" && (chosenSection + "/")}</div>
                </div>
                <div className="DeleteButton" onClick={() => {
                    setDeleteMode(!isDeleteMode);
                }}>{isDeleteMode ? "Anuluj" : "Usuń"}</div>
            </div>
            {chosenTextbook == "" && <div className="Cards">
                {textbooksData.map((value, index) => {
                    return <div key={index} className={isDeleteMode ? "textbookCard DeleteMode" : "textbookCard"} onClick={() => {
                        if (isDeleteMode) {
                            deleteTextbook(value.textbook);
                        } else {
                            setChosenTextbook(value.textbook);
                        }
                    }}>
                        <div className="textbookCardTitle">{value.textbook}</div>
                        <div className="textbookCardSectionsNumber">Liczba działów: {value.sections}</div>
                    </div>
                })}
                {isAdding && <div className="textbookCard addingCard" ref={addingValuesCardRef}>
                    <input inputMode="text" className="TitleInput" placeholder="Tytuł..." ref={textbookTitleInput} />
                    <div className="saveButton" onClick={() => { addTextbook() }}>Zapisz</div>
                </div>}
                <div className="textbookCard addCard" onClick={() => { console.log(isAdding); setAddingMode(true); }}>Dodaj podręcznik</div>
            </div>}




            {chosenTextbook != "" && chosenSection == "" && <div className="Cards">
                {sectionsData.map((value, index) => {
                    return <div key={index} className={isDeleteMode ? "textbookCard DeleteMode" : "textbookCard"} onClick={() => {
                        if (isDeleteMode) {
                            deleteSection(value);
                        } else {
                            setChosenSection(value);
                        }
                    }}>
                        <div className="textbookCardTitle">{value}</div>
                    </div>
                })}
                {isAdding && <div className="textbookCard addingCard" ref={addingValuesCardRef}>
                    <input inputMode="text" className="TitleInput" placeholder="Dział..." ref={sectionTitleInput} />
                    <div className="saveButton" onClick={() => { addSection() }}>Zapisz</div>
                </div>}
                <div className="textbookCard addCard" onClick={() => { setAddingMode(true) }}>Dodaj dział</div>
            </div>}



            {chosenSection != "" && <div className="Cards">
                {wordsData.map((value, index) => {
                    return <div key={index} className={isDeleteMode ? "textbookCard DeleteMode" : "textbookCard"} onClick={() => {
                        if (isDeleteMode) {
                            deleteWords(value);
                        }
                        console.log(value.german, value.polish, value.isProverb)
                    }}>
                        <div>{value.german}</div>
                        <div>{value.polish}</div>
                    </div>
                })}
                {isAdding && <div className="textbookCard addingCard" ref={addingValuesCardRef}>
                    <input inputMode="text" className="wordInput" placeholder="Po Niemiecku..." ref={wordGermanInput} />
                    <input inputMode="text" className="wordInput" placeholder="Po Polsku..." ref={wordPolishInput} />
                    <label className="proverbInput"><input type="checkbox" ref={proverbInput} />Powiedzenie</label>
                    <div className="saveButton" onClick={() => { addWords() }}>Zapisz</div>
                </div>}


                <div className="textbookCard addCard" onClick={() => { setAddingMode(true); }}>Dodaj wyrażenie</div>
            </div>}
        </div>
    );
}

export default Edit;
