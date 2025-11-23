import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Grid, Col, Row } from "rsuite";
import { useAppointment, useAppointments } from "../../hook/appointments";
import { useDoctors } from "../../hook/doctors";
import { usePatients } from "../../hook/patients";
import { ErrorState, LoadingState } from "../../utils/ui";
import { AppointmentsList } from "./AppointmentList";
import { AppointmentModal } from "./AppointmentModal";
import AppointmentsDetails from "./AppointmentDetails";
import PatientDetails from "../Patient/PatientDetails";
import DoctorDetails from "../Doctor/DoctorDetails";
import { useRouter } from "../../context/Router";
export function AppointmentsPage() {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedAppointmentForEdit, setSelectedAppointmentForEdit] =
    useState(null);
  const [modalMode, setModalMode] = useState("add");
  const { data: appointments, isLoading, error, isError } = useAppointments();
  const { data: patients } = usePatients();
  const { data: doctors } = useDoctors();
  const appointmentId = new URLSearchParams(window.location.search).get(
    "appointmentId"
  );
  const {
    data: appointment,
    isLoading: aptIsLoading,
    isError: aptIsError,
  } = useAppointment(appointmentId, { enabled: !!appointmentId });
  const { navigate } = useRouter();

  //redirect to the appointment detail page
  const handleAppointmentClick = (apt) => {
    navigate(`/appointments?appointmentId=${apt.id}`);
  };
  useEffect(() => {
    if (!aptIsLoading && !aptIsError && appointment) {
      setSelectedAppointment(appointment);
    }
  }, [appointment, isLoading, isError]);


  // Open the Modal page to create appointments
  const handleCreationAppointment = () => {
    setModalMode("add");
    setSelectedAppointmentForEdit(null);
    setAppointmentModalOpen(true);
  };


  // Open the Modal page to edit appointments
  const handleEditAppointment = (pat) => {
    setModalMode("edit");
    setSelectedAppointmentForEdit(pat);
    setAppointmentModalOpen(true);
  };

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError) {
    console.log(error);
    return <ErrorState message="Failed to load appointments." />;
  }

  return (
    <>
      <Grid style={{ minHeight: "600px", marginBlock: "10px" }}>
        <Row style={{ height: "100%" }}>
          <Col
            span={8}
            style={{
              background: "hsl(210, 15%, 92%)",
              borderRight: "1px solid hsl(210, 10%, 80%)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(100vh - 200px)",
            }}
          >
            <AppointmentsList
              patients={patients}
              doctors={doctors}
              appointments={appointments}
              selectedAppointment={selectedAppointment}
              setSelectedAppointment={handleAppointmentClick}
              handleCreationAppointment={handleCreationAppointment}
            />
          </Col>
          <Col span={16} style={{ background: "white" }}>
            <AppointmentsDetails
              appointment={selectedAppointment}
              setSelectedAppointment={setSelectedAppointment}
              handleEditAppointment={handleEditAppointment}
            />
            <Row>
              <Col span={12} style={{ background: "white" }}>
                {selectedAppointment && (
                  <PatientDetails
                    readonly={true}
                    patientId={selectedAppointment?.patientId}
                  />
                )}
              </Col>
              <Col span={12} style={{ background: "white" }}>
                {selectedAppointment && (
                  <DoctorDetails
                    readonly={true}
                    doctorId={selectedAppointment?.doctorId}
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>

      <AppointmentModal
        open={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        appointment={selectedAppointmentForEdit}
        mode={modalMode}
      />
    </>
  );
}
