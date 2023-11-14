import { Store } from "tauri-plugin-store-api";
export const store = new Store(".data.dat");

export const loadData = async () => {
    await store.load();
}

export const clearData = async () => {
    store.clear();
    store.set("GeneratorData", {
        "textbooks": ["Effekt 2", "Effekt 1"],
        "Effekt 2": {
            "sections": ["Kapitel 1", "Kapitel 2", "Kapitel 3", "Kapitel 4", "Kapitel 5", "Kapitel 6", "Kapitel 7"],
            "Kapitel 1": [],
            "Kapitel 2": [],
            "Kapitel 3": [],
            "Kapitel 4": [],
            "Kapitel 5": [],
            "Kapitel 6": [],
            "Kapitel 7": []
        },
        "Effekt 1": {
            "sections": ["Kapitel 11", "Kapitel 22", "Kapitel 33", "Kapitel 44", "Kapitel 55", "Kapitel 66", "Kapitel 77"],
            "Kapitel 11": [],
            "Kapitel 22": [],
            "Kapitel 33": [],
            "Kapitel 44": [],
            "Kapitel 55": [],
            "Kapitel 66": [],
            "Kapitel 77": []
        }
    });
    await store.save();
}

export const addData = async (key: string, val: string) => {
    if (key != "") {
        let currentDataJson = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
        currentDataJson[key] = val;
        await store.set("GeneratorData", currentDataJson);
        await store.save();
    }
};

export const removeData = async (keyToRemove: string) => {
    const jsonObject = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
    delete jsonObject[keyToRemove];

    await store.set("GeneratorData", JSON.parse(JSON.stringify(jsonObject)));
    await store.save();
}