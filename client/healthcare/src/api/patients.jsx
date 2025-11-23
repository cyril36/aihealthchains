import http from "./http";

export const getPatients = () => http.get("/patients");
export const getPatient = (id) => http.get(`/patients/${id}`);
export const createPatient = (data) => http.post("/patients", data);
export const updatePatient = ({id, data}) =>{console.log(id);console.log(data); http.put(`/patients/${id}`, data)};
export const deletePatient = (id) => http.delete(`/patients/${id}`);
