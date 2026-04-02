# Local vs GitHub Pages Display Issues - Solutions

## Common Rendering Differences

### Issue 1: Asset Path Problems (CSS/JS not loading)

**Symptom**: Docs appear unstyled on GitHub Pages, but work locally

**Cause**: GitHub Pages serves from a subdirectory path `/d/` rather than root

**Solution**: Update `make.jl` to configure the asset prefix:

```julia
makedocs(
    # ... other config ...
    format = Documenter.HTML(
        prettyurls = get(ENV, "CI", false),  # Disable pretty URLs locally
        canonical = "https://ophelialabs.github.io/d/",
        assets = String[],
    ),
)
```

### Issue 2: Navigation/Links Broken

**Symptom**: Internal links work locally but show 404 on GitHub Pages

**Cause**: GitHub Pages adds `/d/` to the URL path

**Solution**: This is usually handled automatically by Documenter if you set the canonical URL correctly.

**Verify in `docs/make.jl`:**

```julia
makedocs(
    sitename="MyDocumentation.jl",
    format = Documenter.HTML(
        canonical = "https://ophelialabs.github.io/d/",
    ),
    # ... rest of config
)
```

### Issue 3: Code Highlighting Different

**Symptom**: Code blocks look different between local and GitHub Pages

**Cause**: Different CSS themes or Highlight.js versions

**Solution**: Force a specific highlighting style:

```julia
makedocs(
    # ... config ...
    format = Documenter.HTML(
        prettyurls = get(ENV, "CI", false),
        canonical = "https://ophelialabs.github.io/d/",
        highlights = ["julia", "bash", "python"],
    ),
)
```

### Issue 4: Search Not Working

**Symptom**: Search works locally but not on GitHub Pages

**Cause**: Search index generation issue or path problem

**Solution**: Ensure Documenter.jl is up to date and paths are correct.

## Updated `make.jl` with All Fixes

Here's a complete, working configuration for your setup:

```julia
"""
Documenter.jl build script - Fixed for GitHub Pages
"""

using Documenter, MyDocumentation

# Determine environment
is_ci = get(ENV, "CI", false) == "true" || get(ENV, "GITHUB_ACTIONS", "false") == "true"

# Define the documentation structure
makedocs(
    sitename="MyDocumentation.jl",
    authors="Your Name",
    
    # Set remotes based on environment
    remotes = is_ci ? nothing : nothing,
    
    # Build options
    clean=true,
    doctest=false,
    linkcheck=false,
    
    # Source and build directories
    source="src",
    build="build",
    
    # Page structure
    pages=[
        "Home" => "index.md",
        "Guide" => [
            "Getting Started" => "guide/getting_started.md",
            "Tutorial" => "guide/tutorial.md",
            "Advanced Usage" => "guide/advanced.md",
        ],
        "API Reference" => "api/reference.md",
        "Examples" => [
            "Basic Examples" => "examples/basic.md",
            "Advanced Examples" => "examples/advanced.md",
        ],
        "Contributing" => "contributing.md",
    ],
    
    # HTML configuration for both local and GitHub Pages
    format = Documenter.HTML(
        prettyurls = is_ci,  # Pretty URLs on CI/GitHub Pages
        canonical = "https://ophelialabs.github.io/d/",
        assets = String[],
    ),
)

# Deploy to GitHub Pages
deploydocs(
    repo="github.com/ophelialabs/d.git",
    target="build",
    branch="gh-pages",
    devbranch="main",
    push_preview=false,
)
```

## How to Apply Fix

### Option 1: Update your local make.jl (Recommended)

```bash
cd /home/jesse/d
```

Then update `docs/make.jl` with the configuration above.

### Option 2: Minimal Fix (if only assets issue)

Add this to your `makedocs()` call:

```julia
format = Documenter.HTML(
    canonical = "https://ophelialabs.github.io/d/",
),
```

## Testing the Fix

### 1. Build Locally

```bash
cd /home/jesse/d/docs
rm -rf build
julia --project make.jl
cd build && python -m http.server 8000
```

Visit: http://localhost:8000

### 2. Push to GitHub

```bash
cd /home/jesse/d
git add docs/make.jl
git commit -m "Fix: Configure GitHub Pages asset paths"
git push origin main
```

### 3. Monitor Workflow

Go to: https://github.com/ophelialabs/d/actions

Wait for workflow to complete (2-3 minutes)

### 4. Compare Displays

- Local: http://localhost:8000
- GitHub: https://ophelialabs.github.io/d/

Should look identical now!

## Why Local and GitHub Pages Differ

| Aspect | Local Server | GitHub Pages |
|--------|--------------|--------------|
| URL Path | `http://localhost:8000/` | `https://ophelialabs.github.io/d/` |
| Asset Loading | Root-relative | Subdirectory-relative |
| HTTPS | No | Yes |
| Caching | None | Browser cache + CDN |
| CSS/JS | Fresh | May be cached |

## Debug Checklist

- [ ] Local build completes without errors
- [ ] GitHub Actions workflow succeeds
- [ ] `gh-pages` branch exists
- [ ] `canonical` URL is set in HTML format
- [ ] CSS loads (check browser DevTools)
- [ ] Search index exists in build/
- [ ] Links work (check 404s in DevTools)

## If Still Having Issues

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Hard refresh**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. **Wait 10 minutes**: GitHub Pages cache updates slowly
4. **Check Page Settings**: https://github.com/ophelialabs/d/settings/pages
5. **Review workflow logs**: Check for build/deployment errors

## View Detailed Logs

```bash
# Workflow run logs
https://github.com/ophelialabs/d/actions/runs/[run-id]

# Browser DevTools Network tab
- Check for failed asset loads (404s)
- Check for CORS issues
- Check response headers
```

## Additional Resources

- [Documenter.jl HTML Format Docs](https://documenter.juliadocs.org/stable/man/format/)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#about-github-pages)
- [Deployer.jl Deployment Guide](https://documenter.juliadocs.org/stable/man/deploying/)
