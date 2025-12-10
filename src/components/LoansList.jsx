import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loanService from "../services/loanService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import AddIcon from "@mui/icons-material/Add";

const LoansList = () => {
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();

  const init = () => {
    loanService
      .getAll()
      .then((response) => {
        console.log("Mostrando listado de todos los préstamos", response.data);
        setLoans(response.data);
      })
      .catch((error) => {
        console.log("Error al cargar préstamos", error);
      });
  };

  const updateOverdueLoans = () => {
    loanService.updateOverdueLoans()
    .then(response => console.log("Actualizando estado de préstamos atrasados", response.data))
    .catch(err => console.log("Error actualizando estado atrasado" ,err));
  }

  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleReturn = (id) => {
    navigate(`/loan/return/${id}`);
  };

  // función para pagar la multa
  const handlePayFine = (loan) => {
    loanService
      .payFine(loan)
      .then(() => {
        init();
      })
      .catch((error) => {
        console.log("Error al pagar multa", error);
      });
  };

    useEffect(() => {
    init();
    updateOverdueLoans();
  }, []);

  return (
    <Box>
      <h3>Préstamos</h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate("/loan/add")}
        sx={{ mb: 2 }}
      >
        Registrar Préstamo
      </Button>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Herramienta</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha de entrega</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha de devolución</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Dañada</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Multa Total</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Operaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.client?.name}</TableCell>
                <TableCell>{l.tool?.name}</TableCell>
                <TableCell>{l.currentState?.name}</TableCell>
                <TableCell>{formatDate(l.deliveryDate)}</TableCell>
                <TableCell>{formatDate(l.returnDate)}</TableCell>
                <TableCell>{l.damaged ? "Sí" : "No"}</TableCell>
                <TableCell>{l.totalFine ?? "-"}</TableCell>
                <TableCell>
                  {/* Boton para devolver el prestamo */}
                  {l.currentState?.name !== "Completado" &&
                  l.currentState?.name !== "Devuelto" && (
                    <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handleReturn(l.id)}
                    startIcon={<EditIcon />}
                    sx={{ mr: 1 }}
                  >
                    Devolver
                  </Button>
                  )}
                  {/* Boton para pagar multa */}
                  {l.currentState?.name === "Devuelto" && l.totalFine > 0 && (
                    <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handlePayFine(l)}
                    startIcon={<PaymentIcon />}
                    sx={{ mr: 1 }}
                  >
                    Pagar Multa
                  </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoansList;