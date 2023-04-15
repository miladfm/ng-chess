export function objLoop<TKey extends string, TValue>(obj: Record<TKey, TValue>) {
  return {
    forEach: (callBack: (key: TKey, value: TValue) => void) => {
      for (const propName in obj) {
        callBack(propName, obj[propName]);
      }
    }
  }
}