import { useRef } from "react";
import { invoke } from "@tauri-apps/api";

interface SectionCardProps {
    sectionsData: string[]
    isDeleteMode: boolean
    setChosenSection: React.Dispatch<React.SetStateAction<string>>
    isAdding: boolean
    addingValuesCardRef: React.RefObject<HTMLDivElement>
    setAddingMode: React.Dispatch<React.SetStateAction<boolean>>
    chosenTextbook: string
    setSectionsData: React.Dispatch<React.SetStateAction<string[]>>
    getTextbooks: () => Promise<void>
    setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
    getSections: () => Promise<void>
    setFirstClick: React.Dispatch<React.SetStateAction<boolean>>
}

function SectionCard({
    sectionsData,
    isDeleteMode,
    setChosenSection,
    isAdding,
    addingValuesCardRef,
    setAddingMode,
    chosenTextbook,
    setSectionsData,
    getTextbooks,
    setDeleteMode,
    getSections,
    setFirstClick
}: SectionCardProps) {
    const sectionTitleInput = useRef<HTMLInputElement>(null);
    const deleteSection = async (section: string) => {
        const storeData = JSON.parse(await invoke("get_data"));
        delete storeData[chosenTextbook][section];
        storeData[chosenTextbook]["sections"] = storeData[chosenTextbook]["sections"].filter((value: string) => { return value !== section });
        setSectionsData(storeData[chosenTextbook]["sections"]);
        const dataToSave = JSON.stringify(storeData);
        await invoke("save_data", { newData: dataToSave });
        getTextbooks();
        setDeleteMode(false);
    }
    const addSection = async () => {
        if (sectionTitleInput.current !== null && sectionTitleInput.current.value !== "") {
            const storeData = JSON.parse(await invoke("get_data"));
            storeData[chosenTextbook]["sections"].push(sectionTitleInput.current.value);
            storeData[chosenTextbook][sectionTitleInput.current.value] = [];
            const dataToSave = JSON.stringify(storeData);
            await invoke("save_data", { newData: dataToSave });
            getSections();
            getTextbooks();
        }
        setAddingMode(false);
        setFirstClick(true);
    }

    return (
        <div className="Cards">
            {sectionsData.map((value, index) => {
                return <div key={index} className={isDeleteMode ? "sectionCard DeleteMode" : "sectionCard"} onClick={() => {
                    if (isDeleteMode) {
                        deleteSection(value);
                    } else {
                        setChosenSection(value);
                    }
                }}>
                    <div className="sectionCardTitle">{value}</div>
                </div>
            })}
            {isAdding && <div className="textbookCard addingCard" ref={addingValuesCardRef}>
                <input inputMode="text" className="TitleInput" placeholder="Dział..." ref={sectionTitleInput} />
                <div className="saveButton" onClick={() => { addSection() }}>Zapisz</div>
            </div>}
            <div className="textbookCard addCard" onClick={() => { setAddingMode(true) }}>Dodaj dział</div>
        </div>
    );
}

export default SectionCard;
