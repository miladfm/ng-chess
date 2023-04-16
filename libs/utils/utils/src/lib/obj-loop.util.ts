export function objLoop<TKey extends string, TValue>(obj: Record<TKey, TValue>) {
  return {
    forEach: (callBack: (key: TKey, value: TValue) => void) => {
      for (const propName in obj) {
        callBack(propName, obj[propName]);
      }
    },
    map: <TNewValue = unknown>(callBack: (key: TKey, value: TValue) => TNewValue) => {
      const result: TNewValue[] = [];

      for (const propName in obj) {
        result.push(callBack(propName, obj[propName]));
      }

      return result;
    },
    filter: (callBack: (key: TKey, value: TValue) => boolean) => {
      const result: TValue[] = [];

      for (const propName in obj) {
        if(callBack(propName, obj[propName])) {
          result.push(obj[propName]);
        }
      }

      return result;
    },
    /*
     * If return value of callback is null, the item will be filtered.
     * Otherwise the value of return callback will be push to result list
     * */
    filterMap: <TNewValue = unknown>(callBack: (key: TKey, value: TValue) => null | TNewValue) => {
      const result: TNewValue[] = [];

      for (const propName in obj) {
        const callBackResult = callBack(propName, obj[propName]);
        if (callBackResult !== null) {
          result.push(callBackResult);
        }
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
  }
}