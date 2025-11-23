import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Grid,
  Col,
  Row,
} from "rsuite";
import { useDoctors } from "../../hook/doctors";
import { ErrorState, LoadingState } from "../../utils/ui";
import { DoctorModal } from "./DoctorModal";
import { DoctorList } from "./DoctorList";
import DoctorDetails from "./DoctorDetails";
import DoctorAppointmentList from "./DoctorAppointmentList";
import { useRouter } from "../../context/Router";
export function DoctorsPage() {
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState(null);
  const {navigate} = useRouter()
  const doctorId = new URLSearchParams(window.location.search).get(
    "doctorId"
  );

  const queryClient = useQueryClient();

  const { data: doctors, isLoading, error, isError } = useDoctors();

  //redirect to the doctor detail page
  const handleDoctorClick = (pat) => {
        navigate(`/doctors?doctorId=${pat.id}`);
    }
    
  // Open the Modal page to create doctor
  const handleCreationDoctor = () => {
    setModalMode("add");
    setSelectedDoctorForEdit(null);
    setDoctorModalOpen(true);
  };

  // Open the Modal page to edit doctor
  const handleEditDoctor = (pat) => {
    setModalMode("edit");
    setSelectedDoctorForEdit(pat);
    setDoctorModalOpen(true);
  };

  
  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError) {
    console.log(error);
    return <ErrorState message="Failed to load doctors." />;
  }

  return (
    <>
      <Grid style={{ minHeight: "600px", marginBlock: "10px", }}>
        <Row style={{height:"100%"}}>
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
            <DoctorList
              doctors={doctors}
              selectedDoctorId={doctorId}
              setSelectedDoctor={handleDoctorClick}
              handleCreationDoctor={handleCreationDoctor}
            />
          </Col>
          <Col span={16} style={{ background: "white" }}>
            <DoctorDetails
              doctorId={doctorId}
              handleEditDoctor={handleEditDoctor}
            />
            {doctorId && (
              <DoctorAppointmentList
                doctorId={doctorId}
                handleEditDoctor={handleEditDoctor}
              />
            )}
          </Col>
        </Row>
      </Grid>

      <DoctorModal
        open={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
        doctor={selectedDoctorForEdit}
        mode={modalMode}
      />
    </>
  );
}
