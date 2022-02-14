type RRequired<T> = NonNullable<Required<T>>;
type KKeyOf<T> = keyof RRequired<T> & (string | number);
interface PathResult<T, TPath extends string | number> {
  (): TPath;
  <TKey extends KKeyOf<T>>(key: TKey): PathResult<
    RRequired<T>[TKey],
    `${TPath}.${TKey}`
  >;
}

function safePath<T, TKey extends KKeyOf<T> = KKeyOf<T>>(key: TKey) {
  function subpath<T, TPath extends string | number>(
    path: TPath
  ): PathResult<T, TPath> {
    const x = (<TKey extends KKeyOf<T>>(subkey: TKey | undefined) =>
      subkey === undefined
        ? path
        : subpath<RRequired<T>[TKey], `${TPath}.${TKey}`>(
            `${path}.${subkey}`
          )) as PathResult<any, any>;
    return x;
  }

  return subpath<RRequired<T>[TKey], TKey>(key);
}

export function formikPathBuilder<T>(example?: T) {
  return <TKey extends KKeyOf<T>>(key: TKey) => safePath<T, TKey>(key);
}

export default formikPathBuilder;
