# Presentation Components

"Presentation" components are where the user sees the results of the queries they have made. Our presentation components

- Intro
- Table
- Scatter Graph
- Bar Graph
- Pie Graph
- Pivot Table
- Map
- Global Search
- Network Graph
- Video Background

Presentation components subscribe to the Redux store. When the Redux store updates, the components the presentation components then generate a new call to the API.

This way, when a user starts using a filter component, their actions in the filter component update the Redux store, which then triggers an update of the presentation component, allowing the user to immediately see the results of their choices. All presentation components subscribe to the Redux store.

- ![Intro](./Intro/modules.md)
- ![Table](./Tables/modules.md)
- ![Scatter Graph](./Scatter/modules.md)
- ![Bar Graph](./BarGraph/modules.md)
- ![Pie Graph](./PieGraph/modules.md)
- ![Pivot Table](./PivotTables/modules.md)
- ![Map](./Map/modules.md)
- ![GlobalSearch](./GlobalSearch/modules.md)
- ![Network Graph](./NetworkGraph/modules.md)
- ![VideoBackground](./VideoBackground/modules.md)
