
interface PathProps {
    setChosenTextbook: React.Dispatch<React.SetStateAction<string>>
    setChosenSection: React.Dispatch<React.SetStateAction<string>>
    chosenTextbook: string
    chosenSection: string
    setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>
    isDeleteMode: boolean;
}

function Path({
    setChosenTextbook,
    setChosenSection,
    chosenTextbook,
    chosenSection,
    setDeleteMode,
    isDeleteMode
}: PathProps) {

    return (

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
    );
}

export default Path;
