import { initTRPC } from "@trpc/server";
import { ProcedureBuilder, ProcedureParams, AnyRootConfig, unsetMarker } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
export const procedure = t.procedure;

function addAddress<T extends ProcedureParams>(a: ProcedureBuilder<T>) {
    return a.input(
        z.object({
            address: z.string(),
        })
    );
}


function addPreKey<T extends ProcedureParams>(a: ProcedureBuilder<T>) {
    return a.input(
        z.object({
            key: z.string(),
        })
    );
}

function addAddress2<T extends ProcedureParams>() {
    return z.object({
        address: z.string(),
    })
}
function addPreKey2<T extends ProcedureParams>() {
    return z.object({
        key: z.string(),
    })
}
const foldr = <A, B>(f: (x: A, acc: B) => B, acc: B, [h, ...t]: A[]): B => h === undefined ? acc : f(h, foldr(f, acc, t));

function createProcedure(obj: typeof z.object[]) {
    let output: ProcedureBuilder<any> = foldr((a, procedure) =>
        procedure.input(a)
        , procedure, obj)
}

procedure.input([addAddress2(), addPreKey2()].map());

export const test = addAddress(addPreKey(procedure));
test.query(({ input }) => {
    input.address;
    input.key;
});
