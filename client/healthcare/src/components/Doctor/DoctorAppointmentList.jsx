import { Panel } from "rsuite";
import { useAppointmentsByDoctor } from "../../hook/appointments";
import { AppointmentsList } from "../Appointment/AppointmentList";
import { ErrorState, LoadingState } from "../../utils/ui";
import { useRouter } from "../../context/Router";

const DoctorAppointmentList = ({
  doctorId,
}) => {
  const { navigate } = useRouter();

  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useAppointmentsByDoctor(doctorId, { enabled: !!doctorId });


  //Redirect the appointment details page according to the ID 
  const handleAppointmentClick = (apt) => {
    navigate(`/appointments?appointmentId=${apt.id}`);
  };

  // Wrap the loading component , error component or result to a panel block (design)
  const PanelBlock = ({ children }) => (
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
      {children}
    </Panel>
  );

  if (isLoading) {
    return (
      <PanelBlock>
        <LoadingState message={"Loading appointments"} />
      </PanelBlock>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <PanelBlock>
        <ErrorState message={"Failed to load appointments."} />
      </PanelBlock>
    );
  }

  return (
    <PanelBlock>
     {/*  print the list of appointment related to the doctor ID */}
      <AppointmentsList
        readonly={true}
        appointmentsPerPage={2}
        appointments={appointments}
        setSelectedAppointment={handleAppointmentClick}
      />
    </PanelBlock>
  );
};

export default DoctorAppointmentList;
