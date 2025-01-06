type StateValue = {
  provider: string;
  action: string;
  user_id?: string;
  redirect?: string;
};

const stateStore: Map<string, StateValue> = new Map();

export const saveState = (key: string, value: StateValue) => {
  stateStore.set(key, value);
};

export const getState = (key: string): StateValue | undefined => {
  return stateStore.get(key);
};

export const deleteState = (key: string) => {
  stateStore.delete(key);
};
