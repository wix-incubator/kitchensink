# Check Icon

## Overview

The CheckIcon component is a simple SVG icon component that renders a checkmark icon. It follows the standard icon component pattern with customizable className prop for styling and accessibility features. The icon uses stroke-based design with a thicker stroke weight for better visibility and inherits color from the current text color.

This component is commonly used for indicating success states, completed actions, form validation, or selection states throughout the application.

## Exports

### `CheckIcon`
**Type**: `React.FC<{ className?: string }>`

SVG icon component that renders a checkmark icon with optional CSS class customization. Uses stroke-based design with strokeWidth="3" for prominence.

## Usage Examples

### Success Messages
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function SuccessAlert() {
  return (
    <div className="success-alert">
      <CheckIcon className="w-5 h-5 text-green-600" />
      <span>Operation completed successfully!</span>
    </div>
  );
}
```

### Form Validation
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function ValidatedInput({ isValid }) {
  return (
    <div className="input-group">
      <input type="text" />
      {isValid && (
        <CheckIcon className="w-4 h-4 text-green-500" />
      )}
    </div>
  );
}
```

### Checkbox Alternative
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function CustomCheckbox({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`checkbox ${checked ? 'checked' : ''}`}
    >
      {checked && <CheckIcon className="w-3 h-3 text-white" />}
    </button>
  );
}
```

### Status Indicators
```tsx
import { CheckIcon } from './components/icons/CheckIcon';

function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} className="task-item">
          <span className="task-status">
            {task.completed && (
              <CheckIcon className="w-4 h-4 text-green-600" />
            )}
          </span>
          {task.title}
        </li>
      ))}
    </ul>
  );
}
```
