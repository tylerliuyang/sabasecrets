

import { ProcedureBuilder } from '@trpc/server';
import { z } from 'zod';
import { procedure } from '../trpc';

const SignedPublicKey = z.object({
    keyId: z.number(),
    publicKey: z.string(),
    signature: z.string(),
})

const PublicPreKey = z.object({
    keyId: z.number(),
    publicKey: z.string()
})

export const PublicPreKeyProcedure = procedure.input(
    z.object({
        keys: z.array(
            PublicPreKey
        ),
        address: z.string()
    })
);

export const GetPreKeyProcedure = procedure.input(
    z.object({
        address: z.string()
    })
);



export const StoreKeyProcedure = procedure.input(
    z.object({
        address: z.string(),
        bundle: z.object({
            registrationId: z.number(),
            identityKey: z.string(),
            signedPreKey: SignedPublicKey,
            oneTimePreKeys: z.array(PublicPreKey)
        })
    })
);


export const checkDatabase = procedure.input(
    z.object({
        keys: z.array(
            z.object({
                keyId: z.number(),
                publicKey: z.string(),
            })
        )
    })
);

export const storeMessage = procedure.input(
    z.object({
        reciever: z.string(),
        sender: z.string(),
        message: z.string()
    })
)

export const getMessages = procedure.input(
    z.object({
        reciever: z.string(),
        sender: z.string(),
    })
)


// export interface StoreKeyBody {
//     address: string;
//     bundle: SerializedFullDirectoryEntry;
// }

// export interface GetPreKeyBody {
//     address: string;
// }