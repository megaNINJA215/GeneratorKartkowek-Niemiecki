// import { Store } from "tauri-plugin-store-api";
// export const store = new Store(".data.dat");

// export const loadData = async () => {
//     // await store.load();
// }

// export const clearData = async () => {
//     store.clear();
//     store.set("GeneratorData", {
//         "textbooks": []
//     });
//     await store.save();
// }

// export const addData = async (key: string, val: string) => {
//     if (key != "") {
//         let currentDataJson = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
//         currentDataJson[key] = val;
//         await store.set("GeneratorData", currentDataJson);
//         await store.save();
//     }
// };

// export const removeData = async (keyToRemove: string) => {
//     const jsonObject = JSON.parse(JSON.stringify(await store.get("GeneratorData")));
//     delete jsonObject[keyToRemove];

//     await store.set("GeneratorData", JSON.parse(JSON.stringify(jsonObject)));
//     await store.save();
// }