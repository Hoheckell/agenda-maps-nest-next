import axios from "axios";
import { IPessoaResult } from "../../interfaces/pessoas-result.interface";
import { IPessoa } from "../../interfaces/pessoa.interface";
import { IAniversariantes } from "../../interfaces/aniversariantes.interface";
import { BirthDayMessage } from "../../interfaces/birth-day-message.interface";
export const pessoasService = {
  async getPessoas(): Promise<IPessoaResult> {
    return await axios
      .get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas`)
      .then(async (response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getPessoa(pessoaId: number): Promise<IPessoa> {
    return await axios
      .get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/${pessoaId}`)
      .then(async (response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async updatePessoa(pessoa: IPessoa): Promise<IPessoa> {
    return await axios
      .put(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/${pessoa.id}`, {
        nome: pessoa.nome,
        email: pessoa.email,
        data_nascimento: pessoa.data_nascimento,
        sexo: pessoa.sexo,
        empresa: pessoa.empresa,
        whatsapp: pessoa.whatsapp,
        celular: pessoa.celular,
        endereco: pessoa.endereco,
      })
      .then(async (response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async removePhoto(pessoaId: number): Promise<IPessoa> {
    return await axios
      .put(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/remove/photo/${pessoaId}`)
      .then(async (response) => {
        if (response.status === 200) {
          return response.data
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async upload(pessoaId: number, file: File): Promise<IPessoa> {
    const formData = new FormData();
    formData.append("file", file); 
    return await axios
      .post(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/add/photo/${pessoaId}`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(async (response) => {
        if (response.status === 200) {
          return response.data
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async createPessoa(pessoa: IPessoa, file: File): Promise<IPessoa> {
    const formData = new FormData();
    formData.append("file", file); 
    formData.append("pessoa", JSON.stringify(pessoa)); 
    return await axios
      .post(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      })
      .then(async (response) => {
        if (response.status === 201) {
          return response.data
        }
      })
      .catch((error) => {
        console.log(error);
      });

  },
  async deletePessoa(pessoaId: number): Promise<boolean> {
    let result = false;
    await axios
      .delete(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/${pessoaId}`)
      .then(async (response) => {
        if (response.status == 204) {
          result = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return result;
  },
  async pesquisar(filter) {
    const qs = `?${new URLSearchParams(filter)}`
   return await axios
    .get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/${qs}`)
    .then(async (response) => {
      if (response.status == 200) {
        return response.data
      }
    })
    .catch((error) => {
      console.log(error);
    }); 
  },
  async getAniversariantes(): Promise<IAniversariantes> {
    return await axios
     .get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/aniversariantes/mes`)
     .then(async (response) => {
       if (response.status == 200) {
         return response.data
       }
     })
     .catch((error) => {
       console.log(error);
     }); 
  },
  async sendBirthdayMessage ( data: BirthDayMessage): Promise<any> {
    return await axios
     .post(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}pessoas/mensagem/aniversario`, data)
     .then(async (response) => {
       if (response.status == 200) {
        return response.data.responses
       } 
     })
     .catch((error) => {
       console.log(error);
     }); 
  }
};
