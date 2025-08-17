import {
    type DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";

export interface CareRecipientType {
    id: string;
    lastName: string;
    firstName: string;
    lastNameKana: string;
    firstNameKana: string;
    birthDate: string;
    gender: string;
    bloodType: string;
    phone: string;
    email?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactRelation?: string;
    emergencyContactPhone?: string;
    allergies?: string;
    medicalHistory?: string;
    medications?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export namespace CareRecipient {
    export async function addCareRecipient(
        docClient: DynamoDBDocumentClient,
        data: Omit<CareRecipientType, "id" | "createdAt" | "updatedAt">,
    ): Promise<CareRecipientType> {
        const now = new Date().toISOString();
        const id = `care_${Date.now()}_${
            Math.random().toString(36).substr(2, 9)
        }`;

        const careRecipient: CareRecipientType = {
            ...data,
            id,
            createdAt: now,
            updatedAt: now,
        };

        await docClient.send(
            new PutCommand({
                TableName: Resource.CareRecipientTable.name,
                Item: careRecipient,
            }),
        );

        return careRecipient;
    }

    export async function getCareRecipients(
        docClient: DynamoDBDocumentClient,
    ): Promise<CareRecipientType[]> {
        const res = await docClient.send(
            new QueryCommand({
                TableName: Resource.CareRecipientTable.name,
                KeyConditionExpression: "begins_with(pk, :pk)",
                ExpressionAttributeValues: {
                    ":pk": "CARE_RECIPIENT#",
                },
            }),
        );

        return (res.Items || []).map((item) => ({
            id: item.id,
            lastName: item.lastName,
            firstName: item.firstName,
            lastNameKana: item.lastNameKana,
            firstNameKana: item.firstNameKana,
            birthDate: item.birthDate,
            gender: item.gender,
            bloodType: item.bloodType,
            phone: item.phone,
            email: item.email,
            address: item.address,
            emergencyContactName: item.emergencyContactName,
            emergencyContactRelation: item.emergencyContactRelation,
            emergencyContactPhone: item.emergencyContactPhone,
            allergies: item.allergies,
            medicalHistory: item.medicalHistory,
            medications: item.medications,
            notes: item.notes,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        }));
    }
}
