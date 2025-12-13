# 分支管理策略

## 分支結構

本專案採用以下分支策略：

```
main (主分支)
├── stable/v1.0 (穩定版本分支)
└── dev/v1.1 (開發分支)
```

## 分支說明

### main 分支
- **用途**: 主分支，包含最新且經過測試的穩定代碼
- **保護**: 建議設置為受保護分支，需要 Pull Request 才能合併
- **部署**: 可用於預覽環境部署

### stable/v1.0 分支
- **用途**: v1.0 穩定版本分支
- **來源**: 從 main 分支創建
- **部署**: **生產環境應從此分支部署**
- **更新**: 僅接受 bug 修復和關鍵安全更新
- **版本**: v1.0.x（補丁版本）

### dev/v1.1 分支
- **用途**: v1.1 開發分支
- **來源**: 從 main 分支創建
- **部署**: 可用於開發/測試環境部署
- **更新**: 用於開發新功能和改進
- **版本**: v1.1.x（開發版本）

## 工作流程

### 開發新功能

1. **從 dev/v1.1 創建功能分支**
   ```bash
   git checkout dev/v1.1
   git pull origin dev/v1.1
   git checkout -b feature/新功能名稱
   ```

2. **開發和提交**
   ```bash
   git add .
   git commit -m "feat: 新功能描述"
   ```

3. **合併到 dev/v1.1**
   ```bash
   git checkout dev/v1.1
   git merge feature/新功能名稱
   git push origin dev/v1.1
   ```

### 修復 Bug

#### 生產環境 Bug（stable/v1.0）

1. **從 stable/v1.0 創建修復分支**
   ```bash
   git checkout stable/v1.0
   git pull origin stable/v1.0
   git checkout -b hotfix/bug描述
   ```

2. **修復並合併**
   ```bash
   # 修復代碼...
   git add .
   git commit -m "fix: bug描述"
   git checkout stable/v1.0
   git merge hotfix/bug描述
   git push origin stable/v1.0
   ```

3. **同步到 main 和 dev/v1.1**
   ```bash
   git checkout main
   git merge stable/v1.0
   git push origin main
   
   git checkout dev/v1.1
   git merge main
   git push origin dev/v1.1
   ```

#### 開發環境 Bug（dev/v1.1）

1. **從 dev/v1.1 創建修復分支**
   ```bash
   git checkout dev/v1.1
   git pull origin dev/v1.1
   git checkout -b fix/bug描述
   ```

2. **修復並合併**
   ```bash
   # 修復代碼...
   git add .
   git commit -m "fix: bug描述"
   git checkout dev/v1.1
   git merge fix/bug描述
   git push origin dev/v1.1
   ```

### 發布新版本

#### 發布 v1.1.0（從 dev/v1.1）

1. **確保 dev/v1.1 穩定**
   ```bash
   git checkout dev/v1.1
   git pull origin dev/v1.1
   # 測試...
   ```

2. **合併到 main**
   ```bash
   git checkout main
   git merge dev/v1.1
   git push origin main
   ```

3. **創建 stable/v1.1**
   ```bash
   git checkout -b stable/v1.1
   git push -u origin stable/v1.1
   ```

4. **更新版本號**
   ```bash
   # 在 package.json 中更新版本號為 1.1.0
   git add package.json
   git commit -m "chore: 發布 v1.1.0"
   git push origin main
   ```

## 版本號規則

採用 [語義化版本](https://semver.org/lang/zh-TW/)：

- **主版本號** (MAJOR): 不相容的 API 修改
- **次版本號** (MINOR): 向下相容的功能性新增
- **修訂號** (PATCH): 向下相容的問題修正

範例：
- `v1.0.0` - 初始穩定版本
- `v1.0.1` - Bug 修復（stable/v1.0）
- `v1.1.0` - 新功能（dev/v1.1 → main → stable/v1.1）

## Cloudflare Pages 部署配置

### 生產環境
- **分支**: `stable/v1.0`
- **建置命令**: `npm run build`
- **輸出目錄**: `dist`

### 預覽環境
- **分支**: `dev/v1.1`
- **建置命令**: `npm run build`
- **輸出目錄**: `dist`

## 注意事項

1. **不要直接推送到 stable/v1.0**
   - 所有更改應通過 Pull Request 審查
   - 確保代碼經過充分測試

2. **保持分支同步**
   - Bug 修復應同步到所有相關分支
   - 使用 `git merge` 而非 `git rebase` 保持歷史清晰

3. **標籤管理**
   - 發布新版本時創建 Git 標籤
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

4. **文檔更新**
   - 重大更改時更新 README.md
   - 更新 CHANGELOG.md（如果有的話）

