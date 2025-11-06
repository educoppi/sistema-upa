import Medication from "@/models/Medication";
import axios from "axios";
import api from "./api";

const medicationService = {
    async busca(name?: string, dosage?: string, type?: string): Promise<Medication[]> {
        return new Promise<Medication[]>(async function (resolve, reject) {
            const params = new URLSearchParams();
    
            if (name) params.append('name', name.toLowerCase());
            if (type) params.append('type', type.toLowerCase());
            if (dosage) params.append('dosage', dosage);
        
            try {
                const response = await api.get(`/medications?${params.toString()}`);
                resolve(response.data);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error('Erro ao buscar medicamentos:', error.response?.data || error.message);
                } else {
                    console.error('Erro inesperado:', error);
                }
                reject(error);
            }
        });
    },

    
}

export default medicationService;




// const medicamentos = await medicationService.busca('dipirona');

// medicationService.busca('dipirona')
// .then(function (medications) {

// })
// .catch(function (error) {
    
// });
