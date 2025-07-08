- [ ] Extract a generic service for file uploads out of photo upload service
- [ ] Run cursor to remove any UI strings from all services (no english messages) as they shouldn't be inside the services.
- [ ] Document for LLMs how member photo upload service and file upload servie work together to compose services and headless compoennts
- [ ] Extract a common pattern for async operations in services and a matching pattern in headless compoentns when exposing async operations (loading state, error state etc)
- [ ] Make sure the server actions factories functions pattern is documented properly in the main doc
- [ ] in file uploads and media, explain in the docs about it and site visitor uploads vs admin uploads, and generally how the media works
- [ ] start using wix image in this project
- [x] find a better solution for withDocsWrapper so it won't be in the pages code
- [ ] Make sure it's explained that headless components should be namespaced under one root component that acts as the composite that the component is describing
- [x] Make sure all headless components that work with lists have the same pattern: <SomeComp>List and <SomeComp>Item.

Components List:

- [ ] Product
  - [x] Product Name
  - [x] Product Description
  - [ ] InfoSections
- [ ] Selected Variant
  - [x] Details (sku, weight)
  - [x] Price
- [x] Media Gallery
  - [x] Viewport
  - [x] Thumbnail (ThumbnailList and ThumbnailItem)
    - ^ These 2 should support both Image and Video
      - [x] Image
      - [ ] Video
      - [ ] Gif
  - [x] Indicator
  - [x] Next
  - [x] Previous
