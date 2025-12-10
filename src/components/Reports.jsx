import { useEffect, useState } from "react";
import loanService from "../services/loanService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Reports = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromDateLoans, setFromDateLoans] = useState("");
  const [toDateLoans, setToDateLoans] = useState("");
  const [clientsWithDelays, setClientsWithDelays] = useState([]);

  const initActiveLoans = () => {
    // carga los prestamos (en proceso o atrasados)
    loanService.getActiveLoans()
      .then((res) => {
        console.log("Cargando todos los préstamos activos", res.data);
        setActiveLoans(res.data);
      })
      .catch(err => console.error("Error cargando préstamos:", err));
  };
  const initDelayedClients = () => {
    // carga a los clientes con atrasos
    loanService.getClientswithDelays()
    .then((res) => {
      console.log("Cargando clientes con atrasos", res.data);
      setClientsWithDelays(res.data);
    })
    .catch(err => console.error("Error cargando clientes con atrassos" ,err));

  };

  const initRankingTools = () => {
    // carga las herramientas mas solicitadas
    loanService.getRanking()
    .then((res) => {
      console.log("Cargando ranking de herramientas", res.data);
      setRanking(res.data);
    })
    .catch(err => console.error("Error cargando ranking de herramientas", err.data));
  };

  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Lista ranking de las herramientas más prestadas
  const handleRankingFilter = () => {
    loanService.getRankingByDate(fromDate, toDate)
      .then((res) => {
        console.log("Cargando filtro en ranking de herramientas", res.data);
        setRanking(res.data);
      })
      .catch(err => console.error("Error filtrando ranking de herramientas", err));
  };

  const handleLoansFilter = () => {
    loanService.getActiveLoansByDate(fromDateLoans, toDateLoans)
    .then((res) => {
      console.log("Cargando préstamos activos filtrados", res.data);
      setActiveLoans(res.data);
    })
    .catch(err => console.error("Error filtrando préstamos activos", err));
  };

  const handleClearRanking = () => {
    setFromDate("");
    setToDate("");
    initRankingTools();
  };

  const handleClearLoans = () => {
    setFromDateLoans("");
    setToDateLoans("");
    initActiveLoans();
  };

  useEffect(() => {
    initActiveLoans();
    initDelayedClients();
    initRankingTools();
  }, []);

  return (
    <Box>
      <h3>Reportes</h3>

      {/* --- Sección 1: Préstamos activos --- */}
      <h4>Préstamos Activos</h4>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDateLoans}
          onChange={(e) => setFromDateLoans(e.target.value)}
          size="small"
        />

        <TextField
          label="Hasta"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDateLoans}
          onChange={(e) => setToDateLoans(e.target.value)}
          size="small"
        />

        <Button variant="contained" color="info" onClick={handleLoansFilter}>
          Filtrar Préstamos
        </Button>
        <Button variant="outlined" onClick={handleClearLoans}>
          Limpiar
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Herramienta</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha de entrega</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha de devolución</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activeLoans.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.client?.name}</TableCell>
                <TableCell>{l.tool?.name}</TableCell>
                <TableCell>{l.currentState?.name}</TableCell>
                <TableCell>{formatDate(l.deliveryDate)}</TableCell>
                <TableCell>{formatDate(l.returnDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Sección 2: Clientes con atrasos --- */}
      <h4>Clientes con atrasos</h4>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientsWithDelays.map((c) => (
              <TableRow key={c?.id}>
                <TableCell>{c?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Sección 3: Ranking herramientas --- */}
      <h4>Ranking de las Herramientas más Prestadas</h4>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          size="small"
        />

        <TextField
          label="Hasta"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          size="small"
        />

        <Button variant="contained" color="info" onClick={handleRankingFilter}>
          Filtrar Ranking
        </Button>
        <Button variant="outlined" onClick={handleClearRanking}>
          Limpiar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Herramienta</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cantidad de Préstamos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.map((r, idx) => (
              <TableRow key={idx}>
                <TableCell>{r.toolName}</TableCell>
                <TableCell>{r.totalLoans}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Reports;