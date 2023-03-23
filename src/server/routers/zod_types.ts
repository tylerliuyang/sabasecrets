

import { ProcedureBuilder } from '@trpc/server';
import { z } from 'zod';
import { procedure } from '../trpc';
export const a: ProcedureBuilder<any> = procedure.input(
    z.object({
        keys: z.array(
            z.object({
                keyId: z.number(),
                publicKey: z.string(),
            })
        )
    })
);

export const PublicPreKeyProcedure = addAddress(addPreKeyArray(procedure));
PublicPreKeyProcedure.query(({ input }) => { input.address; input.keys; })

// export const Address = procedure.input(
//     z.object({
//         address: z.string(),
//     })
// )

export function addAddress(a: ProcedureBuilder<any>) {
    return a.input(z.object({
        address: z.string()
    }))
}

export function addPreKeyArray(a: ProcedureBuilder<any>) {
    return a.input(
        z.object({
            keys: z.array(
                z.object({
                    keyId: z.number(),
                    publicKey: z.string(),
                })
            )
        })
    )
}



// export interface StoreKeyBody {
//     address: string;
//     bundle: SerializedFullDirectoryEntry;
// }

// export interface GetPreKeyBody {
//     address: string;
// }