import {ArrowDropDown, ArrowRight} from '@mui/icons-material';
import {Button} from '@mui/material';
import {
  DropdownMenuItem,
  DropdownNestedMenuItemChildren,
} from '@/styleMUI';
import {MouseEvent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/redux/store';
import {setVisibleColumn} from '@/redux/getColumnSlice';
import {
  ColumnSelectorTree,
  TableCellStructureInitialStateProp,
} from '@/share/InterfaceTypesTable';
import ENSLAVED_TABLE from '@/utils/flatfiles/enslaved/enslaved_all_table_menu.json';
import AFRICANORIGINS_TABLE from '@/utils/flatfiles/enslaved/enslaved_african_origins_table.json';
import TEXAS_TABLE from '@/utils/flatfiles/enslaved/enslaved_texas_table_cell_structure.json';
import Transatlantic_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_transatlantic_table.json';
import Intraamerican_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_intraamerican_table.json';
import AllVoyages_TABLE_FLAT from '@/utils/flatfiles/voyages/voyages_all_table.json';
import ENSLAVERS_TABLE from '@/utils/flatfiles/enslavers/enslavers_table.json';
import {LabelFilterMeneList, TYPESOFDATASET, TYPESOFDATASETPEOPLE} from '@/share/InterfaceTypes';
import {usePageRouter} from '@/hooks/usePageRouter';
import {checkRouteForVoyages} from '@/utils/functions/checkPagesRoute';
import {ENSALVERSTYLE, INTRAAMERICANTRADS, TRANSATLANTICTRADS} from '@/share/CONST_DATA';
import {DropdownCascading} from '../Cascading/DropdownCascading';
import {getColorBTNVoyageDatasetBackground, getColorBoxShadow, getColorHoverBackground} from '@/utils/functions/getColorStyle';
import {translationHomepage} from '@/utils/functions/translationLanguages';

const ButtonDropdownColumnSelector = () => {
  const dispatch: AppDispatch = useDispatch();
  const {styleName: styleNameRoute} = usePageRouter();
  const {visibleColumnCells} = useSelector(
    (state: RootState) => state.getColumns as TableCellStructureInitialStateProp
  );
  const {languageValue} = useSelector((state: RootState) => state.getLanguages);
  const [menuValueCells, setMenuValueCells] = useState<ColumnSelectorTree[]>([]);
  const translatedHomepage = translationHomepage(languageValue);



  const handleColumnVisibilityChange = (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => {
    const target = event.currentTarget as HTMLLIElement | HTMLDivElement;
    const colID = target.dataset.colid;
    if (colID) {
      const updatedVisibleColumns = visibleColumnCells.includes(colID)
        ? visibleColumnCells.filter((column: string) => column !== colID)
        : [...visibleColumnCells, colID];
      dispatch(setVisibleColumn(updatedVisibleColumns));
    }
  };

  const transatlanticColumnSelector: ColumnSelectorTree[] = JSON.parse(JSON.stringify(Transatlantic_TABLE_FLAT.column_selector_tree));
  const intraamericanColumnSelector: ColumnSelectorTree[] = JSON.parse(JSON.stringify(Intraamerican_TABLE_FLAT.column_selector_tree));
  const allVoyageColumnSelector: ColumnSelectorTree[] = JSON.parse(JSON.stringify(AllVoyages_TABLE_FLAT.column_selector_tree));
  const enslavedColumnSelector: ColumnSelectorTree[] = JSON.parse(JSON.stringify(ENSLAVED_TABLE.column_selector_tree));
  const africanOriginsColumnSelector: ColumnSelectorTree[] = JSON.parse(JSON.stringify(AFRICANORIGINS_TABLE.column_selector_tree));
  const texasColumnSelector: ColumnSelectorTree[] = JSON.parse(JSON.stringify(TEXAS_TABLE.column_selector_tree));
  const enslaversColumnSelector: ColumnSelectorTree[] = JSON.parse(JSON.stringify(ENSLAVERS_TABLE.column_selector_tree));

  useEffect(() => {
    const loadMenuValueCellStructure = async () => {
      try {
        if (styleNameRoute === TYPESOFDATASET.transatlantic) {
          setMenuValueCells(transatlanticColumnSelector);
        } else if (styleNameRoute === TYPESOFDATASET.intraAmerican) {
          setMenuValueCells(intraamericanColumnSelector);
        } else if (checkRouteForVoyages(styleNameRoute!)) {
          setMenuValueCells(allVoyageColumnSelector);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.allEnslaved) {
          setMenuValueCells(enslavedColumnSelector);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.africanOrigins) {
          setMenuValueCells(africanOriginsColumnSelector);
        } else if (styleNameRoute === TYPESOFDATASETPEOPLE.texas) {
          setMenuValueCells(texasColumnSelector);
        } else if ((styleNameRoute === ENSALVERSTYLE) || (styleNameRoute === TRANSATLANTICTRADS) || styleNameRoute === INTRAAMERICANTRADS) {
          setMenuValueCells(enslaversColumnSelector);
        }
      } catch (error) {
        console.error('Failed to load table cell structure:', error);
      }
    };
    loadMenuValueCellStructure();
  }, []);


  function renderMenuItems(nodes: any[]) {
    return nodes.map((node) => {
      const {label: nodeLabel, children, var_name, colID} = node;
      const hasChildren = children && children.length > 0;
      const menuLabel = (nodeLabel as LabelFilterMeneList)[languageValue];

      if (hasChildren) {
        return (
          <DropdownNestedMenuItemChildren
            label={`${menuLabel}`}
            dense
            data-colid={colID}
            data-value={var_name}
            data-label={menuLabel}
            rightIcon={<ArrowRight style={{fontSize: 15}} />}
            onClickMenu={handleColumnVisibilityChange}
            menu={renderMenuItems(children)}
            disabled={visibleColumnCells.includes(colID)}
          />
        );
      }

      return (
        <DropdownMenuItem
          onClick={handleColumnVisibilityChange}
          data-colid={colID}
          data-value={var_name}
          data-label={menuLabel}
          dense
          disabled={visibleColumnCells.includes(colID)}
        >
          {menuLabel}
        </DropdownMenuItem>
      );
    });
  }
  return (
    <DropdownCascading
      trigger={
        <span style={{display: 'flex', alignItems: 'center'}}>
          <Button
            sx={{
              fontSize: '0.80rem',
              textTransform: 'unset',
              backgroundColor: getColorBTNVoyageDatasetBackground(styleNameRoute!),
              boxShadow: getColorBoxShadow(styleNameRoute!),
              fontWeight: 600,
              color: '#ffffff',
              width: {xs: 180, sm: 180},
              '&:hover': {
                backgroundColor: getColorHoverBackground(styleNameRoute!),
              },
            }}
            className="configureColumnsButton"
            endIcon={<ArrowDropDown />}
          >
            {translatedHomepage.configureColumns}
          </Button>
        </span>
      }
      menu={renderMenuItems(menuValueCells)}
    />
  );
};
export default ButtonDropdownColumnSelector;
