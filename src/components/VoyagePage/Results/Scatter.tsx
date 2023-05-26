import { useState, useEffect, useMemo, ChangeEvent } from "react";
import Plot from "react-plotly.js";
import VOYAGE_SCATTER_OPTIONS from "../../../utils/VOYAGE_SCATTER_OPTIONS.json";
import { Grid } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useGetOptionsQuery } from "../../../fetchAPI/fetchApiService";
import SelectDropDownXY from "./SelectDropdownXY";
import AggregationSumAverage from "./AggregationSumAverage";
import { fetchVoyageGroupby } from "../../../fetchAPI/fetchVoyageGroupby";
import {
  PlotXYVar,
  voygOption,
  ScatterOptionsXYResponse,
  Options,
  VoyageOptionsValue,
} from "../../../share/InterfaceTypes";

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
  const [selectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [selectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [plotX, setPlotX] = useState<number[]>([]);
  const [plotY, setPlotY] = useState<number[]>([]);
  const [voyageOption, setVoyageOption] = useState<voygOption>({
    x_vars: VOYAGE_SCATTER_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_SCATTER_OPTIONS.y_vars[0].var_name,
  });

  const [aggregation, setAggregation] = useState("sum");
  const [showAlert, setAlert] = useState(false);

  const VoyageScatterOptions = () => {
    Object.entries(VOYAGE_SCATTER_OPTIONS).forEach(
      ([key, value]: [string, PlotXYVar[]], index: number) => {
        if (key === "x_vars") {
          setSelectedX(value);
        }
        if (key === "y_vars") {
          setSelectedY(value);
        }
      }
    );
  };

  const OptionsFlat = () => {
    if (isSuccess && options_flat) {
      const options: Options = {};
      Object.entries(options_flat).forEach(
        ([key, value]: [string, VoyageOptionsValue]) => {
          options[key] = value;
        }
      );
      setOptionsFlat(options);
    }
  };

  useEffect(() => {
    VoyageScatterOptions();
    OptionsFlat();
    const formData: FormData = new FormData();
    formData.append("groupby_by", voyageOption.x_vars);
    formData.append("groupby_cols", voyageOption.y_vars);
    formData.append("agg_fn", aggregation);
    formData.append("cachename", "voyage_xyscatter");

    dispatch(fetchVoyageGroupby(formData))
      .unwrap()
      .then((response: ScatterOptionsXYResponse) => {
        if (response) {
          const keys = Object.keys(response);
          setVoyageOption({
            x_vars: keys[0] || "",
            y_vars: keys[1] || "",
          });
          if (keys[0]) {
            setPlotX(response[keys[0]]);
          }
          if (keys[1]) {
            setPlotY(response[keys[1]]);
          }
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, [dispatch, aggregation, options_flat]);

  const handleChangeAggregation = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>, name: string) => {
      setAggregation(event.target.value);
    },
    [aggregation]
  );

  const handleChangeSelectXY = useMemo(() => {
    return (event: ChangeEvent<HTMLSelectElement>, name: string) => {
      const value = event.target.value;
      setVoyageOption((prevVoygOption) => ({
        ...prevVoygOption,
        [name]: value,
      }));
    };
  }, [voyageOption]);

  if (isLoading) {
    return <div className="spinner"></div>;
  }
  return (
    <div>
      <SelectDropDownXY
        selectedX={selectedX}
        selectedY={selectedY}
        voyageOption={voyageOption}
        handleChange={handleChangeSelectXY}
        width={width}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
        showAlert={showAlert}
      />

      <div>
        <Grid>
          <Plot
            data={[
              {
                x: [plotX[voyageOption.x_vars as keyof typeof plotX] as number],
                y: [plotY[voyageOption.y_vars as keyof typeof plotY] as number],
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
