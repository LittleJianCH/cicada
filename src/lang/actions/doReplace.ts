import * as Actions from "../actions"
import { ClosureNative } from "../closure"
import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

export function doReplace(target: Value, motive: Value, base: Value): Value {
  if (target.kind === "Refl") {
    return base
  }

  Values.assertValue(target, "TypedNeutral")

  if (target.type.kind !== "Equal") {
    throw new Errors.EvaluationError(
      [
        `[doReplace] When target is a TypedNeutral, expect target.type to be Equal`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  const baseType = Actions.doAp(motive, target.type.from)
  const motiveType = Values.Pi(
    target.type.type,
    ClosureNative("target", () => Values.Type()),
  )

  return Values.TypedNeutral(
    Actions.doAp(motive, target.type.to),
    Neutrals.Replace(
      target.neutral,
      target.type,
      TypedValue(motiveType, motive),
      TypedValue(baseType, base),
    ),
  )
}
