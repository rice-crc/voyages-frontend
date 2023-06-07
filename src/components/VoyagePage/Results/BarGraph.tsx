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
import { fetchVoyageBarGraphGroupby } from "@/fetchAPI/fetchVoyageGroupby";
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

  const [barGraphSelectedX, setSelectedX] = useState<PlotXYVar[]>([]);
  const [barGraphSelectedY, setSelectedY] = useState<PlotXYVar[]>([]);
  const [barGraphPlotX, setPlotBarX] = useState<number[]>([]);
  const [barGraphPlotY, setPlotBarY] = useState<number[]>([]);
  const [barGraphOptions, setBarOptions] = useState<VoyagesOptionProps>({
    x_vars: VOYAGE_BARGRAPH_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_BARGRAPH_OPTIONS.y_vars[0].var_name,
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
      newFormData.append("cachename", "voyage_bar_and_donut_charts");

      if (isChange && rang[varName] && currentPage === 3) {
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
          fetchVoyageBarGraphGroupby(newFormData)
        ).unwrap();
        if (response) {
          const keys = Object.keys(response);
          const values = Object.values(response);
          setBarOptions({
            x_vars: keys[0] || "",
            y_vars: keys[1] || "",
          });
          if (values[0]) {
            setPlotBarX(values[0] as number[]);
          }
          if (values[1]) {
            setPlotBarY(values[1] as number[]);
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

  const handleChangeBarGraphOption = useCallback(
    (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setBarOptions((prevVoyageOption) => ({
        ...prevVoyageOption,
        [name]: value,
      }));
    },
    [barGraphSelectedX, barGraphSelectedY, barGraphOptions]
  );

  const handleChangeAggregation = useMemo(
    () => (event: ChangeEvent<HTMLInputElement>, name: string) => {
      setAggregation(event.target.value);
    },
    [aggregation]
  );

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  const maxWidth =
    width > 1024
      ? width > 1440
        ? width * 0.88
        : width * 0.92
      : width === 1024
      ? width * 0.895
      : width < 768
      ? width * 0.92
      : width * 0.95;

  return (
    <div>
      <SelectDropdownScatter
        selectedX={barGraphSelectedX}
        selectedY={barGraphSelectedY}
        selectedOptions={barGraphOptions}
        handleChange={handleChangeBarGraphOption}
        maxWidth={maxWidth}
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
              type: "bar",
            },
          ]}
          layout={{
            width: maxWidth,
            height: height * 0.45,
            title: `The ${aggregation} of ${
              optionFlat[barGraphOptions.x_vars]?.label || ""
            } vs <br> ${
              optionFlat[barGraphOptions.y_vars]?.label || ""
            } Bar Graph`,

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
