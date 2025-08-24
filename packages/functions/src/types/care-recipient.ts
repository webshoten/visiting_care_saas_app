import type {
    CareRecipientPage,
    CareRecipientType,
} from "@visiting_app/core/care-recipient";

// GraphQL CareRecipient型の定義
export function defineCareRecipientTypes(
    builder: PothosSchemaTypes.SchemaBuilder<
        // biome-ignore lint/complexity/noBannedTypes: Pothos default generic uses {}
        PothosSchemaTypes.ExtendDefaultTypes<{}>
    >,
) {
    const GraphQLCareRecipientType = builder.objectRef<CareRecipientType>(
        "CareRecipient",
    ).implement({
        fields: (t) => ({
            id: t.exposeString("id"),
            firstName: t.exposeString("firstName"),
            lastName: t.exposeString("lastName"),
            firstNameKana: t.exposeString("firstNameKana"),
            lastNameKana: t.exposeString("lastNameKana"),
            birthDate: t.exposeString("birthDate"),
            gender: t.exposeString("gender"),
            bloodType: t.exposeString("bloodType"),
            phone: t.exposeString("phone"),
            email: t.exposeString("email", { nullable: true }),
            address: t.exposeString("address", { nullable: true }),
            allergies: t.exposeString("allergies", { nullable: true }),
            medicalHistory: t.exposeString("medicalHistory", {
                nullable: true,
            }),
            medications: t.exposeString("medications", { nullable: true }),
            createdAt: t.exposeString("createdAt"),
            updatedAt: t.exposeString("updatedAt"),
        }),
    });

    // ページ型（items + nextToken）
    const GraphQLCareRecipientPageType = builder.objectRef<CareRecipientPage>(
        "CareRecipientPage",
    ).implement({
        fields: (t) => ({
            items: t.field({
                type: [GraphQLCareRecipientType] as const,
                resolve: (p) => p.items,
            }),
            nextToken: t.exposeString("nextToken", { nullable: true }),
        }),
    });

    return {
        GraphQLCareRecipientType,
        GraphQLCareRecipientPageType,
    };
}
