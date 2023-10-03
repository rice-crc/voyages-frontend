# Blog Components

"Blog" components are where the user sees the results of the queries they have made. Our blog components

- Author Info and Author post
- Institutions

Blog components subscribe to the Redux store. When the Redux store updates, the components the blog components then generate a new call to the API.

This way, when a user starts using a filter component, their actions in the filter component update the Redux store, which then triggers an update of the presentation component, allowing the user to immediately see the results of their choices. All blog components subscribe to the Redux store.
