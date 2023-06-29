import { useState, useEffect, ChangeEvent, useCallback, useMemo } from "react";
import Plot from "react-plotly.js";
import VOYAGE_PIEGRAPH_OPTIONS from "@/utils/VOYAGE_PIERAPH_OPTIONS.json";
import { Grid, SelectChangeEvent, Skeleton } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useGetOptionsQuery } from "@/fetchAPI/fetchApiService";
import { SelectDropdown } from "./SelectDropdown";
import { AggregationSumAverage } from "./AggregationSumAverage";
import { fetchVoyageGraphGroupby } from "@/fetchAPI/fetchVoyageGroupby";
import {
  VoyagesOptionProps,
  Options,
  RangeSliderState,
  AutoCompleteInitialState,
  CurrentPageInitialState,
  PlotPIEX,
  PlotPIEY,
} from "@/share/InterfaceTypes";
import { fetchOptionsFlat } from "@/fetchAPI/fetchOptionsFlat";
import createPlotlyComponent from "react-plotly.js/factory";

function PieGraph() {
  const datas = useSelector((state: RootState) => state.getOptions?.value);
  const {
    data: options_flat,
    isSuccess,
    isLoading,
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
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );

  const [optionFlat, setOptionsFlat] = useState<Options>({});
  const [width, height] = useWindowSize();
  const [showAlert, setAlert] = useState(false);
  const [pieGraphSelectedX, setSelectedX] = useState<PlotPIEX[]>([]);
  const [pieGraphSelectedY, setSelectedY] = useState<PlotPIEY[]>([]);
  const [plotX, setPlotX] = useState<any[]>([]);
  const [plotY, setPlotY] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [pieGraphOptions, setPieOptions] = useState<VoyagesOptionProps>({
    x_vars: VOYAGE_PIEGRAPH_OPTIONS.x_vars[0].var_name,
    y_vars: VOYAGE_PIEGRAPH_OPTIONS.y_vars[0].var_name,
  });
  const [aggregation, setAggregation] = useState<string>("sum");

  const VoyagepieGraphOptions = () => {
    Object.entries(VOYAGE_PIEGRAPH_OPTIONS).forEach(
      ([key, value]: [string, PlotPIEX[]]) => {
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
    VoyagepieGraphOptions();
    let subscribed = true;
    fetchOptionsFlat(isSuccess, options_flat as Options, setOptionsFlat);

    const fetchData = async () => {
      setLoading(true);
      const newFormData: FormData = new FormData();
      newFormData.append("groupby_by", pieGraphOptions.x_vars);
      newFormData.append("groupby_cols", pieGraphOptions.y_vars);
      newFormData.append("agg_fn", aggregation);
      newFormData.append("cachename", "voyage_bar_and_donut_charts");

      if (isChange && rang[varName] && currentPage === 4) {
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
          fetchVoyageGraphGroupby(newFormData)
        ).unwrap();

        if (subscribed) {
          const keys = Object.keys(response);
          setPieOptions({
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
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => {
      subscribed = false;
    };
  }, [
    dispatch,
    options_flat,
    pieGraphOptions.x_vars,
    pieGraphOptions.y_vars,
    aggregation,
    rang,
    varName,
    isChange,
    autoCompleteValue,
    autoLabelName,
    currentPage,
    isSuccess,
  ]);

  const handleChangeAggregation = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAggregation(event.target.value);
    },
    []
  );

  const handleChangeSingleSelect = useMemo(() => {
    return (event: SelectChangeEvent<string>, name: string) => {
      const value = event.target.value;
      setPieOptions((prevVoygOption) => ({
        ...prevVoygOption,
        [name]: value,
      }));
    };
  }, [pieGraphOptions]);

  const maxWidth =
    width > 1024
      ? width > 1440
        ? width * 0.88
        : width * 0.92
      : width === 1024
      ? width * 0.895
      : width < 768
      ? width * 0.8
      : width * 0.75;

  if (isLoading) {
    <div className="Skeleton-loading">
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </div>;
  }

  return (
    <div>
      <SelectDropdown
        selectedX={pieGraphSelectedX}
        selectedY={pieGraphSelectedY}
        selectedOptions={pieGraphOptions}
        handleChange={handleChangeSingleSelect}
        handleChangeMultipleYSelected={() =>
          console.log("handleChangeMultipleYSelected optional for PIE")
        }
        graphType="PIE"
        maxWidth={maxWidth}
        XFieldText={"Sectors"}
        YFieldText={"Values"}
        optionsFlatY={VOYAGE_PIEGRAPH_OPTIONS.y_vars}
      />
      <AggregationSumAverage
        handleChange={handleChangeAggregation}
        aggregation={aggregation}
        showAlert={showAlert}
        aggregatioOptions={pieGraphOptions}
        optionFlat={optionFlat}
      />

      <Grid>
        <Plot
          data={[
            {
              labels: plotX,
              values: plotY,
              type: "pie",
              mode: "lines+markers",
              textinfo: "label+percent",
              insidetextorientation: "radial",
              hole: 0.25,
            },
          ]}
          layout={{
            width: maxWidth,
            height: height * 0.5,
            title: `The ${aggregation} of ${
              optionFlat[pieGraphOptions.x_vars]?.label || ""
            } vs <br> ${
              optionFlat[pieGraphOptions.y_vars]?.label || ""
            } Pie Graph`,
            font: {
              family: "Arial, sans-serif",
              size: 12,
              color: "#333333",
            },
            legend: {
              x: 0.73,
              y: 0.9,
              font: {
                family: "Arial, sans-serif",
                size: 12,
                color: "#666666",
              },
            },
          }}
          config={{ responsive: true }}
        />
      </Grid>
    </div>
  );
}

export default PieGraph;
