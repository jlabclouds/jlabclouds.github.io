# Documentation Deployment Guide

## Local Preview

The documentation has been built successfully and is ready for preview or deployment.

### View Locally

To preview the documentation in your browser:

```bash
cd docs/build
# Using Python 3
python -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Julia's built-in HTTP module
julia -e "using HTTP; HTTP.serve(HTTP.FileServer(pwd()), \"127.0.0.1\", 8000)"
```

Then open http://localhost:8000 in your browser.

## GitHub Setup

### 1. Initial Repository Setup

```bash
cd /home/jesse/d
git init
git add .
git commit -m "Initial documentation template"
git remote add origin https://github.com/YOUR_USERNAME/MyDocumentation.jl.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages Configuration

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
4. The workflow in `.github/workflows/deploy.yml` will handle deployment

### 3. Update Repository References

Edit the following files to reference your actual repository:

**docs/make.jl:**
```julia
# Update deploydocs with your repo
deploydocs(
    repo="github.com/YOUR_USERNAME/MyDocumentation.jl",
    target="build",
    branch="gh-pages",
    devbranch="main",
    push_preview=true,
)
```

**README.md:**
- Update repository URLs
- Update documentation links
- Customize package description

### 4. Deploy Automatically

The CI/CD workflow (`.github/workflows/deploy.yml`) will:
- Build documentation on every push to `main`
- Deploy to `gh-pages` branch
- Publish to GitHub Pages

Your documentation will be available at:
```
https://YOUR_USERNAME.github.io/MyDocumentation.jl/
```

## Customization

### Project Structure

The template includes:

```
MyDocumentation.jl/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── docs/
│   ├── src/
│   │   ├── index.md            # Home page
│   │   ├── guide/              # User guides
│   │   ├── api/                # API reference
│   │   ├── examples/           # Code examples
│   │   └── contributing.md     # Contributing guide
│   ├── make.jl                 # Build script
│   └── Project.toml            # Dependencies
├── src/
│   └── MyDocumentation.jl      # Main module
└── Project.toml                # Package manifest
```

### Customizing Documentation

1. **Edit content**: Modify `.md` files in `docs/src/`
2. **Update API docs**: Edit `docs/src/api/reference.md`
3. **Add new pages**: Create `.md` files and add to `pages` in `docs/make.jl`
4. **Change theme**: Modify `HTMLWriter` settings in `docs/make.jl`

### Adding Code Documentation

Update `src/MyDocumentation.jl` with docstrings:

```julia
"""
    my_function(x::Int)::String

Description of your function.

# Arguments
- `x::Int`: Parameter description

# Returns
A description of return value

# Examples
```jldoctest
julia> my_function(42)
"Answer: 42"
```
"""
function my_function(x::Int)::String
    "Answer: $x"
end
```

## Building Locally

### First Time Setup

```bash
cd docs
julia --project -e "using Pkg; Pkg.instantiate()"
```

### Build Documentation

```bash
cd docs
julia --project make.jl
```

### View Build Output

```bash
# On Linux
xdg-open build/index.html

# On macOS  
open build/index.html

# On Windows
start build/index.html
```

## Troubleshooting

### Issue: Build fails with "unable to determine remote"
**Solution**: Ensure `remotes=nothing` in `makedocs()` or set `repo` parameter.

### Issue: Cross-reference errors
**Solution**: Don't link to files outside `docs/build/`. Use relative paths to other docs only.

### Issue: Example code blocks fail
**Solution**: Use regular ` ``` ` blocks instead of ` ```@example ` for external dependencies.

### Issue: Documentation not updating after push
**Solution**: 
1. Check GitHub Actions workflow status
2. Verify `.github/workflows/deploy.yml` exists
3. Ensure branch is set to `main`

## GitHub Actions Workflow

The `.github/workflows/deploy.yml` workflow:
- Runs on push to `main`, `master`, or `develop`
- Builds documentation using Julia 1.9
- Uploads build artifacts
- Deploys to GitHub Pages

Monitor the workflow:
1. Go to your repository → **Actions**
2. View workflow runs and logs
3. Check deployment status

## Next Steps

1. **Customize** the template for your project
2. **Push** to GitHub
3. **Enable** GitHub Pages in settings
4. **Share** your documentation URL!

---

**Documentation built with Documenter.jl**

For more information, see:
- [Documenter.jl Documentation](https://documenter.juliadocs.org/)
- [GitHub Pages Guide](https://pages.github.com/)
- [Julia Documentation Style Guide](https://docs.julialang.org/en/v1/manual/documentation/)
