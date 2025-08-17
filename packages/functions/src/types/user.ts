import type { UserType } from "@visiting_app/core/user";

// GraphQL User型の定義関数
export function defineUserTypes(
    builder: PothosSchemaTypes.SchemaBuilder<
        PothosSchemaTypes.ExtendDefaultTypes<{}>
    >,
) {
    const GraphQLUserType = builder.objectRef<UserType>("User").implement({
        fields: (t) => ({
            userId: t.exposeString("userId"),
            noteId: t.exposeString("noteId"),
            version: t.exposeString("version"),
        }),
    });

    return {
        GraphQLUserType,
    };
}
