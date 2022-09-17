import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import * as Exps from "../exp"
import { check, Inferred } from "../exp"
import { PatternVar, Solution, solve } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function insertImplicitAp(
  patternVars: Array<PatternVar>,
  solution: Solution,
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
): Inferred {
  const [arg, ...restArgs] = args

  if (arg?.kind !== "ArgPlain") {
    let inferred = Inferred(type, target)
    inferred = insertByPatternVars(patternVars, solution, ctx, inferred)
    inferred = collectInferredByArgs(ctx, inferred, args)
    return inferred
  }

  const argInferred = Exps.inferOrUndefined(ctx, arg.exp)

  /**
       TODO We also need to handle `Values.ImplicitPi`.
    **/
  Values.assertTypeInCtx(ctx, type, Values.Pi)

  if (argInferred !== undefined) {
    solution = solve(
      solution,
      ctx,
      Values.Type(),
      argInferred.type,
      type.argType,
    )
  }

  const argCore = check(ctx, arg.exp, type.argType)
  const argValue = evaluate(ctxToEnv(ctx), argCore)
  const retType = applyClosure(type.retTypeClosure, argValue)
  return insertImplicitAp(patternVars, solution, ctx, retType, target, restArgs)
}

function insertByPatternVars(
  patternVars: Array<PatternVar>,
  solution: Solution,
  ctx: Ctx,
  inferred: Inferred,
): Inferred {
  for (const patternVar of patternVars) {
    inferred = insertByPatternVar(patternVar, solution, ctx, inferred)
  }

  return inferred
}

function insertByPatternVar(
  patternVar: PatternVar,
  solution: Solution,
  ctx: Ctx,
  inferred: Inferred,
): Inferred {
  throw new Error("TODO")
}

function collectInferredByArgs(
  ctx: Ctx,
  inferred: Inferred,
  args: Array<Exps.Arg>,
): Inferred {
  for (const arg of args) {
    inferred = collectInferredByArg(ctx, inferred, arg)
  }

  return inferred
}

function collectInferredByArg(
  ctx: Ctx,
  inferred: Inferred,
  arg: Exps.Arg,
): Inferred {
  Values.assertTypeInCtx(ctx, inferred.type, Values.Pi)
  const argCore = Exps.check(ctx, arg.exp, inferred.type.argType)
  const argValue = evaluate(ctxToEnv(ctx), argCore)

  switch (arg.kind) {
    case "ArgPlain": {
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.Ap(inferred.core, argCore),
      )
    }

    case "ArgImplicit": {
      return Inferred(
        applyClosure(inferred.type.retTypeClosure, argValue),
        Cores.ImplicitAp(inferred.core, argCore),
      )
    }
  }
}
