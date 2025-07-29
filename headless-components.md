# Wix Headless Components

Wix Headless Components are a collection of React components that provide common Wix sites functionality with an easy integration and complete control over the UX and design of the site. The components encapuslate business logic and state management that is required to implement common features of an ecommerce store, a services bookings website, member management and much more.

Using Wix Headless Components, you can jumpstart your website development with pre-made and best pratices integrated into reuseable components, allowing you to focus on the design and user experience of your project. The components take care of handling client side state management and UI oriented logic from managing lists with filters, to pre-checkout calculation and more.

## What are Headless Components?

Headless components are a pattern for building components that are un-opionated about the exact UI and design, but provide encapulated functionality that is common in many projects. This pattern is great for component libraries that are used as building blocks for building your own project's design system. Popular examples of libraries that use this pattern are [Headless UI](https://headlessui.com/), [Radix UI Primitives](https://www.radix-ui.com/primitives) and [Base UI](https://base-ui.com/).

In the context of Wix, our Headless Components focus on providing a consistent and easy to use API for building React projects on top of Wix's platform. Many Wix websites and apps share the same core functionality, from building checkout flows, to managing member profiles and more. The headless components handle all the logic and state management for these features, providing the user of the component with the data and actions they need to build their own UI.

### Headless Components Structure

At their core, the Wix Headless Components are just React components that use the Wix SDK to fetch data and perform actions. They can be used in any React project, from websites with React DOM to mobile apps with React Native.

### Render Prop Pattern

The Wix Headless Components follow the render prop pattern, allowing the user to fully control the rendering logic of the component. The render functions are injected with the data and actions needed to build the UI, and the render function is responsible to render the React elements with the data and actions.

```tsx
<Product.Name>{({ name }) => <div>{name}</div>}</Product.Name>
```

### Composition and Root Components

The headless components are built as atomic building blocks that are composed together to form a complete feature. Through React Context and internal state management, the components are able to communicate with each other and display the same consistent data. Headless components are designed to be used in a tree structure, with the root component being the one that initializes the state management and provides the data and actions to the child components.

```tsx
<ProductList.Root productsListConfig={productsListConfig}>
  {/* Child components */}
  <ProductList.EmptyState>
    <div>No products found</div>
  </ProductList.EmptyState>
</ProductList.Root>
```

### Data Fetching (Server Side / Client Side) using Loaders

An important aspect that the headless components handle is data fetching from Wix APIs and managing the data in client side state. With the Wix Platform, most of the website or app content is managed in the Wix Platform, whether from Wix Apps or your own CMS collections, and is exposed through REST APIs and through the Wix SDK.

In order to support Server Side Rendering or Static Site Generation and even some Single Page Applications that require initial data fetching to happen before the rendering of the client side components, the Headless Components come with `Loader` functions that load the initial data required by the Headless Component which can be called before the render (e.g on the server) and then passed down to the `Root` components of the headless components as props. Once passed to the `Root` components as props, the data and re-fetching it is managed by the headless component.

```astro
---
import { loadProductsListConfig } from '@wix/stores/services';
import { MyReactComponent } from './MyReactComponent';

const productsListConfig = await loadProductsListConfig(/* ... */);
---

<MyReactComponent productsListConfig={productsListConfig}>
  {/* ... */}
</MyReactComponent>
```

```tsx
import { ProductsListConfig } from '@wix/stores/services';

export function MyReactComponent(props: {
  productsListConfig: ProductsListConfig;
}) {
  return (
    <ProductList.Root productsListConfig={props.productsListConfig}>
      {/* ProductList components here */}
    </ProductList.Root>
  );
}
```

### Cross Component Dependencies

Some headless components may depend on other headless components to work correctly. This is common when some components need to fetch data from other components, or when a component needs to update the state of another component. This dependency between components is created through React Context and the `Root` component of the headless component. Nesting the `Root` component of a headless component inside another `Root` component of a headless component creates a dependency between the two components.

An example of such a scenario is the `Product` headless component and the `ProductVariantSelector` component. The `ProductVariantSelector` allows choosing a variant of a product and it is bound to the product of the `Product.Root` component that it is nested under. In this way, the `Product` headless component can be used in scenarios where no variant selection is required, but it can be extended to support variant selection by nesting the `ProductVariantSelector` component inside the `Product.Root` component.

```tsx
<Product.Root>
  {/* Use Product.Name, Product.Price, Product.Image, etc. */}
  <ProductVariantSelector.Root>
    {/* You can mix Product and ProductVariantSelector components together */}
  </ProductVariantSelector.Root>
</Product.Root>
```

## Usage

To use the headless components, you need to import the component from the relevant Wix SDK package, e.g `@wix/stores/components`, `@wix/ecom/components` etc.

```tsx
import { ProductList } from '@wix/stores/components';
```
