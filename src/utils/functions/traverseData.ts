
export const traverseData = (data: any, varArray: string[]): any => {
    if (data) {
        const dataKeys = Object.keys(data);
        const key = varArray[0];
        if (varArray.length > 1) {
            if (typeof data === 'object' && dataKeys.includes(key)) {
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
            if (typeof data === 'object' && dataKeys.includes(key)) {
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

export const traverseData2 = (data: any, varArray: string[]): any=> {
	
	var output = traverseData(data, varArray);
	
// 	console.log("raw output", output,! output===null);
	if (output!=null){
		if (output.length > 0 && Array.isArray(output[0])){
			console.log("checking-->",output[0],Array.isArray(output[0]))
			if (Array.isArray(output[0])) {
				console.log("flattening",output)
				output=output.flat(3)
			
			}
		
	// 		var new_output = [];
	// 		
	// 		if (Array.isArray(output[0])) {
	// 			console.log(output[0])
		
	// 		  output[0].forEach((a) => {
	// 		  	if (Array.isArray(a)){
	// 				a.forEach((i) => {
	// 				  new_output.push(i);
	// 				});
	// 			} else {
	// 				new_output.push(a)
	// 			}
	// 		  });
	// 		  output = new_output;
	// 		}
		
		}
	}
	return output ?? null
	
	
}