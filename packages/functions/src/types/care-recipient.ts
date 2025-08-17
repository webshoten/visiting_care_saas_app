import type { CareRecipientType } from "@visiting_app/core/care-recipient";

// GraphQL CareRecipient型の定義
export function defineCareRecipientTypes(
    builder: PothosSchemaTypes.SchemaBuilder<
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
            emergencyContactName: t.exposeString("emergencyContactName", {
                nullable: true,
            }),
            emergencyContactRelation: t.exposeString(
                "emergencyContactRelation",
                {
                    nullable: true,
                },
            ),
            emergencyContactPhone: t.exposeString("emergencyContactPhone", {
                nullable: true,
            }),
            allergies: t.exposeString("allergies", { nullable: true }),
            medicalHistory: t.exposeString("medicalHistory", {
                nullable: true,
            }),
            medications: t.exposeString("medications", { nullable: true }),
            createdAt: t.exposeString("createdAt"),
            updatedAt: t.exposeString("updatedAt"),
        }),
    });

    return {
        GraphQLCareRecipientType,
    };
}
