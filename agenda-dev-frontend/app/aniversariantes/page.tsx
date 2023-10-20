"use client";

import { useCallback, useEffect, useState } from "react";
import { pessoasService } from "../services/pessoas/pessoas.service";
import { IPessoa } from '../interfaces/pessoa.interface';
import { IAniversariantes } from "../interfaces/aniversariantes.interface";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import Loading from "../components/Loading";
import moment from "moment";
import { DayCard } from "../components/DayCard";
import styles from "./aniversariantes.module.scss";
import { BirthDayMessage } from "../interfaces/birth-day-message.interface";
import { MailTo } from "../interfaces/mail-to.interface";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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

export default function Page() {
  const [aniversariantes, setAniversariantes] = useState(
    {} as IAniversariantes,
  ); 
  const [loading, setLoading] = useState(false);
  const [msgTo, setmsgTo] = useState([] as string[]);
  const [open, setOpen] = useState(false);
  const [todos, setTodos] = useState(false);
  const [message, setMessage] = useState("");
  const [sentEmails, setSentEmails] = useState([] as string[]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const theme = useTheme();

  const sendMessage = async () => {
    setLoading(true)
    let emails: MailTo[] = [];
    if (todos) {
      aniversariantes?.pessoas?.forEach((it) => { 
        emails.push({ name: it.nome, email: it.email});
      });
    } else {
      aniversariantes?.pessoas?.forEach((it) => {
        if(msgTo.find((x) => x == it.email))
        emails.push({ name: it.nome, email: it.email});
      });
    }
    const data: BirthDayMessage = {
      to: emails,
      message,
    };
    const sent = await pessoasService.sendBirthdayMessage(data); 
    console.log(sent)
    if(sent?.length > 0) {
      let emailsSent = []
      sent?.forEach((it) => { 
        emailsSent.push(it.accepted[0])
      })
      setSentEmails(emailsSent); 
    }
    setLoading(false)
  };

  const handleMsgTo = (e: SelectChangeEvent<typeof msgTo>) => { 
    setmsgTo([...e.target.value])
  };

  function getStyles(
    name: string,
    email: string,
    msgTo: string[],
    theme: Theme,
  ) {
    return {
      fontWeight:
        msgTo.filter((x) => x == email).length == 0
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const setMsgOpen = () => {
    setSentEmails([] as string[]);
    setmsgTo([] as string[])
    setOpen(true);
  }

  useEffect(() => {
    const getAniversariantes = async () => {
      setLoading(true);
      const aniversariantes = await pessoasService.getAniversariantes();
      setAniversariantes(aniversariantes);
      setLoading(false);
    };
    getAniversariantes();
  }, []);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <h1>Aniversariantes</h1>
        </Grid>
        <Grid item xs={4} sx={{ mt: 3 }}>
          <Button onClick={() => setMsgOpen()}>
            Enviar mensagem de aniversário
          </Button>
        </Grid>
        <Grid item xs={4}>
          {loading && <Loading loading={loading} theme={undefined} />}
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        {aniversariantes?.pessoas?.length > 0 &&
          aniversariantes?.days?.length > 0 &&
          aniversariantes?.days.map((d) => (
            <Grid item xs={3}>
              <DayCard key={d} dia={d} pessoas={aniversariantes.pessoas} />
            </Grid>
          ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Mensagem de aniversário
          </Typography>
          <FormGroup>
            <FormControl fullWidth>
              <InputLabel id="destiantarios-label">Destinatários</InputLabel>
              <Select
                labelId="destiantarios-label"
                id="destiantarios"
                value={msgTo}
                multiple
                disabled={todos}
                onChange={handleMsgTo}
                input={<OutlinedInput label="Email" />}
              >
                {aniversariantes?.pessoas?.length > 0 &&
                  aniversariantes.pessoas.map((p) => (
                    <MenuItem
                      key={p.id}
                      value={p.email}
                      style={getStyles(p.nome, p.email, msgTo, theme)}
                    >
                      {p.nome + " " + p.email}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  name="todos"
                  checked={todos}
                  onChange={(e) => setTodos(e.target.checked)}
                />
              }
              label="Todos"
            />
            <TextField
              id="messagem"
              label="Mensagem"
              multiline
              maxRows={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {sentEmails?.length > 0 && sentEmails.map((e) =>(
              <p>{e} <CheckCircleIcon /></p>
            ))
            }
            <Button variant="contained" sx={{ mt: 2 }} onClick={sendMessage}>
              Enviar mensagem
            </Button>
          </FormGroup>
        </Box>
      </Modal>
    </>
  );
}
