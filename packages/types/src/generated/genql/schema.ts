// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    String: string,
    Int: number,
    Boolean: boolean,
}

export interface CareRecipient {
    address: (Scalars['String'] | null)
    allergies: (Scalars['String'] | null)
    birthDate: (Scalars['String'] | null)
    bloodType: (Scalars['String'] | null)
    createdAt: (Scalars['String'] | null)
    email: (Scalars['String'] | null)
    firstName: (Scalars['String'] | null)
    firstNameKana: (Scalars['String'] | null)
    gender: (Scalars['String'] | null)
    id: (Scalars['String'] | null)
    lastName: (Scalars['String'] | null)
    lastNameKana: (Scalars['String'] | null)
    medicalHistory: (Scalars['String'] | null)
    medications: (Scalars['String'] | null)
    phone: (Scalars['String'] | null)
    updatedAt: (Scalars['String'] | null)
    __typename: 'CareRecipient'
}

export interface CareRecipientPage {
    items: (CareRecipient[] | null)
    nextToken: (Scalars['String'] | null)
    __typename: 'CareRecipientPage'
}

export interface Mutation {
    addCareRecipient: (CareRecipient | null)
    addStaff: (Staff | null)
    __typename: 'Mutation'
}

export interface Query {
    hello: (Scalars['String'] | null)
    listCareRecipients: (CareRecipientPage | null)
    listStaff: (StaffPage | null)
    user: (User | null)
    __typename: 'Query'
}

export interface Staff {
    address: (Scalars['String'] | null)
    createdAt: (Scalars['String'] | null)
    id: (Scalars['String'] | null)
    name: (Scalars['String'] | null)
    qualification: (Scalars['String'] | null)
    staffId: (Scalars['String'] | null)
    updatedAt: (Scalars['String'] | null)
    __typename: 'Staff'
}

export interface StaffPage {
    items: (Staff[] | null)
    nextToken: (Scalars['String'] | null)
    __typename: 'StaffPage'
}

export interface User {
    noteId: (Scalars['String'] | null)
    userId: (Scalars['String'] | null)
    version: (Scalars['String'] | null)
    __typename: 'User'
}

export interface CareRecipientGenqlSelection{
    address?: boolean | number
    allergies?: boolean | number
    birthDate?: boolean | number
    bloodType?: boolean | number
    createdAt?: boolean | number
    email?: boolean | number
    firstName?: boolean | number
    firstNameKana?: boolean | number
    gender?: boolean | number
    id?: boolean | number
    lastName?: boolean | number
    lastNameKana?: boolean | number
    medicalHistory?: boolean | number
    medications?: boolean | number
    phone?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CareRecipientPageGenqlSelection{
    items?: CareRecipientGenqlSelection
    nextToken?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationGenqlSelection{
    addCareRecipient?: (CareRecipientGenqlSelection & { __args: {address?: (Scalars['String'] | null), allergies?: (Scalars['String'] | null), birthDate: Scalars['String'], bloodType: Scalars['String'], email?: (Scalars['String'] | null), firstName: Scalars['String'], firstNameKana: Scalars['String'], gender: Scalars['String'], lastName: Scalars['String'], lastNameKana: Scalars['String'], medicalHistory?: (Scalars['String'] | null), medications?: (Scalars['String'] | null), notes?: (Scalars['String'] | null), phone: Scalars['String']} })
    addStaff?: (StaffGenqlSelection & { __args: {address: Scalars['String'], name: Scalars['String'], qualification: Scalars['String'], staffId: Scalars['String']} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryGenqlSelection{
    hello?: boolean | number
    listCareRecipients?: (CareRecipientPageGenqlSelection & { __args?: {limit?: (Scalars['Int'] | null), nextToken?: (Scalars['String'] | null)} })
    listStaff?: (StaffPageGenqlSelection & { __args?: {limit?: (Scalars['Int'] | null), nextToken?: (Scalars['String'] | null)} })
    user?: (UserGenqlSelection & { __args: {userId: Scalars['String']} })
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StaffGenqlSelection{
    address?: boolean | number
    createdAt?: boolean | number
    id?: boolean | number
    name?: boolean | number
    qualification?: boolean | number
    staffId?: boolean | number
    updatedAt?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface StaffPageGenqlSelection{
    items?: StaffGenqlSelection
    nextToken?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserGenqlSelection{
    noteId?: boolean | number
    userId?: boolean | number
    version?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


    const CareRecipient_possibleTypes: string[] = ['CareRecipient']
    export const isCareRecipient = (obj?: { __typename?: any } | null): obj is CareRecipient => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCareRecipient"')
      return CareRecipient_possibleTypes.includes(obj.__typename)
    }
    


    const CareRecipientPage_possibleTypes: string[] = ['CareRecipientPage']
    export const isCareRecipientPage = (obj?: { __typename?: any } | null): obj is CareRecipientPage => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isCareRecipientPage"')
      return CareRecipientPage_possibleTypes.includes(obj.__typename)
    }
    


    const Mutation_possibleTypes: string[] = ['Mutation']
    export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
      return Mutation_possibleTypes.includes(obj.__typename)
    }
    


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const Staff_possibleTypes: string[] = ['Staff']
    export const isStaff = (obj?: { __typename?: any } | null): obj is Staff => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStaff"')
      return Staff_possibleTypes.includes(obj.__typename)
    }
    


    const StaffPage_possibleTypes: string[] = ['StaffPage']
    export const isStaffPage = (obj?: { __typename?: any } | null): obj is StaffPage => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isStaffPage"')
      return StaffPage_possibleTypes.includes(obj.__typename)
    }
    


    const User_possibleTypes: string[] = ['User']
    export const isUser = (obj?: { __typename?: any } | null): obj is User => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
      return User_possibleTypes.includes(obj.__typename)
    }
    