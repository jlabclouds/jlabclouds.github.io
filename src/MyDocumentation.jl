"""
    MyDocumentation

A comprehensive documentation example using Documenter.jl.
"""
module MyDocumentation

# Example function
"""
    hello(name::String)

Say hello to someone.

# Arguments
- `name::String`: The name to greet

# Examples
```jldoctest
julia> hello("World")
"Hello, World!"
```
"""
function hello(name::String)
    return "Hello, $name!"
end

# Example type
"""
    Document

A simple document structure.

# Fields
- `title::String`: The title of the document
- `content::String`: The content of the document
- `author::String`: The author name
"""
struct Document
    title::String
    content::String
    author::String
end

export hello, Document

end # module
