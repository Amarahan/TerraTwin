# 10 — Final Submission Checklist

**Project:** TerraTwin — Planetary Analog Atlas  
**Submission deadline:**  
- ⚠️ Local submission (if applicable): Nov 15, 6:00 PM Yangon time (UTC+6:30)  
- ⚠️ NASA Space Apps global submission: Nov 15, 11:59 PM Yangon time (UTC+6:30)  

> **Team:** Verify the exact deadline on your registered NASA Space Apps dashboard. These times are based on UTC+6:30 (Yangon). Confirm before relying on them.

---

## Documents Ready

- [x] `submission/01_IMPLEMENTATION_AUDIT.md` — Feature-by-feature audit ✅
- [x] `submission/02_PROJECT_SUMMARY.md` — 130–160 word project summary ✅
- [x] `submission/03_PROJECT_DETAILS.md` — Full application description ✅
- [x] `submission/04_CHALLENGE_ALIGNMENT.md` — Challenge alignment ⚠️ Challenge title NEEDS TEAM CONFIRMATION
- [x] `submission/05_AI_SI_DISCLOSURE.md` — AI/SI tool disclosure ✅
- [x] `submission/06_NASA_DATA_RESOURCES.md` — Dataset table ✅
- [x] `submission/07_OTHER_RESOURCES_CREDITS_LICENSES.md` — Credits & licenses ✅
- [x] `submission/08_SUBMISSION_FIELD_ANSWERS.md` — Submission form field guide ⚠️ Challenge title + video URL + team info NEEDS TEAM CONFIRMATION
- [x] `submission/09_DEMO_STORYBOARD.md` — 30-second video storyboard ✅
- [x] `submission/10_FINAL_SUBMISSION_CHECKLIST.md` — This file ✅
- [x] `submission/11_PUBLIC_LINKS_AND_DEPLOYMENT.md` — Public URLs & deployment guide ✅

---

## PPTX Ready

- [x] `submission/build_pptx.py` — Python script to generate PPTX ✅
- [x] `submission/TerraTwin_Final_Demo.pptx` — 7-slide presentation ✅ (verify generation)
- [ ] PDF preview — requires LibreOffice headless (`soffice`) on the team's machine, or manual export from PowerPoint/LibreOffice

---

## Video

- [x] `submission/09_DEMO_STORYBOARD.md` — Scene-by-scene storyboard ✅
- [x] `submission/TerraTwin_Video_Script.md` — Full narration script ✅
- [x] `submission/TerraTwin_Final_Demo.srt` — SRT subtitle file ✅
- [ ] Actual MP4 video — ⚠️ **REQUIRES HUMAN SCREEN RECORDING** using https://amarahan.github.io/TerraTwin/
- [ ] Video uploaded to YouTube / Vimeo — ⚠️ Team action required
- [ ] Video URL inserted in `submission/08_SUBMISSION_FIELD_ANSWERS.md` — ⚠️ Team action required

---

## Repository & Deployment

- [x] GitHub repository public: https://github.com/Amarahan/TerraTwin ✅
- [x] GitHub Pages live: https://amarahan.github.io/TerraTwin/ ✅ (HTTP 200 verified)
- [x] TypeScript strict typecheck: 0 errors ✅
- [x] Production build passes (`npm run build`) ✅
- [x] Python tests pass: 37/37 ✅
- [x] Node.js tests pass: 25/25 ✅

---

## Team Confirmation Items (Human Action Required)

| Item | Status |
|---|---|
| ⚠️ Challenge title confirmed on NASA Space Apps portal | NEEDS TEAM CONFIRMATION |
| ⚠️ Team name matches NASA Space Apps registration | NEEDS TEAM CONFIRMATION |
| ⚠️ All team members listed in submission | NEEDS TEAM CONFIRMATION |
| ⚠️ 30-second video recorded, uploaded, URL confirmed | NEEDS TEAM CONFIRMATION |
| ⚠️ All team members have reviewed the submission before clicking Submit | NEEDS TEAM CONFIRMATION |
| ⚠️ Submission deadline confirmed from official NASA Space Apps dashboard | NEEDS TEAM CONFIRMATION |

---

## Final Pre-Submit Verification Commands

Run these commands from the workspace root before submitting:

```powershell
# From repo root: verify Python tests
cd "c:\Users\Asus\Downloads\Telegram Desktop\TerraTwin_Team_Handoff_Codex_Antigravity\TerraTwin_Team_Handoff"
python -m unittest discover -s data/tests -v

# From starter_app: verify build and Node tests
cd starter_app
npm run build
node --test tests/exploratoryData.test.ts tests/workbookData.test.ts tests/scoring.test.ts tests/data.test.ts tests/mapData.test.ts

# Verify GitHub Pages live
Invoke-WebRequest -Uri "https://amarahan.github.io/TerraTwin/" -Method Head -UseBasicParsing | Select-Object StatusCode
```

Expected results: 37/37 Python, 25/25 Node, build exit 0, HTTP 200.

---

> **IMPORTANT:** Agents cannot access the NASA Space Apps submission portal, click buttons, fill in legal agreements, or certify anything on behalf of the team. The human team must complete the final submission.
