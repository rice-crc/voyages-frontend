import React, { useEffect, useRef, useState } from "react";
import { NestedSelect } from "multi-nested-select";

interface Country {
  name: string;
  code: string;
  disabled?: boolean;
  zones: Zone[];
  continent: string;
  provinceKey: string;
}

interface Zone {
  code: string;
  disabled?: boolean;
  name: string;
}

const AutocompleteBox: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [response, setResponse] = useState<Country[]>([]);
  const data: Country[] = [
    {
      name: "Afghanistan",
      code: "AF",
      disabled: true,
      zones: [],
      continent: "Asia",
      provinceKey: "REGION"
    },
    // Rest of the data...
  ];

  const callbackFunction = (value: Country[]) => {
    console.log(value);
    setResponse(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // alert("saving fat");
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
      <div className="center-component" ref={ref}>
        <NestedSelect
          enableButton={true}
          state={true}
          width={450}
          height={200}
          leading={true}
          // chip={true}
          // limit={5}
          placeholderCtx={true}
          trailing={true}
          trailingIcon={true}
          inputClass="myCustom_text"
          continent={false}
          selectAllOption={true}
          dropDownClass="myCustom_dropbox"
          selectedValue={data}
          onViewmore={(v:any) => alert("viewed")}
          onChipDelete={(v:any) => alert("deleted")}
          onChange={(v:any) => console.log("okay", v)}
          callback={(val:any) => callbackFunction(val)}
        />
      </div>
)}

export default AutocompleteBox