# Advanced Examples

Complex examples showcasing advanced techniques.

## Example 1: Custom Type Extensions

Extend the Document type with utility functions:

```julia
using MyDocumentation

# Define extension functions
function word_count(doc::Document)::Int
    return length(split(doc.content))
end

function char_count(doc::Document)::Int
    return length(doc.content)
end

function reading_time(doc::Document)::Float64
    # Assume 200 words per minute
    wc = word_count(doc)
    return round(wc / 200; digits=1)
end

# Usage
doc = Document(
    "Long Document",
    "Lorem ipsum dolor sit amet. " ^ 50,  # Repeat 50 times
    "Author"
)

println("$(doc.title):")
println("  Words: $(word_count(doc))")
println("  Characters: $(char_count(doc))")
println("  Reading time: $(reading_time(doc)) minutes")
```

## Example 2: Document Processing Pipeline

Create a processing pipeline:

```julia
using MyDocumentation

struct Pipeline
    steps::Vector{Function}
end

function Pipeline(steps...)
    Pipeline(collect(steps))
end

function (p::Pipeline)(doc::Document)
    result = doc
    for step in p.steps
        result = step(result)
    end
    return result
end

# Define pipeline steps
normalize_title(doc) = Document(
    uppercase(doc.title),
    doc.content,
    doc.author
)

add_header(doc) = Document(
    doc.title,
    "Header: $(doc.title)\n\n$(doc.content)",
    doc.author
)

truncate_content(doc) = Document(
    doc.title,
    first(doc.content, 100) * "...",
    doc.author
)

# Create and use pipeline
pipeline = Pipeline(normalize_title, add_header, truncate_content)
doc = Document("example", "This is a long content that will be processed.", "Author")
processed = pipeline(doc)

println("Processed Document:")
println("  Title: $(processed.title)")
println("  Content: $(processed.content[1:50])...")
```

## Example 3: Document Database

Implement a simple document database:

```julia
using MyDocumentation

mutable struct DocumentDB
    documents::Dict{String, Document}
    next_id::Int
end

DocumentDB() = DocumentDB(Dict(), 1)

function add!(db::DocumentDB, doc::Document)::String
    id = "doc_$(db.next_id)"
    db.documents[id] = doc
    db.next_id += 1
    return id
end

function get(db::DocumentDB, id::String)::Union{Document, Nothing}
    return get(db.documents, id, nothing)
end

function search(db::DocumentDB, query::String)::Vector{Document}
    results = Document[]
    query_lower = lowercase(query)
    
    for doc in values(db.documents)
        if contains(lowercase(doc.title), query_lower) ||
           contains(lowercase(doc.content), query_lower)
            push!(results, doc)
        end
    end
    
    return results
end

# Usage
db = DocumentDB()

id1 = add!(db, Document("Julia Basics", "Learn Julia fundamentals", "Dr. Smith"))
id2 = add!(db, Document("Advanced Julia", "Deep dive into Julia", "Dr. Jones"))

println("Added documents with IDs: $id1, $id2")

# Search
results = search(db, "Julia")
println("Found $(length(results)) documents matching 'Julia':")
for doc in results
    println("  - $(doc.title)")
end
```

## Example 4: Async Document Processing

Process documents asynchronously:

```julia
using MyDocumentation
using Base.Threads

function async_process(documents::Vector{Document})::Vector{String}
    results = Vector{String}(undef, length(documents))
    
    @threads for i in eachindex(documents)
        doc = documents[i]
        # Simulate processing
        sleep(0.1)
        results[i] = "Processed: $(doc.title) by $(doc.author)"
    end
    
    return results
end

# Usage
docs = [
    Document("Doc $i", "Content $i", "Author $i")
    for i in 1:10
]

results = async_process(docs)
for result in results
    println(result)
end
```

## Example 5: Document Export Formats

Export documents to different formats:

```julia
using MyDocumentation
using JSON3

function to_json(doc::Document)::String
    data = (
        title = doc.title,
        content = doc.content,
        author = doc.author,
    )
    return JSON3.write(data)
end

function to_markdown(doc::Document)::String
    return """
    # $(doc.title)
    
    **Author:** $(doc.author)
    
    $(doc.content)
    """
end

function to_html(doc::Document)::String
    return """
    <html>
    <head><title>$(doc.title)</title></head>
    <body>
    <h1>$(doc.title)</h1>
    <p><strong>Author:</strong> $(doc.author)</p>
    <p>$(doc.content)</p>
    </body>
    </html>
    """
end

# Usage
doc = Document("Example", "This is example content.", "John Doe")

println("JSON:")
println(to_json(doc))

println("\nMarkdown:")
println(to_markdown(doc))

println("\nHTML:")
println(to_html(doc))
```

## Example 6: Performance Benchmarking

Benchmark document operations:

```julia
using MyDocumentation
using BenchmarkTools

function benchmark_operations()
    # Create test data
    docs = [
        Document("Doc $i", "Content " ^ 100, "Author $i")
        for i in 1:1000
    ]
    
    # Benchmark iteration
    @time for doc in docs
        _ = length(doc.content)
    end
    
    # Benchmark filtering
    @time filter(doc -> startswith(doc.title, "Doc"), docs)
    
    # Benchmark sorting
    @time sort(docs, by=doc -> doc.title)
end

# Run benchmarks
benchmark_operations()
```

## Next Steps

- Explore the [API Reference](../api/reference.md)
- Read [Advanced Usage](../guide/advanced.md) guide
- Check out [Contributing](../contributing.md) guidelines
