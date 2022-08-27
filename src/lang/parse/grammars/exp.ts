/**

   # We must separate exp into operator and operand

   Otherwise `(x) => f(x)` will be ambiguous:

   ```js
   Fn("x", Ap(Var("f"), Var("x")))
   Ap(Fn("x", Var("f")), Var("x"))
   ```

**/

export const exp = {
  $grammar: {
    "exp:operator": [{ operator: "operator" }],
    "exp:operand": [{ operand: "operand" }],
  },
}

export const operator = {
  $grammar: {
    "operator:var": [{ name: "identifier" }],
    "operator:ap": [
      { target: "operator" },
      {
        arg_entries_group: {
          $ap: ["one_or_more", '"("', "arg_entries", '")"'],
        },
      },
    ],
  },
}

export const operand = {
  $grammar: {
    "operand:pi": [
      '"("',
      { pi_bindings: "pi_bindings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "operand:pi_forall": [
      '"forall"',
      '"("',
      { pi_bindings: "pi_bindings" },
      '")"',
      { ret_t: "exp" },
    ],
    "operand:fn": [
      '"("',
      { namings: "namings" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "operand:fn_function": [
      '"function"',
      '"("',
      { namings: "namings" },
      '")"',
      { ret: "exp" },
    ],
  },
}

export const arg_entries = {
  $grammar: {
    "arg_entries:arg_entries": [
      { entries: { $ap: ["zero_or_more", "arg_entry", '","'] } },
      { last_entry: "arg_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const arg_entry = {
  $grammar: {
    "arg_entry:plain": [{ arg: "exp" }],
  },
}

export const pi_bindings = {
  $grammar: {
    "pi_bindings:pi_bindings": [
      { entries: { $ap: ["zero_or_more", "pi_binding", '","'] } },
      { last_entry: "pi_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const pi_binding = {
  $grammar: {
    "pi_binding:nameless": [{ exp: "exp" }],
    "pi_binding:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const namings = {
  $grammar: {
    "namings:namings": [
      { entries: { $ap: ["zero_or_more", "naming", '","'] } },
      { last_entry: "naming" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const naming = {
  $grammar: {
    "naming:naming": [{ name: "identifier" }],
  },
}
