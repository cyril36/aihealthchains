import http from "./http";

export const getDoctors = () => http.get("/doctors");
export const getDoctor = (id) => http.get(`/doctors/${id}`);
export const createDoctor = (data) => http.post("/doctors", data);
export const updateDoctor = ({id, data}) => http.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => http.delete(`/doctors/${id}`);
