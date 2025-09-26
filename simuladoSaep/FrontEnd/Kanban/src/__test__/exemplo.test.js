import { describe, it, expect } from "vitest";

//describe = com eu descrevo esse teste
describe("Matematica basica ", ()=>{
    //qual cenario de teste estou executando
    it("soma 2 + 2", ()=>{
        //o  que eu espero receber como respostas
        expect(2 + 2).toBe(4)
    });
});