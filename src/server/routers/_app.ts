import { z } from 'zod';
import { procedure, router } from '../trpc';
import { addOneTimePreKeysRouter } from './addOneTimePreKeys';
import { checkDatabaseRouter } from './checkDatabase';
import { getPreKeyBundleRouter } from './getPreKeyBundle';
import { storeKeyBundleRouter } from './storeKeyBundle';

export const appRouter = router({
    addOneTimePreKeys: addOneTimePreKeysRouter, // put procedures under "user" namespace
    checkDatabase: checkDatabaseRouter, // put procedures under "post" namespace,
    getPreKeyBundle: getPreKeyBundleRouter,
    storeKeyBundle: storeKeyBundleRouter
});

export type AppRouter = typeof appRouter;
