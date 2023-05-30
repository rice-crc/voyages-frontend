import { useState, useEffect, useMemo, ChangeEvent, useCallback } from "react";
import Plot from "react-plotly.js";
import VOYAGE_SCATTER_OPTIONS from "../../../utils/VOYAGE_SCATTER_OPTIONS.json";
import { Grid, SelectChangeEvent } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useGetOptionsQuery } from "../../../fetchAPI/fetchApiService";
import SelectDropDownXY from "./SelectDropdownXY";
import AggregationSumAverage from "./AggregationSumAverage";
import { fetchVoyageGroupby } from "../../../fetchAPI/fetchVoyageGroupby";
import {
  PlotXYVar,
  VoyagesOptionProps,
  Options,
  VoyageOptionsValue,
} from "../../../share/InterfaceTypes";
import { fetchOptionsFlat } from "../../../fetchAPI/fetchOptionsFlat";

function Scatter() {
  const dispatch: AppDispatch = useDispatch();
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const {
    data: options_flat,
    isLoading,
    isSuccess,
  } = useGetOptionsQuery(datas);
  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
  const [showAlert, setAlert] = useState(false);
  const [selectedX, setSelectedX] = useState<PlotXYVar[]>(() => {
    const storedSelectedX = localStorage.getItem("selectedX");
    return storedSelectedX ? JSON.parse(storedSelectedX) : [];
  });
  const [selectedY, setSelectedY] = useState<PlotXYVar[]>(() => {
    const storedSelectedY = localStorage.getItem("selectedY");
    return storedSelectedY ? JSON.parse(storedSelectedY) : [];
  });
  const [plotX, setPlotX] = useState<number[]>(() => {
    const storedPlotX = localStorage.getItem("plotX");
    return storedPlotX ? JSON.parse(storedPlotX) : [];
  });
  const [plotY, setPlotY] = useState<number[]>(() => {
    const storedPlotY = localStorage.getItem("plotY");
    return storedPlotY ? JSON.parse(storedPlotY) : [];
  });
  const [voyageOption, setVoyageOption] = useState<VoyagesOptionProps>(() => {
    const storedVoyageOption = localStorage.getItem("voyageOption");
    return storedVoyageOption
      ? JSON.parse(storedVoyageOption)
      : {
          x_vars: VOYAGE_SCATTER_OPTIONS.x_vars[0].var_name,
          y_vars: VOYAGE_SCATTER_OPTIONS.y_vars[0].var_name,
        };
  });

  const [aggregation, setAggregation] = useState<string>(() => {
    const storedAggregation = localStorage.getItem("aggregation");
    return storedAggregation ? JSON.parse(storedAggregation) : "sum";
  });

  const VoyageScatterOptions = () => {
    Object.entries(VOYAGE_SCATTER_OPTIONS).forEach(
      ([key, value]: [string, PlotXYVar[]]) => {
        if (key === "x_vars") {
          setSelectedX(value);
        }
        if (key === "y_vars") {
          setSelectedY(value);
        }
      }
    );
  };

  useEffect(() => {
    VoyageScatterOptions();
    fetchOptionsFlat(
      isSuccess,
      (options_flat as Options) || undefined,
      setOptionsFlat
    );
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append("groupby_by", voyageOption.x_vars);
      newFormData.append("groupby_cols", voyageOption.y_vars);
      newFormData.append("agg_fn", aggregation);
      newFormData.append("cachename", "voyage_xyscatter");

      try {
        const response = await dispatch(
          fetchVoyageGroupby(newFormData)
        ).unwrap();
        if (response) {
          const keys = Object.keys(response);
          setVoyageOption({
            x_vars: keys[0] || "",
            y_vars: keys[1] || "",
          });
          localStorage.setItem(
            "voyageOption",
            JSON.stringify({
              x_vars: keys[0] || "",
              y_vars: keys[1] || "",
            })
          );
          if (keys[0]) {
            localStorage.setItem("plotX", JSON.stringify(response[keys[0]]));
            setPlotX(response[keys[0]]);
          }
          if (keys[1]) {
            localStorage.setItem("plotY", JSON.stringify(response[keys[1]]));
            setPlotY(response[keys[1]]);
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [
    dispatch,
    options_flat,
    voyageOption.x_vars,
    voyageOption.y_vars,
    aggregation,
  ]);

  const handleChangeAggregation = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>, name: string) => {
      setAggregation(event.target.value);
    },
    [aggregation]
  );

  const handleChangeVoyageOption = useCallback(
    (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setVoyageOption((prevVoyageOption) => ({
        ...prevVoyageOption,
        [name]: value,
      }));
    },
    [selectedX, selectedY, voyageOption]
  );

  useEffect(() => {
    localStorage.setItem("selectedX", JSON.stringify(selectedX));
  }, [selectedX]);

  useEffect(() => {
    localStorage.setItem("selectedY", JSON.stringify(selectedY));
  }, [selectedY]);

  useEffect(() => {
    localStorage.setItem("plotX", JSON.stringify(plotX));
  }, [plotX]);

  useEffect(() => {
    localStorage.setItem("plotY", JSON.stringify(plotY));
  }, [plotY]);
  useEffect(() => {
    localStorage.setItem("plotY", JSON.stringify(plotY));
  }, [plotY]);

  useEffect(() => {
    localStorage.setItem("aggregation", JSON.stringify(aggregation));
  }, [aggregation]);

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <SelectDropDownXY
        selectedX={selectedX}
        selectedY={selectedY}
        voyageOption={voyageOption}
        handleChange={handleChangeVoyageOption}
        width={width}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
        showAlert={showAlert}
        voyageOption={voyageOption}
        optionFlat={optionFlat}
      />

      <div>
        <Grid>
          <Plot
            data={[
              {
                x: plotX,
                y: plotY,
                type: "scatter",
                mode: "lines",
                marker: { color: "red" },
                line: { shape: "spline" },
              },
              { type: "bar" },
            ]}
            layout={{
              width: width * 0.8,
              title: `The ${aggregation} of ${
                optionFlat[voyageOption.x_vars]?.label || ""
              } vs ${
                optionFlat[voyageOption.y_vars]?.label || ""
              } Scatter Graph`,
              xaxis: {
                title: {
                  text: optionFlat[voyageOption.x_vars]?.label || "",
                },
                fixedrange: true,
              },
              yaxis: {
                title: {
                  text: optionFlat[voyageOption.y_vars]?.label || "",
                },
                fixedrange: true,
              },
            }}
            config={{ responsive: true }}
          />
        </Grid>
      </div>
    </div>
  );
}

export default Scatter;
