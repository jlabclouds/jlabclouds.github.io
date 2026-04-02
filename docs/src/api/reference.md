# API Reference

Complete API documentation for MyDocumentation.jl.

## Functions

### hello(name::String) -> String

Returns a greeting string for the given name.

**Parameters**:
- `name::String`: The name of the person to greet

**Returns**: `String` - A greeting message

## Types

### Document

A structure representing a document with metadata.

**Fields**:
- `title::String`: The title of the document  
- `content::String`: The main content text
- `author::String`: The author name

**Example**:
```julia
doc = Document(
    "Getting Started",
    "This is a beginner's guide",
    "Jane Doe"
)
```

## Complete Function Reference

### hello()

```julia
hello(name::String)
```

Say hello to someone.

**Arguments**:
- `name::String`: The name to greet

**Returns**: A greeting string

**Examples**:
```julia
julia> hello("World")
"Hello, World!"
```

### Document Constructor

```julia
Document(title::String, content::String, author::String)
```

Create a new Document instance.

**Arguments**:
- `title::String`: The title of the document
- `content::String`: The content of the document
- `author::String`: The author name

**Returns**: A Document instance

**Examples**:
```julia
julia> doc = Document("My Title", "Content here", "Author")
Document("My Title", "Content here", "Author")
```

## Summary

MyDocumentation.jl provides the following public API:

- `hello(::String)` - Function to create greetings
- `Document` - Type for document structures

Both are fully exported and can be used with `using MyDocumentation`.
