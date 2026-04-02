To use this template for your own project, follow these steps:

### 1. Update Your Package Name
- Replace `MyDocumentation` with your package name in all files
- Update `src/MyDocumentation.jl` with your code
- Update the main module name to match

### 2. Configure Your Repository

Update the GitHub repository references to point to your repository:

**In `docs/make.jl`:**
- Line 61: Update `canonical` URL to your repository (e.g., `https://yourname.github.io/repository-name/`)
- Line 71: Update `repo_url` with your GitHub repository URL

**In `.github/workflows/deploy.yml`:**
- Ensure the workflow has proper permissions for GitHub Pages deployment

### 3. Configure Git (Local Repository)
```bash
git config user.name "Your Name"
git config user.email "your_email@example.com"
```

### 4. Update Your Documentation
- Update `docs/src/index.md` - Home page content
- Update `docs/src/guide/` - User guides and tutorials
- Update `docs/src/api/reference.md` - API documentation
- Update `docs/src/examples/` - Code examples

### 5. Set Up GitHub Pages

1. Create your repository on GitHub (e.g., `https://github.com/yourname/your-repo`)
2. Push this template to your repository:
   ```bash
   git remote set-url origin https://github.com/yourname/your-repo.git
   git push origin main
   ```
3. Go to your repository **Settings → Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - Click "Save"

### 6. Deploy
The GitHub Actions workflow will automatically build and deploy your documentation to GitHub Pages when you push to `main`:

```bash
git add .
git commit -m "Customize documentation for my project"
git push origin main
```

Your documentation will be available at: `https://yourname.github.io/your-repo/`