"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  ButtonGroup,
  CssBaseline,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import moment from "moment";
import styles from "./empresas.module.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Loading from "../components/Loading";
import InfoIcon from "@mui/icons-material/Info";
import MapContainer from "../components/MapContainer";
import { useRouter } from "next/navigation";
import InputMask from "react-input-mask";
import { IEmpresaResult } from "../interfaces/empresas-result.interface";
import { IEmpresa } from "../interfaces/empresa.interface";
import { empresasService } from "../services/empresas/empresas.service";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { cnpj } from "cpf-cnpj-validator";
import PreviousItem from "../assets/img/arrow_left_icn.svg";
import NextItem from "../assets/img/arrow_rigth_icn.svg";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import BusinessIcon from "@mui/icons-material/Business";
import StoreIcon from "@mui/icons-material/Store";
import NumbersIcon from "@mui/icons-material/Numbers";
import RoomIcon from "@mui/icons-material/Room";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import MailIcon from "@mui/icons-material/Mail";
import MapIcon from "@mui/icons-material/Map";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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

export default function Page() {
  const [empresas, setEmpresas] = useState({} as IEmpresaResult);
  const [empresa, setEmpresa] = useState({} as IEmpresa);
  const [open, setOpen] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [currentItems, setCurrentItems] = useState({} as IEmpresaResult);
  const [shownItems, setShownItems] = useState([] as IEmpresa[]);
  const [nameSearch, setNameSearch] = useState("");
  const [razaoSearch, setRazaoSearch] = useState("");
  const [cnpjSearch, setCnpjSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [map, setMap] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenMap = () => setOpenMap(true);
  const handleCloseMap = () => setOpenMap(false);
  const router = useRouter();

  const handleRowClick = async (id: number) => {
    setLoading(true);
    const empresa = await empresasService.getEmpresa(id);
    setEmpresa(empresa);
    setOpen(true);
    setLoading(false);
  };

  const updateEmpresa = async () => {
    setLoading(true);
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(empresa.email)) {
      toast.error("Email inválido!");
      setLoading(false);
      setOpen(false);
      return;
    } else if (!cnpj.isValid(empresa.cnpj)) {
      toast.error("CNPJ inválido!");
      setLoading(false);
      setOpen(false);
      return;
    } else {
      const updatedEmpresa = await empresasService.updateEmpresa(empresa);
      setEmpresa(updatedEmpresa);
      const empresas = await empresasService.getEmpresas();
      setCurrentItems(empresas);
    }
    setLoading(false);
    toast.success("Empresa alterada com sucesso!");
    router.push("/empresas");
    setOpen(false);
  };

  const removeLogo = async (id: number) => {
    setLoading(true);
    const empresa = await empresasService.removeLogo(id);
    setEmpresa(empresa);
    setLoading(false);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    empresa: IEmpresa,
  ) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      if (e.target.files[0] && e.target.files[0].type === "image/jpeg") {
        submitFile(e.target.files[0], empresa);
        console.log(e.target.files[0].type);
      } else {
        toast.error("Invalid file");
      }
    }
  };

  const submitFile = async (file: File, empresa: IEmpresa) => {
    setLoading(true);
    const updatedEmpresa = await empresasService.upload(empresa.id, file);
    setEmpresa(updatedEmpresa);
    toast.success("Logo alterada com sucesso!");
    setLoading(false);
  };

  const deleteEmpresa = async (empresaId: number) => {
    setLoading(true);
    const deleted = await empresasService.deleteEmpresa(empresaId);
    if (deleted) {
      toast.success("Empresa excluída com sucesso!");
      const empresas = await empresasService.getEmpresas();
      setCurrentItems(empresas);
    } else {
      toast.error("Erro ao excluir empresa!");
    }
    setLoading(false);
  };

  const search = async () => {
    setLoading(true);
    const filter = {
      nome_fantasia: nameSearch,
      email: emailSearch,
      razao_social: razaoSearch,
      endereco: addressSearch,
      cnpj: cnpjSearch,
    };
    const pessoas = await empresasService.pesquisar(filter);
    setCurrentItems(pessoas);
    setLoading(false);
  };

  const clearSearch = async () => {
    setNameSearch("");
    setEmailSearch("");
    setRazaoSearch("");
    setAddressSearch("");
    setCnpjSearch("");
    setLoading(true);
    const empresas = await empresasService.getEmpresas();
    setCurrentItems(empresas);
    setLoading(false);
  };

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % currentItems?.count;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`,
    );
    setItemOffset(newOffset);
  };

  const handlePageChange = (event: SelectChangeEvent) => {
    setitemsPerPage(Number(event.target.value) || 5);
  };

  const showMap = (endereco: string) => {
    handleOpenMap();
    setMap(endereco);
  };

  useEffect(() => {
    const getEmpresas = async () => {
      setLoading(true);
      const empresas = await empresasService.getEmpresas();
      setCurrentItems(empresas);
      setLoading(false);
    };

    if (!currentItems?.results) getEmpresas();

    const endOffset = itemOffset + itemsPerPage;
    setShownItems(currentItems?.results?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(currentItems?.results?.length / itemsPerPage));
  }, [empresa, currentItems, itemOffset, itemsPerPage]);

  return (
    <>
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={6} lg={6}>
          <h1>Empresas</h1>
        </Grid>
        <Grid item xs={12} lg={12}>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-nome"
              endAdornment={
                <InputAdornment position="end">
                  <MailIcon />
                </InputAdornment>
              }
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
            />
            <FormHelperText id="outlined-weight-helper-text">
              Busca por email
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-nome"
              endAdornment={
                <InputAdornment position="end">
                  <BusinessIcon />
                </InputAdornment>
              }
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
            <FormHelperText id="outlined-weight-helper-text">
              Busca por nome fantasia
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-email"
              endAdornment={
                <InputAdornment position="end">
                  <StoreIcon />
                </InputAdornment>
              }
              value={razaoSearch}
              onChange={(e) => setRazaoSearch(e.target.value)}
            />
            <FormHelperText id="outlined-weight-helper-text">
              Busca por razão social
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-address"
              endAdornment={
                <InputAdornment position="end">
                  <NumbersIcon />
                </InputAdornment>
              }
              value={cnpjSearch}
              onChange={(e) => setCnpjSearch(e.target.value)}
            />
            <FormHelperText id="outlined-weight-helper-text">
              Busca por CNPJ
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-address"
              endAdornment={
                <InputAdornment position="end">
                  <RoomIcon />
                </InputAdornment>
              }
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
            />
            <FormHelperText id="outlined-weight-helper-text">
              Busca por endereço
            </FormHelperText>
          </FormControl>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            title="Pesquisar"
            onClick={() => search()}
          >
            <SearchIcon />
          </Button>
          <Button
            variant="contained"
            sx={{ mt: 2, ml: 2 }}
            title="Limpar campos"
            onClick={() => clearSearch()}
          >
            <ClearAllIcon />
          </Button>
        </Grid>
        <Grid item xs={3} lg={3}>
          <Button color="primary" onClick={() => router.push("/empresas/novo")}>
            Nova Empresa
          </Button>
        </Grid>
        <Grid item xs={3} lg={3}>
          {loading && <Loading loading={loading} theme={undefined} />}
        </Grid>
        <Grid item xs={3} lg={3} sx={{ textAlign: "right" }}>
          <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
            <InputLabel id="items-por-pagina-label" variant="filled">
              Por página
            </InputLabel>
            <Select
              labelId="items-por-pagina-label"
              id="items-por-pagina"
              value={itemsPerPage.toString()}
              defaultValue="5"
              label="5"
              onChange={handlePageChange}
            >
              <MenuItem value={5}>
                <em>5</em>
              </MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Razão Social</TableCell>
              <TableCell align="right">Nome Fantasia</TableCell>
              <TableCell align="right">Responsável</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">CNPJ</TableCell>
              <TableCell align="right">Celular</TableCell>
              <TableCell align="right">Whatsapp</TableCell>
              <TableCell align="right">Telefone</TableCell>
              <TableCell align="right">Endereço</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shownItems?.length > 0 &&
              shownItems.map((empresa) => (
                <TableRow
                  key={empresa.id}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {empresa.razao_social}
                  </TableCell>
                  <TableCell align="right">{empresa.nome_fantasia}</TableCell>
                  <TableCell align="right">{empresa.responsavel}</TableCell>
                  <TableCell align="right">
                    <Link href={"mailto:" + empresa.email} target="_blank">
                      {empresa.email}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{empresa.cnpj}</TableCell>
                  <TableCell align="right">{empresa?.celular}</TableCell>
                  <TableCell align="right">
                   {empresa.whatsapp && <Link
                      href={
                        "https://api.whatsapp.com/send?phone=" +
                        empresa.whatsapp?.replace(/[\(\)\.\s-]+/g, "")
                      }
                      target="_blank"
                    >
                      {empresa.whatsapp}
                    </Link>}
                  </TableCell>
                  <TableCell align="right">{empresa?.telefone}</TableCell>
                  <TableCell align="right">{empresa.endereco}</TableCell>
                  <TableCell align="right">
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                    >
                      <Button
                        title="Editar"
                        variant="outlined"
                        onClick={() => handleRowClick(empresa.id)}
                      >
                        <ModeEditIcon />
                      </Button>
                      <Button
                        title="Excluir"
                        variant="outlined"
                        onClick={() => deleteEmpresa(empresa.id)}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        title="Exibir no mapa"
                        variant="outlined"
                        onClick={() => showMap(empresa.endereco)}
                      >
                        <MapIcon />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ReactPaginate
        nextLabel={<Image src={NextItem} alt="proximo" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel={<Image src={PreviousItem} alt="anterior" />}
        pageClassName={styles.page_item}
        pageLinkClassName={styles.page_link}
        previousClassName={styles.page_item}
        previousLinkClassName={styles.page_link}
        nextClassName={styles.page_item}
        nextLinkClassName={styles.page_link}
        breakLabel="..."
        breakClassName={styles.page_item}
        breakLinkClassName={styles.page_link}
        containerClassName={styles.pagination}
        activeClassName={styles.active}
        renderOnZeroPageCount={null}
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {empresa.razao_social?.toUpperCase()}
          </Typography>
          <div className={styles.imageArea}>
            <img
              src={
                empresa.logo
                  ? process.env.NEXT_PUBLIC_APP_BACKEND_URL + empresa.logo
                  : "https://placehold.co/100x100"
              }
              style={{ width: "100px" }}
            />
            <div className={styles.buttons}>
              {empresa.logo && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeLogo(empresa.id)}
                >
                  Excluir foto
                </Button>
              )}
              {empresa.logo == null && (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Adicionar logo &nbsp;
                  <Tooltip title="deve ser .jpeg">
                    <InfoIcon />
                  </Tooltip>
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => handleFileChange(e, empresa)}
                  />
                </Button>
              )}
            </div>
          </div>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "20rem" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className={styles.divMap}>
              <TextField
                required
                id="razao_social"
                label="Razão Social"
                value={empresa.razao_social}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setEmpresa({ ...empresa, razao_social: e.target.value })
                }
              />
              <TextField
                required
                id="nome_fantasia"
                label="Nome Fantasia"
                value={empresa.nome_fantasia}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setEmpresa({ ...empresa, nome_fantasia: e.target.value })
                }
              />
              <TextField
                required
                id="responsavel"
                label="Responsável"
                value={empresa.responsavel}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setEmpresa({ ...empresa, responsavel: e.target.value })
                }
              />
              <TextField
                required
                id="cnpj"
                label="CNPJ"
                value={empresa.cnpj}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setEmpresa({ ...empresa, cnpj: e.target.value })
                }
              />
              <TextField
                required
                type="email"
                id="email"
                label="Email"
                value={empresa.email}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setEmpresa({ ...empresa, email: e.target.value })
                }
              />
              <InputMask
                mask="(99)99999-9999"
                maskChar=" "
                value={empresa.celular}
                onChange={(e) =>
                  setEmpresa({ ...empresa, celular: e.target.value })
                }
              >
                {() => (
                  <TextField id="celular" label="Celular" sx={{ mt: 1 }} />
                )}
              </InputMask>
              <InputMask
                mask="(99)99999-9999"
                maskChar=" "
                value={empresa.whatsapp}
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
                value={empresa.telefone}
                onChange={(e) =>
                  setEmpresa({ ...empresa, telefone: e.target.value })
                }
              >
                {() => (
                  <TextField id="telefone" label="Telefone" sx={{ mt: 1 }} />
                )}
              </InputMask>
              <TextField
                required
                id="endereco"
                label="Endereço"
                value={empresa.endereco}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setEmpresa({ ...empresa, endereco: e.target.value })
                }
              />
              <Button variant="contained" onClick={() => updateEmpresa()}>
                Alterar
              </Button>
              <MapContainer
                myAddress={empresa.endereco}
                mapWidth={undefined}
                mapHeight={undefined}
              />
            </div>
          </Box>
        </Box>
      </Modal>
      <Modal open={openMap} onClose={handleCloseMap}>
        <Box sx={modalStyle}>
          <MapContainer
            myAddress={map}
            mapWidth={"500px"}
            mapHeight={"500px"}
          />
        </Box>
      </Modal>
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
}
