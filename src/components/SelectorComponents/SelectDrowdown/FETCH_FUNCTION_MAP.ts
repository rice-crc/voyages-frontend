import { fetchEnslavedGenderList } from '@/fetch/pastEnslavedFetch/fetchPastEnslavedGenderList';
import { fetchAfricanInfoList } from '@/fetch/voyagesFetch/fetchAfricanInfoList';
import { fetchCargoTypeListList } from '@/fetch/voyagesFetch/fetchCargoTypeList';
import { fetchEnslaverRoleList } from '@/fetch/voyagesFetch/fetchEnslaverRoleList';
import { fetchNationalityList } from '@/fetch/voyagesFetch/fetchNationalityList';
import { fetchOwnerOutcomeList } from '@/fetch/voyagesFetch/fetchOwnerOutcomeList';
import { fetchParticularOutcomeList } from '@/fetch/voyagesFetch/fetchParticularOutcomeList';
import { fetchResistanceList } from '@/fetch/voyagesFetch/fetchResistanceList';
import { fetchRigOfVesselList } from '@/fetch/voyagesFetch/fetchRigOfVesselList';
import { fetchSlavesOutcomeList } from '@/fetch/voyagesFetch/fetchSlavesOutcomeList';
import { fetchTonTypeList } from '@/fetch/voyagesFetch/fetchTonTypeList';
import { fetchVesselCapturedOutcomeList } from '@/fetch/voyagesFetch/fetchVesselCapturedOutcomeList';
import {
  varNameOfFlagOfVessel,
  varNameOfFlagOfVesselIMP,
  varNameOfResistance,
  varNameParticularCoutComeList,
  varNameRigOfVesselList,
  varNameOwnerOutcomeList,
  varNameTonTypList,
  varNameSlavesOutcomeList,
  varNameVesselCapturedOutcomeList,
  varNameEnslaverRoleList,
  varNameGenderName,
  varNameCargoTypeList,
  varNameAfricanInfoList,
} from '@/share/CONST_DATA';

// Fetch function mapping
export const FETCH_FUNCTION_MAP: Record<string, () => Promise<unknown>> = {
  [varNameOfFlagOfVessel]: fetchNationalityList,
  [varNameOfFlagOfVesselIMP]: fetchNationalityList,
  [varNameOwnerOutcomeList]: fetchOwnerOutcomeList,
  [varNameParticularCoutComeList]: fetchParticularOutcomeList,
  [varNameOfResistance]: fetchResistanceList,
  [varNameRigOfVesselList]: fetchRigOfVesselList,
  [varNameSlavesOutcomeList]: fetchSlavesOutcomeList,
  [varNameTonTypList]: fetchTonTypeList,
  [varNameVesselCapturedOutcomeList]: fetchVesselCapturedOutcomeList,
  [varNameEnslaverRoleList]: fetchEnslaverRoleList,
  [varNameGenderName]: fetchEnslavedGenderList,
  [varNameCargoTypeList]: fetchCargoTypeListList,
  [varNameAfricanInfoList]: fetchAfricanInfoList,
};
