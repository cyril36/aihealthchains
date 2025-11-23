import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  List,
  Input,
  InputGroup,
  Pagination,
  Tag,
  Stack,
  Button,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import PlusIcon from "@rsuite/icons/Plus";
import { EmptyState } from "../../utils/ui";
export function PatientList({
  patients,
  selectedPatientId,
  setSelectedPatient,
  handleCreationPatient,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  // filter the patient according to the search terms
  const filteredPatients = useMemo(() => {
    if (!Array.isArray(patients)) return [];
    if (!patients) return [];
    if (!searchTerm) return patients;
    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const startIndex = (currentPage - 1) * patientsPerPage;
  const paginatedPatients = Array.isArray(filteredPatients)
    ? filteredPatients.slice(startIndex, startIndex + patientsPerPage)
    : [];



  return (
    <>
      <div style={{ padding: "24px" }}>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          style={{ marginBottom: "16px" }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.25rem",
              color: "hsl(215, 20%, 20%)",
              fontWeight: 600,
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            Patients
          </h3>
          <Button
            appearance="primary"
            startIcon={<PlusIcon />}
            onClick={() => {
              handleCreationPatient();
            }}
          >
            Add
          </Button>
        </Stack>
        <InputGroup style={{ marginBottom: "15px" }}>
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
        </InputGroup>
        <div
          style={{
            fontSize: "0.875rem",
            color: "hsl(210, 8%, 45%)",
            marginBottom: "10px",
          }}
        >
          {filteredPatients.length > 0
            ? `Showing ${startIndex + 1}-${Math.min(
                startIndex + patientsPerPage,
                filteredPatients.length
              )} of ${filteredPatients.length}`
            : "No patients"}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        <List hover>
          {paginatedPatients.map((p) => (
            <List.Item
              key={p.id}
              style={{
                cursor: "pointer",
                background:
                  selectedPatientId == p.id ? "hsl(0, 0%, 98%)" : "white",
                border:
                  selectedPatientId == p.id
                    ? "2px solid hsl(182, 40%, 45%)"
                    : "2px solid hsl(210, 10%, 80%)",
                borderRadius: "8px",
                marginBottom: "12px",
                padding: "16px",
                transition: "all 0.2s ease",
              }}
              onClick={() => setSelectedPatient(p)}
            >
              <h4 style={{ margin: 0, marginBottom: "8px", fontWeight: 600 }}>
                {p.name}
              </h4>
              <div>
                <Tag
                  size="sm"
                  style={{
                    background: "hsl(182, 40%, 45%)",
                    color: "white",
                    marginRight: "6px",
                  }}
                >
                  {p.age} years
                </Tag>
                <Tag
                  size="sm"
                  style={{
                    background: "hsl(160, 20%, 80%)",
                    color: "hsl(215, 28%, 15%)",
                  }}
                >
                  {p.gender}
                </Tag>
              </div>
            </List.Item>
          ))}
        </List>
      </div>
      {totalPages > 1 && (
        <div
          style={{ padding: "20px", borderTop: "1px solid hsl(210, 10%, 80%)" }}
        >
          <Pagination
            prev
            next
            size="md"
            ellipsis
            maxButtons={2} boundaryLinks
            total={filteredPatients.length}
            limit={patientsPerPage}
            activePage={currentPage}
            onChangePage={setCurrentPage}
            style={{ justifyContent: "center" }}
          />
        </div>
      )}
    </>
  );
}
