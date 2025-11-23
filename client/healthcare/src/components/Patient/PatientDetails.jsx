import {
  Grid,
  Panel,
  Divider,
  Badge,
  Stack,
  ButtonGroup,
  IconButton,
  Col,
  Row,
  ButtonToolbar,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { usePatient } from "../../hook/patients";
import { ErrorState, LoadingState } from "../../utils/ui";
import { useRouter } from "../../context/Router";
import { deletePatient } from "../../api/patients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EyeRoundIcon from "@rsuite/icons/EyeRound";

const PatientDetails = ({ readonly = false, patientId, handleEditPatient }) => {
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatient(patientId, { enabled: !!patientId });

  const { navigate } = useRouter();

  // redirect to the patient detail page
  const handlePatientClick = (id) => {
    navigate(`/?patientId=${id}`);
  };

  const queryClient = useQueryClient();
 
 
  //delete a patient
  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
      toaster.push(<Notification type="success">Patient deleted</Notification>);
    },
    onError: (error) => {
      console.log(error);
      toaster.push(
        <Notification type="error">Patient deletion failed</Notification>
      );
    },
  });
  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError) {
    console.log(error);
    return <ErrorState message="Failed to load patient." />;
  }

  let render = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "hsl(210, 8%, 45%)",
        padding: "30px",
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ marginBottom: "20px", opacity: 0.3 }}
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <p>Select a patient to view details</p>
    </div>
  );
  if (patient) {
    render = (
      <div >
        <Panel
          bordered
          style={{
            background: "hsl(0, 0%, 98%)",
            border: "1px solid hsl(210, 10%, 80%)",
            marginBottom: "24px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: "24px" }}
          >
            <h2
              style={{
                margin: 0,
                color: "hsl(215, 28%, 15%)",
                fontSize: "1.875rem",
                fontWeight: 700,
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              {patient.name}
            </h2>
            {!readonly && patient ? (
              <ButtonToolbar>
                <IconButton
                  icon={<EditIcon />}
                  appearance="ghost"
                  onClick={() => handleEditPatient(patient)}
                ></IconButton>
                <IconButton
                  icon={<TrashIcon />}
                  appearance="ghost"
                  color="red"
                  onClick={() => {
                    if (window.confirm("Delete patient?")) {
                      deleteMutation.mutate(patient.id);
                      navigate(window.location.pathname);
                    }
                  }}
                ></IconButton>
              </ButtonToolbar>
            ): (
              <ButtonToolbar>
                <IconButton
                  icon={<EyeRoundIcon />}
                  appearance="ghost"
                  onClick={() => handlePatientClick(patient?.id)}
                ></IconButton>
              </ButtonToolbar>
            )}
          </Stack>
          <Grid style={{ marginBottom: "24px" }}>
            <Row>
              <Col span={8}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.75rem",
                    color: "hsl(210, 8%, 45%)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Age
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  {patient.age} years
                </div>
              </Col>
              <Col span={8}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.75rem",
                    color: "hsl(210, 8%, 45%)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Gender
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  {patient.gender}
                </div>
              </Col>
              <Col span={8}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.75rem",
                    color: "hsl(210, 8%, 45%)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  ID
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  #{patient.id}
                </div>
              </Col>
            </Row>
          </Grid>
          <Divider />
          <div>
            <div
              style={{
                marginBottom: "12px",
                fontSize: "0.75rem",
                color: "hsl(210, 8%, 45%)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Medical History
            </div>
            <p style={{ lineHeight: 1.625 }}>
              {patient.medicalHistory || "No medical history"}
            </p>
          </div>
        </Panel>
      </div>
    );
  }
  return render;
};

export default PatientDetails;
