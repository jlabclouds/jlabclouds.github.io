# Contributing

Thank you for your interest in contributing to MyDocumentation.jl!

## Getting Started

Before you start contributing, please:

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bug fix

```bash
git clone https://github.com/YOUR_USERNAME/MyDocumentation.jl.git
cd MyDocumentation.jl
git checkout -b your-feature-name
```

## Setting Up Development Environment

Install development dependencies:

```bash
julia --project -e "using Pkg; Pkg.instantiate()"
cd docs
julia --project -e "using Pkg; Pkg.instantiate()"
```

## Making Changes

### Code Style

Follow Julia style conventions:
- Use 4 spaces for indentation
- Use lowercase for function names
- Use `CamelCase` for type names
- Include docstrings for all public functions

Example:

```julia
"""
    my_function(x::Int, y::String)::Bool

Description of what my_function does.

# Arguments
- `x::Int`: Description of x
- `y::String`: Description of y

# Returns
A boolean indicating success

# Examples
```jldoctest
julia> my_function(42, "test")
true
```
"""
function my_function(x::Int, y::String)::Bool
    # Implementation
    return true
end
```

### Documentation

Update `docs/src/` when adding features:
- Add/update API documentation in `docs/src/api/reference.md`
- Add examples in `docs/src/examples/`
- Update guides if behavior changes

### Testing

Run tests before submitting:

```bash
julia --project -e "using Pkg; Pkg.test()"
```

Build documentation locally to check formatting:

```bash
cd docs
julia --project make.jl
xdg-open build/index.html  # Linux
open build/index.html      # macOS
start build/index.html     # Windows
```

## Testing Your Documentation

### Run Doctests

Ensure all code examples work:

```bash
cd docs
julia --project -e "using Documenter; Documenter.doctest(\"src\")"
```

### Check for Broken Links

Enable linkcheck in `docs/make.jl`:

```julia
makedocs(
    # ...
    linkcheck=true,
    # ...
)
```

Then build:

```bash
cd docs
julia --project make.jl
```

## Committing Changes

Write clear commit messages:

```bash
git add -A
git commit -m "Add feature X: Brief description of changes"
git push origin your-feature-name
```

## Submitting a Pull Request

1. Push your branch to your fork
2. Go to the main repository on GitHub
3. Click "New Pull Request"
4. Select your branch and describe the changes
5. Ensure CI/CD tests pass

### PR Checklist

- [ ] Code follows Julia style guide
- [ ] New functions have docstrings
- [ ] Tests pass (`julia --project -e "using Pkg; Pkg.test()"`)
- [ ] Documentation builds (`cd docs && julia --project make.jl`)
- [ ] Documentation is updated for new features
- [ ] No unrelated changes included
- [ ] Commit messages are clear

## Reporting Bugs

If you find a bug, create an issue with:

1. **Title**: Brief description of the problem
2. **Description**: Detailed explanation of the issue
3. **Steps to Reproduce**: Code that reproduces the bug
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Environment**: Julia version, OS, package versions

## Suggesting Features

To suggest a new feature:

1. Create an issue with the title "Feature: [description]"
2. Explain the use case and expected behavior
3. Provide examples if possible
4. Discuss implementation ideas

## Code Review Process

- Maintainers will review your PR
- They may request changes or ask questions
- Once approved, your PR will be merged
- Your changes will be included in the next release

## Documentation Structure

The documentation follows this structure:

```
docs/src/
├── index.md              # Home page
├── guide/
│   ├── getting_started.md
│   ├── tutorial.md
│   └── advanced.md
├── api/
│   └── reference.md
├── examples/
│   ├── basic.md
│   └── advanced.md
└── contributing.md       # This file
```

Each section should:
- Have clear headers
- Include code examples
- Link to related sections
- Be beginner-friendly where appropriate

## Building Documentation Locally

See [Getting Started](guide/getting_started.md#building-documentation-locally) for detailed instructions.

## Running Examples

All code examples in documentation should be runnable. Test them:

```julia
using MyDocumentation

# Copy code from examples and run it here
hello("Test")
```

## Questions?

- Open a discussion on GitHub
- Ask on [Julia Discourse](https://discourse.julialang.org/)
- Check existing issues and documentation

## Code of Conduct

Please be respectful and inclusive in all interactions:

- Welcome people of all backgrounds
- Be kind and constructive in feedback
- Respect different opinions
- Report harassment to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (typically MIT).

## Thank You!

We appreciate your contributions to making MyDocumentation.jl better! 🎉
