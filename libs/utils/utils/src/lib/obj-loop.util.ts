export function objLoop<TKey extends string, TValue>(obj: Record<TKey, TValue>) {
  return {
    forEach: (callBack: (key: TKey, value: TValue) => void) => {
      for (const propName in obj) {
        callBack(propName, obj[propName]);
      }
    },
    map: <TNewValue = unknown>(callBack: (key: TKey, value: TValue) => TNewValue): Record<TKey, TNewValue> => {
      const result = {} as Record<TKey, TNewValue>;

      for (const propName in obj) {
        result[propName] = callBack(propName, obj[propName]);
      }

      return result;
    },

    find: (callBack: (key: TKey, value: TValue) => boolean): TValue | undefined => {

      for (const propName in obj) {
        if (callBack(propName, obj[propName])) {
          return obj[propName];
        }
      }

      return undefined;

    },

    findKey: (callBack: (key: TKey, value: TValue) => boolean): TKey | undefined => {

      for (const propName in obj) {
        if (callBack(propName, obj[propName])) {
          return propName;
        }
      }

      return undefined;

    },

    filter: (callBack: (key: TKey, value: TValue) => boolean): Record<TKey, TValue> => {
      const result = {} as Record<TKey, TValue>;

      for (const propName in obj) {
        if (callBack(propName, obj[propName])) {
          result[propName] = obj[propName];
        }
      }

      return result;

    },
  }
}