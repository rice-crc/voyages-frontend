import { useState, useEffect, useMemo, ChangeEvent, useCallback } from "react";
import Plot from "react-plotly.js";
import VOYAGE_BARGRAPH_OPTIONS from "@/utils/VOYAGE_BARGRAPH_OPTIONS.json";
import { Grid, SelectChangeEvent } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useGetOptionsQuery } from "@/fetchAPI/fetchApiService";
import SelectDropdownScatter from "./SelectDropdownScatter";
import AggregationSumAverage from "./AggregationSumAverage";
import { fetchVoyageGroupby } from "@/fetchAPI/fetchVoyageGroupby";
import {
  PlotXYVar,
  VoyagesOptionProps,
  Options,
  RangeSliderState,
  AutoCompleteInitialState,
  currentPageInitialState,
  BargraphXYVar,
} from "@/share/InterfaceTypes";
import { fetchOptionsFlat } from "@/fetchAPI/fetchOptionsFlat";

function BarGraph() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const {
    data: options_flat,
    isLoading,
    isSuccess,
  } = useGetOptionsQuery(datas);
  const dispatch: AppDispatch = useDispatch();
  const {
    rangeSliderMinMax: rang,
    varName,
    isChange,
  } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);
  const { autoCompleteValue, autoLabelName, isChangeAuto } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as currentPageInitialState
  );

  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
  const [showAlert, setAlert] = useState(false);

  const [barGraphSelectedX, setSelectedX] = useState<BargraphXYVar[]>([]);
  const [barGraphSelectedY, setSelectedY] = useState<BargraphXYVar[]>([]);
  const [barGraphPlotX, setPlotX] = useState<number[]>([]);
  const [barGraphPlotY, setPlotY] = useState<number[]>([]);
  const [barData, setBarData] = useState([]);
  const [chips, setChips] = useState([VOYAGE_BARGRAPH_OPTIONS.y_vars[5]]);

  const [barGraphOptions, setBarOptins] = useState<VoyagesOptionProps>({
    x_vars: VOYAGE_BARGRAPH_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_BARGRAPH_OPTIONS.y_vars[5].var_name,
  });

  const [aggregation, setAggregation] = useState<string>("sum");

  const VoyageBargraphOptions = () => {
    Object.entries(VOYAGE_BARGRAPH_OPTIONS).forEach(
      ([key, value]: [string, BargraphXYVar[]]) => {
        if (key === "x_vars") {
          setSelectedX(value);
        }
        if (key === "y_vars") {
          setSelectedY(value);
        }
      }
    );
  };
  console.log("ischange", isChange);

  useEffect(() => {
    VoyageBargraphOptions();
    fetchOptionsFlat(
      isSuccess,
      (options_flat as Options) || undefined,
      setOptionsFlat
    );
    const fetchData = async () => {
      const newFormData: FormData = new FormData();
      newFormData.append("groupby_by", barGraphOptions.x_vars);
      newFormData.append("groupby_cols", barGraphOptions.y_vars);
      newFormData.append("agg_fn", aggregation);
      newFormData.append("cachename", "voyage_xyscatter");
      if (isChange && rang[varName] && currentPage === 1) {
        newFormData.append(varName, String(rang[varName][0]));
        newFormData.append(varName, String(rang[varName][1]));
      }
      if (autoCompleteValue && varName && isChangeAuto) {
        for (let i = 0; i < autoLabelName.length; i++) {
          const label = autoLabelName[i];
          newFormData.append(varName, label);
        }
      }

      try {
        const response = await dispatch(
          fetchVoyageGroupby(newFormData)
        ).unwrap();
        if (response) {
          const keys = Object.keys(response);
          setBarOptins({
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
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [
    dispatch,
    options_flat,
    barGraphOptions.x_vars,
    barGraphOptions.y_vars,
    aggregation,
    rang,
    varName,
    isChange,
    autoLabelName,
  ]);

  const handleChangeChips = (event: any, name: string) => {
    //   console.log("⚽️", "Chips changed")
    const {
      target: { value },
    } = event;

    setChips(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setBarOptins({
      ...barGraphOptions,
      [name]: event.target.value[event.target.value.length - 1],
    });
  };
  const handleChangeAggregation = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>, name: string) => {
      setAggregation(event.target.value);
    },
    [aggregation]
  );

  // const handleChangeVoyageOption = useCallback(
  //   (event: SelectChangeEvent<string>, name: string) => {
  //     const value = event.target.value;
  //     setScatterOptins((prevVoyageOption) => ({
  //       ...prevVoyageOption,
  //       [name]: value,
  //     }));
  //   },
  //   [barGraphSelectedX, barGraphSelectedY, barGraphOptions]
  // );
  if (isLoading) {
    return <div className="spinner"></div>;
  }
  const maxWidth = width > 600 ? width * 0.8 : width * 0.7;
  return (
    <div>
      <SelectDropdownScatter
        scatterSelectedX={barGraphSelectedX}
        scatterSelectedY={barGraphSelectedY}
        scatterOptions={barGraphOptions}
        handleChange={handleChangeChips}
        width={width}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
        showAlert={showAlert}
        scatterOptions={barGraphOptions}
        optionFlat={optionFlat}
      />

      <Grid>
        <Plot
          data={[
            {
              x: barGraphPlotX,
              y: barGraphPlotY,
              type: "scatter",
              mode: "lines",
              marker: { color: "red" },
              line: { shape: "spline" },
            },
            { type: "bar" },
          ]}
          layout={{
            width: maxWidth,
            height: height * 0.4,
            title: `The ${aggregation} of ${
              optionFlat[barGraphOptions.x_vars]?.label || ""
            } vs ${
              optionFlat[barGraphOptions.y_vars]?.label || ""
            } Scatter Graph`,

            xaxis: {
              title: {
                text: optionFlat[barGraphOptions.x_vars]?.label || "",
              },
              fixedrange: true,
            },
            yaxis: {
              title: {
                text: optionFlat[barGraphOptions.y_vars]?.label || "",
              },
              fixedrange: true,
            },
          }}
          config={{ responsive: true }}
        />
      </Grid>
    </div>
  );
}

export default BarGraph;
