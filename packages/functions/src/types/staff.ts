import type { StaffPage, StaffType } from "@visiting_app/core/staff";

export function defineStaffTypes(
    builder: PothosSchemaTypes.SchemaBuilder<
        // biome-ignore lint/complexity/noBannedTypes: Pothos default uses {}
        PothosSchemaTypes.ExtendDefaultTypes<{}>
    >,
) {
    const GraphQLStaffType = builder.objectRef<StaffType>("Staff").implement({
        fields: (t) => ({
            id: t.exposeString("id"),
            name: t.exposeString("name"),
            staffId: t.exposeString("staffId"),
            address: t.exposeString("address"),
            qualification: t.exposeString("qualification"),
            createdAt: t.exposeString("createdAt"),
            updatedAt: t.exposeString("updatedAt"),
        }),
    });

    const GraphQLStaffPageType = builder.objectRef<StaffPage>("StaffPage")
        .implement({
            fields: (t) => ({
                items: t.field({
                    type: [GraphQLStaffType] as const,
                    resolve: (p) => p.items,
                }),
                nextToken: t.exposeString("nextToken", { nullable: true }),
            }),
        });

    return { GraphQLStaffType, GraphQLStaffPageType };
}
