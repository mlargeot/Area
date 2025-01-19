import { ProviderDto } from "src/auth/dto/provider-dto";

export interface ProviderConfig {
    clientId: string;
    clientSecret: string;
    authorizationEndpoint: string;
    scopes: string[];
    // tokenEndpoint: string;
}

export interface ProviderService {
    config: ProviderConfig;
    refreshToken(): Promise<void>;
    exchangeCode(code: string): Promise<ProviderDto>
}