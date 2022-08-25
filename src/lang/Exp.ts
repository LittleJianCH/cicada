import { Span } from "./Span"

type ExpMeta = { span?: Span }

export type Exp =
  | Var
  | Pi
  | Ap
  | MultiAp
  | Fn
  | Sigma
  | Cons
  | Car
  | Cdr
  | Cls
  | Obj
  | Dot

export type Var = { kind: "Var"; name: string } & ExpMeta

export function Var(name: string, span?: Span): Var {
  return { kind: "Var", name, span }
}

export type Pi = {
  kind: "Pi"
  name: string
  argType: Exp
  retType: Exp
} & ExpMeta

export function Pi(name: string, argType: Exp, retType: Exp, span?: Span): Pi {
  return { kind: "Pi", name, argType, retType, span }
}

export type Fn = { kind: "Fn"; name: string; ret: Exp } & ExpMeta

export function Fn(name: string, ret: Exp, span?: Span): Fn {
  return { kind: "Fn", name, ret, span }
}

export type Ap = { kind: "Ap"; target: Exp; arg: Exp } & ExpMeta

export function Ap(target: Exp, arg: Exp, span?: Span): Ap {
  return { kind: "Ap", target, arg, span }
}

export type ArgKind = "plain" // | "implicit" | "vague"

export type ArgEntry = {
  kind: ArgKind
  exp: Exp
}

export type MultiAp = {
  kind: "MultiAp"
  target: Exp
  argEntries: Array<ArgEntry>
} & ExpMeta

export function MultiAp(
  target: Exp,
  argEntries: Array<ArgEntry>,
  span?: Span
): MultiAp {
  return { kind: "MultiAp", target, argEntries, span }
}

export type Sigma = {
  kind: "Sigma"
  name: string
  carType: Exp
  cdrType: Exp
} & ExpMeta

export function Sigma(
  name: string,
  carType: Exp,
  cdrType: Exp,
  span?: Span
): Sigma {
  return { kind: "Sigma", name, carType, cdrType, span }
}

export type Cons = { kind: "Cons"; car: Exp; cdr: Exp } & ExpMeta

export function Cons(car: Exp, cdr: Exp, span?: Span): Cons {
  return { kind: "Cons", car, cdr, span }
}

export type Car = { kind: "Car"; target: Exp } & ExpMeta

export function Car(target: Exp, span?: Span): Car {
  return { kind: "Car", target, span }
}

export type Cdr = { kind: "Cdr"; target: Exp } & ExpMeta

export function Cdr(target: Exp, span?: Span): Cdr {
  return { kind: "Cdr", target, span }
}

// NOTE We can not only use `name` we also need `realName`,
//   because of `subst` might rename bound variables.
export type Cls = ClsCons | ClsFulfilled | ClsNull

export type ClsCons = {
  kind: "ClsCons"
  name: string
  realName: string
  propertyType: Exp
  rest: Cls
} & ExpMeta

export function ClsCons(
  name: string,
  realName: string,
  propertyType: Exp,
  rest: Cls,
  span?: Span
): ClsCons {
  return { kind: "ClsCons", name, realName, propertyType, rest, span }
}

export type ClsFulfilled = {
  kind: "ClsFulfilled"
  name: string
  realName: string
  property: Exp
  propertyType: Exp
  rest: Cls
} & ExpMeta

export function ClsFulfilled(
  name: string,
  realName: string,
  property: Exp,
  propertyType: Exp,
  rest: Cls,
  span?: Span
): ClsFulfilled {
  return {
    kind: "ClsFulfilled",
    name,
    realName,
    property,
    propertyType,
    rest,
    span,
  }
}

export type ClsNull = {
  kind: "ClsNull"
} & ExpMeta

export function ClsNull(span?: Span): ClsNull {
  return { kind: "ClsNull", span }
}

export type Obj = { kind: "Obj"; properties: Record<string, Exp> } & ExpMeta

export function Obj(properties: Record<string, Exp>, span?: Span): Obj {
  return { kind: "Obj", properties, span }
}

export type Dot = { kind: "Dot"; target: Exp; name: string } & ExpMeta

export function Dot(target: Exp, name: string, span?: Span): Dot {
  return { kind: "Dot", target, name, span }
}
