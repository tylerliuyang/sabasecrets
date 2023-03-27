import { z } from 'zod';
import { procedure, router } from '../trpc';
import { addOneTimePreKeysRouter } from './addOneTimePreKeys';
import { checkDatabaseRouter } from './checkDatabase';
import { getMessagesRouter } from './getMessages';
import { getPreKeyBundleRouter } from './getPreKeyBundle';
import { storeKeyBundleRouter } from './storeKeyBundle';
import { storeMessageRouter } from './storeMessage';

export const appRouter = router({
    addOneTimePreKeys: addOneTimePreKeysRouter, // put procedures under "user" namespace
    checkDatabase: checkDatabaseRouter, // put procedures under "post" namespace,
    getPreKeyBundle: getPreKeyBundleRouter,
    storeKeyBundle: storeKeyBundleRouter,
    getMessages: getMessagesRouter,
    storeMessage: storeMessageRouter
});

export type AppRouter = typeof appRouter;
