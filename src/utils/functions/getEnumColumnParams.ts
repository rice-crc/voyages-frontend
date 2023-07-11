export const getEnumColumnParams = (enumMap: Record<string, string>) => {
  return {
    cellRenderer: (params: any) => {
      if (!params.data) return ';
      const { value } = params;
      return enumMap[value];
    },
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true,
      filterOptions: [
        'empty',
        ...Object.keys(enumMap).map((key) => {
          return {
            displayKey: key,
            displayName: enumMap[key],
            test: function (filterValue: any, cellValue: any) {
              return cellValue === key;
            },
            hideFilterInput: true,
          };
        }),
      ],
      suppressAndOrCondition: true,
    },
  };
};
