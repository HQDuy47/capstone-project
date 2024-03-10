// import { User } from "@prisma/client";
// import { ContextInterface } from "../context";

import { ContextInterface } from "../context";

const Query = {
  user: async (
    _: any,
    {
      id,
    }: {
      id: string;
    },
    { keycloak }: ContextInterface,
  ): Promise<any> => {
    const userData = await keycloak.getUserData(id);
    return userData;
  },
  helloWord: async (): Promise<string> => {
    return "Hello Word";
  },
};

const Mutation = {};
export default { Query, Mutation };
