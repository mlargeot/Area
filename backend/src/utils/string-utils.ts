export function replacePlaceholders(input: string, params: Record<string, any>): string {
  console.log(`\n replacePlaceholders: ${input} ${params}\n`);
    return input.replace(/\$\{([A-Z_]+)\}/g, (match, p1) => {
      const key = p1.toUpperCase(); // Convert the captured group to uppercase
      const lowerCaseKey = p1.toLowerCase(); // Convert the captured group to lowercase
      if (params.hasOwnProperty(key)) {
        return params[key];
      } else if (params.hasOwnProperty(lowerCaseKey)) {
        return params[lowerCaseKey];
      }
      return match; // If the key is not found, return the original placeholder
    });
  }
