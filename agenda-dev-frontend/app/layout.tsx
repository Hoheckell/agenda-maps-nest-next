"use client";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  createTheme,
  CssBaseline,
  Link, 
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "styled-components";
import styles from './layout.module.scss';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#ffdd59",
    },
    secondary: {
      main: "#1B9CFC",
    },
    text: {
      primary: "#000000",
    },
  },
});
 
export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const router = useRouter();

    const handleLink = (link: string) =>{
        router.push(`/${link}`)
    }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Agenda-Dev</title>
        <link
          rel="icon"
          href="/assets/images/logo.png"
          type="image/png"
          sizes="16x16 32x32"
        />
      </head>
      <body>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/" className={styles.barlink}>Agenda-Dev</Link>
              </Typography>
              <Button color="inherit" onClick={() => handleLink("pessoas")}>Pessoas</Button>
              <Button color="inherit" onClick={() => handleLink("empresas")}>Empresas</Button>
              <Button color="inherit" onClick={() => handleLink("aniversariantes")}>Aniversariantes do mês</Button>
            </Toolbar>
          </AppBar>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
      </ThemeProvider></body>
    </html>
  );
}
