import { useState } from "react";
import { Grid, Col, Row } from "rsuite";
import { usePatients } from "../../hook/patients";
import { ErrorState, LoadingState } from "../../utils/ui";
import { PatientModal } from "./PatientModal";
import { PatientList } from "./PatientList";
import PatientDetails from "./PatientDetails";
import PatientAppointmentList from "./PatientAppointmentList";
import { useRouter } from "../../context/Router";
export function PatientsPage() {
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState(null);
  const { navigate } = useRouter();
  const patientId = new URLSearchParams(window.location.search).get(
    "patientId"
  );

  const { data: patients, isLoading, error, isError } = usePatients();


  //redirect to the patient detail page
  const handlePatientClick = (pat) => {
    navigate(`/?patientId=${pat.id}`);
  };


  // Open the Modal page to create patient
  const handleCreationPatient = () => {
    setModalMode("add");
    setSelectedPatientForEdit(null);
    setPatientModalOpen(true);
  };


  // Open the Modal page to edit patient
  const handleEditPatient = (pat) => {
    setModalMode("edit");
    setSelectedPatientForEdit(pat);
    setPatientModalOpen(true);
  };

  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError) {
    console.log(error);
    return <ErrorState message="Failed to load patients." />;
  }

  return (
    <>
      <Grid style={{ minHeight: "600px" , marginBlock: "10px",}}>
        <Row>
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
            <PatientList
              patients={patients}
              selectedPatientId={patientId}
              setSelectedPatient={handlePatientClick}
              handleCreationPatient={handleCreationPatient}
            />
          </Col>
          <Col span={16} style={{ background: "white" }}>
            <PatientDetails
              patientId={patientId}
              handleEditPatient={handleEditPatient}
            />
            {patientId && (
              <PatientAppointmentList
                patientId={patientId}
                handleEditPatient={handleEditPatient}
              />
            )}
          </Col>
        </Row>
      </Grid>

      <PatientModal
        open={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        patient={selectedPatientForEdit}
        mode={modalMode}
      />
    </>
  );
}
