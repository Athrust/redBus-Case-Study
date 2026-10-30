# 🚌 redBus Vikalp Pass — Case Study Prototype

A high-fidelity clone of redBus built with React Native (Expo) demonstrating the **redBus Vikalp Pass** solution proposed by **Team Vantage** for short-corridor routes (< 250 km).

---

## 📱 Download Standalone Android APK

You can download and install the prototype directly on any Android smartphone or tablet without needing a developer setup:

- 🚀 **Direct APK Download**: [**Download `redBus-Vikalp-Pass.apk` (v1.0.0)**](https://github.com/Athrust/redBus-Case-Study/releases/download/v1.0.0/redBus-Vikalp-Pass.apk)
- 📦 **GitHub Release Page**: [v1.0.0 Release](https://github.com/Athrust/redBus-Case-Study/releases/tag/v1.0.0)

### 📲 How to Install:
1. Tap the download link above on your Android phone or tablet.
2. Once downloaded, tap the APK in your notifications or Downloads folder.
3. Select **Install** (if prompted by Android, tap "Allow installation from unknown sources").
4. Launch the app and experience the full Vikalp Pass flow!

---

## 💡 Key Features Implemented

1. **Short-Corridor Distance Engine**:
   - Detects intercity routes < 250 km (e.g. Pune ⇄ Mumbai, 148 km Expressway Corridor).
   - Automatically activates Vikalp Pass eligibility.

2. **Strict Same-Day ('Today' Only) Policy**:
   - Vikalp Pass is restricted to same-day travel (`Date of Journey: Today`) to monetize perishable unbooked seats.
   - Selecting future dates disables the pass and reverts to standard bus search.

3. **24-Hour Non-Clickable Timetable**:
   - Shows all scheduled departures over the next 24 hours with arrival predictions and spare capacity estimates.

4. **Dummy Payment & Instant Universal Pass**:
   - 10% discounted flat-rate corridor pass (₹405 vs ₹450 normal assured benchmark).
   - Generates an authentic, high-resolution vector QR code boarding pass with PNR and countdown timer.

5. **Clean Bus Departures View**:
   - Replaced individual bus booking buttons with single universal pass access.
   - Interactive category filtering: **All Departures**, **AC Only**, **Non AC**, and **Electric Express**.
