// @ts-nocheck
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Scalars = {
    String: string,
    Boolean: boolean,
}

export interface Query {
    hello: (Scalars['String'] | null)
    user: (User | null)
    __typename: 'Query'
}

export interface User {
    noteId: (Scalars['String'] | null)
    userId: (Scalars['String'] | null)
    version: (Scalars['String'] | null)
    __typename: 'User'
}

export interface QueryGenqlSelection{
    hello?: boolean | number
    user?: (UserGenqlSelection & { __args: {userId: Scalars['String']} })
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


    const Query_possibleTypes: string[] = ['Query']
    export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
      return Query_possibleTypes.includes(obj.__typename)
    }
    


    const User_possibleTypes: string[] = ['User']
    export const isUser = (obj?: { __typename?: any } | null): obj is User => {
      if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
      return User_possibleTypes.includes(obj.__typename)
    }
    