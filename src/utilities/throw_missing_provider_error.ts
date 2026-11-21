export const throwMissingProviderError = (provider_name: string): never => {
    const missing_provider_error: Error = new Error(`${provider_name} must wrap this component`);
    throw missing_provider_error;
};
