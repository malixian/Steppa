# Steppa Android Client

This Android version wraps the local Steppa web app in a native Android WebView.

## What Runs on Xiaomi

- Opens `index.html` from Android assets.
- Supports JavaScript and localStorage.
- Works offline after installation.
- Preserves the current Steppa features: profile editing, level pages, category detail, and 0-5 block progress.

## Build in Android Studio

1. Open the `android` folder in Android Studio.
2. Let Android Studio sync Gradle.
3. Connect the Xiaomi phone with USB debugging enabled.
4. Select the phone as the run target.
5. Click Run.

## Build APK

In Android Studio:

`Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`

The APK will be generated under:

`android/app/build/outputs/apk/debug/app-debug.apk`

## Sync Web Assets

After changing the root web files, run:

```powershell
powershell -ExecutionPolicy Bypass -File android/sync-web.ps1
```
