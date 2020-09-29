/**
 * Check whether all keys in param exist in location.state
 */
export const checkLocationState = (location: any, ...params: string[]) => {
  if (!(location && location.state)) {
    return false;
  }

  let valid = true;
  params.forEach((param) => {
    valid = valid && (param in location.state);
  });

  return valid;
};
