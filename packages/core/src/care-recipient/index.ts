import {
    type DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    ScanCommand,
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

export type CareRecipientPage = {
    items: CareRecipientType[];
    nextToken?: string;
};

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

    // Legacy simple fetch (to be removed after migration)
    export async function getCareRecipients(
        docClient: DynamoDBDocumentClient,
    ): Promise<CareRecipientType[]> {
        try {
            const res = await docClient.send(
                new ScanCommand({
                    TableName: Resource.CareRecipientTable.name,
                    Limit: 100,
                }),
            );

            return (res.Items || []).map((item) => {
                return {
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
                };
            });
        } catch (error) {
            return [];
        }
    }

    export async function listCareRecipients(
        docClient: DynamoDBDocumentClient,
        params: { limit?: number; nextToken?: string },
    ): Promise<CareRecipientPage> {
        const exclusiveStartKey = params.nextToken
            ? (JSON.parse(
                Buffer.from(params.nextToken, "base64").toString("utf8"),
            ) as Record<string, unknown>)
            : undefined;

        const res = await docClient.send(
            new ScanCommand({
                TableName: Resource.CareRecipientTable.name,
                Limit: params.limit ?? 20,
                ExclusiveStartKey: exclusiveStartKey,
            }),
        );

        const items = (res.Items || []).map((item) => {
            return {
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
            };
        });
        const nextToken = res.LastEvaluatedKey
            ? Buffer.from(JSON.stringify(res.LastEvaluatedKey), "utf8")
                .toString("base64")
            : undefined;

        return { items, nextToken };
    }
}
