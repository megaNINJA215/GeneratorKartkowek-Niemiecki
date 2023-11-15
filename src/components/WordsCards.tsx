import { useRef } from "react";
import { store } from "../store";

interface WordsCardProps {
    wordsData: {
        polish: string;
        german: string;
        isProverb: boolean;
    }[]
    isDeleteMode: boolean
    addingValuesCardRef: React.RefObject<HTMLDivElement>
    chosenTextbook: string
    chosenSection: string
    setWordsData: React.Dispatch<React.SetStateAction<{
        polish: string;
        german: string;
        isProverb: boolean;
    }[]>>
    setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
    setAddingMode: React.Dispatch<React.SetStateAction<boolean>>
    setFirstClick: React.Dispatch<React.SetStateAction<boolean>>
    isAdding: boolean
}

function WordsCard({
    wordsData,
    isDeleteMode,
    addingValuesCardRef,
    chosenTextbook,
    chosenSection,
    setWordsData,
    setDeleteMode,
    setAddingMode,
    setFirstClick,
    isAdding
}: WordsCardProps) {
    const wordPolishInput = useRef<HTMLInputElement>(null);
    const wordGermanInput = useRef<HTMLInputElement>(null);
    const proverbInput = useRef<HTMLInputElement>(null);

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

    return (
        <div className="Cards">
            {wordsData.map((value, index) => {
                return <div key={index} className={isDeleteMode ? "wordCard DeleteMode" : "wordCard"} onClick={() => {
                    if (isDeleteMode) {
                        deleteWords(value);
                    }
                    console.log(value.german, value.polish, value.isProverb)
                }}>
                    <div className="GermanWord">{value.german}</div>
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
        </div>
    );
}

export default WordsCard;
