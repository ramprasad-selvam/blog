import { resume } from "./resume";

export const getAtsBullets = (companyIndex: number) => {
  return resume.experience[companyIndex].highlights.map(h => h.ats);
};

export const getTechStackString = (companyIndex: number) => {
  return resume.experience[companyIndex].techStack.join(" • ");
};