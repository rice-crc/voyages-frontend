import { ArrowDropDown, ArrowRight } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DropdownColumn } from "./DropdownColumn";
import {
  DropdownMenuColumnItem,
  DropdownNestedMenuColumnItem,
} from "@/styleMUI";
import { VoyagaesFilterMenu } from "@/share/InterfaceTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
interface ButtonComponentProps {}
const ButtonDropdownSelectoreColumn: React.FC<ButtonComponentProps> = () => {
  const menuOptionFlat: VoyagaesFilterMenu = useSelector(
    (state: RootState) => state.optionFlatMenu.value
  );
  function renderMenuItems(nodes: any[]) {
    return nodes.map((node) => {
      const { label, children } = node;
      const hasChildren = children && children.length > 1;

      if (hasChildren) {
        return (
          <DropdownNestedMenuColumnItem
            label={`${label}`}
            rightIcon={<ArrowRight />}
            menu={renderMenuItems(children)}
          />
        );
      }

      return (
        <DropdownMenuColumnItem
          onClick={() => {
            console.log("clicked");
          }}
          dense
        >
          {label}
        </DropdownMenuColumnItem>
      );
    });
  }
  return (
    <DropdownColumn
      trigger={
        <span style={{ display: "flex", alignItems: "center" }}>
          <Button
            style={{
              fontSize: 12,
              backgroundColor: "#17a2b8",
              color: "#ffffff",
            }}
            endIcon={<ArrowDropDown />}
          >
            configure columns
          </Button>
        </span>
      }
      menu={renderMenuItems(menuOptionFlat)}
    />
  );
};
export default ButtonDropdownSelectoreColumn;
