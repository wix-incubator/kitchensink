# User Icon

## Overview

The UserIcon component is a simple SVG icon component that renders a user/person icon. It follows the standard icon component pattern with customizable className prop for styling and accessibility features. The icon uses stroke-based design and inherits color from the current text color.

This component is part of the icon library and provides a consistent user interface element for representing users, profiles, or account-related functionality throughout the application.

## Exports

### `UserIcon`
**Type**: `React.FC<{ className?: string }>`

SVG icon component that renders a user/person icon with optional CSS class customization. Uses stroke-based design and inherits current text color.

## Usage Examples

### Basic Icon Usage
```tsx
import { UserIcon } from './components/icons/UserIcon';

function UserProfile() {
  return (
    <div className="user-profile">
      <UserIcon className="w-6 h-6" />
      <span>John Doe</span>
    </div>
  );
}
```

### With Custom Styling
```tsx
import { UserIcon } from './components/icons/UserIcon';

function ProfileButton() {
  return (
    <button className="profile-btn">
      <UserIcon className="w-5 h-5 text-blue-600" />
      Profile
    </button>
  );
}
```

### In Navigation Menu
```tsx
import { UserIcon } from './components/icons/UserIcon';

function Navigation() {
  return (
    <nav>
      <a href="/profile" className="nav-link">
        <UserIcon className="w-4 h-4 mr-2" />
        My Account
      </a>
    </nav>
  );
}
```

### Different Sizes
```tsx
import { UserIcon } from './components/icons/UserIcon';

function IconSizes() {
  return (
    <div>
      <UserIcon className="w-4 h-4" /> {/* Small */}
      <UserIcon className="w-6 h-6" /> {/* Medium */}
      <UserIcon className="w-8 h-8" /> {/* Large */}
    </div>
  );
}
```
