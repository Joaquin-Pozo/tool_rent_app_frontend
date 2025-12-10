import { useEffect, useState } from "react";
import kardexService from "../services/kardexService";
import toolService from "../services/toolService";
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
import MenuItem from "@mui/material/MenuItem";

const KardexsList = () => {
  const [kardexs, setKardexs] = useState([]);
  const [tools, setTools] = useState([]);
  const [toolId, setToolId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const init = () => {
    kardexService.getAll()
      .then((res) => {
        console.log("Mostrando listado de movimientos del kardex", res.data);
        setKardexs(res.data);
      })
      .catch(err => console.error("Error cargando los movimientos del kardex:", err));
  };

  const loadTools = () => {
    toolService.getAll()
      .then((res) => {
        console.log("Mostrando listado de movimiento de herramientas", res.data);
        setTools(res.data);
      })
      .catch(err => console.error("Error cargando herramientas:", err));
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

    const handleFilter = () => {
    kardexService.filter(toolId || null, fromDate || null, toDate || null)
      .then(res => setKardexs(res.data))
      .catch(err => console.error("Error filtrando kardex:", err));
  };

  const handleClear = () => {
    // setea las variables en cero
    setToolId("");
    setFromDate("");
    setToDate("");
    init();
  };

  useEffect(() => {
    init();
    loadTools();
  }, []);

  return (
    <Box>
      <h3>Historial de movimientos Kardex</h3>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          select
          label="Herramienta"
          value={toolId}
          onChange={(e) => setToolId(e.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">-- Todas --</MenuItem>
          {tools.map(t => (
            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
          ))}
        </TextField>

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

        <Button variant="contained" color="info" onClick={handleFilter}>
          Filtrar
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Limpiar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Herramienta</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cantidad</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Prestamo (ID)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kardexs.map(k => (
              <TableRow key={k.id}>
                <TableCell>{formatDate(k.movementDate)}</TableCell>
                <TableCell>{k.tool?.name}</TableCell>
                <TableCell>{k.type?.name}</TableCell>
                <TableCell>{k.quantity}</TableCell>
                <TableCell>{k.client?.name ?? ""}</TableCell>
                <TableCell>{k.loan?.id ?? ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KardexsList;