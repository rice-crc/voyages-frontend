# Filter Component Factories

Filter component factories generate ui elements that update the Redux store, which in turn is used by all the presentation components to show the search results in their own way.

Which filter component factory is generated is determined by the _filter component factory controller_ WHERE DOES THIS HAPPEN?. We currently have 4 different filter component types, which are triggered by different variable data types:

- AutoComplete for text fields
- GeoTreeSelect for places
- RangeSlider for numeric fields
- AutoComplete Search blog for text fields

The properties that each filter component factory receives are

    1. endpoint
    1. variable name
    1. label
    1. filter object state
    1. anything else?

The filter component that has been generated updates the Redux store to maintain the active variable filters that the user has selected.

## Autocomplete

`Autocomplete` is a special case. It remains in constant contact with its own, special sub-endpoint on the API in order to assist the user in quickly narrowing down their search. RangeSlider and TreeSelect only hit the API once, in order to populate the available choices.

When these filter components are interacted with by the user, the selected values are pushed to the Redux store as k/v pairs, with the variable name being the key and the selected values being the values.

## GeoTreeSelect

`GeoTreeSelect` is also a special case, but we are considering generalizing this behavior to the other two search filter components. When GeoTreeSelect asks the server for the tree, it also passes the filter object, meaning that as other filters are applied, the number of displayed options shrinks down accordingly.

## RangeSlider

The `RangeSlider` is currently a special case, but we are contemplating extending this functionality to the other two search filter components as well. When the RangeSlider requests data from the server, it includes the filter object. This approach ensures that as additional filters are applied, the available options are dynamically adjusted to match the refined criteria.

## Autocompleted Search Blog

`AutoCompletedSearhBlog` is a React component designed to create a dropdown menu that allows users to select search options related to blog posts. This component provides a button that, when clicked, opens a menu containing a list of search options. Users can select an option from the menu to perform a specific search action. This README documentation explains the purpose of the component and provides guidance on how to use it within your React application.

- ![Autocomplete](./Autocomplete/modules.md)
- ![AutoCompletedSearhBlog](./AutoCompletedSearhBlog/modules.md)
- ![GeoTreeSelect](./GeoTreeSelect/modules.md)
- ![RangeSlider](./RangeSlider/modules.md)
