type Movement = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    medicationId: number;
    userId: number;
    doctorId: number;
    date: Date;
    quantity: number;
    movementType: string;
    approvedMovement: boolean;
}

export default Movement;