import {
  Card,
  CardContent,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import moment from "moment";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IPessoa } from "../../interfaces/pessoa.interface";
import PhonelinkRingIcon from "@mui/icons-material/PhonelinkRing";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";

export const DayCard = ({ dia, pessoas }) => {
  const isTheDay = (value) =>
    moment(value.data_nascimento).toDate().getDate() == dia;
  return (
    <>
      <Card sx={{ maxWidth: 350, minWidth: 200, backgroundColor: "#ecf0f1" }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Dia {dia}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pessoas.filter(isTheDay).map((p: IPessoa) => (
              <List key={p.id}>
              <ListItem>
              <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText>                  
                  <strong>Nome:</strong> <br/>{p.nome}
                </ListItemText>
                </ListItem>
            <Divider light />
                <ListItem>
              <ListItemIcon><MailIcon /></ListItemIcon>
                <ListItemText>
                  
                <strong>Email:</strong><br/>
                  <Link href={"mailto:" + p.email} target="_blank">
                    {p.email}
                  </Link>
                </ListItemText>
                </ListItem>
            <Divider light />
                <ListItem>
              <ListItemIcon><PhonelinkRingIcon /></ListItemIcon>
                <ListItemText>
                <strong>Celular:</strong><br/> {p.celular}
                </ListItemText>
                </ListItem>
            <Divider light />
                <ListItem>
              <ListItemIcon><WhatsAppIcon /> </ListItemIcon>
                <ListItemText>
                <strong>Whatsapp:</strong><br/>
                  <Link
                    href={
                      "https://api.whatsapp.com/send?phone=" +
                      p.whatsapp.replace(/[\(\)\.\s-]+/g, "")
                    }
                    target="_blank"
                  >
                    {p.whatsapp}
                  </Link>
                </ListItemText>
                </ListItem> 
            <Divider light />
              </List>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};
