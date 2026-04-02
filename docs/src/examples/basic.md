# Basic Examples

Practical examples to get you started.

## Example 1: Simple Greeting

The most basic example:

```julia
using MyDocumentation

result = hello("World")
println(result)
```

## Example 2: Creating Documents

Create and work with documents:

```julia
using MyDocumentation

# Create a document
doc = Document(
    "Julia Programming",
    "Julia is a high-performance dynamic programming language.",
    "Jane Smith"
)

# Access fields
println("Title: $(doc.title)")
println("Author: $(doc.author)")
```

## Example 3: Processing Multiple Documents

```julia
using MyDocumentation

# Create a list of documents
documents = [
    Document("Chapter 1", "Introduction...", "Author A"),
    Document("Chapter 2", "Basics...", "Author B"),
    Document("Chapter 3", "Advanced Topics...", "Author C"),
]

# Print information about each
for (i, doc) in enumerate(documents)
    println("$i. $(doc.title) by $(doc.author)")
end
```

## Example 4: Document Analysis

Analyze document content:

```julia
using MyDocumentation

doc = Document(
    "Sample Document",
    "This is a sample document with several words in it.",
    "Test Author"
)

# Count words
word_count = length(split(doc.content))
println("Document: $(doc.title)")
println("Words: $word_count")
println("Author: $(doc.author)")
```

## Example 5: Working with Collections

Process collections of documents:

```julia
using MyDocumentation

# Create document collection
docs = [
    Document("Doc $i", "Content for document $i", "Author $i")
    for i in 1:5
]

# Filter and process
important_docs = filter(doc -> startswith(doc.title, "Doc"), docs)

println("Processing $(length(important_docs)) documents:")
for doc in important_docs
    println("  - $(doc.title)")
end
```

## Example 6: Creating a Report

Generate a report from documents:

```julia
using MyDocumentation

function generate_report(documents::Vector{Document})::String
    report = "# Document Report\n\n"
    report *= "Total Documents: $(length(documents))\n\n"
    
    for doc in documents
        report *= "## $(doc.title)\n"
        report *= "**Author:** $(doc.author)\n"
        report *= "**Preview:** $(first(doc.content, 50))...\n\n"
    end
    
    return report
end

docs = [
    Document("Report 1", "This is the first report with some content", "Alice"),
    Document("Report 2", "This is the second report with different content", "Bob"),
]

println(generate_report(docs))
```

## Next Steps

- See [Advanced Examples](advanced.md) for more complex use cases
- Read the [Tutorial](../guide/tutorial.md) for a comprehensive introduction
- Check the [API Reference](../api/reference.md) for function details
