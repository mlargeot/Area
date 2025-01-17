export function replacePlaceholders(input: string, params: Record<string, any>): string {
    return input.replace(/\$([A-Z_]+)/g, (match, p1) => {
      const key = p1;
      if (params.hasOwnProperty(key)) {
        return params[key];
      }
      return match;
    });
}