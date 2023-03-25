import { addOneTimePreKeysRouter } from '@/server/routers/addOneTimePreKeys';
import { appRouter } from '@/server/routers/_app';
import { createNextApiHandler } from '@trpc/server/adapters/next';
// export API handler
export default createNextApiHandler({
    router: appRouter, // your outermost router, see https://trpc.io/docs/procedures
    createContext: () => ({})
});