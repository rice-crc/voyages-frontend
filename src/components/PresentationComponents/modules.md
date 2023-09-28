# Presentation Components

"Presentation" components are where the user sees the results of the queries they have made. Our presentation components

- Intro
- Table
- Scatter Graph
- Bar Graph
- Pie Graph
- Pivot Table
- Map

Presentation components subscribe to the Redux store. When the Redux store updates, the components the presentation components then generate a new call to the API.

This way, when a user starts using a filter component, their actions in the filter component update the Redux store, which then triggers an update of the presentation component, allowing the user to immediately see the results of their choices. All presentation components subscribe to the Redux store.
