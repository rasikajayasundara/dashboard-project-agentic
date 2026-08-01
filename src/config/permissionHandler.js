import permissionsList from "../jsons/permissionsList.json";

const getPermissionFlags = (userPermissionCodes) => {
  const codeSet = new Set(userPermissionCodes);
  const result = {};

  const toKey = (action) => {
    const [entity, type] = action.split(":");
    return `can${entity.charAt(0).toUpperCase() + entity.slice(1)}${
      type.charAt(0).toUpperCase() + type.slice(1)
    }`;
  };

  Object.values(permissionsList).forEach((modules) => {
    modules.forEach(({ action, action_code }) => {
      result[toKey(action)] = codeSet.has(action_code);
    });
  });

  return result;
};

export { getPermissionFlags };
