
interface ReadyTestProps {
    tests: string[][]
    id: number
}

function ReadyTest({
    tests,
    id
}: ReadyTestProps) {

    return (
        <div className="ReadyTests">
            <div className="TestTitle">Grupa {id + 1}</div>
            <div className="TestContent">
                {tests[id].map((item, index) => {
                    return <div key={index}>{index + 1}. {item}</div>
                })}
            </div>
        </div>
    );
}

export default ReadyTest;
