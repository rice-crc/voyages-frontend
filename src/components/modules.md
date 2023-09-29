# Components

## Introduction

Welcome to the Slave Voyages Application Components README. This document provides an overview of the various components that make up the Slave Voyages Application, which is designed to provide historical information about the transatlantic slave trade. This documentation will help developers understand the architecture, functionality, and usage of each component in the application.

In our application, we have organized components into two main categories:

## Factory model

Our components are built on the factory model in order to enable editors to change things like the structure of menus, tables, dropdown selectors, etc. The inputs into these components are laid out in json flatfiles in utils/flatfiles.

All components, in one way or another, interact with the Redux store. This allows, for instance, filter components (like the rangeslider) to update the search filter, which triggers the presentation components (like the table) to make a new query and show updated results. Below is a representation of this communication flow.

![filtercomponentfactory](../documentation_assets/filtercomponentfactory.svg)

## Special cases

The following components have some very specific behavior. We describe how the different typescript files in each of those subfolders work on the following documentation pages:

- ![Cascading Menu Factories](./cascading/package.md)
- ![Filter Component Factories](./FilterComponents/package.md)
- ![Presentation Components](./PresentationComponents/package.md)

## Blog Components

Blog Components play a crucial role in presenting historical narratives, insights, and educational resources to our users. These components are designed to deliver engaging and informative content related to the transatlantic slave trade. Whether it's articles, images, or multimedia, Blog Components are responsible for the presentation and navigation of this valuable information.

## Function Components

Function Components form the backbone of our application's core functionality. These components handle data processing, user interactions, and communication with our database. Function Components are designed to be modular and efficient, ensuring that the application operates smoothly and reliably. They encompass features such as user authentication, search functionality, and data retrieval.

By categorizing our components into Blog Components and Function Components, we aim to provide developers with a clear understanding of the distinct roles each component plays in our application's architecture. This organization facilitates easier development, testing, and maintenance, allowing us to continuously improve the Slave Voyages Application and deliver a seamless user experience.

Thank you for your interest in our application's components. If you have any questions or require further assistance, please don't hesitate to reach out to our development team.
