
export const traverseData = (data: any, varArray: string[]): any => {
    // console.log("traverseData--", data)
    if (data) {
        const dataKeys = Object.keys(data);
        const key = varArray[0];
        if (varArray.length > 1) {
            if (typeof data === "object" && dataKeys.includes(key)) {
                const value = data[key];
                data = traverseData(value, varArray.slice(1));
            } else if (Array.isArray(data)) {
                const results: any[] = [];
                data.forEach((element) => {
                    const result = traverseData(element, varArray);
                    results.push(result);
                });
                return results;
            }
        } else {
            if (typeof data === "object" && dataKeys.includes(key)) {
                return data[key];
            } else if (Array.isArray(data)) {
                const results: any[] = [];
                data.forEach((element) => {
                    const value = traverseData(element, varArray);
                    results.push(value);
                });
                return results;
            } else {
                return null;
            }
        }
    }
    return data ?? null
};
