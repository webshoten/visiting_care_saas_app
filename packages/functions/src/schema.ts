// biome-ignore assist/source/organizeImports: keep import order for clarity
import SchemaBuilder from "@pothos/core";
import { docClient } from "@visiting_app/core/dynamo-db";
import { User } from "@visiting_app/core/user";
import { CareRecipient } from "@visiting_app/core/care-recipient";
import { defineUserTypes } from "./types/user";
import { defineCareRecipientTypes } from "./types/care-recipient";
import { Staff } from "@visiting_app/core/staff";
import { defineStaffTypes } from "./types/staff";

// Pothos Builderの作成
export const builder = new SchemaBuilder({});
const userTypes = defineUserTypes(builder);
const careRecipientTypes = defineCareRecipientTypes(builder);
const staffTypes = defineStaffTypes(builder);

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
      type: userTypes.GraphQLUserType,
      args: {
        userId: t.arg.string({ required: true }),
      },
      resolve: async (_, { userId }) => {
        const users = await User.getUser(docClient, { userId });
        return users[0];
      },
    }),
    listCareRecipients: t.field({
      type: careRecipientTypes.GraphQLCareRecipientPageType,
      args: {
        limit: t.arg.int({ required: false }),
        nextToken: t.arg.string({ required: false }),
      },
      resolve: async (_, { limit, nextToken }) => {
        return await CareRecipient.listCareRecipients(docClient, {
          limit: limit ?? undefined,
          nextToken: nextToken ?? undefined,
        });
      },
    }),
    listStaff: t.field({
      type: staffTypes.GraphQLStaffPageType,
      args: {
        limit: t.arg.int({ required: false }),
        nextToken: t.arg.string({ required: false }),
      },
      resolve: async (_, { limit, nextToken }) => {
        return await Staff.listStaff(docClient, {
          limit: limit ?? undefined,
          nextToken: nextToken ?? undefined,
        });
      },
    }),
  }),
});

// Mutation型の定義
builder.mutationType({
  fields: (t) => ({
    addCareRecipient: t.field({
      type: careRecipientTypes.GraphQLCareRecipientType,
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
          allergies: args.allergies ?? undefined,
          medicalHistory: args.medicalHistory ?? undefined,
          medications: args.medications ?? undefined,
          notes: args.notes ?? undefined,
        });
      },
    }),
    addStaff: t.field({
      type: staffTypes.GraphQLStaffType,
      args: {
        name: t.arg.string({ required: true }),
        staffId: t.arg.string({ required: true }),
        address: t.arg.string({ required: true }),
        qualification: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        return await Staff.addStaff(docClient, {
          name: args.name,
          staffId: args.staffId,
          address: args.address,
          qualification: args.qualification,
        });
      },
    }),
  }),
}); // スキーマをエクスポート
export const schema = builder.toSchema();
