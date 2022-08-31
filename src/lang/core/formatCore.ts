import { EvaluationError } from "../errors"
import { Core } from "./Core"

export function formatCore(core: Core): string {
  switch (core.kind) {
    case "Var": {
      return core.name
    }

    case "Pi": {
      const { bindings, retType } = unfoldPi(core)
      return `(${bindings.join(", ")}) -> ${retType}`
    }

    case "Fn": {
      const { bindings, ret } = unfoldFn(core)
      return `(${bindings.join(", ")}) =>> ${ret}`
    }

    case "Ap": {
      const target = formatCore(core.target)
      const arg = formatCore(core.arg)
      return `${target}(${arg})`
    }

    default: {
      throw new EvaluationError(
        `formatCore is not implemented for ${core.kind}`
      )
    }
  }
}

function unfoldPi(core: Core): { bindings: Array<string>; retType: string } {
  switch (core.kind) {
    case "Pi": {
      const argType = formatCore(core.argType)
      const binding = `${core.name}: ${argType}`
      const { bindings, retType } = unfoldPi(core.retType)
      return { bindings: [binding, ...bindings], retType }
    }

    default: {
      return { bindings: [], retType: formatCore(core) }
    }
  }
}

function unfoldFn(core: Core): { bindings: Array<string>; ret: string } {
  switch (core.kind) {
    case "Fn": {
      const binding = `${core.name}`
      const { bindings, ret } = unfoldFn(core.ret)
      return { bindings: [binding, ...bindings], ret }
    }

    default: {
      return { bindings: [], ret: formatCore(core) }
    }
  }
}
