// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager};
use oauth2::{PkceCodeChallenge};

// create handler to generate a oauth code challenge
#[tauri::command]
fn generate_code_challenge() -> (String, String) {
  let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();
 
  let challenge_str = pkce_challenge.as_str();
  let verifier_str = pkce_verifier.secret();

  return (challenge_str.to_string(), verifier_str.to_string());
}

fn main() {
  // prepare() checks if it's a single instance and tries to send the args otherwise.
  // It should always be the first line in your main function (with the exception of loggers or similar)
  tauri_plugin_deep_link::prepare("com.gumbee.logbook");
  // It's expected to use the identifier from tauri.conf.json
  
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![generate_code_challenge])
    .setup(|app| {
      // If you need macOS support this must be called in .setup() !
      let handle = app.handle();
      
      tauri_plugin_deep_link::register(
        "logbook",
        move |request| {
          handle.emit_all("scheme-request-received", request).unwrap();
        },
      )
      .unwrap();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
