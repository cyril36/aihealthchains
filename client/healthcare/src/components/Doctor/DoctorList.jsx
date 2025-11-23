import { useState, useMemo, useEffect } from "react";
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
export function DoctorList({
  doctors,
  selectedDoctorId,
  setSelectedDoctor,
  handleCreationDoctor,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  // filter the doctor according to the search terms
  const filteredDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return [];
    if (!doctors) return [];
    if (!searchTerm) return doctors;
    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [doctors, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = (currentPage - 1) * doctorsPerPage;
  const paginatedDoctors = Array.isArray(filteredDoctors)
    ? filteredDoctors.slice(startIndex, startIndex + doctorsPerPage)
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
            Doctors
          </h3>
          <Button
            appearance="primary"
            startIcon={<PlusIcon />}
            onClick={() => {
              handleCreationDoctor();
            }}
          >
            Add
          </Button>
        </Stack>
        <InputGroup style={{ marginBottom: "15px" }}>
          <Input
            placeholder="Search doctors..."
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
          {filteredDoctors.length > 0
            ? `Showing ${startIndex + 1}-${Math.min(
                startIndex + doctorsPerPage,
                filteredDoctors.length
              )} of ${filteredDoctors.length}`
            : "No doctors"}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        <List hover>
          {paginatedDoctors.map((p) => (
            <List.Item
              key={p.id}
              style={{
                cursor: "pointer",
                background:
                  selectedDoctorId === p.id ? "hsl(0, 0%, 98%)" : "white",
                border:
                  selectedDoctorId === p.id
                    ? "2px solid hsl(182, 40%, 45%)"
                    : "2px solid hsl(210, 10%, 80%)",
                borderRadius: "8px",
                marginBottom: "12px",
                padding: "16px",
                transition: "all 0.2s ease",
              }}
              onClick={() => setSelectedDoctor(p)}
            >
              <h4 style={{ margin: 0, marginBottom: "8px", fontWeight: 600 }}>
                {p.name}
              </h4>

              <Tag
                size="sm"
                style={{ background: "hsl(182, 40%, 45%)", color: "white" }}
              >
                {p.specialty}
              </Tag>
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
            total={filteredDoctors.length}
            limit={doctorsPerPage}
            activePage={currentPage}
            onChangePage={setCurrentPage}
            style={{ justifyContent: "center" }}
          />
        </div>
      )}
    </>
  );
}
