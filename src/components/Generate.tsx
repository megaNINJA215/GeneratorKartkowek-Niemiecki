import { useEffect, useState } from "react";
import "../styles/Generate.css";
import ReadyTest from "./ReadyTest";
import { invoke } from "@tauri-apps/api";

function Generate() {
    const [textbooks, setTextbooks] = useState([]);
    const [chosenTextbook, setChosenTextbook] = useState("");
    const [sections, setSections] = useState([]);
    const [chosenSection, setChosenSection] = useState("");
    const [warning, setWarning] = useState(false);
    const [tests, setTests] = useState<string[][]>([[], [], [], []])
    const [isTestsReady, setTestsReady] = useState(false);


    const generateTests = async () => {
        if (chosenTextbook != "" && chosenSection != "") {
            setWarning(false);
            const storeData = JSON.parse(await invoke("get_data"));
            let words: { "polish": string, "german": string, "isProverb": boolean }[] = [];
            let proverbs: { "polish": string, "german": string, "isProverb": boolean }[] = [];
            let Tests: string[][] = [[], [], [], []];
            storeData[chosenTextbook][chosenSection].forEach((element: { "polish": string, "german": string, "isProverb": boolean }) => {
                if (element.isProverb) {
                    proverbs.push(element);
                } else {
                    words.push(element);
                }
            });
            console.log(words.length, proverbs.length)
            if (words.length != 0 && proverbs.length != 0) {
                if (words.length < 64 || proverbs.length < 16) {
                    setWarning(true);
                }

                let IndexesWords: number[] = [];
                let IndexesProverbs: number[] = [];
                for (let i = 0; i < words.length; i++) {
                    IndexesWords.push(i);
                }
                for (let i = 0; i < proverbs.length; i++) {
                    IndexesProverbs.push(i);
                }
                let avaibleIndexesWords: number[] = [...IndexesWords];
                let avaibleIndexesProverbs: number[] = [...IndexesProverbs];


                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 8; j++) {
                        if (avaibleIndexesWords.length === 0) {
                            avaibleIndexesWords = [...IndexesWords];
                            console.log("wyszyczszono words");
                        }
                        let index = Math.round(Math.random() * 1000) % avaibleIndexesWords.length;
                        Tests[i].push(words[avaibleIndexesWords[index]]?.polish);
                        avaibleIndexesWords.splice(index, 1);
                    }
                    for (let j = 0; j < 2; j++) {
                        if (avaibleIndexesProverbs.length == 0) {
                            avaibleIndexesProverbs = [...IndexesProverbs];
                            console.log("wyszyczszono proverbs");
                        }
                        let index = Math.round(Math.random() * 1000) % avaibleIndexesProverbs.length;
                        Tests[i].push(proverbs[avaibleIndexesProverbs[index]]?.polish);
                        avaibleIndexesProverbs.splice(index, 1);
                    }
                    for (let j = 0; j < 8; j++) {
                        if (avaibleIndexesWords.length == 0) {
                            avaibleIndexesWords = [...IndexesWords];
                            console.log("wyszyczszono words");
                        }
                        let index = Math.round(Math.random() * 1000) % avaibleIndexesWords.length;
                        Tests[i].push(words[avaibleIndexesWords[index]]?.german);
                        avaibleIndexesWords.splice(index, 1);
                    }
                    for (let j = 0; j < 2; j++) {
                        if (avaibleIndexesProverbs.length == 0) {
                            avaibleIndexesProverbs = [...IndexesProverbs];
                            console.log("wyszyczszono proverbs");
                        }
                        let index = Math.round(Math.random() * 1000) % avaibleIndexesProverbs.length;
                        Tests[i].push(proverbs[avaibleIndexesProverbs[index]]?.german);
                        avaibleIndexesProverbs.splice(index, 1);
                    }
                }

                console.log(Tests);
                setTests(Tests);
                setChosenTextbook("");
                setChosenSection("");
                setSections([]);
                setTestsReady(true);
            } else {
                setTestsReady(false);
                setTests([[], [], [], []]);
            }
        } else {
            setTestsReady(false);
            setTests([[], [], [], []]);
        }
    }
    const getTextbooks = async () => {
        let storeData = JSON.parse(await invoke("get_data"));
        setTextbooks(storeData["textbooks"]);
    };
    useEffect(() => {
        getTextbooks();
    }, [])
    const handleTextbookChange = async () => {
        let storeData = JSON.parse(await invoke("get_data"));
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
                <select name="Podręcznik" id="Podręcznik" value={chosenTextbook} onChange={(e) => { setChosenTextbook(e.target.value); }}>
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
                    generateTests()
                }}>Generuj</div>

            </div>
            {isTestsReady && <div className="TestsContainer">
                {warning && <div className="Warning">Słowa w kartkówkach się powtarzają, powodem jest za mała liczba danych</div>}
                {!warning && <div className="WarningDummy" />}
                <div className="Tests">
                    <ReadyTest id={0} tests={tests} />
                    <ReadyTest id={1} tests={tests} />
                    <ReadyTest id={2} tests={tests} />
                    <ReadyTest id={3} tests={tests} />
                </div>
            </div>}
        </div>
    );
}

export default Generate;
