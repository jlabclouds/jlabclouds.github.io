# Getting Started

Learn how to install and set up MyDocumentation.jl.

## Installation

### Prerequisites

- Julia 1.6 or later
- Git (for cloning the repository)

### Install from GitHub

```julia
using Pkg
Pkg.add(url="https://github.com/yourname/MyDocumentation.jl")
```

### Install from Source (for development)

```bash
git clone https://github.com/yourname/MyDocumentation.jl.git
cd MyDocumentation.jl
julia --project
```

Then in the Julia REPL:

```julia
using Pkg
Pkg.instantiate()
```

## Basic Usage

### First Steps

```julia
using MyDocumentation
hello("World")
```

### Working with Documents

```julia
using MyDocumentation

# Create a document
doc = Document(
    "My First Document",
    "This is the content of my document.",
    "John Doe"
)

# Access fields
println(doc.title)
println(doc.author)
```

## Project Structure

The MyDocumentation.jl package is organized as follows:

```
MyDocumentation.jl/
├── src/                    # Source code
│   └── MyDocumentation.jl  # Main module
├── docs/                   # Documentation
│   ├── src/                # Documentation sources (Markdown files)
│   ├── make.jl             # Build script
│   └── Project.toml        # Documentation environment
├── test/                   # Tests
├── Project.toml            # Package manifest
└── README.md               # Package readme
```

## Building Documentation Locally

### Setup

Navigate to the `docs` directory and ensure dependencies are installed:

```bash
cd docs
julia --project -e "using Pkg; Pkg.instantiate()"
```

### Build

To build the documentation:

```bash
cd docs
julia --project make.jl
```

The generated HTML will be in `docs/build/`.

### View Locally

Open the documentation in your browser:

```bash
# On Linux
xdg-open docs/build/index.html

# On macOS
open docs/build/index.html

# On Windows
start docs/build/index.html
```

Or use a local server. If you have Python installed:

```bash
cd docs/build
python -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Running Tests

To run the testing suite:

```bash
julia --project -e "using Pkg; Pkg.test()"
```

## Next Steps

Now that you have MyDocumentation.jl installed, check out:

1. **[Tutorial](tutorial.md)** - Learn the core concepts
2. **[API Reference](../api/reference.md)** - Explore the full API
3. **[Examples](../examples/basic.md)** - See practical examples

## Troubleshooting

### Issue: Build fails with missing Documenter

**Solution**: Ensure `Documenter.jl` is in your docs environment:

```julia
cd docs
using Pkg
Pkg.add("Documenter")
Pkg.instantiate()
```

### Issue: Documentation doesn't update after changes

**Solution**: The documentation is cached. Do a clean build:

```bash
cd docs
rm -rf build/
julia --project make.jl
```

### Issue: External links are broken

Check the URL and ensure it's accessible. If building locally with `linkcheck=true`, you may need a working internet connection.

## Getting Help

- Check the [FAQ](../contributing.md) section
- Open an issue on [GitHub](https://github.com/yourname/MyDocumentation.jl/issues)
- Visit the Julia Discourse: https://discourse.julialang.org/
