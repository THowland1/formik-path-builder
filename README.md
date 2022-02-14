# formik-path-builder

A string builder that can build formik-readable paths of a given object in a TypeScript-enforced way

## Example

```typescript
import formikPathBuilder from 'formik-path-builder';

type Person = {
  name: {
    first: string;
    last: string;
  };
  friends: Person[];
};

const p = formikPathBuilder<Person>();
// or `const p = formikPathBuilder({} as Person);`

p('name')(); // = "name"
p('friends')(); // = "friends"
p('friends')(1)(); // = "friends.1"
p('friends')(1)('name')('first')(); // = "friends.1.name.first"
p('emailaddress')(); // throws compile-time error
```

## TypeScript is super nifty

Output of string builder is the literal value of the exact string that will come out

```typescript
const path = p('friends')(1)(); // = "friends.1"
type Path = typeof path; // = "friends.1"
```

In a loop (where the code is index-agnostic), the literal is preserved, only the unknown segments are generic

```typescript
const person = {} as Person;

person.friends.forEach((_, i) => {
  const path = p('friends')(i)('name')(); // = "friends.0.name", or "friends.1.name", etc.
  type Path = typeof path; // = `friends.${number}.name`
});
```
