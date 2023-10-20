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
  Pagination,
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
import { pessoasService } from "../services/pessoas/pessoas.service";
import { IPessoa } from "../interfaces/pessoa.interface";
import { IPessoaResult } from "../interfaces/pessoas-result.interface";
import moment from "moment";
import styles from "./pessoas.module.scss";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Loading from "../components/Loading";
import InfoIcon from "@mui/icons-material/Info";
import MapContainer from "../components/MapContainer";
import { useRouter } from "next/navigation";
import InputMask from "react-input-mask";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import RoomIcon from "@mui/icons-material/Room";
import BusinessIcon from "@mui/icons-material/Business";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PreviousItem from "../assets/img/arrow_left_icn.svg";
import NextItem from "../assets/img/arrow_rigth_icn.svg";
import ReactPaginate from "react-paginate";
import Image from "next/image";
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
  const [pessoas, setPessoas] = useState({} as IPessoaResult);
  const [pessoa, setPessoa] = useState({} as IPessoa);
  const [loading, setLoading] = useState(false);
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [businessSearch, setBusinessSearch] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [currentItems, setCurrentItems] = useState({} as IPessoaResult);
  const [shownItems, setShownItems] = useState([] as IPessoa[]);
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [map, setMap] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenMap = () => setOpenMap(true);
  const handleCloseMap = () => setOpenMap(false);
  const router = useRouter();

  const handleRowClick = async (id: number) => {
    const pessoa = await pessoasService.getPessoa(id);
    setPessoa(pessoa);
    setOpen(true);
  };

  const updatePessoa = async () => {
    setLoading(true);
    const updatedPessoa = await pessoasService.updatePessoa(pessoa);
    setPessoa(updatedPessoa);
    setLoading(false);
    toast.success("Pessoa alterada com sucesso!");
  };

  const removePhoto = async (id: number) => {
    setLoading(true);
    const pessoa = await pessoasService.removePhoto(id);
    setPessoa(pessoa);
    setLoading(false);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    pessoa: IPessoa,
  ) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      if (e.target.files[0] && e.target.files[0].type === "image/jpeg") {
        submitFile(e.target.files[0], pessoa);
        console.log(e.target.files[0].type);
      } else {
        toast.error("Invalid file");
      }
    }
  };

  const submitFile = async (file: File, pessoa: IPessoa) => {
    setLoading(true);
    const updatedPessoa = await pessoasService.upload(pessoa.id, file);
    setPessoa(updatedPessoa);
    toast.success("Foto alterada com sucesso!");
    setLoading(false);
  };

  const deletePessoa = async (pessoaId: number) => {
    setLoading(true);
    const deleted = await pessoasService.deletePessoa(pessoaId);
    if (deleted) {
      toast.success("Pessoa excluída com sucesso!");
      const pessoas = await pessoasService.getPessoas();
      setCurrentItems(pessoas);
    } else {
      toast.error("Erro ao excluir pessoa!");
    }
    setLoading(false);
  };

  const search = async () => {
    setLoading(true);
    const filter = {
      nome: nameSearch,
      email: emailSearch,
      endereco: addressSearch,
      empresa: businessSearch,
    };
    const pessoas = await pessoasService.pesquisar(filter);
    setCurrentItems(pessoas);
    setLoading(false);
  };

  const clearSearch = async () => {
    setNameSearch("");
    setEmailSearch("");
    setAddressSearch("");
    setBusinessSearch("");
    setLoading(true);
    const pessoas = await pessoasService.getPessoas();
    setCurrentItems(pessoas);
    setLoading(false);
  };

  const handlePageClick = (event: { selected: number }) => {
    const newOffset =
      (event.selected * itemsPerPage) % currentItems?.results?.length;
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
    const getPessoas = async () => {
      setLoading(true);
      const pessoas = await pessoasService.getPessoas();
      setCurrentItems(pessoas);
      setLoading(false);
    };
    if (!currentItems?.results) getPessoas();

    const endOffset = itemOffset + itemsPerPage;
    setShownItems(currentItems?.results?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(currentItems?.results?.length / itemsPerPage));
  }, [pessoa, currentItems, itemOffset, itemsPerPage]);

  return (
    <>
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={6} lg={6}>
          <h1>Pessoas</h1>
        </Grid>
        <Grid item xs={12} lg={12}>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-nome"
              endAdornment={
                <InputAdornment position="end">
                  <PersonIcon />
                </InputAdornment>
              }
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
            <FormHelperText id="outlined-weight-helper-text">
              Busca por nome
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-email"
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
          <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
            <OutlinedInput
              id="search-address"
              endAdornment={
                <InputAdornment position="end">
                  <BusinessIcon />
                </InputAdornment>
              }
              value={businessSearch}
              onChange={(e) => setBusinessSearch(e.target.value)}
            />
            <FormHelperText id="outlined-weight-helper-text">
              Busca por empresa
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
          <Button color="primary" onClick={() => router.push("/pessoas/novo")}>
            Adicionar Pessoa
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
              <TableCell>Nome</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Empresa</TableCell>
              <TableCell align="right">Dt.Nascimento</TableCell>
              <TableCell align="right">Sexo</TableCell>
              <TableCell align="right">Celular</TableCell>
              <TableCell align="right">Whatsapp</TableCell>
              <TableCell align="right">Endereço</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shownItems?.length > 0 &&
              shownItems.map((pessoa) => (
                <TableRow
                  key={pessoa.id}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {pessoa.nome}
                  </TableCell>
                  <TableCell align="right">
                    <Link href={"mailto:" + pessoa.email} target="_blank">
                      {pessoa.email}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{pessoa.empresa}</TableCell>
                  <TableCell align="right">
                    {moment(pessoa.data_nascimento).format("DD/MM/Y")}
                  </TableCell>
                  <TableCell align="right">{pessoa.sexo}</TableCell>
                  <TableCell align="right">{pessoa.celular}</TableCell>
                  <TableCell align="right">
                    <Link
                      href={
                        "https://api.whatsapp.com/send?phone=" +
                        pessoa.whatsapp.replace(/[\(\)\.\s-]+/g, "")
                      }
                      target="_blank"
                    >
                      {pessoa.whatsapp}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{pessoa.endereco}</TableCell>
                  <TableCell align="right">
                    <ButtonGroup
                      variant="contained"
                      aria-label="outlined primary button group"
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleRowClick(pessoa.id)}
                      >
                        <ModeEditIcon />
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => deletePessoa(pessoa.id)}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        title="Exibir no mapa"
                        variant="outlined"
                        onClick={() => showMap(pessoa.endereco)}
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
            {pessoa.nome?.toUpperCase()}
          </Typography>
          <div className={styles.imageArea}>
            <img
              src={
                pessoa.foto
                  ? process.env.NEXT_PUBLIC_APP_BACKEND_URL + pessoa.foto
                  : "https://placehold.co/100x100"
              }
              style={{ width: "100px" }}
            />
            <div className={styles.buttons}>
              {pessoa.foto && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removePhoto(pessoa.id)}
                >
                  Excluir foto
                </Button>
              )}
              {pessoa.foto == null && (
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
                id="nome"
                label="Nome"
                value={pessoa.nome}
                sx={{ mt: 1 }}
                onChange={(e) => setPessoa({ ...pessoa, nome: e.target.value })}
              />
              <TextField
                required
                type="email"
                id="email"
                label="Email"
                value={pessoa.email}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setPessoa({ ...pessoa, email: e.target.value })
                }
              />
              <TextField
                id="empresa"
                label="Empresa"
                value={pessoa.empresa}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setPessoa({ ...pessoa, empresa: e.target.value })
                }
              />
              <TextField
                required
                type="date"
                id="dtnasc"
                label="Data de Nasciemnto"
                value={moment(pessoa.data_nascimento).format("Y-MM-DD")}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setPessoa({
                    ...pessoa,
                    data_nascimento: moment(e.target.value).toDate(),
                  })
                }
              />
              <FormControl sx={{ m: 1, minWidth: 320 }}>
                <InputLabel id="demo-simple-select-helper-label">
                  Sexo
                </InputLabel>
                <Select
                  required
                  id="sexo"
                  label="Sexo"
                  value={pessoa?.sexo}
                  onChange={(e) =>
                    setPessoa({ ...pessoa, sexo: e.target.value })
                  }
                >
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                </Select>
              </FormControl>
              <InputMask
                mask="(99)99999-9999"
                maskChar=" "
                value={pessoa.celular}
                onChange={(e) =>
                  setPessoa({ ...pessoa, celular: e.target.value })
                }
              >
                {() => (
                  <TextField id="celular" label="Celular" sx={{ mt: 1 }} />
                )}
              </InputMask>
              <InputMask
                mask="(99)99999-9999"
                maskChar=" "
                value={pessoa.whatsapp}
                onChange={(e) =>
                  setPessoa({ ...pessoa, whatsapp: e.target.value })
                }
              >
                {() => (
                  <TextField id="whatsapp" label="Whatsapp" sx={{ mt: 1 }} />
                )}
              </InputMask>
              <TextField
                required
                id="endereco"
                label="Endereço"
                value={pessoa.endereco}
                sx={{ mt: 1 }}
                onChange={(e) =>
                  setPessoa({ ...pessoa, endereco: e.target.value })
                }
              />
              <Button variant="contained" onClick={() => updatePessoa()}>
                Alterar
              </Button>
              <MapContainer myAddress={pessoa.endereco} mapWidth={undefined} mapHeight={undefined} />
            </div>
          </Box>
        </Box>
      </Modal>
      <Modal open={openMap} onClose={handleCloseMap}>
        <Box sx={modalStyle}>
          <MapContainer myAddress={map} mapWidth={'500px'} mapHeight={'500px'} />
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
