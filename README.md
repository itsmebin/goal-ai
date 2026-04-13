# How To Install

android
 └ app
    └ build
       └ outputs
          └ apk
             └ debug
                └ app-debug.apk

**Download "app-debug.apk"** 

# Goal Description

The goal is to transform the frontend-only UI mockup into a functional application by:
1. **Fixing AI Tools (Form Correction):** Capturing images from the webcam and using Google's Gemini Vision API to analyze workout form and provide constructive feedback.
2. **Adding a Record System:** Keeping a history of AI analyses, chat conversations, and user data so information isn't lost when the page refreshes.
3. **Enhancing User Profiles:** Storing user profile information persistently and allowing users to update their data (and setting up their API keys).

## User Review Required

> [!IMPORTANT]
> The AI features rely on the **Gemini API**. Because this is a purely frontend application (no backend database or server), the API key cannot be hardcoded securely. 
> 
> My plan is to add an **API Key configuration field** in the "Pengaturan" (Settings) menu. You will need to obtain a free Gemini API key from Google AI Studio and paste it there for the AI features (Chat and Form Correction) to actually reach the internet and work. The key will be securely saved locally in your browser so you only have to enter it once.

## Proposed Changes

### State Management & Persistence (Local Storage)
We need to persist user data, setting, and chat histories across page reloads.

#### [MODIFY] `src/App.jsx`
- Implement custom local storage hooks (or `useEffect` syncing) to persist:
  - `userData` (Profile Info)
  - `chatHistory` (Messages array)
  - `analysisRecords` (History of form corrections)
  - `apiKey` (Gemini API token)

### AI Tools (Form Correction)
Currently, the camera opens but nothing happens.

#### [MODIFY] `src/App.jsx` (Component: `AITools`)
- Add a hidden `<canvas>` element to capture still frames from the live `<video>` feed.
- Add a "Capture & Analyze" button.
- Integrate the `fetchGeminiVision` API call. When the user captures a frame, the app will convert it to a smaller format and send it to the Gemini API with a prompt like: *"Analyze this exercise form. Is the posture correct? What can be improved?"*.
- Display a loading state and the resulting AI critique.
- Save the result to the new "Record System" history.

### API & Network Integration
The app needs to properly connect to the Gemini API.

#### [MODIFY] `src/App.jsx` (Functions: `fetchGemini` & new `fetchGeminiVision`)
- Update the API fetching logic to dynamically read the `apiKey` from the user's settings rather than a hardcoded empty string.
- Create a new API request function specifically designed to handle `multipart/form-data` or base64 images for the vision capabilities.

### Profile & Settings Upgrades

#### [MODIFY] `src/App.jsx` (Component: `SettingsPage` & `ProfilePage`)
- **Settings:** Build the UI for entering and saving the Gemini API Key.
- **Profile:** Add basic editing capabilities so the user can change their Name, Bio, and Goal, which will be synced to the Local Storage profile.
- **Record System GUI:** Add a tab or section to view past AI Form Corrections and their feedback.

## Verification Plan

### Manual Verification
1. I will complete the code changes locally.
2. You will be instructed to get a free Gemini API key, input it into the new Settings page.
3. You will navigate to the AI Tools page, allow camera access, and click "Analyze". We will verify if the app successfully hits the internet and brings back AI feedback.
4. You will refresh the page to confirm that your profile, session status, and chat messages are not lost (Record System functional).
