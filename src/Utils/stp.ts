export interface R {
 [key: string]: unknown | R;
}

/**
 * Replaces placeholders in a string with values from an object.
 * @param expression - The string containing placeholders.
 * @param obj - The object containing values to replace placeholders.
 * @returns The updated string with placeholders replaced with values.
 */
export default (expression: string, obj: R) => {
 Object.entries(obj).forEach(([key, value]) => {
  if (!String(value).length) obj[key] = ' ';
 });

 const replace = (substring: string, value: string): string => {
  const newValue = value.split('.');
  let decided: R | string = '';
  const result = obj[newValue[0]];
  if (!result) return substring;
  if (newValue.length < 2) return result as string;

  newValue.forEach((element: string, i) => {
   if (i === 1) decided = (result as R)[element] as string;
   if (i > 1) decided = (decided as R)[element] as string;
  });

  return decided as string;
 };

 return expression
  .replace(/{\s?([^{}\s]*)\s?}/g, replace)
  .replace(RegExp(process.env.Token as string, 'g'), 'TOKEN');
};
