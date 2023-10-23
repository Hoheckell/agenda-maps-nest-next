"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Alert,
  Box,
  Button,
  CssBaseline,
  Divider,
  Grid,
  Modal,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import moment from "moment";
import MapContainer from "../../components/MapContainer";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";
import styles from "./novo.module.scss";
import InputMask from "react-input-mask";
import { IEmpresa } from "../../interfaces/empresa.interface";
import { empresasService } from "../../services/empresas/empresas.service";
import { useRouter } from "next/navigation";
import { cnpj } from "cpf-cnpj-validator";

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

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NovaEmpresa = () => {
  const [empresa, setEmpresa] = useState({} as IEmpresa);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();

  const saveEmpresa = async () => {
    setLoading(true);
    const validCnpj = cnpj.isValid(empresa.cnpj)
    const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(empresa.email)
    if (validEmail && validCnpj) {
    await empresasService
      .createEmpresa(empresa, file)
      .then((response) => {
        if (response !== undefined) {
          setEmpresa(response);
          toast.success("Empresa cadastrada com sucesso!");
          router.push("/empresas");
        } else {
            toast.error("Dados ja existem ou são inválidos");
        }
      })
      .catch((err) => {
        console.log(err);
      });
      setLoading(false);
    } else {
        toast.error(`Dados inválidos ${(!validEmail)?"Email":""} ${(!validCnpj)?"CNPJ":"" }`);
        setLoading(false);
        return;
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    pessoa: IEmpresa,
  ) => {
    if (e.target.files) {
      if (e.target.files[0] && e.target.files[0].type === "image/jpeg") {
        setFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
      } else {
        toast.error("Invalid file");
      }
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h2 className={styles.header}>Cadastrar empresa</h2>
        <div className={styles.loading}>
          <Loading loading={loading} />
        </div>
      </div>
      <img
        src={
          image
            ? image
            : empresa?.logo
            ? process.env.NEXT_PUBLIC_APP_BACKEND_URL + empresa.logo
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
                onChange={(e) => handleFileChange(e, empresa)}
              />
            </Button>
            <br />
            <TextField
              required
              id="razao_social"
              label="Razão Social"
              value={empresa?.razao_social}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setEmpresa({ ...empresa, razao_social: e.target.value })
              }
            />
            <TextField
              required
              id="nome_fantasia"
              label="Nome Fantasia"
              value={empresa?.nome_fantasia}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setEmpresa({ ...empresa, nome_fantasia: e.target.value })
              }
            />
            <TextField
              required
              id="responsavel"
              label="Responsável"
              value={empresa?.responsavel}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setEmpresa({ ...empresa, responsavel: e.target.value })
              }
            />
            <TextField
              required
              id="cnpj"
              label="CNPJ"
              value={empresa?.cnpj}
              sx={{ mt: 1 }}
              onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })}
            />
            <TextField
              required
              type="email"
              id="email"
              label="Email"
              value={empresa?.email}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setEmpresa({ ...empresa, email: e.target.value })
              }
            />
            <InputMask
              mask="(99)99999-9999"
              maskChar=" "
              value={empresa?.celular}
              onChange={(e) =>
                setEmpresa({ ...empresa, celular: e.target.value })
              }
            >
              {() => <TextField id="celular" label="Celular" sx={{ mt: 1 }} />}
            </InputMask>
            <InputMask
              mask="(99)99999-9999"
              maskChar=" "
              value={empresa?.whatsapp}
              onChange={(e) =>
                setEmpresa({ ...empresa, whatsapp: e.target.value })
              }
            >
              {() => (
                <TextField id="whatsapp" label="Whatsapp" sx={{ mt: 1 }} />
              )}
            </InputMask>
            <InputMask
              mask="(99)99999-9999"
              maskChar=" "
              value={empresa?.telefone}
              onChange={(e) =>
                setEmpresa({ ...empresa, telefone: e.target.value })
              }
            >
              {() => (
                <TextField id="telefone" label="Telefone" sx={{ mt: 1 }} />
              )}
            </InputMask>
            <TextField
              id="endereco"
              label="Endereço"
              value={empresa?.endereco}
              sx={{ mt: 1 }}
              onChange={(e) =>
                setEmpresa({ ...empresa, endereco: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "5" }}>
            <Button variant="contained" onClick={() => saveEmpresa()}>
              OK
            </Button>
          </Grid>
          <Grid item xs={12} lg={8}>
            <MapContainer myAddress={empresa?.endereco} mapWidth={undefined} mapHeight={undefined} />
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
      {/* <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Avisos
          </Typography>
          {emailError && (
            <Alert severity="error">O Email ja existe na base de dados</Alert>
          )}
          {cnpjError && (
            <Alert severity="error">O CNPJ ja existe na base de dados</Alert>
          )}
        </Box>
      </Modal> */}
    </>
  );
};

export default NovaEmpresa;
