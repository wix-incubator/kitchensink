# API Documentation

## Basic Rule of Thumbs
Inspire by the [Radix UI](https://www.radix-ui.com/primitives/docs/components/accordion) and [Shadcn UI](https://ui.shadcn.com/docs/components/accordion) components, each component is built with composable primitives, similar to Radix UI architecture.

Headless components should include no styling and preferably no dom elements, they should be used to compose the UI of the ecommerce app.
The actual implementation of the UI should be in a components/ui/ folder, as shadcn/ui components.

Each entity component is of few types:

Say that our entity is `A`
- `A.Root` - receives the entity data and sets a context for the entity, allowing child components to access the entity data
  - `A.Raw` - receives the entity as a render prop, allowing the child components to access the entity data, **This should not be used unless you need to render a custom component that does not support the entity data**, or in other words, should not be used in any component in this repo!

- `A.[name]` - A component which renders dom elements, and is used to render the entity data. It can also be used in 3 different ways:
  - `<A.[name] />` - renders the entity data as a dom element with default tags, and default attributes, can be customized with properties and `className` attributes.
  - `<A.[name] asChild><[primitive] /></A.[name]>` - indicate it should not render a default DOM element, instead cloning the part's child and passing it the props and behavior required to make it functional.
  - `<A.[name] asChild><Component /></A.[name]>` - indicate it should not render a default DOM element, but render a custom component which accepts the entity data as a prop. The component must use react's `forwardRef` to pass the ref to the child, allowing the parent to control the child's behavior.

  ```tsx
  // plain
  <Product.Name className="text-4xl font-bold">

  // asChild with primitive
  <Product.Name asChild>
    <h1 className="text-4xl font-bold">
  </Product.Name>

  // asChild use with react component (mind the ref)
  <Product.Name asChild>
    {React.forwardRef(({name, ...props}, ref) => (
      <h1 ref={ref} {...props} className="text-4xl font-bold">
        {name}
      </h1>
    ))}
  </Product.Name>
  ```
  
  **Note:**radix-ui has a built in Component for it, called [Slot](https://www.radix-ui.com/primitives/docs/utilities/slot)


- `A.ListSection` - renders a list of entities, considering that the types of the entities is different from the current component, it would always include 3 levels of components:
  - `A.ListSection` - list container, not rendered if the list is empty
  - `A.ListSection.Bs` - Container for the list of `B` entities.
   - in many cases it would just be a plain div but we would like to keep it as a practice to allow handling container level behavior, for example, infinite scroll, pagination, etc. It can also contain an `emptyState` attribute, which will be rendered if the list is empty (null by default).
  - `A.ListSection.BRepeater` - The `B` entity component itself, which in reality is just rendering a `B.Root` component with the `B` entity data.

  For example, if we have a `Product` entity, and we want to render a list of `Product.VariantOptions`, we would do the following:
  ```tsx
  <Product.Modifiers>
    <Product.ModifierOptions>
      <Product.ModifierOptionRepeater {/* array of<Option.Root option={option} /> */} >
        <Option.Name/>
        <Option.Choices>
          <Option.ChoiceRepeater>
            <Choice.Text/>
          </Option.ChoiceRepeater>
        </Option.Choices>
      </Product.ModifierOptionRepeater>
    </Product.ModifierOptions>
  </Product.Modifiers>
  ```
  This is a transition from the render tree of one entity to the other allowing reuse of entities with similar structure in different contexts. (for example - modifiers and options, have similar UI, but different data)

Defining the behaviour of the component is passed as a prop to the highet level possible, for example, product increment and decrement will receive the `steps` (how many steps to increment or decrement) from Quantity.Root, and will use it to increment and decrement the quantity.

State of the entity will be provided to the child component as a data attribute, allowing setting a style based on the state. For example, `[disabled]` will be set to `true` if add to cart is not possible, and `[data-selected]` will be set to `true` if the option is selected.
You should not rely on isSelected, isDisabled, etc. properties.


## Product
See the [Product](./PRODUCT_INTERFACE.md) API

## Cart
See the [Cart](./CART_INTERFACE.md) API

## Product List
See the [Product List](./PRODUCT_LIST_INTERFACE.md) API

## Platform
See the [Platform](./PLATFORM_INTERFACE.md) API

## General

### Notes
- The main root element should support getting the routes of the sites, so when redirecting to checkout, it will use the correct route to return, including other verticals.

### Open issues:
- Should The component also check if the entity is still loading, and if so, render a loading state (skeleton), by doing so, skeletons will be rendered natively by elements and would be pefectly aligned with the loaded state.

  for example:
  ```tsx
  const Product = {
    Name: ({asChild, skeleton, ...props}) => {
      const { product, isLoading } = useProductContext();
      // this is simplified should obviously consider asChild, and use forwardRef
      return isLoading ? {skeleton} : <h1>{product.name}</h1>;
    }
  }
  ```
- Do we need a ProductVariant component? or is everying we need is already covered by the Product.Root (it is implicit)?

- Texts - for example "showing {count} products" how do we handle it (these would require probably label props and render props)? is filtered (we can use Filter.Filtered component)?

- Actions - for example, add to cart, buy now, checkout, etc.
  - Currently are defined as complete component with UI and label, maybe we should use a trigger pattern (no dom so no need for asChild):
  ```tsx
  // current
  <Cart.Action.AddToCart label="Add to Cart">
  // alternative
  <Cart.Action.AddToCart loading={<button>Loading...</button>}>
    <button>Add to Cart</button>
  </Cart.Action.AddToCart>
  ```
  The current is more oppinionated, and also involves both dom and headless logic, which is not ideal.
  The alternative is more flexible but requires more code
  
- There is no Button in radix-ui, it is shadcn/ui only, which comps should not be implemented as headless, but only in components/ui/ folder.
