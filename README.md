# CRC-Voyages-React-App

This is a sample React application for the CRC Voyages exercise. The application is built using Vite and React, TypeScript, Redux-toolkit, and Material-UI.

[![](https://img.shields.io/badge/npm-v8.12.2-brightgreen)](https://shields.io) [![](https://img.shields.io/badge/node-v16.15.1-orange)](https://shields.io)

Website Link: [OCI](https://voyages-staging.crc.rice.edu/)

## The branch we except to deploy is: **production**

---

## Installation

To run this application locally, you'll need to have Node.js installed on your machine. After cloning the repository, navigate to the project directory and install the dependencies
by running: `npm install`

**Deploy Problem Solution && Wordflow**
**Quick Way with Makefile**

1. Make sure you are in the `main` branch

Since we found `package-lock.json` will casuse `OCI` deployment process error, we summarized a workflow to avoid that:

1. use nvm (Node version management) tool make sure node -version is "correct <same version everybody>"

   1.1: Check your local node version by `node -v` and npm version with `npm -v`

   1.2: Make sure the versions are same as top of this README

2. Delete `node_modules` && `package-lock.json` file
3. npm install
4. Delete `node_modules`
5. npm ci
6. Locally test (run `npm run dev`, if all functions gose well, Prefect!)
7. If funciton on local serve is perfect then push & merge

### How it run on localhost:

**1. Clone the project to local**

```
git clone https://github.com/ThasaneePuttamadilok/voyages-frontend.git
```

**2. Run `npm install`**
It installs all the packages that project need. If install process failed, you clould check as follows:

**React-Route**

```javaScript
npm install --save react-router-dom

```

**Type of React-Route**

```javaScript
npm i -D @types/react@18.0.21 @types/react-dom@18.0.6
```

**To set up Redux Toolkit in your React project**

```javaScript
npm install @reduxjs/toolkit react-redux

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Import your root reducer

const store = configureStore({
  reducer: rootReducer,
  // Add any middleware or enhancers as needed
});

export default store;

```

**Axios**

```javaScript
npm install axios
```

**Type Script**

```javaScript
npm i -D typescript
```

**To generate typeScript**

```javaScript
npx tsc --init
```

**dotenv**

```javaScript
npm i --save-dev @types/node
```

**Material UI**

```javaScript
npm install @mui/material @emotion/react @emotion/styled
```

**3. Authorization**</br>
In the `.env_sample`, you need to set `VITE_API_AUTHTOKEN` and `VITE_API_BASEURL` and change file name to `.env`

```
#Example
VITE_API_AUTHTOKEN = 'Token ABCDEF.... (replace it with your authentication token)'
VITE_API_BASEURL = 'https://voyages.ilove.you.haha..... (replace it with your own url for api call)'
```

**4. Run Application**

```javaScript
npm run dev
```

**5. Run Test Application**

```javaScript
npm run test
```

### Code Structure

```javscript
  │── public/
  │── src/
  │   ├── assets
  │   ├── components
  │   │     ├── canscanding
  │   │     │     ├── CanscandingMenu
  │   │     │     ├── CanscandingMenuMobile
  │   │     │     ├── Dropdown
  │   │     │     ├── MenuListDropdown
  │   │     │     ├── MenuListDropdownPeople.tsx
  │   │     │     ├── NestedMenuItem
  │   │     │     ├── PaperDraggable
  │   │     ├── FunctionComponents
  │   │     │     ├──  ColumnSelectorTable
  │   │     │     │      ├── ButtonDropdownSelectoreColumn
  │   │     │     │      ├── ColumnSelector
  │   │     │     │      ├── DropdownColumn
  │   │     │     │      ├── NestedMenuColumnItem
  │   │     │     ├── AutocompletedTree
  │   │     │     ├── CustomHeader
  │   │     │     ├── TableCharacter
  │   │     │     ├── TableRangeSlider
  │   │     │── header
  │   │     │     ├── drawerMenuBar
  │   │     │     ├── HeaderNavar
  │   │     │     ├── HeaderSearchLogo
  │   │     │── Home
  │   │     │     ├── stylesMenu
  │   │     │     │      ├── StyledBurger
  │   │     │     │      ├── SytledMenu
  │   │     │     ├── BurgerMenu
  │   │     │     ├── Menu
  │   │     │     ├── MenuDropdownProps
  │   │     │── PastPeople
  │   │     │     ├── Enslaved
  │   │     │     │      ├── ColumnSelectorEnslavedTable
  |   │     │     │      │      ├── ButtonDropdownSelectorEnslaved
  │   │     │     │      ├── HeaderEnslaved
  |   │     │     │      │      ├── HeaderEnslavedNavBar
  │   │     │     |      ├── EnslavedPage
  │   │     │     |      ├── EnslavedPageScrolling
  │   │     │     |      ├── EnslavedTable
  │   │     │     ├── Enslaved
  │   │     │     │      ├── ColumnSelectorEnslaversTable
  |   │     │     │      │      ├── ButtonDropdownSelectorEnslavers
  │   │     │     │      ├── HeaderEnslavers
  |   │     │     │      │      ├── HeaderEnslaversNavBar
  │   │     │     |      ├── EnslaversPage
  │   │     │     |      ├── EnslaversPageScrolling
  │   │     │     |      ├── EnslaversTable
  │   │     │     ├── Header
  │   │     │     │      ├── DrawerMenuPeopleBar
  |   │     │     │      ├── NavBarPeople
  │   │     │     ├── PastPeoplePage
  │   │     │── voyagePage
  │   │     │     ├── Results
  │   │     │     │      ├── AggregationSumAverage
  │   │     │     │      ├── AutocompletedBox
  │   │     │     │      ├── BarGraph
  │   │     │     │      ├── PieGraph
  │   │     │     │      ├── RangeSlider
  │   │     │     │      ├── Scatter
  │   │     │     │      ├── SelectDropdown
  │   │     │     │      ├── VoyagesHompPage
  │   │     │     │      ├── VoyagesTable
  │   │     │     ├── ScrollPage
  │   │── fetchAPI
  │   │     ├── pastEnslaved
  │   │     │     ├── fetchEnslavedOptionsList
  │   │     │     ├── fetchPastEnslavedApiService
  │   │     │     ├── fetchPastEnslavedAutoCompleted
  │   │     │     ├── fetchPastEnslavedRangeSliderData
  │   │     │     ├── fetchVoyageSortedEnslavedTableData
  │   │     ├── voyagesApi
  │   │     │     ├── fetchApiService
  │   │     │     ├── fetchAutoCompleted
  │   │     │     ├── fetchOptionsData
  │   │     │     ├── fetchOptionsFlat
  │   │     │     ├── fetchRangeSliderData
  │   │     │     ├── fetchVoyageGroupby
  │   │     │     ├── fetchVoyageOptionsPagination
  │   │     │     ├── fetchVoyagesOptionsApi
  │   │     │     ├── fetchVoyageSortedData
  │   │── pages
  │   │     ├── Enslaved
  │   │     ├── Enslavers
  │   │     ├── Home
  │   │     ├── PastPage
  │   │     ├── VoyagesPage
  │   │── redux
  │   │     ├── getAutoCompleteSlice
  │   │     ├── getColumnSlice
  │   │     ├── getDataSetCollectionSlice
  │   │     ├── getFilterPeopleObjectSlice
  │   │     ├── getFilterSlice
  │   │     ├── getOptionsDataPastPeopleEnslavedSlice
  │   │     ├── getOptionsDataSlice
  │   │     ├── getOptionsFlatObjSlice
  │   │     ├── getPeopleEnlavedDataSetCollectionSlice
  │   │     ├── getScrollEnlavedPageSlice
  │   │     ├── getScrollPageSlice
  │   │     ├── getTableSlice
  │   │     ├── rangeSliderSlice
  │   │     ├── store
  │   │── share
  │   │     ├── AUTH_BASEURL
  │   │     ├── CONST_DATA
  │   │     ├── InterfaceTypes
  │   │     ├── InterfaceTypesTable
  │   │     ├── InterfactTypesDatasetCollection
  │   │     ├── PeopleCollectionType
  │   │── style
  │   │     ├── homepage.scss
  │   │     ├── index.css
  │   │     ├── Nav.scss
  │   │     ├── page-past.scss
  │   │     ├── page.scss
  │   │     ├── Slider.scss
  │   │     ├── table.scss
  │   │── styleMUI
  │   │     ├── index.ts
  │   │     ├── thems.ts
  │   │── tests
  │   │     ├── components
  │   │     ├── flat-files
  │   │     │     ├── BARGRAPH_OPTIONS.test.ts
  │   │     │     ├── PIECHART_OPTIONS.test.ts
  │   │     │     ├── SCATTER_OPTIONS.test.ts
  │   │     │     ├── Table_Cell_Structure.test.ts
  │   │     │     ├── transatlantic_voyages_filter_menu.test.ts
  │   │     ├── redux-test
  │   │     │     ├── getDataSetCollection.test.ts
  │   │     ├── untils-test
  │   │     │     ├── valueGetter.test.ts
  │   │── utils
  │   │     ├── flatfiles
  │   │     │     ├── african_origins_filter_menu.json
  │   │     │     ├── african_origins_table_cell_structure.json
  │   │     │     ├── enslaved_filter_menu.json
  │   │     │     ├── enslaved_options.json
  │   │     │     ├── enslaved_table_cell_structure.json
  │   │     │     ├── enslaver_options.json
  │   │     │     ├── people_page_data.json
  │   │     │     ├── texas_filter_menu.json
  │   │     │     ├── texas_table_cell_structure.json
  │   │     │     ├── transatlantic_voyages_filter_menu_SIMPLE.json
  │   │     │     ├── transatlantic_voyages_filter_menu.json
  │   │     │     ├── varnamechecker.py
  │   │     │     ├── VOYAGE_BARGRAPH_OPTIONS.json
  │   │     │     ├── VOYAGE_COLLECTIONS.json
  │   │     │     ├── VOYAGE_PIECHART_OPTIONS.json
  │   │     │     ├── VOYAGE_SCATTER_OPTIONS.json
  │   │     │     ├── voyage_table_cell_structure__updated21June.json
  │   │     ├── functions
  │   │     │     ├── generateRowsData.ts
  │   │     │     ├── getRowsPerPage.ts
  │   │     │     ├── getColorStyle.ts
  │   │     │     ├── hasValueGetter.ts
  │   │     │     ├── TableCollectionsOptions.ts
  │   │     │     ├── traverseData.ts
  │   │── App.tsx
  │   └── main.tsx
  |── .env
  |── eslintrc
  |── .gitignore
  |── .prettierrc
  |── index.html
  |── package.json
  |── tsconfig.json
  |── vite-env.d.ts
  |── vite.config.js

```

## Features

This application is a simple search engine for the CRC Voyages database. It allows users to search for voyages based on various criteria such as the ship name, captain's name, or embarkation port. The search results are displayed in a table that can be sorted by various columns.

The application also includes a form for adding new voyages to the database, although this functionality is not yet fully implemented.

## Building for Production

```javascipt
npm run build
```

This will create an optimized build in the dist/ directory. The build artifacts can be deployed to a web server or hosting platform.

## Conclusion

This documentation provided an overview and guide to the application built using Vite, React, TypeScript, Redux Toolkit, and Material UI. It covered the project structure, key features

## License

This project is licensed under the MIT License.
