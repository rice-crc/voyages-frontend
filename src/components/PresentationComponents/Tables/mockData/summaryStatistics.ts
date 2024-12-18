export interface SummaryStatisticsProps {
  data: [string, any, number, any, any][];
}

export const summaryStatisticsData = {
  data: [
    ['Captives embarked *IMP', 0, 0, 0, 0, 0],
    ['Captives disembarked *IMP', 0, 0, 0, 0, 0],
    ['Percentage of captives embarked who died during crossing', 0, 0, 0, 0, 0],
    ["Duration of captives' crossing (in days)", 0, 0, 0, 0, 0],
    ['Percentage male', 0, 0, 0, 0, 0],
    ['Percentage children', 0, 0, 0, 0, 0],
    ['Tonnage of vessel', 0, 0, 0, 0, 0],
  ],
};
