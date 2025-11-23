import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "../api/doctors";
import { getDoctor } from "../api/doctors";

// Hook to get the doctors 
export const useDoctors = () =>
  useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
    select: (data) => data.data,
  });

// Hook to get the doctor by  id
export const useDoctor = (id, options = {}) =>
  useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctor(id),
    select: (data) => {
      return data.data;
    },
    enabled: !!id,
    ...options,
  });
