import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toolService from "../services/toolService";
import ErrorPopup from "../components/ErrorPopup";
import { Box, TextField, Button, FormControl, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const AddEditTool = () => {
  const [toolIdentifier, setToolIdentifier] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [replacementCost, setReplacementCost] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [currentStateId, setCurrentStateId] = useState(1); // por defecto es Disponible
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const saveTool = async (e) => {
    e.preventDefault();
    
    // Validar que no sean cadenas vacías o espacios
    if (!name.trim()) {
      setErrorMessage("El nombre es obligatorio");
      setOpenError(true);
      return;
    }
    if (!category.trim()) {
      setErrorMessage("La categoría es obligatoria");
      setOpenError(true);
      return;
    }

    // Validar Costo de Reposición (Numérico y positivo)
    // isNaN comprueba si NO es un número.
    if (!replacementCost || isNaN(replacementCost) || Number(replacementCost) <= 0) {
      setErrorMessage("El costo de reposición debe ser un número mayor a 0");
      setOpenError(true);
      return;
    }

    // Validar Precio (Numérico y no negativo)
    if (price === "" || isNaN(price) || Number(price) <= 0) {
      setErrorMessage("El precio debe ser un número válido mayor a 0");
      setOpenError(true);
      return;
    }

    // Validar Stock (Entero y positivo)
    // Number.isInteger verifica que no tenga decimales
    if (!stock || isNaN(stock) || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
      setErrorMessage("El stock debe ser un número entero mayor o igual a 0");
      setOpenError(true);
      return;
    }
    

    const tool = {
      id,
      toolIdentifier,
      name,
      category,
      replacementCost,
      price,
      stock,
      currentState: { id: currentStateId },
    };

    try {
      if (id) {
        // Actualiza los datos de la herramienta
        await toolService.update(tool).then(() => navigate("/tool/list"));
      } else {
        // Agrega una nueva herramienta
        await toolService.create(tool).then(() => navigate("/tool/list"));
      }
      navigate("/tool/list");
    } catch (error) {
      console.error("Error en la solicitud: ", error);

      const backendMessage = error.response?.data?.message || "Error al procesar la solicitud.";
      setErrorMessage(backendMessage);
      setOpenError(true);
    }
  };

  useEffect(() => {
    if (id) {
      setTitle("Editar Herramienta");
      toolService.get(id).then((res) => {
        const tool = res.data;
        setToolIdentifier(tool.toolIdentifier);
        setName(tool.name);
        setCategory(tool.category);
        setReplacementCost(tool.replacementCost);
        setPrice(tool.price);
        setStock(tool.stock);
        setCurrentStateId(tool.currentState?.id || 1);
      });
    } else {
      setTitle("Nueva Herramienta");
      setCurrentStateId(1);
    }
  }, [id]);

  return (
    <Box 
    component="form" 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center">
      
      <h3>{title}</h3>

        <FormControl fullWidth>
          <TextField
            id="toolIdentifier"
            label="Identificador (SKU)"
            value={toolIdentifier}
            onChange={(e) => setToolIdentifier(e.target.value)}
            variant="standard"
            helperText="SKU-123"
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="name"
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="standard"
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="category"
            label="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            variant="standard"
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="replacementCost"
            label="Costo de Reposición"
            type="number"
            value={replacementCost}
            onChange={(e) => setReplacementCost(e.target.value)}
            variant="standard"
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="price"
            label="Precio"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            variant="standard"
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="stock"
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            variant="standard"
            required
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            id="currentStateId"
            select
            label="Estado"
            value={currentStateId}
            onChange={(e) => setCurrentStateId(e.target.value)}
            variant="standard"
            style={{width: "10%"}}
            required
          >
            <MenuItem value={1}>Disponible</MenuItem>
            <MenuItem value={2}>Prestada</MenuItem>
            <MenuItem value={3}>En reparación</MenuItem>
            <MenuItem value={4}>Dada de baja</MenuItem>
          </TextField>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={saveTool}
          startIcon={<SaveIcon />}
        >
          Guardar
        </Button>

      <ErrorPopup 
        open={openError}
        message={errorMessage}
        onClose={() => setOpenError(false)}
      />
      <Link to="/tool/list">Volver a la Lista</Link>
    </Box>
  );
};

export default AddEditTool;