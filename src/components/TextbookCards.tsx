import { useRef } from "react";
import { store } from "../store";

interface TextbookCardProps {
    isAdding: boolean
    isDeleteMode: boolean
    textbooksData: {
        textbook: string;
        sections: number;
    }[]
    setChosenTextbook: React.Dispatch<React.SetStateAction<string>>
    addingValuesCardRef: React.RefObject<HTMLDivElement>
    setAddingMode: React.Dispatch<React.SetStateAction<boolean>>
    getTextbooks: () => Promise<void>
    setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
    setFirstClick: React.Dispatch<React.SetStateAction<boolean>>
}

function TextbookCard({
    textbooksData,
    isDeleteMode,
    setChosenTextbook,
    isAdding,
    addingValuesCardRef,
    setAddingMode,
    getTextbooks,
    setDeleteMode,
    setFirstClick
}: TextbookCardProps) {
    const textbookTitleInput = useRef<HTMLInputElement>(null);

    const deleteTextbook = async (textbook: string) => {
        const storeData = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        delete storeData[textbook];
        storeData["textbooks"] = storeData["textbooks"].filter((value: string) => { return value !== textbook });
        await store.set("GeneratorData", storeData);
        await store.save();
        getTextbooks();
        setDeleteMode(false);
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

    return (<div className="Cards">
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
    </div>
    );
}

export default TextbookCard;
