# MyDocumentation.jl

A comprehensive Julia package demonstrating professional documentation practices using Documenter.jl.

## 📚 Features

- **Professional Documentation**: Complete guide, tutorial, and API reference
- **Compiled Examples**: Working code examples with doctests
- **GitHub Pages Ready**: Automatically deploys to GitHub Pages via GitHub Actions
- **Local Development**: Easy local build and preview workflow
- **Best Practices Template**: Ready-to-customize for your own projects

## 🚀 Quick Start

### Prerequisites

- Julia 1.6 or later
- Git

### Installation

```bash
git clone https://github.com/yourname/MyDocumentation.jl.git
cd MyDocumentation.jl
julia --project
```

In the Julia REPL:

```julia
using Pkg
Pkg.instantiate()
```

### Basic Usage

```julia
using MyDocumentation

# Simple greeting
hello("World")

# Create a document
doc = Document("My Title", "Document content", "Author Name")
```

## 📖 Building Documentation

### Local Build

```bash
cd docs
julia --project -e "using Pkg; Pkg.instantiate()"
julia --project make.jl
```

### View Documentation

```bash
# Open in browser
cd build
python -m http.server 8000
# Visit http://localhost:8000
```

## 🌐 GitHub Pages Deployment

The documentation automatically deploys to GitHub Pages when you push to `main`. See the [GitHub Actions workflow](.github/workflows/deploy.yml) for details.

## 📂 Project Structure

```
MyDocumentation.jl/
├── src/
│   └── MyDocumentation.jl       # Main module
├── docs/
│   ├── src/
│   │   ├── index.md             # Home page
│   │   ├── guide/               # User guides
│   │   ├── api/                 # API reference
│   │   ├── examples/            # Code examples
│   │   └── contributing.md      # Contribution guide
│   ├── make.jl                  # Build script
│   └── Project.toml             # Docs dependencies
├── .github/workflows/
│   └── deploy.yml               # GitHub Actions deployment
└── Project.toml                 # Package manifest
```

## 📝 Documentation Sections

- **[Home](docs/src/index.md)** - Overview and quick start
- **[Getting Started](docs/src/guide/getting_started.md)** - Installation and setup
- **[Tutorial](docs/src/guide/tutorial.md)** - Comprehensive tutorial
- **[Advanced Usage](docs/src/guide/advanced.md)** - Advanced techniques
- **[API Reference](docs/src/api/reference.md)** - Full API documentation
- **[Examples](docs/src/examples/)** - Practical code examples
- **[Contributing](docs/src/contributing.md)** - How to contribute

## 🛠️ Customization
To use this template for your own project:
cd ~/path_to_cloned_directory,
or hotkey 'ctr+`' if open in vs code:
```
git config user.name "Your Name"
git config user.email "your_email@example.com"
```
1. Update GitHub repository references in `docs/make.jl` (lines 66, 77 && 79) and `.github/workflows/deploy.yml`
2. Replace `MyDocumentation` with your package name
3. Update `src/MyDocumentation.jl` with your code
4. Update `docs/src/` with your documentation
5. Use Source Control to publish or
```
git add docs/make.jl && git commit -m "Configure deployment for GitHub Pages" && git push origin main
```

## 🔧 GitHub Pages Configuration

1. Go to your repository settings
2. Navigate to "Pages"
3. Select "Deploy from a branch"
4. Choose "gh-pages" branch and "/ (root)" folder
5. Wait for the first deployment to complete

## 🧪 Testing

Run tests with:

```bash
julia --project -e "using Pkg; Pkg.test()"
```

Run doctests in documentation:

```bash
cd docs
julia --project -e "using Documenter; Documenter.doctest(\"src\")"
```

## 📚 Learn More

- [Documenter.jl Documentation](https://documenter.juliadocs.org/)
- [Julia Style Guide](https://docs.julialang.org/en/v1/manual/style-guide/)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please see [Contributing Guidelines](docs/src/contributing.md) for details.

## 📞 Support

- [GitHub Issues](https://github.com/yourname/MyDocumentation.jl/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/yourname/MyDocumentation.jl/discussions) - Questions and discussions
- [Julia Discourse](https://discourse.julialang.org/) - Julia community support

---

**Made with ❤️ using Documenter.jl**
