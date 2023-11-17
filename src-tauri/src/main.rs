// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::fs;
use std::fs::File;
use std::io::Read;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|_app| {
            tauri::async_runtime::spawn(async move {
                create_data_file();
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![save_data, get_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn create_data_file() {
    let app_data_path = dirs::data_dir().unwrap();
    let folder_path = app_data_path.join("GeneratorKartkowek");
    let full_path = folder_path.join("data.dat");

    if !fs::metadata(&folder_path)
        .map(|metadata| metadata.is_dir())
        .unwrap_or(false)
    {
        // Jeśli folder nie istnieje, utwórz go
        if let Err(e) = fs::create_dir(&folder_path) {
            eprintln!("Błąd podczas tworzenia folderu: {}", e);
        } else {
            // println!("Folder {:?} został pomyślnie utworzony.", &folder_path);
        }
    } else {
        // println!("Folder {:?} już istnieje.", &folder_path);
    }

    if fs::metadata(&full_path).is_err() {
        // Jeśli plik nie istnieje, utwórz go
        if let Err(e) = fs::write(&full_path, r#"{"textbooks": []}"#) {
            eprintln!("Błąd podczas tworzenia pliku: {}", e);
        } else {
            // println!("Plik {:?} został pomyślnie utworzony.", &full_path);
        }
    }
}

#[tauri::command]
fn save_data(new_data: &str) {
    let app_data_path = dirs::data_dir().unwrap();
    let folder_path = app_data_path.join("GeneratorKartkowek");
    let full_path = folder_path.join("data.dat");

    if !fs::metadata(&folder_path)
        .map(|metadata| metadata.is_dir())
        .unwrap_or(false)
    {
        // Jeśli folder nie istnieje, utwórz go
        if let Err(e) = fs::create_dir(&folder_path) {
            eprintln!("Błąd podczas tworzenia folderu: {}", e);
        } else {
            // println!("Folder {:?} został pomyślnie utworzony.", &folder_path);
        }
    } else {
        // println!("Folder {:?} już istnieje.", &folder_path);
    }

    if let Ok(metadata) = fs::metadata(&full_path) {
        if metadata.is_file() {
            fs::write(&full_path, new_data).unwrap();
        } else {
            // println!("Błąd: {} nie jest plikiem.", nazwa_pliku);
        }
    } else {
        // println!(
        //     "Błąd: Brak pliku {} w lokalizacji {}.",
        //     nazwa_pliku, sciezka
        // );
    }
}

#[tauri::command]
fn get_data() -> String {
    let app_data_path = dirs::data_dir().unwrap();
    let folder_path = app_data_path.join("GeneratorKartkowek");
    let full_path = folder_path.join("data.dat");

    if !fs::metadata(&folder_path)
        .map(|metadata| metadata.is_dir())
        .unwrap_or(false)
    {
        // Jeśli folder nie istnieje, utwórz go
        if let Err(e) = fs::create_dir(&folder_path) {
            eprintln!("Błąd podczas tworzenia folderu: {}", e);
        } else {
            // println!("Folder {:?} został pomyślnie utworzony.", &folder_path);
        }
    } else {
        // println!("Folder {:?} już istnieje.", &folder_path);
    }

    if let Ok(metadata) = fs::metadata(&full_path) {
        if metadata.is_file() {
            let mut file = File::open(&full_path).unwrap();
            let mut zawartosc = String::new();
            let _ = file.read_to_string(&mut zawartosc);
            return zawartosc;
        } else {
            // println!("Błąd: {} nie jest plikiem.", nazwa_pliku);
            return r#"{"textbooks": []}"#.to_string();
        }
    } else {
        // println!(
        //     "Błąd: Brak pliku {} w lokalizacji {}.",
        //     nazwa_pliku, sciezka
        // );
        return r#"{"textbooks": []}"#.to_string();
    }
}
