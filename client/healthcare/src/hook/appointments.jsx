import { useQuery } from "@tanstack/react-query";
import {
  getAppointmentsByPatient,
  getAppointments,
  getAppointment,
  getAppointmentsByDoctor,
} from "../api/appointments";

// Hook to get the appointments
export const useAppointments = () =>
  useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointments,
    select: (data) => data.data,
  });

// Hook to get the appointment by id
export const useAppointment = (id, options = {}) =>
  useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointment(id),
    select: (data) => data.data,
    enabled: !!id,
    ...options,
  });

// Hook to get the appointments by patient id

export const useAppointmentsByPatient = (id) =>
  useQuery({
    queryKey: ["appointmentsByPatient", id],
    queryFn: () => id && getAppointmentsByPatient(id),
    select: (data) => {
      return data.data;
    },
  });

// Hook to get the appointments by doctor id
export const useAppointmentsByDoctor = (id) =>
  useQuery({
    queryKey: ["appointmentsByDoctor", id],
    queryFn: () => id && getAppointmentsByDoctor(id),
    select: (data) => {
      return data.data;
    },
  });
