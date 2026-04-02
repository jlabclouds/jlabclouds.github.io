# Tutorial

A comprehensive tutorial to get you productive with MyDocumentation.jl.

## Learning Path

This tutorial covers:
1. Basic function usage
2. Working with types
3. Creating complex workflows
4. Best practices

## Part 1: Basic Functions

### The `hello()` Function

The simplest way to start is with the `hello()` function:

```julia
using MyDocumentation

result = hello("Tutorial Reader")
println(result)
```

This function takes a name and returns a greeting string.

### Function Behavior

```julia
using MyDocumentation

# Different use cases
for name in ["Alice", "Bob", "Charlie"]
    println(hello(name))
end
```

## Part 2: Working with the Document Type

### Creating Documents

The `Document` type is the core data structure:

```julia
using MyDocumentation

doc = Document(
    "Introduction to Julia",
    "Julia is a high-performance dynamic programming language.",
    "Jane Smith"
)

println("Title: $(doc.title)")
println("Author: $(doc.author)")
println("Content: $(doc.content)")
```

### Using Documents in Collections

```julia
using MyDocumentation

# Create multiple documents
docs = [
    Document("Getting Started", "Installation and setup...", "Author 1"),
    Document("Advanced Topics", "Deep dive into features...", "Author 2"),
    Document("API Reference", "Complete API documentation...", "Author 3"),
]

# Display information
for doc in docs
    println("- $(doc.title) by $(doc.author)")
end
```

## Part 3: Common Patterns

### Pattern 1: Batch Processing

Process multiple items efficiently:

```julia
using MyDocumentation

names = ["User1", "User2", "User3", "User4"]
greetings = [hello(name) for name in names]

for greeting in greetings
    println(greeting)
end
```

### Pattern 2: Data Organization

Organize documents by category:

```julia
using MyDocumentation

# Create categorized documents
categories = Dict(
    "Tutorials" => [
        Document("Intro", "Getting started guide", "Team"),
        Document("Advanced", "Deep dive", "Team"),
    ],
    "References" => [
        Document("API", "Function reference", "Team"),
    ],
)

for (category, docs) in categories
    println("$category:")
    for doc in docs
        println("  - $(doc.title)")
    end
end
```

## Part 4: Best Practices

### 1. Error Handling

Always handle potential errors gracefully:

```julia
function safe_hello(name)
    try
        if isempty(name)
            return "Hello, friend!"
        else
            return hello(name)
        end
    catch e
        @error "Error in greeting" exception=e
        return "Hello!"
    end
end
```

### 2. Type Safety

Use type annotations for clarity:

```julia
function process_documents(docs::Vector{Document})::Int
    return length(docs)
end
```

### 3. Documentation

Always document your code:

```julia
"""
    analyze_document(doc::Document)::Int

Count the number of words in a document.

# Arguments
- `doc::Document`: The document to analyze

# Returns
An integer representing word count
"""
function analyze_document(doc::Document)::Int
    return length(split(doc.content))
end
```

## Part 5: Practical Workflow

Here's a complete workflow example:

```julia
using MyDocumentation

# Step 1: Create documents
my_docs = [
    Document("Project Plan", "Phase 1: Planning...", "Manager"),
    Document("Implementation", "Phase 2: Development...", "Developer"),
]

# Step 2: Process them
for (i, doc) in enumerate(my_docs)
    println("[$i] $(doc.title) - by $(doc.author)")
    word_count = length(split(doc.content))
    println("    Content length: $word_count words")
end

# Step 3: Generate output
output = [hello("User $i") for i in 1:3]
println("\nGreetings:")
for greeting in output
    println("  $greeting")
end
```

## Summary

You've learned:
- ✅ Using the `hello()` function
- ✅ Creating and working with `Document` objects
- ✅ Common patterns for batch processing
- ✅ Best practices for code organization
- ✅ A practical workflow example

## Next Steps

- Explore [Advanced Usage](advanced.md) for more complex scenarios
- Check the [API Reference](../api/reference.md) for all available functions
- See [Examples](../examples/basic.md) for more practical code samples
- Read about [Contributing](../contributing.md) if interested in development
