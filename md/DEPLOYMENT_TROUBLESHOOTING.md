# GitHub Pages Deployment - Troubleshooting Guide

## Issues Fixed ✅

### 1. Missing Navbar, Sidebar, and Styling
**Cause**: The `assets = String[]` configuration disabled Documenter's default theme CSS/JS  
**Fix**: Removed empty assets list to enable Documenter's default theme  
**Result**: Navbar, sidebar, and styling will now display properly

### 2. CI Environment Not Properly Detected
**Cause**: `CI` environment variable wasn't being passed  
**Fix**: Added `CI: true` to the workflow environment variables  
**Result**: The `is_ci` flag now correctly identifies CI environment

## Verification Steps

### Step 1: Verify GitHub Pages Source Configuration
1. Go to: https://github.com/ophelialabs/d/settings/pages
2. Under "Build and deployment":
   - **Source**: Should be set to "GitHub Actions"
   - If it shows "Deploy from a branch", change it to "GitHub Actions"
3. Click "Save"

### Step 2: Push Code to Trigger Workflow
```bash
cd /home/jesse/d
git add -A
git commit -m "Fix: Enable theme assets and CI environment for GitHub Pages"
git push origin main
```

### Step 3: Monitor Workflow Execution
1. Go to: https://github.com/ophelialabs/d/actions
2. Find the "Deploy Documentation" workflow
3. Click on the latest run to view logs
4. Look for the "Verify deployment" step which shows build contents

### Step 4: Wait for deployment to gh-pages
The workflow should:
1. Build the documentation (1-2 minutes)
2. Push to `gh-pages` branch
3. GitHub Pages will deploy from that branch

First deployment usually takes 1-3 minutes to appear at the URL.

### Step 5: Verify the Live Site
Wait ~5 minutes after workflow completes, then visit:
https://ophelialabs.github.io/d/

You should now see:
- ✓ Navigation sidebar
- ✓ Table of contents
- ✓ Styled content with CSS
- ✓ Code highlighting

## Common Issues & Solutions

### Issue: Site still shows no styling
**Solution**: 
1. Hard refresh the browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Clear browser cache for the domain
3. Check if `prettyurls = is_ci` is working by viewing page source for asset paths

### Issue: Workflow shows "No workflow details displayed"
**Problem**: GitHub might still be using automatic Pages deployment  
**Solution**:
1. Go to repository Settings > Pages
2. Verify "Source" is set to "GitHub Actions" (not a branch)
3. If changed, save and re-run workflow

### Issue: 404 errors for internal links
**Cause**: Pretty URLs might not be configured correctly  
**Solution**: Verify in `docs/make.jl`:
```julia
prettyurls = is_ci,  # Should be true on CI
canonical = "https://ophelialabs.github.io/d/",  # Correct subdirectory
```

### Issue: Deployment fails silently
**Solution**: Check workflow logs:
1. Go to Actions > Deploy Documentation > Latest run
2. Click "Build and deploy documentation" step
3. Look for Julia error messages
4. Common issues:
   - Missing documentation structure (missing .md files referenced in pages)
   - Package dependency issues in docs/Project.toml

## File Changes Made

### docs/make.jl
- ✅ Removed `assets = String[]` (was causing missing theme)
- ✅ Imported Documenter theme automatically
- ✅ Proper prettyurls configuration

### .github/workflows/deploy.yml
- ✅ Added `CI: true` environment variable
- ✅ Added verification step to check build output
- ✅ Proper permissions for pages deployment

## Next Steps

1. **Commit and push** the changes
2. **Monitor the workflow** in GitHub Actions
3. **Wait for deployment** to gh-pages (check notifications)
4. **Verify live site** at https://ophelialabs.github.io/d/
5. **Clear browser cache** if assets aren't loading immediately

## Debug Commands

To test locally before pushing:
```bash
cd /home/jesse/d/docs
julia --project make.jl
# Should create docs/build/ with all HTML files and assets
```

Check if build has assets:
```bash
ls -la docs/build/
# Should contain: index.html, css/, js/, assets/
```

Visit local build:
```bash
# Open docs/build/index.html in a browser
open docs/build/index.html  # macOS
xdg-open docs/build/index.html  # Linux
start docs/build/index.html  # Windows
```

## References

- [Documenter.jl Guide](https://documenter.juliadocs.org/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
