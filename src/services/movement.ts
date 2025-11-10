import axios from "axios";
import api from "./api";
import Movement from "@/models/Movement";

const movementService = {
    async create(movementData: Movement): Promise<Movement> {
        return new Promise<Movement>(async (resolve, reject) => {
            try {
                const response = await api.post('/movements', movementData);
                resolve(response.data);
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    console.error('Erro ao criar movimentação:', error.response?.data || error.message);
                } else {
                    console.error('Erro inesperado:', error);
                }
                reject(error);
            }
        });
    },
};

export default movementService;
 