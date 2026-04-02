# Advanced Usage

Advanced topics and techniques for power users.

## Advanced Topics

### Custom Type Extensions

Extend existing types with your own functionality:

```julia
import MyDocumentation: Document

# Custom function for documents
function summary(doc::Document)::String
    word_count = length(split(doc.content))
    return "$(doc.title) by $(doc.author) ($(word_count) words)"
end

doc = Document("Example", "This is content", "Author")
println(summary(doc))
```

### Performance Optimization

When working with large collections:

```julia
using MyDocumentation

# Process many documents efficiently
function batch_process(docs::Vector{Document})
    # Pre-allocate results
    results = String[]
    
    # Vectorized operations
    for doc in docs
        push!(results, "Processed: $(doc.title)")
    end
    
    return results
end
```

### Integration with Other Packages

MyDocumentation.jl works well with other Julia packages:

```julia
using MyDocumentation
using JSON3

# Export documents to JSON
function to_json(doc::Document)
    return JSON3.write(dict(
        :title => doc.title,
        :content => doc.content,
        :author => doc.author,
    ))
end
```

## Advanced Patterns

### Builder Pattern

Create documents using a builder approach:

```julia
using MyDocumentation

struct DocumentBuilder
    title::String
    content::Ref{String}
    author::Ref{String}
    
    DocumentBuilder(title) = new(title, Ref(""), Ref(""))
end

function with_content(builder::DocumentBuilder, content::String)
    builder.content[] = content
    return builder
end

function with_author(builder::DocumentBuilder, author::String)
    builder.author[] = author
    return builder
end

function build(builder::DocumentBuilder)::Document
    return Document(builder.title, builder.content[], builder.author[])
end

# Usage
doc = build(
    with_author(
        with_content(
            DocumentBuilder("My Title"),
            "Document content here"
        ),
        "John Doe"
    )
)
```

### Functional Composition

Compose operations functionally:

```julia
using MyDocumentation

# Compose transformations
uppercase_title(doc) = Document(uppercase(doc.title), doc.content, doc.author)
add_prefix(prefix) = doc -> Document("$prefix: $(doc.title)", doc.content, doc.author)

# Apply composed transformations
doc = Document("original", "content", "author")
result = add_prefix("IMPORTANT")(uppercase_title(doc))
```

## Performance Considerations

### Memory Usage

For large-scale document processing:

```julia
using MyDocumentation

# Use String interning for repeated content
const title_cache = Dict{String, String}()

function cached_title(title::String)
    get!(title_cache, title, title)
end

# For memory-intensive operations, consider strided arrays and views
function process_large_collection(docs::Vector{Document})
    # Process in chunks to manage memory
    chunk_size = 1000
    for i in 1:chunk_size:length(docs)
        chunk = @view docs[i:min(i+chunk_size-1, end)]
        # Process chunk
    end
end
```

### Multithreading

Enable parallel processing:

```julia
using MyDocumentation
using Base.Threads

function parallel_process(docs::Vector{Document})
    results = Vector{String}(undef, length(docs))
    
    @threads for i in eachindex(docs)
        doc = docs[i]
        results[i] = "Processed: $(doc.title)"
    end
    
    return results
end
```

## Debugging Techniques

### Enable Verbose Logging

```julia
using Logging

# Set debug logging level
global_logger(ConsoleLogger(stderr, Logging.Debug))

# Your code here
@debug "Processing document" doc=doc
```

### Profiling Code

Identify bottlenecks:

```julia
using Profile, ProfileSVG

function expensive_operation()
    # Your code
end

@profile expensive_operation()
ProfileSVG.save("/tmp/profile.svg")
```

## Common Pitfalls

### ❌ Mutable Struct Issues

Avoid unexpected mutations:

```julia
# ❌ Bad: mutable but should be immutable
mutable struct BadDocument
    title::String
    content::String
end

# ✅ Good: immutable for safety
struct GoodDocument
    title::String
    content::String
end
```

### ❌ Type Instability

Keep types consistent:

```julia
# ❌ Bad: function returns different types
function process(x)
    if x < 0
        return nothing  # Different type!
    else
        return x * 2
    end
end

# ✅ Good: consistent return type
function process(x)::Int
    return max(0, x * 2)
end
```

## Advanced Examples

### Custom Iteration

Implement iteration protocol:

```julia
using MyDocumentation

struct DocumentCollection
    docs::Vector{Document}
end

Base.iterate(dc::DocumentCollection) = iterate(dc.docs)
Base.iterate(dc::DocumentCollection, state) = iterate(dc.docs, state)
Base.length(dc::DocumentCollection) = length(dc.docs)

# Usage
collection = DocumentCollection([
    Document("Doc1", "content1", "author1"),
    Document("Doc2", "content2", "author2"),
])

for doc in collection
    println(doc.title)
end
```

## Next Steps

- Check the [API Reference](../api/reference.md) for all available functions
- Explore [Examples](../examples/advanced.md) for more code samples
- Contribute improvements - see [Contributing](../contributing.md)
