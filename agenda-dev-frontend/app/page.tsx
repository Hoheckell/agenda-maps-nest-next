"use client";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  createTheme,
  CssBaseline,
  Grid,
  Card,
  CardActions,
  CardContent,
  Link,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import { IPessoaResult } from "./interfaces/pessoas-result.interface";
import { pessoasService } from "./services/pessoas/pessoas.service";
import { IEmpresaResult } from "./interfaces/empresas-result.interface";
import { empresasService } from "./services/empresas/empresas.service";
import Loading from "./components/Loading";
import moment from "moment";

export default function Page() {
  const [pessoas, setPessoas] = useState({} as IPessoaResult);
  const [empresas, setEmpresas] = useState({} as IEmpresaResult);
  const [aniversariantes, setAniversariantes] = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getPessoas = async () => {
      setLoading(true);
      const pessoas = await pessoasService.getPessoas();
      setPessoas(pessoas);
      checkAniversario(pessoas);
      setLoading(false);
    };
    getPessoas();
    const getEmpresas = async () => {
      setLoading(true);
      const empresas = await empresasService.getEmpresas();
      setEmpresas(empresas);
      setLoading(false);
    };
    getEmpresas();
    const checkAniversario = (pessoas: IPessoaResult) => { 
      if(pessoas?.results?.length > 0) {
        let count = 0;
        pessoas.results.forEach(pessoa => {
          const birthDay = moment(pessoa.data_nascimento).toDate().getDate(); 
          const birthMonth = moment(pessoa.data_nascimento).toDate().getMonth()+1;  
          if(birthDay === moment().toDate().getDate() && birthMonth === (moment().toDate().getMonth()+1)) {
            count ++;
          }
        });
        setAniversariantes(count);
      }
    };
  }, []);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card sx={{ maxWidth: 345, backgroundColor: "#7ed6df" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Pessoas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total</strong>:{" "}
                <Chip
                  label={pessoas?.count ?? 0}
                  color="success"
                  variant="outlined"
                />
                {loading && <Loading loading={loading} theme={undefined} />}
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/pessoas">Listar Pessoas</Link>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ maxWidth: 345, backgroundColor: "#c7ecee" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Empresas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total</strong>:{" "}
                <Chip
                  label={empresas?.count ?? 0}
                  color="primary"
                  variant="outlined"
                />
                {loading && <Loading loading={loading} theme={undefined} />}
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/pessoas">Listar Empresas</Link>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ maxWidth: 345, backgroundColor: "#dff9fb" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Aniversariantes Hoje
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total</strong>:{" "}
                <Chip
                  label={aniversariantes}
                  color="success"
                  variant="outlined"
                />
                {loading && <Loading loading={loading} theme={undefined} />}
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/aniversariantes">Aniversariantes do mês</Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
