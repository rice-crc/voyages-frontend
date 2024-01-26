# Fetch

The Fetch folder contains modules and utilities related to making HTTP requests using the Fetch API. The Fetch API provides a modern and flexible way to interact with server resources asynchronously.

## Installation

To use the Fetch API folder in your application, follow these steps:

1. Copy the Fetch API folder into your project directory.

2. Install the required dependencies. The Fetch API folder might depend on libraries such as axios or others. Make sure to install these dependencies based on the specific requirements of the Fetch API folder.

3. Import the necessary modules and functions into your application files where you need to make API requests.

## Usage

Here is an example of how to use the Fetch API folder to make an API request:

```jsx
Example:

import { fetchRangeSliderData } from '@/fetchAPI/fetchAggregationsSlider';

  useEffect(() => {

     const dataSend: { [key: string]: string[] } = {
        aggregate_fields: [varName],
      };

    dispatch(fetchRangeSliderData(dataSend))
      .unwrap()
      .then((response: any) => {
        if (response) {
          const initialValue: number[] = [
            response[varName].min,
            response[varName].max,
          ];
          dispatch(setKeyValueName(varName));
          dispatch(
            setRangeValue({
              ...rangeValue,
              [varName]: initialValue as number[],
            })
          );
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, [dispatch, varName]);

```

In this example, we import the fetchRangeSliderData function from fetchRangeSliderData.ts and We then use the fetchRangeSliderData function to make a POST request to the specified user endpoint and handle the response or error accordingly.
