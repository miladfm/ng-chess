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
    flatMap: <TNewValue = unknown>(callBack: (key: TKey, value: TValue) => TNewValue | TNewValue[]): TNewValue[] => {
      const result = [] as TNewValue[];

      for (const propName in obj) {
        const newValue = callBack(propName, obj[propName]);
        Array.isArray(newValue)
          ? result.push(...newValue)
          : result.push(newValue)
      }

      return result;
    },
    every: (callBack: (key: TKey, value: TValue) => boolean | null | undefined): boolean => {

      for (const propName in obj) {
        if (!callBack(propName, obj[propName])) {
          return false;
        }
      }

      return true;
    },

    some: (callBack: (key: TKey, value: TValue) => boolean | null | undefined): boolean => {

      for (const propName in obj) {
        if (callBack(propName, obj[propName])) {
          return true;
        }
      }

      return false;
    },

    find: (callBack: (key: TKey, value: TValue) => boolean): {key: TKey, value: TValue} | undefined => {

      for (const propName in obj) {
        if (callBack(propName, obj[propName])) {
          return {key: propName, value: obj[propName]};
        }
      }

      return undefined;

    },

    findAll: (callBack: (key: TKey, value: TValue) => boolean): Record<TKey, TValue> => {

      const result = {} as Record<TKey, TValue>

      for (const propName in obj) {
        if (callBack(propName, obj[propName])) {
          result[propName] = obj[propName];
        }
      }

      return result;

    },

    findValue: (callBack: (key: TKey, value: TValue) => boolean): TValue | undefined => {

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

    findKeys: (callBack: (key: TKey, value: TValue) => boolean): TKey[] => {

      const keys = []

      for (const propName in obj) {
        if (callBack(propName, obj[propName])) {
          keys.push(propName);
        }
      }

      return keys;

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