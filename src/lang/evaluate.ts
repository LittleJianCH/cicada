import { Core } from "./Core"
import { Env, lookupEnv } from "./Env"
import { Value } from "./Value"

export function evaluate(env: Env, core: Core): Value {
  switch (core.kind) {
    case "Var": {
      const value = lookupEnv(env, core.name)
      if (value === undefined) {
        throw new Error("TODO")
      }

      return value
    }

    default: {
      throw new Error("TODO")
    }
  }
}
