import http from "./http";

export const getAppointments = () => http.get("/appointments");
export const getAppointment = (id) => http.get(`/appointments/${id}`);
export const getAppointmentsByPatient = (id) => http.get(`/appointments?patientId=${id}`);
export const getAppointmentsByDoctor = (id) => http.get(`/appointments?doctorId=${id}`);
export const createAppointment = (data) => http.post("/appointments", data);
export const updateAppointment = ({id, data}) => http.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => http.delete(`/appointments/${id}`);
