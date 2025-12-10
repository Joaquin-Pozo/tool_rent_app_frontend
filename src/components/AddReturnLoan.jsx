import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import loanService from "../services/loanService";
import clientService from "../services/clientService";
import toolService from "../services/toolService";
import ErrorPopup from "../components/ErrorPopup";
import { Box, TextField, Button, FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const AddReturnLoan = () => {

  const [clients, setClients] = useState([]);
  const [tools, setTools] = useState([]);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [clientId, setClientId] = useState("");
  const [toolId, setToolId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [damaged, setDamaged] = useState(false);
  const [dailyFineRate, setDailyFineRate] = useState(5000);
  const [totalFine, setTotalFine] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const saveLoan = async (e) => {
    e.preventDefault();

    const loan = {
      id,
      client: { id: clientId },
      tool: { id: toolId },
      deliveryDate,
      returnDate,
      damaged,
      dailyFineRate,
      totalFine,
    };

    try {
      if (id) {
      // Devuelve un préstamo
      loanService.returnLoan(loan).then(() => navigate("/loan/list"));
    } else {
      // Registra un nuevo préstamo
      await loanService.create(loan).then(() => navigate("/loan/list"));
    }
    navigate("/loan/list");
    } catch (error) {
      console.error("Error en la solicitud: ", error);

      const backendMessage = error.response?.data?.message || "Error al procesar la solicitud.";
      setErrorMessage(backendMessage);
      setOpenError(true);
    }

  };

  useEffect(() => {
    // carga clientes disponibles
    clientService.getAll().then((res) => {
      // filtra por clientes activos
      const activeClients = res.data.filter((c) => c.currentState?.name === "Activo");
      setClients(activeClients);
    });
    // carga herramientas disponibles
    toolService.getAll().then((res) => {
      // filtra por herramientas disponibles
      const activeTools = res.data.filter((c) => c.currentState?.name === "Disponible");
      setTools(activeTools);
    });

    if (id) {
      setTitle("Devolver Préstamo");
      loanService.get(id).then((res) => {
        const loan = res.data;
        setClientId(loan.client?.id);
        setToolId(loan.tool?.id);
        setDeliveryDate(loan.deliveryDate);
        setReturnDate(loan.returnDate);
        setDamaged(loan.damaged);
        setDailyFineRate(loan.dailyFineRate);
        setTotalFine(loan.totalFine);
      });
    } else {
      setTitle("Registrar Préstamo");
    }
  }, [id]);

  // Si es devolución, se deshabilitan ciertos campos
  const disabledFields = Boolean(id);

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ gap: 2, width: "400px", mx: "auto" }}
    >
      <h3>{title}</h3>

      {/* Select cliente */}
      <FormControl fullWidth variant="standard">
        <InputLabel id="client-label">Cliente</InputLabel>
        <Select
          labelId="client-label"
          id="clientId"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          disabled={disabledFields}
        >
          {clients.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select herramienta */}
      <FormControl fullWidth variant="standard">
        <InputLabel id="tool-label">Herramienta</InputLabel>
        <Select
          labelId="tool-label"
          id="toolId"
          value={toolId}
          onChange={(e) => setToolId(e.target.value)}
          required
          disabled={disabledFields}
        >
          {tools.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Fechas */}
      <TextField
        id="deliveryDate"
        label="Fecha de entrega"
        type="date"
        value={deliveryDate}
        onChange={(e) => setDeliveryDate(e.target.value)}
        variant="standard"
        fullWidth
        required
        disabled={disabledFields}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        id="returnDate"
        label="Fecha de devolución"
        type="date"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
        variant="standard"
        fullWidth
        required
        disabled={disabledFields}
        InputLabelProps={{ shrink: true }}
      />

      {/* Multa diaria (solo visible en el registro) */}
      {!id && (
        <TextField
        id="dailyFineRate"
        label="Multa diaria (CLP$)"
        type="number"
        value={dailyFineRate}
        onChange={(e) => setDailyFineRate(e.target.value)}
        variant="standard"
        fullWidth
      />
      )}

      {/* Multa total */}
      {id && (
        <TextField
        id="totalFine"
        label="Multa total (CLP$)"
        type="number"
        value={totalFine || ""}
        disabled // se calcula por el backend
        variant="standard"
        fullWidth
      />
      )}

      {/* Daño */}
      {id && (
        <TextField
        id="damaged"
        select
        label="¿Herramienta dañada?"
        value={damaged ? 1 : 0}
        onChange={(e) => setDamaged(Number(e.target.value) === 1)}
        variant="standard"
        fullWidth
        required
      >
        <MenuItem value={0}>No</MenuItem>
        <MenuItem value={1}>Sí</MenuItem>
      </TextField>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={saveLoan}
        startIcon={<SaveIcon />}
        sx={{ mt: 2 }}
      >
        Guardar
      </Button>

      <ErrorPopup
        open={openError}
        message={errorMessage}
        onClose={() => setOpenError(false)}
      />

      <Link to="/loan/list" style={{ marginTop: "1rem" }}>
        Volver a la Lista
      </Link>
    </Box>
  );
};

export default AddReturnLoan;