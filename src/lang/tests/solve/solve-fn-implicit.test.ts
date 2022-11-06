import { expect, test } from "vitest"
import * as Errors from "../../errors"
import { expectCodeToFail, runCode } from "../utils"

test("solve FnImplicit", async () => {
  const output = await runCode(`

solve (x: String) {
  (implicit A: Type, a: A) => x =
  (implicit A: Type, a: A) => "abc"
}

`)

  expect(output).toMatchInlineSnapshot('"{ x: \\"abc\\" }"')
})

test("solve FnImplicit -- 2", async () => {
  const output = await runCode(`

solve (x: String) {
  (implicit A: Type, implicit B: Type, a: A, b: B) => x =
  (implicit A: Type, implicit B: Type, a: A, b: B) => "abc"
}

`)

  expect(output).toMatchInlineSnapshot('"{ x: \\"abc\\" }"')
})

test("solve FnImplicit -- alpha equivalence", async () => {
  const output = await runCode(`

solve () {
  (implicit A: Type, a: A) => a = (implicit B: Type, b: B) => b
}

`)

  expect(output).toMatchInlineSnapshot('"{  }"')
})

test("solve FnImplicit -- deepWalk", async () => {
  const output = await runCode(`

solve (T: Type, f: (implicit _: Trivial) -> Type) {
  f = (implicit _) => T
  T = String
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ T: String, f: (implicit _) => String }"',
  )
})

test("solve FnImplicit -- occur", async () => {
  await expectCodeToFail(
    `
  
solve (x: (implicit _: Type) -> Type) {
  x = (implicit y: Type) => x(implicit y)
}

`,
    Errors.UnificationError,
  )
})
