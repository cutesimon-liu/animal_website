# 專案開發與部署標準作業流程 (SOP)

這份文件記錄了我們與使用者協定的標準作業流程，以確保未來操作的一致性與效率。

## 核心原則 (Core Principles)

- **先預覽，後部署**: 所有程式碼修改完成後，都必須先由使用者在本地端預覽確認，才能進行部署。
- **遵循SOP**: 本文件是我們所有操作的最高指導原則，以確保工作流程的可預測性。

---

## 1. 開發流程 (Development Workflow)

#### 1.1. 需求理解
- Gemini 確認並覆述使用者的開發或修改需求。

#### 1.2. 檔案分析
- Gemini 使用 `read_file`, `list_directory`, `glob` 等工具來理解現有程式碼的結構與邏輯。

#### 1.3. 程式碼修改
- Gemini 使用 `replace` 或 `write_file` 工具來修改或建立檔案。

#### 1.4. 依賴管理 (Dependency Management)
- 如果需要安裝新的 npm 套件 (例如 `firebase-admin`)：
  1.  修改 `package.json` 檔案，將新套件加入 `dependencies`。
  2.  執行 `npm install` 來安裝套件。

---

## 2. 本地預覽流程 (Local Preview Workflow)

1.  **開發完成**: Gemini 完成所有程式碼修改後，**必須停止**，不得自動執行部署指令。
2.  **啟動預覽**: Gemini 提示使用者在終端機輸入 `npm start` 來啟動本地開發伺服器。
3.  **進行預覽**: 使用者在瀏覽器中打開 `http://localhost:3000` 來預覽變更。
4.  **功能限制提醒**: Gemini 需提醒使用者，在本地預覽時，與 Netlify Functions 相關的後端功能 (如訪客計數器) 將無法運作，只會顯示「讀取中...」。

---

## 3. 部署流程 (Deployment Workflow)

1.  **使用者確認**: Gemini 必須等待使用者明確表示「可以上傳」或「可以部署」後，才能繼續。
2.  **執行部署**: 依序執行以下指令，所有指令皆在 `animal-website` 資料夾中執行。

    *   **3.1. Git Staging (加入變更):**
        ```bash
        git add .
        ```

    *   **3.2. Git Commit (建立存檔點):**
        1.  使用 `write_file` 建立暫存檔案 `commit_message.txt`，內容為本次變更的描述 (例如: `feat: Add new feature`)。
        2.  執行 `git commit -F commit_message.txt`。
        3.  執行 `del commit_message.txt` (Windows) 來刪除暫存檔案。

    *   **3.3. Git Push (推送到遠端):**
        ```bash
        git push
        ```
3.  **部署觸發**: `git push` 完成後，Netlify 將會自動開始部署新版本。

---

## 4. 偵錯流程 (Debugging Workflow)

#### 4.1. 前端問題 (Frontend Issues)
- **畫面或互動問題**: 請使用者打開瀏覽器開發人員工具 (F12)，切換到 **"Console"** (主控台) 標籤，並將紅色的錯誤訊息複製給 Gemini。
- **快取問題 (例如圖示未更新)**: 建議使用者打開**無痕/私密視窗**來進行測試。

#### 4.2. 後端/函式問題 (Backend/Function Issues)
- **現象**: 頁面功能持續顯示「讀取中...」。
- **步驟**: 
  1.  請使用者打開瀏覽器開發人員工具 (F12)，切換到 **"Network"** (網路) 標籤。
  2.  重新整理頁面。
  3.  在列表中找到狀態為 500 (或紅色) 的函式名稱 (例如 `visitorCounter`)，點擊它。
  4.  在新視窗中點擊 **"Response"** (回應) 標籤，並將看到的錯誤訊息複製給 Gemini。
  5.  如果需要更詳細的日誌，可直接訪問 Netlify 函式日誌頁面 (`https://app.netlify.com/projects/animalknow/functions`)。

---

## 5. 專案特定設定 (Project-Specific Configurations)

- **Netlify 後端函式路徑**: `netlify/functions` (定義於 `netlify.toml`)。
- **Firebase 資料庫**: 
  - 使用 `visits` 集合 (collection)。
  - `summary` 文件 (document) 儲存總數，欄位為 `total_count`。
  - `YYYY-MM-DD` 格式的日期文件儲存當日計數，欄位為 `daily_count`。