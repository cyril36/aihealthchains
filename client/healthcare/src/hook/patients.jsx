import { useQuery } from "@tanstack/react-query";
import { getPatient, getPatients } from "../api/patients";

// Hook to get the patients

export const usePatients = () =>
  useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
    select: (data) => {
      return data.data;
    },
  });

// Hook to get the patient by id
export const usePatient = (id, options = {}) =>
  useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatient(id),
    select: (data) => {
      return data.data;
    },
    enabled: !!id,
    ...options,
  });
