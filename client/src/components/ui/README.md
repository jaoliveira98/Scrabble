# UI Components

This directory contains reusable UI components that provide consistent styling and behavior across the application.

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "../ui";

// Basic usage
<Button onClick={handleClick}>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>
<Button variant="text">Text Link</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With custom styling
<Button className="w-full" disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

**Props:**

- `variant`: "primary" | "secondary" | "success" | "warning" | "danger" | "text"
- `size`: "sm" | "md" | "lg"
- All standard button HTML attributes

### Title

A flexible heading component with semantic levels and styling variants.

```tsx
import { Title } from "../ui";

// Different heading levels
<Title level={1}>Main Title</Title>
<Title level={2}>Section Title</Title>
<Title level={3}>Subsection</Title>

// With variants
<Title variant="default">Default Title</Title>
<Title variant="muted">Muted Title</Title>

// With custom styling
<Title level={2} className="text-center">
  Centered Title
</Title>
```

**Props:**

- `level`: 1 | 2 | 3 | 4 | 5 | 6 (default: 2)
- `variant`: "default" | "muted"
- All standard heading HTML attributes

### Paragraph

A text component with consistent typography and color variants.

```tsx
import { Paragraph } from "../ui";

// Basic usage
<Paragraph>This is a paragraph</Paragraph>

// With variants
<Paragraph variant="default">Default text</Paragraph>
<Paragraph variant="muted">Muted text</Paragraph>
<Paragraph variant="error">Error message</Paragraph>
<Paragraph variant="success">Success message</Paragraph>

// With sizes
<Paragraph size="sm">Small text</Paragraph>
<Paragraph size="md">Medium text (default)</Paragraph>
<Paragraph size="lg">Large text</Paragraph>
```

**Props:**

- `variant`: "default" | "muted" | "error" | "success"
- `size`: "sm" | "md" | "lg"
- All standard paragraph HTML attributes

### Status

A status indicator component for showing different states.

```tsx
import { Status } from "../ui";

// Different status variants
<Status variant="active">Active</Status>
<Status variant="inactive">Inactive</Status>
<Status variant="success">Success</Status>
<Status variant="warning">Warning</Status>
<Status variant="error">Error</Status>

// With custom content
<Status variant="active">
  <div className="w-2 h-2 bg-green-500 rounded-full" />
  Online
</Status>
```

**Props:**

- `variant`: "active" | "inactive" | "success" | "warning" | "error"
- All standard div HTML attributes

### Box

A container component with different styling variants for cards and layouts.

```tsx
import { Box } from "../ui";

// Different box variants
<Box variant="default">Default box</Box>
<Box variant="card">Card container</Box>
<Box variant="card-large">Large card</Box>
<Box variant="glass">Glass effect</Box>
<Box variant="glass-strong">Strong glass effect</Box>

// With custom content
<Box variant="card" className="p-8">
  <Title level={2}>Card Title</Title>
  <Paragraph>Card content goes here</Paragraph>
</Box>
```

**Props:**

- `variant`: "default" | "card" | "card-large" | "glass" | "glass-strong"
- All standard div HTML attributes

## Usage Examples

### Complete Card Example

```tsx
import { Box, Title, Paragraph, Button, Status } from "../ui";

function PlayerCard({ player, isActive, onAction }) {
  return (
    <Box variant="card">
      <div className="flex items-center justify-between mb-4">
        <Title level={3}>{player.name}</Title>
        <Status variant={isActive ? "active" : "inactive"}>
          {isActive ? "Your Turn" : "Waiting"}
        </Status>
      </div>

      <Paragraph variant="muted" className="mb-4">
        Score: {player.score} points
      </Paragraph>

      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={onAction}>
          Action
        </Button>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
      </div>
    </Box>
  );
}
```

### Form Example

```tsx
import { Box, Title, Paragraph, Button } from "../ui";

function LoginForm() {
  return (
    <Box variant="card-large">
      <Title level={2} className="text-center mb-6">
        Welcome Back
      </Title>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            type="text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            type="password"
          />
        </div>

        <Button variant="primary" size="lg" className="w-full">
          Sign In
        </Button>
      </form>
    </Box>
  );
}
```

## Benefits

1. **Consistency**: All components follow the same design system
2. **Maintainability**: Changes to styling can be made in one place
3. **Reusability**: Components can be used throughout the application
4. **Type Safety**: Full TypeScript support with proper prop types
5. **Accessibility**: Components include proper semantic HTML and ARIA attributes
6. **Customization**: Easy to extend with custom classes and props

## Design System

The components are built on a consistent design system:

- **Colors**: Blue (primary), Green (success), Amber (warning), Rose (danger), Slate (neutral)
- **Spacing**: Consistent padding and margins using Tailwind's spacing scale
- **Typography**: Inter font family with consistent font weights and sizes
- **Shadows**: Subtle shadows for depth and hierarchy
- **Transitions**: Smooth color transitions on hover and focus states
- **Border Radius**: Consistent rounded corners (lg for buttons, xl for cards)
