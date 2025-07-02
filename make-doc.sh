#!/bin/bash

# Script to concatenate all documentation files from docs/src with nested structure
# Usage: ./make-doc.sh [output_file]

OUTPUT_FILE="${1:-consolidated-docs.md}"
DOCS_DIR="docs/src"

# Check if docs directory exists
if [ ! -d "$DOCS_DIR" ]; then
  echo "Error: $DOCS_DIR directory not found!"
  exit 1
fi

# Function to get heading level based on directory depth
get_heading_level() {
  local path="$1"
  local depth=$(echo "$path" | tr -cd '/' | wc -c)
  echo $((depth + 1))
}

# Function to convert path to title
path_to_title() {
  local path="$1"
  # Remove .md extension and convert to title case
  local title=$(basename "$path" .md | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
  echo "$title"
}

# Function to get directory title
dir_to_title() {
  local dir="$1"
  local title=$(basename "$dir" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
  echo "$title"
}

# Initialize output file
echo "# Headless Components Documentation" >"$OUTPUT_FILE"
echo "" >>"$OUTPUT_FILE"

# Function to process directory recursively
process_directory() {
  local current_dir="$1"
  local base_depth="$2"

  # Get relative path from docs/src
  local rel_path=${current_dir#$DOCS_DIR/}

  # Skip if this is the root docs/src directory
  if [ "$current_dir" != "$DOCS_DIR" ]; then
    local depth=$(echo "$rel_path" | tr -cd '/' | wc -c)
    local heading_level=$((depth + base_depth))
    local heading_prefix=""

    # Create heading prefix based on depth
    for ((i = 0; i < heading_level; i++)); do
      heading_prefix="${heading_prefix}#"
    done

    # Add directory heading
    local dir_title=$(dir_to_title "$current_dir")
    echo "${heading_prefix} ${dir_title}" >>"$OUTPUT_FILE"
    echo "" >>"$OUTPUT_FILE"
  fi

  # Process .md files in current directory first
  find "$current_dir" -maxdepth 1 -name "*.md" -type f | sort | while read -r file; do
    local rel_file_path=${file#$DOCS_DIR/}
    local file_depth=$(echo "$rel_file_path" | tr -cd '/' | wc -c)
    local file_heading_level=$((file_depth + base_depth + 1))
    local file_heading_prefix=""

    # Create heading prefix for file
    for ((i = 0; i < file_heading_level; i++)); do
      file_heading_prefix="${file_heading_prefix}#"
    done

    # Add file heading
    local file_title=$(path_to_title "$file")
    echo "${file_heading_prefix} ${file_title}" >>"$OUTPUT_FILE"
    echo "" >>"$OUTPUT_FILE"

    # Add file content, skipping the first line if it's already a heading
    if head -n 1 "$file" | grep -q "^#"; then
      tail -n +2 "$file" >>"$OUTPUT_FILE"
    else
      cat "$file" >>"$OUTPUT_FILE"
    fi

    echo "" >>"$OUTPUT_FILE"
    echo "---" >>"$OUTPUT_FILE"
    echo "" >>"$OUTPUT_FILE"
  done

  # Then process subdirectories
  find "$current_dir" -maxdepth 1 -type d ! -path "$current_dir" | sort | while read -r subdir; do
    process_directory "$subdir" "$base_depth"
  done
}

echo "Concatenating documentation files..."

# Start processing from docs/src with base depth 1
process_directory "$DOCS_DIR" 1

echo "Documentation concatenated successfully!"
echo "Output file: $OUTPUT_FILE"
echo "Total files processed: $(find $DOCS_DIR -name "*.md" -type f | wc -l)"
echo "Output file size: $(wc -l <"$OUTPUT_FILE") lines"
