export interface StaffType {
    id: string;
    name: string;
    staffId: string;
    address: string;
    qualification: string;
    createdAt: string;
    updatedAt: string;
}

export type StaffPage = {
    items: StaffType[];
    nextToken?: string;
};

import {
    type DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";

export namespace Staff {
    export async function addStaff(
        docClient: DynamoDBDocumentClient,
        data: Omit<StaffType, "id" | "createdAt" | "updatedAt">,
    ): Promise<StaffType> {
        const now = new Date().toISOString();
        const id = `staff_${Date.now()}_${
            Math.random().toString(36).slice(2, 11)
        }`;

        const staff: StaffType = {
            ...data,
            id,
            createdAt: now,
            updatedAt: now,
        };

        await docClient.send(
            new PutCommand({
                TableName: Resource.StaffTable.name,
                Item: staff,
            }),
        );

        return staff;
    }

    export async function listStaff(
        docClient: DynamoDBDocumentClient,
        params: { limit?: number; nextToken?: string },
    ): Promise<StaffPage> {
        const exclusiveStartKey = params.nextToken
            ? (JSON.parse(
                Buffer.from(params.nextToken, "base64").toString("utf8"),
            ) as Record<string, unknown>)
            : undefined;

        const res = await docClient.send(
            new ScanCommand({
                TableName: Resource.StaffTable.name,
                Limit: params.limit ?? 20,
                ExclusiveStartKey: exclusiveStartKey,
            }),
        );

        const items = (res.Items || []).map((item) => {
            return {
                id: item.id,
                name: item.name,
                staffId: item.staffId,
                address: item.address,
                qualification: item.qualification,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            } as StaffType;
        });
        const nextToken = res.LastEvaluatedKey
            ? Buffer.from(JSON.stringify(res.LastEvaluatedKey), "utf8")
                .toString("base64")
            : undefined;

        return { items, nextToken };
    }
}
