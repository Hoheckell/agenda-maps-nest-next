import axios from "axios";
import { IEmpresaResult } from "../../interfaces/empresas-result.interface";
import { IEmpresa } from "../../interfaces/empresa.interface";
import { cnpj } from "cpf-cnpj-validator";

export const empresasService = {
  async getEmpresas(): Promise<IEmpresaResult> {
    return await axios
      .get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas`)
      .then(async (response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async getEmpresa(empresaId: number): Promise<IEmpresa> {
    return await axios
      .get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas/${empresaId}`)
      .then(async (response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async updateEmpresa(empresa: IEmpresa): Promise<IEmpresa> {
    return await axios
      .put(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas/${empresa.id}`, {
        razao_social: empresa.razao_social,
        nome_fantasia: empresa.nome_fantasia,
        responsavel: empresa.responsavel,
        cnpj: empresa.cnpj,
        email: empresa.email,
        whatsapp: empresa.whatsapp,
        celular: empresa.celular,
        endereco: empresa.endereco,
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
  async removeLogo(empresaId: number): Promise<IEmpresa> {
    return await axios
      .put(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas/remove/logo/${empresaId}`,
      )
      .then(async (response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async upload(empresaId: number, file: File): Promise<IEmpresa> {
    const formData = new FormData();
    formData.append("file", file);
    return await axios
      .post(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas/add/logo/${empresaId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then(async (response) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  async createEmpresa(empresa: IEmpresa, file: File): Promise<IEmpresa> {
    const formData = new FormData();
    formData.append("logo", file);
    formData.append("empresa", JSON.stringify(empresa));
    return await axios
      .post(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async (response) => {
        if (response.status === 201) {
          return response.data;
        } 
      })
      .catch((error) => {
        console.log(error.response.data); 
      });
  },
  async deleteEmpresa(empresaId: number): Promise<boolean> {
    let result = false;
    await axios
      .delete(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas/${empresaId}`)
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
    .get(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}empresas/${qs}`)
    .then(async (response) => {
      if (response.status == 200) {
        return response.data
      }
    })
    .catch((error) => {
      console.log(error);
    }); 
  }
};
