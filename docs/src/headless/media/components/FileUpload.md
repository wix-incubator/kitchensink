# FileUpload Headless Components

## Overview

The FileUpload headless components provide a comprehensive file upload system using the render props pattern. These components handle file selection via drag-and-drop or file input, upload progress tracking, file validation, and preview functionality. The system is designed to be completely headless, providing the logic and state management while allowing full control over the UI presentation.

The components integrate with Wix's FileUploadService to provide reliable file handling including validation, progress tracking, and upload management. They support various file types with preview capabilities for images and provide detailed feedback throughout the upload process.

## Exports

### `FileSelector`
**Type**: `React.FC<FileSelectorProps>`

Headless component that handles file selection through drag-and-drop or file input. Provides drag state management, file preview generation, and file selection callbacks.

### `UploadProgress`
**Type**: `React.FC<UploadProgressProps>`

Headless component that tracks and reports upload progress and status including loading, success, and error states with detailed status information.

### `UploadTrigger`
**Type**: `React.FC<UploadTriggerProps>`

Headless component that provides upload initiation functionality. Manages upload availability based on file selection and current upload state.

### `FilePreview`
**Type**: `React.FC<FilePreviewProps>`

Headless component that provides file preview information including preview URLs, file metadata, formatted file sizes, and preview availability status.

### `ValidationStatus`
**Type**: `React.FC<ValidationStatusProps>`

Headless component that handles file validation against configurable rules including file size limits, allowed types, and file extensions.

## Usage Examples

### Basic File Upload Component
```tsx
import { FileSelector, UploadProgress, UploadTrigger, FilePreview } from './headless/media/components/FileUpload';

function FileUploadForm() {
  return (
    <div className="upload-container">
      <FileSelector>
        {({ dragOver, handleDragOver, handleDragLeave, handleDrop, handleFileSelect, selectedFile }) => (
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="upload-label">
              {selectedFile ? selectedFile.name : 'Drop files here or click to browse'}
            </label>
          </div>
        )}
      </FileSelector>

      <FilePreview>
        {({ hasPreview, previewUrl, fileName, formattedFileSize, fileType }) => (
          hasPreview && (
            <div className="file-preview">
              {previewUrl && <img src={previewUrl} alt="Preview" />}
              <div className="file-info">
                <p>Name: {fileName}</p>
                <p>Size: {formattedFileSize}</p>
                <p>Type: {fileType}</p>
              </div>
            </div>
          )
        )}
      </FilePreview>

      <UploadTrigger>
        {({ uploadFile, canUpload, isUploading }) => (
          <button
            onClick={uploadFile}
            disabled={!canUpload}
            className="upload-button"
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        )}
      </UploadTrigger>

      <UploadProgress>
        {({ uploadState, isLoading, isSuccess, isError, hasMessage }) => (
          <div className="upload-status">
            {isLoading && <p>Uploading...</p>}
            {isSuccess && <p>Upload successful!</p>}
            {isError && <p>Upload failed: {uploadState.message}</p>}
          </div>
        )}
      </UploadProgress>
    </div>
  );
}
```

### Advanced File Upload with Validation
```tsx
import { 
  FileSelector, 
  UploadProgress, 
  UploadTrigger, 
  FilePreview, 
  ValidationStatus 
} from './headless/media/components/FileUpload';

function AdvancedFileUpload() {
  return (
    <div className="advanced-upload">
      <FileSelector>
        {({ 
          dragOver, 
          handleDragOver, 
          handleDragLeave, 
          handleDrop, 
          handleFileSelect, 
          selectedFile,
          clearFile 
        }) => (
          <div className="upload-area">
            <div
              className={`drop-zone ${dragOver ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                id="file-input"
              />
              
              {!selectedFile ? (
                <label htmlFor="file-input" className="upload-prompt">
                  <div className="upload-icon">📁</div>
                  <p>Drag & drop files here</p>
                  <p>or <span className="browse-link">browse</span></p>
                </label>
              ) : (
                <div className="file-selected">
                  <p>✅ File selected: {selectedFile.name}</p>
                  <button onClick={clearFile} className="clear-button">
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </FileSelector>

      <ValidationStatus>
        {({ isValid, error, validationRules }) => (
          <div className="validation-info">
            {!isValid && error && (
              <div className="error-message">❌ {error}</div>
            )}
            <div className="validation-rules">
              <p>Upload requirements:</p>
              <ul>
                {validationRules.maxFileSize && (
                  <li>Max size: {validationRules.maxFileSize / 1024 / 1024}MB</li>
                )}
                {validationRules.allowedTypes && (
                  <li>Allowed types: {validationRules.allowedTypes.join(', ')}</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </ValidationStatus>

      <FilePreview>
        {({ hasPreview, previewUrl, fileName, formattedFileSize, canPreview }) => (
          hasPreview && (
            <div className="preview-section">
              <h3>File Preview</h3>
              {canPreview && previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="File preview" 
                  className="preview-image"
                />
              )}
              <div className="file-details">
                <p><strong>File:</strong> {fileName}</p>
                <p><strong>Size:</strong> {formattedFileSize}</p>
              </div>
            </div>
          )
        )}
      </FilePreview>

      <div className="upload-actions">
        <UploadTrigger>
          {({ uploadFile, canUpload, isUploading }) => (
            <button
              onClick={uploadFile}
              disabled={!canUpload}
              className={`upload-btn ${canUpload ? 'enabled' : 'disabled'}`}
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                'Start Upload'
              )}
            </button>
          )}
        </UploadTrigger>
      </div>

      <UploadProgress>
        {({ uploadState, isLoading, isSuccess, isError }) => (
          <div className="progress-section">
            {isLoading && (
              <div className="progress-bar">
                <div className="progress-fill"></div>
                <p>Uploading file...</p>
              </div>
            )}
            
            {isSuccess && (
              <div className="success-message">
                ✅ Upload completed successfully!
              </div>
            )}
            
            {isError && (
              <div className="error-message">
                ❌ Upload failed: {uploadState.message}
              </div>
            )}
          </div>
        )}
      </UploadProgress>
    </div>
  );
}
```

### Multiple File Upload Interface
```tsx
function MultiFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <div className="multi-upload">
      <FileSelector>
        {({ selectedFile, handleFileSelect, clearFile }) => (
          <div className="file-selector">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="file-input"
            />
            
            {selectedFile && (
              <FilePreview>
                {({ fileName, formattedFileSize }) => (
                  <div className="selected-file">
                    <span>{fileName} ({formattedFileSize})</span>
                    <button onClick={clearFile}>Remove</button>
                  </div>
                )}
              </FilePreview>
            )}
          </div>
        )}
      </FileSelector>

      <UploadTrigger>
        {({ uploadFile, canUpload }) => (
          <button
            onClick={async () => {
              await uploadFile();
              // Add to uploaded files list
            }}
            disabled={!canUpload}
          >
            Add File
          </button>
        )}
      </UploadTrigger>

      <div className="uploaded-files">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="uploaded-file-item">
            {file.name} - ✅ Uploaded
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Image Upload with Crop Preview
```tsx
function ImageUploadWithPreview() {
  return (
    <div className="image-upload">
      <FileSelector>
        {({ dragOver, handleDrop, handleFileSelect, selectedFile }) => (
          <div 
            className={`image-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="image-input"
            />
            
            <FilePreview>
              {({ hasPreview, previewUrl, canPreview }) => (
                <>
                  {hasPreview && canPreview ? (
                    <div className="image-preview">
                      <img src={previewUrl} alt="Preview" />
                      <div className="preview-actions">
                        <label htmlFor="image-input">Change Image</label>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="image-input" className="upload-prompt">
                      <div className="upload-icon">🖼️</div>
                      <p>Drop image here or click to browse</p>
                    </label>
                  )}
                </>
              )}
            </FilePreview>
          </div>
        )}
      </FileSelector>

      <ValidationStatus>
        {({ isValid, error }) => (
          !isValid && error && (
            <div className="validation-error">{error}</div>
          )
        )}
      </ValidationStatus>

      <UploadTrigger>
        {({ uploadFile, canUpload, isUploading }) => (
          <div className="upload-controls">
            <button
              onClick={uploadFile}
              disabled={!canUpload}
              className="primary-button"
            >
              {isUploading ? 'Uploading Image...' : 'Upload Image'}
            </button>
          </div>
        )}
      </UploadTrigger>
    </div>
  );
}
```
