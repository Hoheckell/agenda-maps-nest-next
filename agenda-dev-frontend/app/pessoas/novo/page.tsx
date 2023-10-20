"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  styled,
} from "@mui/material";
import moment from "moment";
import MapContainer from "../../components/MapContainer";
import { ChangeEvent, useState } from "react";
import { IPessoa } from "../../interfaces/pessoa.interface";
import Loading from "../../components/Loading";
import { pessoasService } from "../../services/pessoas/pessoas.service";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";
import styles from "./novo.module.scss";
import InputMask from "react-input-mask";
import { useRouter } from "next/navigation";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const NovaPessoa = () => {
  const [pessoa, setPessoa] = useState({} as IPessoa);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState("");
  const router = useRouter();

  const savePessoa = async () => {
    setLoading(true);
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(pessoa.email)) {
    await pessoasService
      .createPessoa(pessoa, file)
      .then((response) => {
        if (response !== undefined) {
          setPessoa(response);
          toast.success("Pessoa cadastrada com sucesso!");
          router.push("/pessoas");
        } else {
          toast.error("Dados ja existem ou são inválidos");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      toast.error("Email inválido");
    }
    setLoading(false);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    pessoa: IPessoa,
  ) => {
    if (e.target.files) {
      if (e.target.files[0] && e.target.files[0].type === "image/jpeg") {
        setFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
      } else {
        toast.error("Arquivo inválido, deve ser .jpeg");
      }
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h2 className={styles.header}>Cadastrar contato</h2>
        <div className={styles.loading}>
          <Loading loading={loading} />
        </div>
      </div>
      <img
        src={
          image
            ? image
            : pessoa?.foto
            ? process.env.NEXT_PUBLIC_APP_BACKEND_URL + pessoa.foto
            : "https://placehold.co/100x100"
        }
        style={{ width: "100px" }}
      />
      <CssBaseline />
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "20rem" },
        }}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Adicionar foto &nbsp;
              <Tooltip title="deve ser .jpeg">
                <InfoIcon />
              </Tooltip>
              <VisuallyHiddenInput
                type="file"
                onChange={(e) => handleFileChange(e, pessoa)}
              />
            </Button>
            <br />
            <TextField
              required
              id="nome"
              label="Nome"
              value={pessoa?.nome}
              sx={{ mt: 1 }}
              onChange={(e) => setPessoa({ ...pessoa, nome: e.target.value })}
            />
            <TextField
              required
              type="email"
              id="email"
              label="Email"
              value={pessoa?.email}
              sx={{ mt: 1 }}
              onChange={(e) => setPessoa({ ...pessoa, email: e.target.value })}
            />
            <TextField
              id="empresa"
              label="empresa"
              value={pessoa?.empresa}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setPessoa({ ...pessoa, empresa: e.target.value })
              }
            />
            <TextField
              required
              id="dtnasc"
              label="Data de Nasciemnto"
              type="date"
              value={pessoa?.data_nascimento}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setPessoa({ ...pessoa, data_nascimento: e.target.value })
              }
            />
            <FormControl sx={{ m: 1, minWidth: 320 }} >
            <InputLabel id="demo-simple-select-helper-label">Sexo</InputLabel>
            <Select
              required
              id="sexo"
              label="Sexo"
              value={pessoa?.sexo} 
              onChange={(e) => setPessoa({ ...pessoa, sexo: e.target.value })}
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Feminino">Feminino</MenuItem>
            </Select>
            </FormControl>
            <InputMask
              mask="(99)99999-9999"
              maskChar=" "
              value={pessoa?.celular}
              onChange={(e) =>
                setPessoa({ ...pessoa, celular: e.target.value })
              }
            >
              {() => <TextField id="celular" label="Celular" sx={{ mt: 1 }} />}
            </InputMask>
            <InputMask
              mask="(99)99999-9999"
              maskChar=" "
              value={pessoa?.whatsapp}
              onChange={(e) =>
                setPessoa({ ...pessoa, whatsapp: e.target.value })
              }
            >
              {() => (
                <TextField id="whatsapp" label="Whatsapp" sx={{ mt: 1 }} />
              )}
            </InputMask>
            <TextField
              id="endereco"
              label="Endereço"
              value={pessoa?.endereco}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setPessoa({ ...pessoa, endereco: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "5" }}>
            <Button variant="contained" onClick={() => savePessoa()}>
              OK
            </Button>
          </Grid>
          <Grid item xs={12} lg={8}>
            <MapContainer myAddress={pessoa?.endereco} />
          </Grid>
        </Grid>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default NovaPessoa;
