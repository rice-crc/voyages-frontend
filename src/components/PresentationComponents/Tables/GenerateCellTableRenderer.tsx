import React, { CSSProperties, useContext } from 'react';

import { ICellRendererParams } from 'ag-grid-community';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import NETWORKICON from '@/assets/networksIcon.png';
import { usePageRouter } from '@/hooks/usePageRouter';
import {
  setCardFileName,
  setCardRowID,
  setIsModalCard,
  setNodeClass,
} from '@/redux/getCardFlatObjectSlice';
import {
  setNetWorksID,
  setNetWorksKEY,
  setsetOpenModalNetworks,
} from '@/redux/getPastNetworksGraphDataSlice';
import '@/style/table.scss';
import { RootState } from '@/redux/store';
import {
  ENSLAVEDNODE,
  ENSLAVERSNODE,
  VOYAGESNODECLASS,
} from '@/share/CONST_DATA';
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForEnslavers,
  checkPagesRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { cleanUpTextDisplay } from '@/utils/functions/cleanUpTextDisplay';
import {
  DocumentViewerContext,
  createDocKey,
} from '@/utils/functions/documentWorkspace';
import { numberWithCommas } from '@/utils/functions/numberWithCommas';

import PopoverWrapper from '../Cards/PopoverWrapper';

export const GenerateCellTableRenderer = (
  params: ICellRendererParams,
  cellFN: string,
  colID: string,
  numberFormat?: string | null,
  nodeClass?: string,
) => {
  const values = params.value;
  console.log({ values });
  const ID = params.data.id;
  const dispatch = useDispatch();
  const { styleName } = usePageRouter();
  const { setDoc } = useContext(DocumentViewerContext);
  const { cardFileName } = useSelector(
    (state: RootState) => state.getCardFlatObjectData,
  );

  let nodeType: string = '';

  if (checkPagesRouteForVoyages(styleName!)) {
    nodeType = VOYAGESNODECLASS;
  } else if (checkPagesRouteForEnslaved(styleName!)) {
    nodeType = ENSLAVEDNODE;
  } else if (checkPagesRouteForEnslavers(styleName!)) {
    nodeType = ENSLAVERSNODE;
  }
  const maxRowsToShow = 5; // Maximum rows to show before applying overflow
  const calculateHeight = (rowCount: number) => {
    const rowHeight = 35; // Adjust this value as needed based on your design

    const maxHeight = rowHeight * maxRowsToShow;
    return rowCount * rowHeight <= maxHeight ? rowCount * rowHeight : maxHeight;
  };
  if (Array.isArray(values)) {
    const rowCount = values.length;
    const calculatedHeight = calculateHeight(rowCount);

    const style: CSSProperties = {
      backgroundColor: '#e5e5e5',
      borderRadius: '8px',
      padding: '0px 10px',
      height: 'auto',
      whiteSpace: 'normal',
      overflow: 'hidden',
      margin: '5px 0',
      textAlign: 'left',
      lineHeight: '1.5',
      fontSize: '.80rem',
      cursor: 'pointer',
    };

    if (values.length <= 0) {
      return (
        <span>
          <div style={{ textAlign: 'left' }}>--</div>
        </span>
      );
    } else {
      const renderedValues = values.map((value: string, index: number) => {
        const additionalProps: React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLDivElement>,
          HTMLDivElement
        > = {
          style,
          onClick: () => {
            dispatch(setCardRowID(ID));
            dispatch(setIsModalCard(true));
            dispatch(setNodeClass(nodeType));
            dispatch(setCardFileName(cardFileName));
          },
          dangerouslySetInnerHTML: { __html: value ?? null },
        };
        let extraElements: React.ReactNode = null;
        if (
          (colID === 'voyage_sources' || colID === 'enslaved_sources') &&
          params.data.sources__zotero_group_id &&
          params.data.sources__title &&
          params.data.sources__zotero_item_id &&
          params.data.sources__has_published_manifest &&
          params.data.sources__has_published_manifest[index]
        ) {
          additionalProps.style = {
            ...style,
            borderColor: 'blue',
            borderWidth: 1,
            borderStyle: 'solid',
          };
          additionalProps.dangerouslySetInnerHTML = undefined;
          extraElements = (
            <>
              <span>{value} </span>
              <i className="fa fa-file-text" aria-hidden="true"></i>
            </>
          );
          additionalProps.onClick = () =>
            setDoc({
              key: createDocKey(
                params.data.sources__zotero_group_id[index],
                params.data.sources__zotero_item_id[index],
              ),
              label: params.data.sources__title[index],
              thumb: params.data.sources__thumbnail?.at(index),
              revision_number: 1,
              textSnippet: '',
            });
        }
        let cellComponent = (
          <span key={`${index}-${value}`}>
            <div {...additionalProps} key={`${index}-${value}`}>
              {extraElements}
            </div>
          </span>
        );
        if (
          (colID === 'voyage_sources' || colID === 'enslaved_sources') &&
          params.data.sources__bib
        ) {
          // Wrap the component so that we can display a tooltip.
          cellComponent = (
            <PopoverWrapper
              padding={2}
              key={`${index}-${value}`}
              popoverContents={
                <div
                  dangerouslySetInnerHTML={{
                    __html: params.data.sources__bib[index],
                  }}
                  key={`${index}-${value}`}
                />
              }
            >
              {cellComponent}
            </PopoverWrapper>
          );
        }
        return cellComponent;
      });
      const ellipsisStyle: CSSProperties = {
        ...style,
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        overflow: 'hidden',
      };

      const remainingRows = values.slice(maxRowsToShow);
      const renderRows = renderedValues.slice(0, maxRowsToShow);
      return (
        <div
          style={{ maxHeight: calculatedHeight, overflowY: 'auto' }}
          key={`${uuidv4()}`}
        >
          {renderRows}
          {remainingRows.length > 0 &&
            remainingRows.map((value, index) => (
              <div key={`${index}-${value}`} style={ellipsisStyle}>
                {cleanUpTextDisplay(value)}
              </div>
            ))}
        </div>
      );
    }
  } else if (typeof values !== 'object' && cellFN !== 'networks') {
    const values = params.value;
    let justifyContent: CSSProperties['justifyContent'] = 'flex-end';
    if (typeof values === 'number') {
      justifyContent = 'flex-end';
    } else if (
      (values === '--' && numberFormat === 'comma') ||
      (values === '--' && numberFormat === 'percent')
    ) {
      justifyContent = 'flex-end';
    } else {
      justifyContent = 'flex-start';
    }

    let valueFormat = values;
    if (numberFormat === 'comma') {
      valueFormat = numberWithCommas(values);
    } else if (numberFormat === 'percent') {
      const percent = values * 100;
      valueFormat = values === '--' ? '0.0%' : `${percent.toFixed(1)}%`;
    }

    return (
      <div className="div-value">
        <div
          className="value-cell"
          style={{ justifyContent: justifyContent }}
          role="button"
          tabIndex={0}
          onClick={() => {
            dispatch(setCardRowID(ID));
            dispatch(setIsModalCard(true));
            dispatch(setNodeClass(nodeType));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              dispatch(setCardRowID(ID));
              dispatch(setIsModalCard(true));
              dispatch(setNodeClass(nodeType));
            }
          }}
        >
          {valueFormat}
        </div>
      </div>
    );
  } else if (cellFN === 'networks' && nodeClass) {
    return (
      <span
        role="button"
        className="network-icon"
        tabIndex={0}
        onClick={() => {
          dispatch(setsetOpenModalNetworks(true));
          dispatch(setNetWorksID(ID));
          dispatch(setNetWorksKEY(nodeType || nodeClass));
          dispatch(setCardRowID(ID));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            dispatch(setsetOpenModalNetworks(true));
            dispatch(setNetWorksID(ID));
            dispatch(setNetWorksKEY(nodeType || nodeClass));
            dispatch(setCardRowID(ID));
          }
        }}
      >
        <img alt="network" src={NETWORKICON} style={{ cursor: 'pointer' }} />
      </span>
    );
  } else {
    return (
      <div className="div-value">
        <div className="value">--</div>
      </div>
    );
  }
};
