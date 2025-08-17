import SchemaBuilder from "@pothos/core";
import {
  CareRecipient,
  type CareRecipientType,
} from "@visiting_app/core/care-recipient";
import { docClient } from "@visiting_app/core/dynamo-db";
import { User, type UserType } from "@visiting_app/core/user";

// Pothos Builderの作成
export const builder = new SchemaBuilder({});

// GraphQL User型の定義
export const GraphQLUserType = builder.objectRef<UserType>("User").implement({
  fields: (t) => ({
    userId: t.exposeString("userId"),
    noteId: t.exposeString("noteId"),
    version: t.exposeString("version"),
  }),
});

// GraphQL CareRecipient型の定義
export const GraphQLCareRecipientType = builder.objectRef<CareRecipientType>(
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
    emergencyContactRelation: t.exposeString("emergencyContactRelation", {
      nullable: true,
    }),
    emergencyContactPhone: t.exposeString("emergencyContactPhone", {
      nullable: true,
    }),
    allergies: t.exposeString("allergies", { nullable: true }),
    medicalHistory: t.exposeString("medicalHistory", { nullable: true }),
    medications: t.exposeString("medications", { nullable: true }),
    createdAt: t.exposeString("createdAt"),
    updatedAt: t.exposeString("updatedAt"),
  }),
});

// Query型の定義
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: async () =>
        `Hello from Pothos!DynamoDB data is ${
          JSON.stringify(await User.getUser(docClient, { userId: "1" }))
        }`,
    }),
    user: t.field({
      type: GraphQLUserType,
      args: {
        userId: t.arg.string({ required: true }),
      },
      resolve: async (_, { userId }) => {
        const users = await User.getUser(docClient, { userId });
        return users[0];
      },
    }),
    careRecipients: t.field({
      type: [GraphQLCareRecipientType],
      resolve: async () => {
        return await CareRecipient.getCareRecipients(docClient);
      },
    }),
  }),
});

// Mutation型の定義
builder.mutationType({
  fields: (t) => ({
    addCareRecipient: t.field({
      type: GraphQLCareRecipientType,
      args: {
        firstName: t.arg.string({ required: true }),
        lastName: t.arg.string({ required: true }),
        firstNameKana: t.arg.string({ required: true }),
        lastNameKana: t.arg.string({ required: true }),
        birthDate: t.arg.string({ required: true }),
        gender: t.arg.string({ required: true }),
        bloodType: t.arg.string({ required: true }),
        phone: t.arg.string({ required: true }),
        email: t.arg.string({ required: false }),
        address: t.arg.string({ required: false }),
        emergencyContactName: t.arg.string({ required: false }),
        emergencyContactRelation: t.arg.string({ required: false }),
        emergencyContactPhone: t.arg.string({ required: false }),
        allergies: t.arg.string({ required: false }),
        medicalHistory: t.arg.string({ required: false }),
        medications: t.arg.string({ required: false }),
        notes: t.arg.string({ required: false }),
      },
      resolve: async (_, args) => {
        return await CareRecipient.addCareRecipient(docClient, {
          firstName: args.firstName,
          lastName: args.lastName,
          firstNameKana: args.firstNameKana,
          lastNameKana: args.lastNameKana,
          birthDate: args.birthDate,
          bloodType: args.bloodType,
          gender: args.gender,
          phone: args.phone,
          email: args.email ?? undefined,
          address: args.address ?? undefined,
          emergencyContactName: args.emergencyContactName ?? undefined,
          emergencyContactRelation: args.emergencyContactRelation ?? undefined,
          emergencyContactPhone: args.emergencyContactPhone ?? undefined,
          allergies: args.allergies ?? undefined,
          medicalHistory: args.medicalHistory ?? undefined,
          medications: args.medications ?? undefined,
          notes: args.notes ?? undefined,
        });
      },
    }),
  }),
});

// スキーマをエクスポート
export const schema = builder.toSchema();
