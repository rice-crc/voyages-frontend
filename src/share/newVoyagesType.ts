export interface ShipDataProps {
  nameOfVessel: string;
  constructionPlace: string;
  registrationPlace: string;
  constructionYear: string;
  registrationYear: string;
  nationalCarrier: string;
  rigOfVessel: string;
  tonOfVessel: string;
  tonDefinition: string;
  gunsMounted: string;
  firstOwner: string;
  secondOwner: string;
  otherOwners: string;
  cargo: CargoProps[];
}

export interface CargoProps {
  type: string;
  unit: string;
  amount: string;
}
