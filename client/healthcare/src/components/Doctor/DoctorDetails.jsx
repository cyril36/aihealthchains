import {
  Grid,
  Panel,
  Divider,
  Stack,
  IconButton,
  Col,
  Row,
  ButtonToolbar,
  toaster,
  Notification,
} from "rsuite";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { useDoctor } from "../../hook/doctors";
import { ErrorState, LoadingState } from "../../utils/ui";
import { useRouter } from "../../context/Router";
import { deleteDoctor } from "../../api/doctors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EyeRoundIcon from "@rsuite/icons/EyeRound";

const DoctorDetails = ({ readonly = false, doctorId, handleEditDoctor }) => {
  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useDoctor(doctorId, { enabled: !!doctorId });
  const queryClient = useQueryClient();

  const { navigate } = useRouter();
  
  // redirect to the doctor detail page
  const handleDoctorClick = (id) => {
    navigate(`/doctors?doctorId=${id}`);
  };

  //delete a doctor
  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries(["doctors"]);
      toaster.push(<Notification type="success">Doctor deleted</Notification>);
    },
    onError: (error) => {
      console.log(error);
      toaster.push(
        <Notification type="error">Doctor deletion failed</Notification>
      );
    },
  });

  
  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }
  if (isError) {
    console.log(error);
    return <ErrorState message="Failed to load doctor." />;
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
      <p>Select a doctor to view details</p>
    </div>
  );
  if (doctor) {
    render = (
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
              {doctor.name}
            </h2>
            {!readonly ? (
              <ButtonToolbar>
                <IconButton
                  icon={<EditIcon />}
                  appearance="ghost"
                  onClick={() => handleEditDoctor(doctor)}
                ></IconButton>
                <IconButton
                  icon={<TrashIcon />}
                  appearance="ghost"
                  color="red"
                  onClick={() => {
                    if (window.confirm("Delete doctor?")) {
                      deleteMutation.mutate(doctor.id);
                      navigate(window.location.pathname);
                    }
                  }}
                ></IconButton>
              </ButtonToolbar>
            ) : (
              <ButtonToolbar>
                <IconButton
                  icon={<EyeRoundIcon />}
                  appearance="ghost"
                  onClick={() => handleDoctorClick(doctor?.id)}
                ></IconButton>
              </ButtonToolbar>
            )}
          </Stack>
          <Grid style={{ marginBottom: "24px" }}>
            <Row>
              <Col span={12}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.75rem",
                    color: "hsl(210, 8%, 45%)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Specialty
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  {doctor.specialty}
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "0.75rem",
                    color: "hsl(210, 8%, 45%)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Doctor ID
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  #{doctor.id}
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
              Bio
            </div>
            <p style={{ lineHeight: 1.625 }}>
              {doctor.bio || "No bio available"}
            </p>
          </div>
        </Panel>
    );
  }
  return render;
};

export default DoctorDetails;
