# Close Icon

## Overview

The CloseIcon component is a simple SVG icon component that renders an X (close) icon. It follows the standard icon component pattern with customizable className prop for styling and accessibility features. The icon uses stroke-based design and inherits color from the current text color.

This component is commonly used for close buttons, dismiss actions, remove operations, or cancel functionality in modals, alerts, forms, and other UI components.

## Exports

### `CloseIcon`
**Type**: `React.FC<{ className?: string }>`

SVG icon component that renders an X/close icon with optional CSS class customization. Uses stroke-based design with standard stroke weight.

## Usage Examples

### Modal Close Button
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function Modal({ onClose, children }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          <CloseIcon className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
```

### Alert Dismiss
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function Alert({ message, onDismiss }) {
  return (
    <div className="alert">
      <span>{message}</span>
      <button onClick={onDismiss} className="alert-dismiss">
        <CloseIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
}
```

### Tag/Chip Remove
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function Tag({ label, onRemove }) {
  return (
    <span className="tag">
      {label}
      <button onClick={onRemove} className="tag-remove">
        <CloseIcon className="w-3 h-3 ml-1" />
      </button>
    </span>
  );
}
```

### Search Clear Button
```tsx
import { CloseIcon } from './components/icons/CloseIcon';

function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="search-input">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
      />
      {value && (
        <button onClick={onClear} className="search-clear">
          <CloseIcon className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
```
